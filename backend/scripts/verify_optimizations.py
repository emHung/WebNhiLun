"""Regression checks for bounded lists and accurate totals; cleanup uses exact QA IDs."""

import asyncio
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import asyncpg
from app.core.config import get_settings
from verify_system import check, request

settings = get_settings()
tag = "QA-OPT-" + uuid.uuid4().hex
notifs = []
stories = []


async def fixtures(clean=False):
    conn = await asyncpg.connect(settings.supabase_db_url, ssl="require")
    try:
        async with conn.transaction():
            if clean:
                await conn.execute(
                    "delete from notifications where id=any($1::text[])", notifs
                )
                await conn.execute(
                    "delete from stories where id=any($1::text[])", stories
                )
            else:
                owner = await conn.fetchval(
                    "select id from profiles where legacy_id='USR-001'"
                )
                for i in range(25):
                    identifier = f"{tag}-N-{i:02}"
                    notifs.append(identifier)
                    await conn.execute(
                        "insert into notifications(id,user_id,title,description,unread,type) values($1,$2,$3,'isolated pagination fixture',true,'info')",
                        identifier,
                        owner,
                        identifier,
                    )
                for i in range(8):
                    identifier = f"{tag}-S-{i:02}"
                    stories.append(identifier)
                    await conn.execute(
                        "insert into stories(id,user_id,title,body,category) values($1,$2,$1,'isolated pagination fixture','article')",
                        identifier,
                        owner,
                    )
    finally:
        await conn.close()


def run():
    status, body = request("/auth/demo-login/volunteer", method="POST")
    check(status == 200, "optimization volunteer login")
    volunteer = body["data"]["access_token"]
    status, body = request("/auth/demo-login/organizer", method="POST")
    check(status == 200, "optimization organizer login")
    organizer = body["data"]["access_token"]
    asyncio.run(fixtures())
    first = request("/notifications?search=" + tag + "&page=1&limit=12", volunteer)[1][
        "data"
    ]
    second = request("/notifications?search=" + tag + "&page=2&limit=12", volunteer)[1][
        "data"
    ]
    third = request("/notifications?search=" + tag + "&page=3&limit=12", volunteer)[1][
        "data"
    ]
    check(
        [len(p["items"]) for p in (first, second, third)] == [12, 12, 1],
        "notification pages bounded 12/12/1",
    )
    check(
        all(p["total"] == 25 and p["pages"] == 3 for p in (first, second, third)),
        "notification totals independent of page",
    )
    check(
        len({r["id"] for p in (first, second, third) for r in p["items"]}) == 25,
        "stable notification ordering has no duplicate rows",
    )
    summary = request("/notifications/summary", volunteer)[1]["data"]
    check(
        len(summary["items"]) <= 5 and summary["unread_total"] >= 25,
        "summary badge counts beyond first five notifications",
    )
    check(
        request("/notifications?limit=101", volunteer)[0] == 422,
        "unbounded notification limit rejected",
    )
    a = request("/stories?search=" + tag + "&page=1&limit=6")[1]["data"]
    b = request("/stories?search=" + tag + "&page=2&limit=6")[1]["data"]
    check(
        len(a["items"]) == 6 and len(b["items"]) == 2 and b["total"] == 8,
        "stories paginated 6/2",
    )
    check(
        not {r["id"] for r in a["items"]} & {r["id"] for r in b["items"]},
        "story pages do not overlap",
    )
    check(
        request("/stories?search=" + tag + "&category=video")[1]["data"]["total"] == 0,
        "category filter applies before pagination",
    )
    check(
        request("/organizer/applicants?page=1&limit=1", volunteer)[0] == 403,
        "applicant pages enforce role",
    )
    a = request("/organizer/applicants?page=1&limit=1", organizer)[1]["data"]
    b = request("/organizer/applicants?page=2&limit=1", organizer)[1]["data"]
    check(
        len(a["items"]) <= 1 and len(b["items"]) <= 1 and a["total"] == b["total"],
        "applicant page size and totals",
    )
    check(a["stats"] == b["stats"], "organizer KPI totals are not page counts")
    check(
        request("/organizer/applicants?search=" + tag, organizer)[1]["data"]["total"]
        == 0,
        "applicant server search excludes unrelated rows",
    )
    print("OPTIMIZATION CHECKS PASSED")


if __name__ == "__main__":
    try:
        run()
    finally:
        asyncio.run(fixtures(clean=True))
        print("Optimization fixtures cleaned")
