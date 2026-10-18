import asyncio
import os
from pathlib import Path
import asyncpg
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "backend/.env")
db_url = os.environ.get("SUPABASE_DB_URL")

async def migrate_stories():
    conn = await asyncpg.connect(db_url, ssl="require", timeout=15)
    await conn.execute("ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS author_name text")
    await conn.execute("ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS author_avatar text")
    await conn.execute("ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS thumbnail_url text")
    print("Columns ensured!")

    updates = [
        ("legacy-story-1", "Nguyễn Thị Lan", "/legacy/images/profile-avatar.jpg", "/legacy/images/act-tree.jpg"),
        ("legacy-story-2", "Trần Minh Khoa", "/legacy/images/home-hero-volunteer.jpg", "/legacy/images/act-books.jpg"),
        ("legacy-story-3", "Lê Thu Thảo", "/legacy/images/profile-avatar.jpg", "/legacy/images/act-beach.jpg"),
        ("legacy-story-4", "Phạm Ngọc Anh", "/legacy/images/profile-avatar.jpg", "/legacy/images/act-medical.jpg"),
        ("legacy-story-5", "Vũ Đức Thành", "/legacy/images/home-hero-volunteer.jpg", "/legacy/images/act-food.jpg"),
        ("legacy-story-6", "Nguyễn Hoài Nam", "/legacy/images/profile-avatar.jpg", "/legacy/images/home-hero-volunteer.jpg"),
    ]
    for sid, author, avatar, thumb in updates:
        await conn.execute(
            "UPDATE public.stories SET author_name=$2, author_avatar=$3, thumbnail_url=$4 WHERE id=$1",
            sid, author, avatar, thumb
        )
    print("Stories updated successfully!")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(migrate_stories())
