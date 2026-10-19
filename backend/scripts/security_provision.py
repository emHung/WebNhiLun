"""Provision and verify credentials without printing them; preview is the default."""
import argparse
import asyncio
import os
import json
from pathlib import Path
import secrets
from urllib.parse import quote, urlsplit, urlunsplit

import asyncpg
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[2]


def save_env(path, values):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".pending")
    content = "\n".join(f"{key}={json.dumps(str(value), ensure_ascii=False)}" for key, value in values.items() if value is not None) + "\n"
    descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as stream:
        stream.write(content)
    temporary.replace(path)


def credential_url(dsn, username, password):
    parsed = urlsplit(dsn)
    host = parsed.hostname
    if ":" in host:
        host = f"[{host}]"
    address = f"{quote(username, safe='')}:{quote(password, safe='')}@{host}"
    if parsed.port:
        address += f":{parsed.port}"
    return urlunsplit((parsed.scheme, address, parsed.path, parsed.query, parsed.fragment))


async def run(args):
    values = dict(dotenv_values(ROOT / "backend/.env"))
    admin_path = ROOT / ".secrets/admin.env"
    admin_values = dict(dotenv_values(admin_path)) if admin_path.exists() else {}
    admin_dsn = admin_values.get("SUPABASE_MIGRATION_DB_URL") or values["SUPABASE_DB_URL"]
    ref = urlsplit(values["SUPABASE_URL"]).hostname.split(".")[0]
    if urlsplit(admin_dsn).hostname != f"db.{ref}.supabase.co" or urlsplit(admin_dsn).username != "postgres":
        raise RuntimeError("Expected a verified direct migration connection for this project.")
    if not args.apply:
        print({"preview": True, "runtime_role": "volunteerhub_api", "rotate_admin": args.rotate_db_admin})
        return
    conn = await asyncpg.connect(admin_dsn, ssl="require", timeout=15)
    try:
        exists = await conn.fetchval("select exists(select 1 from pg_roles where rolname='volunteerhub_api')")
        if not exists:
            raise RuntimeError("Apply the runtime security migration first.")
        password = secrets.token_urlsafe(36)
        runtime_dsn = credential_url(admin_dsn, "volunteerhub_api", password)
        await conn.execute(f"alter role volunteerhub_api password '{password}'")
        check = await asyncpg.connect(runtime_dsn, ssl="require", timeout=15)
        try:
            await check.fetchval("select count(*) from public.activities")
        finally:
            await check.close()
        values["SUPABASE_DB_URL"] = runtime_dsn
        values["SECURITY_HASH_KEY"] = values.get("SECURITY_HASH_KEY") or secrets.token_urlsafe(48)
        admin_values["SUPABASE_MIGRATION_DB_URL"] = admin_dsn
        save_env(admin_path, admin_values)
        save_env(ROOT / "backend/.env", values)
        if args.rotate_db_admin:
            new_password = secrets.token_urlsafe(42)
            new_dsn = credential_url(admin_dsn, "postgres", new_password)
            pending_path = ROOT / ".secrets/admin-rotation.env"
            save_env(pending_path, {"SUPABASE_MIGRATION_DB_URL": new_dsn})
            try:
                await conn.execute(f"alter role postgres password '{new_password}'")
            except asyncpg.InsufficientPrivilegeError:
                pending_path.unlink()
                print({"runtime_verified": True, "admin_password_rotated": False, "requires_supabase_dashboard": True, "credentials_printed": False})
                return
            check = await asyncpg.connect(new_dsn, ssl="require", timeout=15)
            try:
                await check.fetchval("select 1")
            finally:
                await check.close()
            save_env(admin_path, {"SUPABASE_MIGRATION_DB_URL": new_dsn})
            pending_path.unlink()
        print({"runtime_verified": True, "admin_password_rotated": args.rotate_db_admin, "credentials_printed": False})
    finally:
        await conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--rotate-db-admin", action="store_true")
    try:
        asyncio.run(run(parser.parse_args()))
    except Exception as error:
        print({"result": "failed", "error_type": type(error).__name__, "credentials_printed": False})
        raise SystemExit(1) from None
