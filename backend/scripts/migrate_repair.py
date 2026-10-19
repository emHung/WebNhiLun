"""Apply tracked SQL atomically; default is a preview. Never print credentials."""
import argparse
import asyncio
import hashlib
from pathlib import Path
from urllib.parse import urlparse
import asyncpg
from dotenv import load_dotenv
import os

ROOT=Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "backend/.env")
load_dotenv(ROOT / ".secrets/admin.env")

async def run(args):
    target=os.environ.get("SUPABASE_URL", "")
    dsn=os.environ.get("SUPABASE_MIGRATION_DB_URL") or os.environ.get("SUPABASE_DB_URL", "")
    ref=(urlparse(target).hostname or "").split(".")[0]
    uri=urlparse(dsn)
    if not ref or not (uri.hostname==f"db.{ref}.supabase.co" or (uri.hostname or "").endswith(".pooler.supabase.com") and ref in (uri.username or "")):
        raise RuntimeError("Supabase URL and database target do not match.")
    file=(ROOT / args.file).resolve()
    if ROOT / "supabase/migrations" not in file.parents:
        raise RuntimeError("SQL must be inside supabase/migrations.")
    sql=file.read_text(encoding="utf-8")
    digest=hashlib.sha256(sql.encode()).hexdigest()
    print({"target":target,"migration":file.name,"sha256":digest,"apply":args.apply})
    if not args.apply:
        return
    connection=await asyncpg.connect(dsn,ssl="require",timeout=15)
    try:
        async with connection.transaction():
            await connection.execute("select pg_advisory_xact_lock(641830)")
            await connection.execute("create schema if not exists private; create table if not exists private.migration_history(name text primary key, checksum text not null, applied_at timestamptz not null default now())")
            previous=await connection.fetchval("select checksum from private.migration_history where name=$1",file.name)
            if previous:
                if previous!=digest:
                    raise RuntimeError("An applied migration changed. Create a new migration.")
                print("Already applied; no changes.")
                return
            await connection.execute(sql)
            await connection.execute("insert into private.migration_history(name,checksum) values($1,$2)",file.name,digest)
        print("Migration applied successfully.")
    finally:
        await connection.close()

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--file",required=True)
    parser.add_argument("--apply",action="store_true")
    asyncio.run(run(parser.parse_args()))
