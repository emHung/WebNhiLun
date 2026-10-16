"""Validate legacy seed data; database writes require an explicit --apply flag."""
import argparse
import asyncio
import json
import os
import subprocess
import urllib.error
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
try:
    from dotenv import load_dotenv
    load_dotenv(ROOT / "backend/.env")
except ImportError:
    pass


def load_seed() -> dict:
    result = subprocess.run(
        ["node", str(ROOT / "backend/scripts/export_seed_data.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        timeout=10,
    )
    return json.loads(result.stdout)


def validate(data: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    activity_ids = {row.get("id") for row in data.get("activities", [])}
    user_ids = {row.get("id") for row in data.get("users", [])}
    organization_names = {row.get("name") for row in data.get("organizations", [])}
    application_ids = {row.get("id") for row in data.get("applications", [])}
    for activity in data.get("activities", []):
        if not activity.get("id") or not activity.get("slug"):
            errors.append("Activity is missing its stable id or slug")
        if activity.get("organizer") not in organization_names:
            warnings.append(f"Activity {activity.get('id')} has no matching organization row; importer will create a rejected LEGACY organization placeholder")
        if int(activity.get("capacity", 0)) < 1:
            errors.append(f"Activity {activity.get('id')} has invalid capacity")
    for application in data.get("applications", []):
        if application.get("activityId") not in activity_ids:
            errors.append(f"Application {application.get('id')} refers to an unknown activity")
        if application.get("userId") not in user_ids:
            warnings.append(f"Application {application.get('id')} keeps legacy_user_id only; its source account is absent from seed users")
    for certificate in data.get("certificates", []):
        if certificate.get("activityId") not in activity_ids:
            errors.append(f"Certificate {certificate.get('id')} refers to an unknown activity")
        if certificate.get("userId") not in user_ids:
            warnings.append(f"Certificate {certificate.get('id')} keeps no profile link; its source account is absent from seed users")
        if certificate.get("applicationId") and certificate.get("applicationId") not in application_ids:
            warnings.append(f"Certificate {certificate.get('id')} has no matching source application; it will be imported without a linked application")
    for item in data.get("notifications", []):
        if item.get("userId") not in user_ids:
            warnings.append(f"Notification {item.get('id')} keeps legacy user reference only")
    return errors, warnings


def _auth_request(url: str, secret: str, method: str = "GET", body: dict | None = None):
    payload = json.dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(url, data=payload, method=method, headers={
        "apikey": secret,
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"Supabase Auth Admin API returned HTTP {exc.code}: {detail}") from exc


def _database_matches_project(database_url: str, project_url: str) -> bool:
    from urllib.parse import urlparse

    database = urlparse(database_url)
    project_ref = (urlparse(project_url).hostname or "").split(".")[0]
    if not project_ref or database.scheme not in {"postgres", "postgresql"}:
        return False
    if database.hostname == f"db.{project_ref}.supabase.co":
        return True
    return bool(
        database.hostname
        and database.hostname.endswith(".pooler.supabase.com")
        and project_ref in (database.username or "")
    )


def _ensure_demo_auth_users(data: dict) -> dict[str, str]:
    project_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    secret = os.environ.get("SUPABASE_SECRET_KEY", "")
    if not project_url or not secret:
        raise RuntimeError("--apply requires SUPABASE_URL and a newly rotated SUPABASE_SECRET_KEY in backend/.env.")
    db_url = os.environ.get("SUPABASE_DB_URL", "")
    if not _database_matches_project(db_url, project_url):
        raise RuntimeError("SUPABASE_DB_URL does not belong to SUPABASE_URL; no Auth users were created.")
    found: dict[str, dict] = {}
    page = 1
    while True:
        result = _auth_request(f"{project_url}/auth/v1/admin/users?page={page}&per_page=1000", secret)
        users = result.get("users", [])
        for user in users:
            if user.get("email"):
                found[user["email"].casefold()] = user
        if len(users) < 1000:
            break
        page += 1
    for user in data.get("users", []):
        if user["email"].casefold() in found:
            continue
        env_key = f"DEMO_PASSWORD_{user['id'].replace('-', '_')}"
        password = os.environ.get(env_key, "")
        if len(password) < 12:
            raise RuntimeError(f"Set {env_key} in backend/.env before importing seed accounts. Use unique strong passwords.")
        created = _auth_request(f"{project_url}/auth/v1/admin/users", secret, method="POST", body={
            "email": user["email"],
            "password": password,
            "email_confirm": True,
            "user_metadata": {"name": user.get("name", ""), "role": user.get("role", "volunteer"), "volunteerhub_demo": True},
        })
        if not created.get("id"):
            raise RuntimeError(f"Supabase Auth did not return an id for demo account {user['id']}.")
        found[user["email"].casefold()] = created
    return {row["id"]: found[row["email"].casefold()]["id"] for row in data.get("users", [])}


def _date(value):
    if not value:
        return None
    if isinstance(value, date):
        return value
    text = str(value)
    for pattern in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(text[:10], pattern).date()
        except ValueError:
            pass
    return None


def _timestamp(value):
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return datetime.now(timezone.utc)


async def apply_public_reference_data(data: dict) -> None:
    import asyncpg

    dsn = os.environ.get("SUPABASE_DB_URL")
    if not dsn:
        raise RuntimeError("Set SUPABASE_DB_URL in the backend environment before --apply.")
    conn = await asyncpg.connect(dsn=dsn, command_timeout=30, ssl="require")
    try:
        # Bootstrap seeding cannot reset an already-used database.
        if await conn.fetchval("select exists(select 1 from public.activities) or exists(select 1 from public.applications)"):
            print("Existing database detected; bootstrap seed skipped without writes.")
            return
        required = {
            "profiles": {"id", "legacy_id", "name", "email", "role", "verified_hours"},
            "organizations": {"id", "owner_id", "name", "status"},
            "activities": {"id", "slug", "title", "organization_id", "event_date", "capacity"},
            "applications": {"id", "activity_id", "user_id", "legacy_user_id", "status"},
            "certificates": {"id", "certificate_code", "application_id", "user_id"},
            "site_content": {"content_key", "content_html"},
        }
        rows = await conn.fetch(
            "select table_name,column_name from information_schema.columns where table_schema='public' and table_name=any($1::text[])",
            list(required),
        )
        present: dict[str, set[str]] = {}
        for row in rows:
            present.setdefault(row["table_name"], set()).add(row["column_name"])
        missing = [f"{table}.{column}" for table, columns in required.items() for column in sorted(columns - present.get(table, set()))]
        if missing:
            raise RuntimeError("Supabase schema is missing VolunteerHub columns; no Auth users or seed data were written: " + ", ".join(missing))
        auth_ids = _ensure_demo_auth_users(data)
        async with conn.transaction():
            marketing_path = ROOT / "backend/data/marketing_content.json"
            if marketing_path.exists():
                marketing = json.loads(marketing_path.read_text(encoding="utf-8"))
                for content_key, content_html in marketing.items():
                    if content_key in {"aboutContent", "storiesContent"} and isinstance(content_html, str):
                        await conn.execute(
                            "insert into public.site_content(content_key,content_html) values($1,$2) on conflict(content_key) do update set content_html=excluded.content_html,updated_at=now()",
                            content_key,
                            content_html,
                        )
            for person in data.get("users", []):
                role = person.get("role", "volunteer")
                if role not in {"volunteer", "organizer", "admin"}:
                    role = "volunteer"
                await conn.execute(
                    """insert into public.profiles(id,legacy_id,name,email,phone,dob,city,role,role_title,avatar_url,bio,skills)
                    values($1::uuid,$2,$3,$4,$5,$6::date,$7,$8,$9,$10,$11,$12)
                    on conflict(id) do update set legacy_id=excluded.legacy_id,name=excluded.name,email=excluded.email,
                    phone=excluded.phone,dob=excluded.dob,city=excluded.city,role=excluded.role,role_title=excluded.role_title,
                    avatar_url=excluded.avatar_url,bio=excluded.bio,skills=excluded.skills""",
                    auth_ids[person["id"]], person["id"], person["name"], person["email"], person.get("phone"),
                    _date(person.get("dob")), person.get("city"), role, person.get("roleTitle"), person.get("avatarImg"),
                    person.get("bio"), person.get("skills") or [],
                )
            org_ids: dict[str, str] = {}
            for org in data.get("organizations", []):
                org_ids[org["name"]] = org["id"]
                owner = next((u for u in data.get("users", []) if u.get("orgName") == org["name"]), None)
                await conn.execute(
                    """insert into public.organizations(id,owner_id,name,representative,category,status,verified,doc_name,registered_at,description)
                    values($1,$2::uuid,$3,$4,$5,$6,$7,$8,coalesce($9::date,current_date),$10)
                    on conflict(id) do update set owner_id=excluded.owner_id,name=excluded.name, representative=excluded.representative,
                    category=excluded.category,status=excluded.status,verified=excluded.verified,
                    doc_name=excluded.doc_name,description=excluded.description""",
                    org["id"], auth_ids.get(owner["id"]) if owner else None, org["name"], org.get("representative") or org.get("name"), org.get("category") or "Cộng đồng",
                    org.get("status") if org.get("status") in {"pending", "approved", "rejected"} else ("approved" if org.get("verified") else "pending"),
                    bool(org.get("verified")), org.get("docName"), _date(org.get("registeredAt")), org.get("desc") or org.get("description"),
                )

            for activity in data.get("activities", []):
                event_date = _date(activity.get("date"))
                deadline = _date(activity.get("deadline"))
                banner = activity.get("banner")
                if banner and not str(banner).startswith(("http://", "https://", "/")):
                    banner = f"/legacy/{str(banner).lstrip('/')}"
                org_id = org_ids.get(activity.get("organizer"))
                if not org_id:
                    # Legacy activities may reference retired organizations; retain the visible organizer label.
                    org_id = f"LEGACY-{activity['id']}"
                    await conn.execute(
                        """insert into public.organizations(id,name,representative,category,status,verified,description)
                        values($1,$2,$2,'Cộng đồng','rejected',false,'Tổ chức tham chiếu từ dữ liệu legacy; cần xác minh trước khi sử dụng.')
                        on conflict(id) do nothing""",
                        org_id, activity.get("organizer") or "Tổ chức legacy",
                    )
                status = activity.get("status")
                if status not in {"draft", "pending", "rejected", "recruiting", "ongoing", "completed", "Đang tuyển", "Đang diễn ra", "Sắp diễn ra", "Đã hoàn thành", "Chờ Admin duyệt", "Bản nháp"}:
                    status = "recruiting"
                await conn.execute(
                    """insert into public.activities(id,slug,title,category,organization_id,organizer_name,organizer_verified,event_date,event_time,deadline_date,city,location,capacity,applied,verified_hours,status,featured,banner_url,description,requirements,items_to_bring,contact)
                    values($1,$2,$3,$4,$5,$6,$7,$8::date,$9,$10::date,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
                    on conflict(id) do update set slug=excluded.slug,title=excluded.title,category=excluded.category,
                    organization_id=excluded.organization_id,organizer_name=excluded.organizer_name,organizer_verified=excluded.organizer_verified,
                    event_date=excluded.event_date,event_time=excluded.event_time,deadline_date=excluded.deadline_date,city=excluded.city,
                    location=excluded.location,capacity=excluded.capacity,applied=excluded.applied,verified_hours=excluded.verified_hours,
                    status=excluded.status,featured=excluded.featured,banner_url=excluded.banner_url,description=excluded.description,
                    requirements=excluded.requirements,items_to_bring=excluded.items_to_bring,contact=excluded.contact""",
                    activity["id"], activity["slug"], activity["title"], activity.get("category", "Cộng đồng"), org_id,
                    activity.get("organizer", ""), bool(activity.get("organizerVerified")), event_date, activity.get("time", ""), deadline,
                    activity.get("city", ""), activity.get("location", ""), max(1, int(activity.get("capacity", 1))),
                    min(int(activity.get("applied", 0)), max(1, int(activity.get("capacity", 1)))), int(activity.get("verifiedHours", 0)), status,
                    bool(activity.get("featured")), banner, activity.get("description", ""), activity.get("requirements"),
                    activity.get("itemsToBring"), activity.get("contact"),
                )
                await conn.execute("delete from public.activity_schedules where activity_id=$1", activity["id"])
                for order, item in enumerate(activity.get("schedule", []), start=1):
                    await conn.execute(
                        "insert into public.activity_schedules(activity_id,step_order,time_frame,content) values($1,$2,$3,$4)",
                        activity["id"], order, item.get("time", ""), item.get("content", ""),
                    )
            for theme in data.get("themes", []):
                is_default = int(theme.get("id", 0)) == 1
                if is_default:
                    await conn.execute("update public.system_themes set is_active=false where is_active")
                await conn.execute(
                    """insert into public.system_themes(legacy_id,name,primary_color,cta_color,surface_color,meaning,is_active,is_default,mode)
                    values($1,$2,$3,$4,$5,$6,$7,$8,$9)
                    on conflict(legacy_id) do update set name=excluded.name,primary_color=excluded.primary_color,
                    cta_color=excluded.cta_color,surface_color=excluded.surface_color,meaning=excluded.meaning,
                    is_active=excluded.is_active,is_default=excluded.is_default,mode=excluded.mode""",
                    str(theme["id"]), theme["name"], theme["primary"], theme["cta"], theme["surface"], theme.get("meaning"),
                    is_default, is_default, theme.get("mode", "light"),
                )
            app_rows = {row.get("id"): row for row in data.get("applications", [])}
            for application in data.get("applications", []):
                status = application.get("status", "pending")
                if status not in {"pending", "approved", "rejected", "cancelled"}:
                    status = "pending"
                checkin = "checked_in" if application.get("checkinStatus") in {"checked_in", "Đã điểm danh"} else "not_yet"
                await conn.execute(
                    """insert into public.applications(id,activity_id,user_id,legacy_user_id,user_name,user_email,user_phone,event_date,shift,status,status_text,reject_reason,checkin_status,verified_hours,has_certificate,applied_at)
                    values($1,$2,$3::uuid,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
                    on conflict(id) do update set activity_id=excluded.activity_id,user_id=excluded.user_id,
                    legacy_user_id=excluded.legacy_user_id,user_name=excluded.user_name,user_email=excluded.user_email,
                    user_phone=excluded.user_phone,event_date=excluded.event_date,shift=excluded.shift,status=excluded.status,
                    status_text=excluded.status_text,reject_reason=excluded.reject_reason,checkin_status=excluded.checkin_status,
                    verified_hours=excluded.verified_hours,has_certificate=excluded.has_certificate""",
                    application["id"], application["activityId"], auth_ids.get(application["userId"]), application.get("userId"),
                    application.get("userName", ""), application.get("userEmail", ""), application.get("userPhone", ""),
                    application.get("date"), application.get("shift", "Toàn thời gian"), status, application.get("statusText"),
                    application.get("rejectReason"), checkin, int(application.get("verifiedHours", 0)), bool(application.get("hasCert")),
                    _timestamp(application.get("appliedAt")),
                )
            for certificate in data.get("certificates", []):
                app_id = certificate.get("applicationId") or next((a["id"] for a in app_rows.values() if a.get("userId") == certificate.get("userId") and a.get("activityId") == certificate.get("activityId")), None)
                legacy_app_id = None
                if not app_id or app_id not in app_rows:
                    legacy_app_id = f"LEGACY-{certificate['id']}"
                    app_id = legacy_app_id
                    await conn.execute(
                        """insert into public.applications(id,activity_id,legacy_user_id,user_name,user_email,event_date,shift,status,status_text,verified_hours,has_certificate)
                        values($1,$2,$3,$4,'',$5,'Toàn thời gian','approved','Đã xác nhận (legacy)',$6,true)
                        on conflict(id) do nothing""",
                        legacy_app_id, certificate["activityId"], certificate.get("userId"), certificate.get("userName", "Người tham gia legacy"),
                        str(_date(certificate.get("issueDate")) or ""), int(certificate.get("hours", 0)),
                    )
                await conn.execute(
                    """insert into public.certificates(id,certificate_code,application_id,user_id,recipient_name,activity_id,title,issuer,hours,issue_date,badge_type,qr_verified)
                    values($1,$2,$3,$4::uuid,$5,$6,$7,$8,$9,coalesce($10::date,current_date),$11,$12)
                    on conflict(id) do update set certificate_code=excluded.certificate_code,application_id=excluded.application_id,
                    user_id=excluded.user_id,recipient_name=excluded.recipient_name,activity_id=excluded.activity_id,title=excluded.title,issuer=excluded.issuer,
                    hours=excluded.hours,issue_date=excluded.issue_date,badge_type=excluded.badge_type,qr_verified=excluded.qr_verified""",
                    certificate["id"], certificate.get("certificateCode") or certificate["id"], app_id,
                    auth_ids.get(certificate["userId"]), certificate.get("userName", ""), certificate["activityId"], certificate.get("title", ""), certificate.get("issuer", ""),
                    int(certificate.get("hours", 0)), _date(certificate.get("issueDate")), certificate.get("badgeType"), bool(certificate.get("qrVerified", True)),
                )
            for item in data.get("notifications", []):
                linked_user_id = auth_ids.get(item.get("userId"))
                if not linked_user_id:
                    continue
                await conn.execute(
                    """insert into public.notifications(id,user_id,icon,type,title,description,unread,link,created_at)
                    values($1,$2::uuid,$3,$4,$5,$6,$7,$8,$9)
                    on conflict(id) do update set user_id=excluded.user_id,icon=excluded.icon,type=excluded.type,title=excluded.title,
                    description=excluded.description,unread=excluded.unread,link=excluded.link""",
                    str(item.get("id")), linked_user_id, item.get("icon"), item.get("type", "info"), item.get("title", ""),
                    item.get("desc"), bool(item.get("unread", True)), item.get("link"), _timestamp(item.get("time")),
                )
            for item in data.get("auditLogs", []):
                await conn.execute(
                    """insert into public.audit_logs(id,actor,action,target,details,ip,created_at)
                    values($1,$2,$3,$4,$5,$6::inet,$7)
                    on conflict(id) do update set actor=excluded.actor,action=excluded.action,target=excluded.target,details=excluded.details""",
                    item.get("id"), item.get("actor", ""), item.get("action", ""), item.get("target", ""), item.get("details"),
                    item.get("ip") if item.get("ip") and "://" not in str(item.get("ip")) else None, _timestamp(item.get("time")),
                )
            for activity_id in data.get("favorites", []):
                if auth_ids.get("USR-001"):
                    await conn.execute("insert into public.favorites(user_id,activity_id) values($1::uuid,$2) on conflict do nothing", auth_ids["USR-001"], activity_id)
            await conn.execute(
                """select setval('public.application_id_seq', coalesce(max(nullif(substring(id from '([0-9]+)$'), '')::bigint), 1),
                coalesce(max(nullif(substring(id from '([0-9]+)$'), '')::bigint), 0) > 0) from public.applications"""
            )
            await conn.execute(
                """select setval('public.certificate_code_seq', coalesce(max(nullif(substring(certificate_code from '([0-9]+)$'), '')::bigint), 1),
                coalesce(max(nullif(substring(certificate_code from '([0-9]+)$'), '')::bigint), 0) > 0) from public.certificates"""
            )
    finally:
        await conn.close()


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write reference organizations and activities to Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Validate and print record counts without database writes (default)")
    args = parser.parse_args()
    data = load_seed()
    errors, warnings = validate(data)
    counts = {name: len(data.get(name, [])) for name in ("users", "organizations", "activities", "applications", "certificates", "auditLogs", "themes")}
    print(json.dumps({"dry_run": not args.apply, "counts": counts, "warnings": warnings, "errors": errors}, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit("Seed validation failed; no data was written.")
    if args.apply:
        dsn = os.environ.get("SUPABASE_DB_URL", "")
        if not dsn or "placeholder" in dsn.casefold():
            raise SystemExit("--apply requires a real SUPABASE_DB_URL in backend/.env; no remote writes were made.")
        try:
            if not _database_matches_project(dsn, os.environ.get("SUPABASE_URL", "")):
                raise SystemExit("SUPABASE_DB_URL host must match SUPABASE_URL; no remote writes were made.")
        except ValueError as exc:
            raise SystemExit("SUPABASE_DB_URL is invalid; no remote writes were made.") from exc
        if os.environ.get("APP_ENV", "development").casefold() == "production":
            raise SystemExit("Demo seed is disabled in production; use a reviewed production import process.")
        await apply_public_reference_data(data)
        print("Seeded profiles, organizations, activities, schedules, applications, certificates, notifications, audit logs, favorites, themes, and site content.")


if __name__ == "__main__":
    asyncio.run(main())
