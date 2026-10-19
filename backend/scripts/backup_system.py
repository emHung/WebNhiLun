"""Encrypted DB/Storage backup and isolated local restore drill; default is preview."""
import argparse
import asyncio
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import quote, urlsplit
import uuid
import zipfile

import asyncpg
import certifi
from cryptography.fernet import Fernet
from dotenv import dotenv_values
import httpx

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from app.core.config import get_settings


def tools():
    folder = Path(os.getenv("PG_BIN", ROOT / ".tools/pgsql/bin"))
    suffix = ".exe" if os.name == "nt" else ""
    def locate(name):
        value = folder / (name + suffix)
        if not value.is_file():
            raise RuntimeError("Install the official PostgreSQL client tools or configure PG_BIN.")
        return str(value)
    return locate


def admin_url():
    return dotenv_values(ROOT / ".secrets/admin.env")["SUPABASE_MIGRATION_DB_URL"]


def pg_environment(dsn):
    parsed = urlsplit(dsn)
    environment = dict(os.environ)
    from urllib.parse import unquote
    certificate = get_settings().supabase_db_ca_file
    if not Path(certificate).is_file():
        raise RuntimeError("The trusted Supabase database CA certificate is required.")
    environment.update(PGHOST=parsed.hostname, PGPORT=str(parsed.port or 5432), PGDATABASE=parsed.path.lstrip("/"), PGUSER=unquote(parsed.username), PGPASSWORD=unquote(parsed.password or ""), PGSSLMODE="verify-full", PGSSLROOTCERT=certificate)
    return environment


def run(command, environment=None, timeout=300):
    result = subprocess.run(command, env=environment, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=timeout, creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0)
    if result.returncode:
        raise RuntimeError(f"{Path(command[0]).stem} failed; exit={result.returncode}")
    return b""


def backup_key():
    path = ROOT / ".secrets/backup.key"
    if not path.exists():
        path.parent.mkdir(exist_ok=True)
        descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(Fernet.generate_key())
    return Fernet(path.read_bytes())


async def backup(apply):
    settings = get_settings()
    dsn = admin_url()
    if urlsplit(dsn).hostname != "db." + urlsplit(settings.supabase_url).hostname:
        raise RuntimeError("Backup target does not match application project.")
    locate = tools()
    connection = await asyncpg.connect(dsn, ssl="require", timeout=15, command_timeout=60)
    try:
        if not apply:
            count = await connection.fetchval("select count(*) from storage.objects")
            print(json.dumps({"preview": True, "storage_objects": count, "destination": "local encrypted backups/", "offsite": False}))
            return
        (ROOT / ".secrets").mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="backup-", dir=ROOT / ".secrets") as temporary:
            dump = Path(temporary) / "database.dump"
            async with connection.transaction(isolation="repeatable_read", readonly=True):
                snapshot = await connection.fetchval("select pg_export_snapshot()")
                counts = {row["tablename"]: await connection.fetchval('select count(*) from public."' + row["tablename"].replace('"', '""') + '"') for row in await connection.fetch("select tablename from pg_tables where schemaname='public' order by tablename")}
                objects = [dict(row) for row in await connection.fetch("select bucket_id,name,updated_at from storage.objects order by bucket_id,name")]
                roles = [row["rolname"] for row in await connection.fetch("select rolname from pg_roles where rolname<>'postgres' and rolname not like 'pg\\_%' escape '\\' order by rolname")]
                await asyncio.to_thread(run, [locate("pg_dump"), "--format=custom", "--no-owner", "--schema=public", "--schema=private", "--schema=auth", "--schema=storage", "--snapshot=" + snapshot, "--file=" + str(dump)], pg_environment(dsn))
            manifest = {"created_at": datetime.now(timezone.utc).isoformat(), "project": urlsplit(settings.supabase_url).hostname, "counts": counts, "roles": roles, "objects": [], "database_sha256": hashlib.sha256(dump.read_bytes()).hexdigest()}
            archive = io.BytesIO()
            async with httpx.AsyncClient(timeout=30) as client:
                with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
                    bundle.write(dump, "database.dump")
                    for obj in objects:
                        target = quote(obj["bucket_id"], safe="") + "/" + quote(obj["name"], safe="/")
                        response = await client.get(settings.supabase_url + "/storage/v1/object/" + target, headers={"apikey": settings.supabase_secret_key})
                        if response.status_code != 200:
                            raise RuntimeError("Storage object download failed; backup not published.")
                        filename = "objects/" + hashlib.sha256(target.encode()).hexdigest()
                        bundle.writestr(filename, response.content)
                        manifest["objects"].append({"bucket": obj["bucket_id"], "name": obj["name"], "file": filename, "sha256": hashlib.sha256(response.content).hexdigest()})
                    current = [dict(row) for row in await connection.fetch("select bucket_id,name,updated_at from storage.objects order by bucket_id,name")]
                    if current != objects:
                        raise RuntimeError("Storage changed during snapshot; retry backup.")
                    bundle.writestr("manifest.json", json.dumps(manifest))
            folder = ROOT / "backups"
            folder.mkdir(exist_ok=True)
            name = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid.uuid4().hex[:8] + ".vhb"
            encrypted = backup_key().encrypt(archive.getvalue())
            path = folder / name
            path.write_bytes(encrypted)
            print(json.dumps({"backup": str(path), "encrypted_bytes": len(encrypted), "storage_objects": len(objects), "tables": len(counts), "offsite": False}))
    finally:
        await connection.close()


async def restore_drill(file, apply):
    path = Path(file).resolve()
    if not path.is_relative_to((ROOT / "backups").resolve()) or path.suffix != ".vhb":
        raise RuntimeError("Restore drill only accepts local encrypted backup artifacts.")
    if not apply:
        print(json.dumps({"preview": True, "action": "restore to disposable localhost PostgreSQL", "remote_writes": False}))
        return
    locate = tools()
    decrypted = backup_key().decrypt(path.read_bytes())
    with tempfile.TemporaryDirectory(prefix="restore-", dir=ROOT / ".secrets") as temporary:
        folder = Path(temporary)
        with zipfile.ZipFile(io.BytesIO(decrypted)) as bundle:
            manifest = json.loads(bundle.read("manifest.json"))
            dump = folder / "database.dump"
            dump.write_bytes(bundle.read("database.dump"))
            if hashlib.sha256(dump.read_bytes()).hexdigest() != manifest["database_sha256"]:
                raise RuntimeError("Database artifact checksum mismatch")
            restored = folder / "storage"
            restored.mkdir()
            for obj in manifest["objects"]:
                content = bundle.read(obj["file"])
                if hashlib.sha256(content).hexdigest() != obj["sha256"]:
                    raise RuntimeError("Storage checksum mismatch")
                (restored / Path(obj["file"]).name).write_bytes(content)
        data = folder / "pgdata"
        import secrets
        password = secrets.token_urlsafe(32)
        password_file = folder / "local-password"
        password_file.write_text(password, encoding="utf-8")
        await asyncio.to_thread(run, [locate("initdb"), "-D", str(data), "-U", "postgres", "-A", "scram-sha-256", "--pwfile=" + str(password_file), "--encoding=UTF8", "--no-locale"])
        import socket
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0)); port = sock.getsockname()[1]
        started = False
        try:
            await asyncio.to_thread(run, [locate("pg_ctl"), "-D", str(data), "-l", str(folder / "postgres.log"), "-o", f"-h 127.0.0.1 -p {port}", "-w", "start"])
            started = True
            dsn = f"postgresql://postgres:{password}@127.0.0.1:{port}/postgres"
            conn = await asyncpg.connect(dsn, timeout=10)
            try:
                for role in manifest["roles"]:
                    await conn.execute('create role "' + role.replace('"', '""') + '"')
            finally:
                await conn.close()
            environment = dict(os.environ, PGHOST="127.0.0.1", PGPORT=str(port), PGDATABASE="postgres", PGUSER="postgres", PGSSLMODE="disable", PGPASSWORD=password)
            await asyncio.to_thread(run, [locate("pg_restore"), "--clean", "--if-exists", "--no-owner", "--exit-on-error", "--dbname=postgres", str(dump)], environment)
            conn = await asyncpg.connect(dsn, timeout=10)
            try:
                for table, expected in manifest["counts"].items():
                    actual = await conn.fetchval('select count(*) from public."' + table.replace('"', '""') + '"')
                    if actual != expected:
                        raise RuntimeError("Restored row count mismatch")
            finally:
                await conn.close()
            print(json.dumps({"restore_verified": True, "tables": len(manifest["counts"]), "storage_objects": len(manifest["objects"]), "target": "disposable localhost PostgreSQL", "remote_writes": False}))
        finally:
            if started:
                await asyncio.to_thread(run, [locate("pg_ctl"), "-D", str(data), "-m", "fast", "-w", "stop"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["backup", "restore-drill"])
    parser.add_argument("--file")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    try:
        asyncio.run(backup(args.apply) if args.action == "backup" else restore_drill(args.file, args.apply))
    except Exception as error:
        print(json.dumps({"result": "failed", "error_type": type(error).__name__, "message": str(error) if isinstance(error, RuntimeError) else "Backup or restore failed; credentials suppressed."}))
        raise SystemExit(1) from None
