import asyncio
import os
from pathlib import Path
import asyncpg
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "backend/.env")

DB_URL = os.environ.get("SUPABASE_DB_URL")
SCHEMA_FILE = ROOT / "supabase/migrations/202610140001_initial_schema.sql"

async def run_migration():
    if not DB_URL:
        print("ERROR: SUPABASE_DB_URL is not set.")
        return
    print(f"Connecting to database...")
    conn = await asyncpg.connect(DB_URL, ssl="require", timeout=15)
    print("Connected!")
    
    print(f"Reading schema from: {SCHEMA_FILE}")
    sql = SCHEMA_FILE.read_text(encoding="utf-8")
    
    print("Executing schema migration...")
    await conn.execute(sql)
    print("Migration executed successfully!")
    
    rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
    print("Created public tables:", [r[0] for r in rows])
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(run_migration())
