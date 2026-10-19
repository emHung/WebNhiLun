"""Convert the existing HTML stories into idempotent DB records; never reset likes."""
import asyncio
import html
import re
from pathlib import Path
import asyncpg
from dotenv import load_dotenv
import os

ROOT=Path(__file__).resolve().parents[2]
load_dotenv(ROOT/"backend/.env")

def legacy_stories(content):
    result=[]
    for index,card in enumerate(re.findall(r'<article\b[^>]*class="story-card-item"[^>]*>.*?</article>',content,re.S),1):
        def text(class_name):
            match=re.search(r'class="'+class_name+r'"[^>]*>(.*?)</(?:h3|p)>',card,re.S)
            return html.unescape(re.sub(r'<[^>]+>','',match.group(1))).strip() if match else ''
        likes=re.search(r'story-like-btn.*?<span>(\d+)</span>',card,re.S)
        category=re.search(r'data-category="([^"]+)"',card)
        result.append((f"legacy-story-{index}",text("story-card-title"),text("story-card-desc"),category.group(1) if category else "all",int(likes.group(1)) if likes else 0))
    return result

async def main():
    project=os.environ["SUPABASE_URL"].split('//')[-1].split('.')[0]
    dsn=os.environ["SUPABASE_DB_URL"]
    from urllib.parse import urlparse
    uri=urlparse(dsn)
    if uri.hostname!=f"db.{project}.supabase.co" and project not in (uri.username or ''):
        raise RuntimeError("Project mismatch")
    conn=await asyncpg.connect(dsn,ssl='require')
    try:
        content=await conn.fetchval("select content_html from public.site_content where content_key='storiesContent'")
        rows=legacy_stories(content)
        if not rows:raise RuntimeError("No legacy stories found; stopped.")
        async with conn.transaction():
            await conn.executemany("insert into public.stories(id,title,body,category,legacy_likes) values($1,$2,$3,$4,$5) on conflict(id) do nothing",rows)

            content=re.sub(r'onclick="filterStories\(\'([^\']+)\', this\)"',r'data-story-filter="\1"',content)
            content=content.replace('onclick="openStoryModal()"','data-story-action="share"').replace('onclick="openStoryVideoModal(event)"','data-story-action="video"')
            content=re.sub(r'\s+on\w+="[^"]*"','',content)
            legacy=ROOT/'stories.html'
            source=legacy.read_text(encoding='utf-8')
            video=re.search(r"iframe.src = '([^']+)'",source)
            if video and "data-video-url" not in content:
                content=content.replace('class="stories-hero-banner"',f'class="stories-hero-banner" data-video-url="{html.escape(video.group(1),quote=True)}"')
            await conn.execute("update public.site_content set content_html=$1,updated_at=now() where content_key='storiesContent'",content)
        print({"imported_story_records":len(rows)})
    finally:await conn.close()

if __name__=='__main__':asyncio.run(main())
