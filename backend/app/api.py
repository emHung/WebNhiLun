from datetime import datetime, timezone
import asyncio
import csv
import io
import json
import re
import time
import urllib.error
import urllib.request
from urllib.parse import quote
from collections import defaultdict, deque
from uuid import uuid4
from zoneinfo import ZoneInfo
from app.services.storage import upload_document, signed_url
from app.services.pagination import page_result
from app.services.certificate_files import certificate_file

import asyncpg
from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, UploadFile
from fastapi.responses import StreamingResponse

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_roles
from app.schemas import (
    ActivityCreate,
    AdminDecision,
    ApplyInput,
    FavoriteInput,
    OrganizationCreate,
    NotificationReadInput,
    ProfileUpdate,
    ReviewInput,
    ThemeUpdate,
    StoryInput,
    AdminDeleteStoryInput,
)

router = APIRouter(prefix="/api/v1")
_demo_attempts: dict[str, deque[float]] = defaultdict(deque)
_demo_accounts = {
    "volunteer": ("an.nguyen@email.com", "demo_password_usr_001"),
    "organizer": ("coordinator@quyxanh.vn", "demo_password_usr_002"),
    "admin": ("admin@volunteerhub.vn", "demo_password_usr_003"),
}


def ok(data, message: str | None = None):
    return {
        "success": True,
        "data": data,
        "message": message,
        "meta": {"timestamp": datetime.now(timezone.utc).isoformat()},
    }


async def write_audit(
    conn,
    user: CurrentUser,
    action: str,
    target: str,
    details: str | None = None,
    request: Request | None = None,
):
    ip = request.client.host if request and request.client else None
    await conn.execute(
        "insert into public.audit_logs(id,actor_id,actor,action,target,details,ip) values($1,$2,$3,$4,$5,$6,$7::inet)",
        f"LOG-{uuid4().hex[:12].upper()}",
        user.id,
        user.name,
        action,
        target,
        details,
        ip,
    )


def business_today():
    return datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")).date()


def ensure_open_for_registration(activity):
    if activity["status"] not in {
        "recruiting",
        "upcoming",
        "Đang tuyển",
        "Sắp diễn ra",
        "Đang tuyển TNV",
    }:
        raise HTTPException(409, "Hoạt động không còn tuyển tình nguyện viên.")
    if activity["event_date"] < business_today():
        raise HTTPException(409, "Hoạt động đã kết thúc.")
    if activity.get("deadline_date") and activity["deadline_date"] < business_today():
        raise HTTPException(409, "Đã hết hạn đăng ký.")


def make_slug(value: str) -> str:
    value = value.casefold().strip()
    value = re.sub(r"[^\w\s-]", "", value, flags=re.UNICODE)
    return re.sub(r"[-\s]+", "-", value).strip("-") or uuid4().hex[:10]


@router.get("/health")
async def health():
    return ok({"status": "ok"})


@router.get("/home/metrics")
async def home_metrics(db=Depends(get_db)):
    row = await db.fetchrow(
        "select (select count(*) from public.activities where status not in ('draft','pending','rejected','Chờ Admin duyệt','Bản nháp')) as activities, (select count(*) from public.profiles where role='volunteer') as volunteers, (select count(distinct city) from public.activities where nullif(trim(city),'') is not null) as locations"
    )
    return ok({key: int(value) for key, value in dict(row).items()})


@router.get("/site-content/{content_key}")
async def site_content(content_key: str, db=Depends(get_db)):
    if content_key not in {"aboutContent", "storiesContent"}:
        raise HTTPException(404, "Không tìm thấy nội dung.")
    row = await db.fetchrow(
        "select content_html from public.site_content where content_key=$1",
        content_key,
    )
    if not row:
        raise HTTPException(404, "Nội dung chưa được nạp vào cơ sở dữ liệu.")
    return ok({"html": row["content_html"]})


@router.get("/activities/filters")
async def activity_filters(db=Depends(get_db)):
    cities = await db.fetch(
        "select distinct city from public.activities where city<>'' order by city"
    )
    categories = await db.fetch(
        "select distinct category from public.activities where category<>'' order by category"
    )
    statuses = await db.fetch(
        "select distinct status from public.activities where status not in ('draft','pending','rejected','Chờ Admin duyệt','Bản nháp') order by status"
    )
    return ok(
        {
            "cities": [row["city"] for row in cities],
            "categories": [row["category"] for row in categories],
            "statuses": [row["status"] for row in statuses],
        }
    )


@router.get("/themes")
async def active_theme(db=Depends(get_db)):
    row = await db.fetchrow(
        "select * from public.system_themes where is_active=true limit 1"
    )
    return ok({**dict(row), "id": int(row["id"])} if row else None)


@router.get("/auth/me")
async def me(user: CurrentUser = Depends(get_current_user), db=Depends(get_db)):
    row = await db.fetchrow(
        "select id,role,role_title,name,email,avatar_url from public.profiles where id=$1",
        user.id,
    )
    return ok(dict(row))


@router.get("/me/profile")
async def my_profile(user: CurrentUser = Depends(get_current_user), db=Depends(get_db)):
    row = await db.fetchrow(
        "select id,legacy_id,name,email,phone,dob,city,role,role_title,avatar_url,cover_url,bio,skills,interests,verified_hours from public.profiles where id=$1",
        user.id,
    )
    settings = get_settings()
    points = row["verified_hours"] * settings.volunteer_points_per_hour
    thresholds = sorted(
        int(value) for value in settings.volunteer_rank_thresholds.split(",")
    )
    next_points = next(
        (value for value in thresholds if value > points), max(points, thresholds[-1])
    )
    rank = (
        "Tình nguyện viên mới"
        if points == 0
        else "Tình nguyện viên tích cực"
        if points < thresholds[0]
        else "Người lan tỏa"
    )
    return ok(
        {
            **dict(row),
            "id": str(row["id"]),
            "volunteer_points": points,
            "next_rank_points": next_points,
            "rank_title": rank,
        }
    )


@router.patch("/me/profile")
async def update_profile(
    payload: ProfileUpdate,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    fields = payload.model_dump(exclude_unset=True)
    if not fields:
        return ok(
            {
                "id": str(user.id),
                "role": user.role,
                "name": user.name,
                "email": user.email,
            },
            "Không có thông tin cần cập nhật.",
        )
    if "name" in fields and not fields["name"].strip():
        raise HTTPException(422, "Tên không được để trống.")
    for key in ("skills", "interests"):
        if key in fields:
            fields[key] = list(
                dict.fromkeys(
                    skill.strip()[:100] for skill in fields[key] if skill.strip()
                )
            )
    columns = list(fields)
    assignments = ",".join(
        f"{column}=${index + 2}" for index, column in enumerate(columns)
    )
    values = [fields[column] for column in columns]
    row = await db.fetchrow(
        f"update public.profiles set {assignments} where id=$1 returning id,legacy_id,name,email,phone,dob,city,role,role_title,avatar_url,cover_url,bio,skills,interests,verified_hours",
        user.id,
        *values,
    )
    return ok({**dict(row), "id": str(row["id"])}, "Đã cập nhật hồ sơ.")


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...), user: CurrentUser = Depends(get_current_user)
):
    settings = get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503, "Storage chưa được cấu hình ở backend.")
    mime = (file.content_type or "").lower()
    allowed = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
    if mime not in allowed:
        raise HTTPException(415, "Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.")
    content = await file.read(2 * 1024 * 1024 + 1)
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(413, "Ảnh vượt quá dung lượng tối đa 2 MB.")
    object_path = f"{user.id}/{uuid4().hex}.{allowed[mime]}"
    url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/avatars/{quote(object_path, safe='/')}"
    upload = urllib.request.Request(
        url,
        data=content,
        method="POST",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": mime,
            "x-upsert": "false",
        },
    )
    try:
        await asyncio.to_thread(
            lambda: urllib.request.urlopen(upload, timeout=20).read()
        )
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, "Supabase Storage từ chối tải ảnh lên.") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(502, "Không thể kết nối Supabase Storage.") from exc
    public_url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/public/avatars/{quote(object_path, safe='/')}"
    return ok({"path": object_path, "url": public_url}, "Đã tải ảnh đại diện lên.")


@router.get("/me/favorites")
async def my_favorites(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    rows = await db.fetch(
        "select a.* from public.favorites f join public.activities a on a.id=f.activity_id where f.user_id=$1 order by f.created_at desc",
        user.id,
    )
    return ok([{**dict(row), "id": str(row["id"])} for row in rows])


@router.post("/me/favorites", status_code=201)
async def add_favorite(
    payload: FavoriteInput,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    exists = await db.fetchval(
        "select 1 from public.activities where id=$1", payload.activity_id
    )
    if not exists:
        raise HTTPException(404, "Không tìm thấy hoạt động.")
    await db.execute(
        "insert into public.favorites(user_id,activity_id) values($1,$2) on conflict do nothing",
        user.id,
        payload.activity_id,
    )
    return ok({"activity_id": payload.activity_id}, "Đã lưu hoạt động.")


@router.delete("/me/favorites/{activity_id}")
async def remove_favorite(
    activity_id: str, user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    await db.execute(
        "delete from public.favorites where user_id=$1 and activity_id=$2",
        user.id,
        activity_id,
    )
    return ok({"activity_id": activity_id}, "Đã bỏ lưu hoạt động.")


@router.post("/auth/demo-login/{role}")
async def demo_login(role: str, request: Request):
    from app.core.config import get_settings

    settings = get_settings()
    if (
        role not in _demo_accounts
        or not settings.demo_login_enabled
        or settings.app_env.lower() == "production"
    ):
        raise HTTPException(404, "Đăng nhập demo hiện không khả dụng.")
    email, password_attribute = _demo_accounts[role]
    password = getattr(settings, password_attribute)
    if not password or not settings.supabase_publishable_key:
        raise HTTPException(503, "Tài khoản demo chưa được cấu hình ở backend.")
    client_ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    attempts = _demo_attempts[client_ip]
    while attempts and now - attempts[0] > 60:
        attempts.popleft()
    if len(attempts) >= 5:
        raise HTTPException(
            429, "Bạn thao tác quá nhanh. Vui lòng thử lại sau một phút."
        )
    attempts.append(now)

    def request_session():
        payload = json.dumps({"email": email, "password": password}).encode("utf-8")
        req = urllib.request.Request(
            f"{settings.supabase_url.rstrip('/')}/auth/v1/token?grant_type=password",
            data=payload,
            method="POST",
            headers={
                "apikey": settings.supabase_publishable_key,
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise RuntimeError("Supabase Auth rejected the demo sign-in") from exc

    try:
        session = await asyncio.to_thread(request_session)
    except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
        raise HTTPException(
            502, "Không thể đăng nhập tài khoản demo với Supabase Auth."
        ) from exc
    return ok(
        {
            "access_token": session["access_token"],
            "refresh_token": session["refresh_token"],
            "expires_in": session.get("expires_in"),
            "token_type": session.get("token_type", "bearer"),
        }
    )


@router.get("/activities")
async def activities(
    search: str | None = None,
    city: str | None = None,
    category: str | None = None,
    featured: bool | None = None,
    time_filter: str | None = Query(None, alias="time", pattern="^(7d|30d)$"),
    status: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db=Depends(get_db),
):
    where = [
        "status not in ('draft','pending','rejected','Chờ Admin duyệt','Bản nháp')"
    ]
    args: list[object] = []
    for column, value in (("city", city), ("category", category)):
        if value:
            args.append(value)
            where.append(f"{column} = ${len(args)}")
    if search:
        args.append(f"%{search[:100]}%")
        where.append(
            f"(title ilike ${len(args)} or description ilike ${len(args)} or location ilike ${len(args)})"
        )
    if time_filter:
        args.extend([business_today(), 7 if time_filter == "7d" else 30])
        where.append(
            f"event_date between ${len(args) - 1}::date and (${len(args) - 1}::date + ${len(args)}::integer)"
        )
    if status:
        args.append(status)
        where.append(f"status = ${len(args)}")
    if featured is not None:
        args.append(featured)
        where.append(f"featured = ${len(args)}")
    count = await db.fetchval(
        f"select count(*) from public.activities where {' and '.join(where)}", *args
    )
    args.extend([limit, (page - 1) * limit])
    rows = await db.fetch(
        f"select * from public.activities where {' and '.join(where)} order by featured desc, event_date asc limit ${len(args) - 1} offset ${len(args)}",
        *args,
    )
    return ok(
        {
            "items": [{**dict(row), "id": str(row["id"])} for row in rows],
            "page": page,
            "limit": limit,
            "total": count,
        }
    )


@router.get("/activities/{identifier}")
async def activity_detail(identifier: str, db=Depends(get_db)):
    row = await db.fetchrow(
        "select * from public.activities where (id=$1 or slug=$1) and status not in ('draft','pending','rejected','Chờ Admin duyệt','Bản nháp')",
        identifier,
    )
    if not row:
        raise HTTPException(404, "Không tìm thấy hoạt động.")
    schedule = await db.fetch(
        "select step_order, time_frame, content from public.activity_schedules where activity_id=$1 order by step_order",
        row["id"],
    )
    return ok(
        {
            **dict(row),
            "id": str(row["id"]),
            "schedule": [dict(item) for item in schedule],
        }
    )


@router.post("/activities/{activity_id}/apply", status_code=201)
async def apply(
    activity_id: str,
    payload: ApplyInput,
    request: Request,
    user: CurrentUser = Depends(require_roles("volunteer")),
    db=Depends(get_db),
):
    try:
        async with db.acquire() as conn, conn.transaction():
            activity = await conn.fetchrow(
                "select * from public.activities where id=$1 for update", activity_id
            )
            if not activity or activity["status"] in {
                "draft",
                "pending",
                "rejected",
                "Chờ Admin duyệt",
                "Bản nháp",
            }:
                raise HTTPException(
                    404, "Hoạt động không tồn tại hoặc chưa mở đăng ký."
                )
            ensure_open_for_registration(activity)
            if activity["applied"] >= activity["capacity"]:
                raise HTTPException(409, "Hoạt động đã đủ chỉ tiêu.")
            existing = await conn.fetchval(
                "select 1 from public.applications where activity_id=$1 and user_id=$2 and status not in ('cancelled','rejected')",
                activity_id,
                user.id,
            )
            if existing:
                raise HTTPException(409, "Bạn đã có đơn đăng ký cho hoạt động này.")
            app_id = await conn.fetchval(
                "select 'APP-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('public.application_id_seq')::text, 3, '0')"
            )
            row = await conn.fetchrow(
                "insert into public.applications(id,activity_id,user_id,user_name,user_email,user_phone,event_date,shift,experience,skills,status,status_text) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending','Chờ duyệt') returning *",
                app_id,
                activity_id,
                user.id,
                user.name,
                user.email,
                (
                    await conn.fetchval(
                        "select phone from public.profiles where id=$1", user.id
                    )
                )
                or "",
                activity["event_date"].isoformat(),
                payload.shift,
                payload.experience,
                payload.skills,
            )
            await conn.execute(
                "insert into public.notifications(id,user_id,type,title,description,link,source_activity_id) values($1,$2,'info',$3,$4,$5,$6)",
                f"NOTIF-{uuid4().hex[:12].upper()}",
                user.id,
                "Đã gửi đơn đăng ký thành công",
                f"Bạn đã nộp đơn tham gia '{activity['title']}'. Vui lòng chờ Ban tổ chức xét duyệt.",
                f"/volunteer/dashboard",
                activity_id,
            )
            await write_audit(
                conn, user, "application_submitted", app_id, activity_id, request
            )
            return ok(
                {**dict(row), "activity_id": str(row["activity_id"])},
                "Nộp đơn đăng ký thành công.",
            )
    except asyncpg.UniqueViolationError as exc:
        raise HTTPException(409, "Bạn đã có đơn đăng ký cho hoạt động này.") from exc


@router.get("/me/applications")
async def my_applications(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    rows = await db.fetch(
        "select ap.*, coalesce((select c.title from public.certificates c where c.application_id=ap.id and ap.is_historical),a.title) as activity_title, a.slug, coalesce(ap.historical_date,a.event_date) as event_date, a.event_time,a.city,a.location,a.organizer_name,a.banner_url,a.category,a.capacity,a.applied from public.applications ap join public.activities a on a.id=ap.activity_id where ap.user_id=$1 order by ap.applied_at desc",
        user.id,
    )
    return ok([{**dict(row), "activity_id": str(row["activity_id"])} for row in rows])


@router.post("/me/applications/{application_id}/cancel")
async def cancel_application(
    application_id: str,
    request: Request,
    user: CurrentUser = Depends(require_roles("volunteer")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "select ap.*, a.id as locked_activity_id from public.applications ap join public.activities a on a.id=ap.activity_id where ap.id=$1 and ap.user_id=$2 for update of a, ap",
            application_id,
            user.id,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy đơn đăng ký.")
        if row["checkin_status"] == "checked_in" or row["is_historical"]:
            raise HTTPException(
                409,
                "Không thể hủy đơn đã hoàn thành; liên hệ Ban tổ chức nếu cần điều chỉnh.",
            )
        if row["status"] not in {"pending", "approved"}:
            raise HTTPException(409, "Đơn này không thể hủy.")
        if row["checkin_status"] == "checked_in" and row["user_id"]:
            await conn.execute(
                "delete from public.certificates where application_id=$1",
                application_id,
            )
        await conn.execute(
            "update public.applications set status='cancelled', status_text='Đã hủy', checkin_status='not_yet', verified_hours=0, has_certificate=false where id=$1",
            application_id,
        )
        await conn.execute(
            "insert into public.notifications(id,user_id,type,title,description,link,source_activity_id) values($1,$2,'warning',$3,$4,$5,$6)",
            f"NOTIF-{uuid4().hex[:12].upper()}",
            user.id,
            "Đã hủy đơn đăng ký",
            f"Đơn {application_id} đã được hủy.",
            "/volunteer/dashboard",
            row["activity_id"],
        )
        await write_audit(
            conn, user, "application_cancelled", application_id, None, request
        )
    return ok({"id": application_id, "status": "cancelled"}, "Đã hủy đơn đăng ký.")


@router.get("/organizer/activities")
async def organizer_activities(
    user: CurrentUser = Depends(require_roles("organizer")), db=Depends(get_db)
):
    rows = await db.fetch(
        "select a.* from public.activities a join public.organizations o on o.id=a.organization_id where o.owner_id=$1 order by a.event_date",
        user.id,
    )
    return ok([{**dict(row), "id": str(row["id"])} for row in rows])


@router.get("/organizer/organization")
async def organizer_organization(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    row = await db.fetchrow(
        "select * from public.organizations where owner_id=$1", user.id
    )
    return ok(
        {**dict(row), "owner_id": str(row["owner_id"]) if row["owner_id"] else None}
        if row
        else None
    )


@router.post("/organizer/organization", status_code=201)
async def register_organization(
    payload: OrganizationCreate,
    request: Request,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    if user.role not in {"volunteer", "organizer"}:
        raise HTTPException(
            403, "Chỉ tài khoản tình nguyện viên mới có thể đăng ký tổ chức."
        )
    organization_id = f"ORG-{uuid4().hex[:10].upper()}"
    try:
        async with db.acquire() as conn, conn.transaction():
            await conn.fetchrow(
                "select id from public.profiles where id=$1 for update", user.id
            )
            existing = await conn.fetchrow(
                "select id,status from public.organizations where owner_id=$1", user.id
            )
            if existing:
                raise HTTPException(
                    409,
                    f"Tài khoản đã có hồ sơ tổ chức ở trạng thái {existing['status']}.",
                )
            row = await conn.fetchrow(
                "insert into public.organizations(id,owner_id,name,representative,category,status,verified,description) values($1,$2,$3,$4,$5,'pending',false,$6) returning *",
                organization_id,
                user.id,
                payload.name.strip(),
                payload.representative.strip(),
                payload.category.strip(),
                payload.description,
            )
            await conn.execute(
                "update public.profiles set role='organizer',role_title='Ban tổ chức' where id=$1",
                user.id,
            )
            await write_audit(
                conn,
                user,
                "organization_registered",
                organization_id,
                "Submitted for admin review",
                request,
            )
    except asyncpg.UniqueViolationError as exc:
        raise HTTPException(409, "Tài khoản đã được liên kết với một tổ chức.") from exc
    return ok(
        {**dict(row), "owner_id": str(row["owner_id"]) if row["owner_id"] else None},
        "Hồ sơ tổ chức đã gửi quản trị viên xét duyệt.",
    )


@router.get("/organizer/applicants")
async def organizer_applicants(
    activity_id: str | None = None,
    search: str = Query("", max_length=200),
    status: str | None = Query(None, pattern="^(pending|approved|rejected|cancelled)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    source = "from public.applications ap join public.activities a on a.id=ap.activity_id join public.organizations o on o.id=a.organization_id left join public.profiles p on p.id=ap.user_id"
    where = "where o.owner_id=$1 and ($2::text is null or a.id=$2) and ($3::text is null or ap.status=$3) and ($4='' or concat_ws(' ',ap.user_name,ap.user_email,a.title,ap.id) ilike $4)"
    args = [
        user.id,
        activity_id,
        status,
        f"%{search.strip()}%" if search.strip() else "",
    ]
    async with (
        db.acquire() as conn,
        conn.transaction(isolation="repeatable_read", readonly=True),
    ):
        total = await conn.fetchval(f"select count(*) {source} {where}", *args)
        rows = await conn.fetch(
            f"select ap.*,a.title as activity_title,coalesce(p.phone,ap.user_phone) as user_phone {source} {where} order by ap.applied_at desc,ap.id desc limit $5 offset $6",
            *args,
            limit,
            (page - 1) * limit,
        )
        stats = await conn.fetchrow(
            f"select count(*) as total,count(*) filter(where ap.status='approved') as approved,count(*) filter(where ap.checkin_status='checked_in') as checked_in {source} where o.owner_id=$1",
            user.id,
        )
    return ok(page_result(rows, total, page, limit, stats=dict(stats)))


@router.get("/organizer/export-csv")
async def export_applicants(
    activity_id: str,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    owns_activity = await db.fetchval(
        "select 1 from public.activities a join public.organizations o on o.id=a.organization_id where a.id=$1 and o.owner_id=$2",
        activity_id,
        user.id,
    )
    if not owns_activity:
        raise HTTPException(404, "Không tìm thấy hoạt động thuộc tổ chức của bạn.")
    rows = await db.fetch(
        "select id,user_name,user_email,user_phone,status,status_text,shift,experience,skills,applied_at from public.applications where activity_id=$1 order by applied_at",
        activity_id,
    )
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow(
        [
            "Mã đơn",
            "Họ tên",
            "Email",
            "Điện thoại",
            "Trạng thái",
            "Ca tham gia",
            "Kinh nghiệm",
            "Kỹ năng",
            "Ngày nộp",
        ]
    )
    for row in rows:
        writer.writerow(
            [
                row["id"],
                row["user_name"],
                row["user_email"],
                row["user_phone"],
                row["status_text"] or row["status"],
                row["shift"],
                row["experience"],
                row["skills"],
                row["applied_at"].isoformat(),
            ]
        )
    content = "\ufeff" + output.getvalue()
    return StreamingResponse(
        iter([content]),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="applicants-{activity_id}.csv"'
        },
    )


@router.post("/organizer/applications/{application_id}/review")
async def review_application(
    application_id: str,
    payload: ReviewInput,
    request: Request,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    if payload.decision == "reject" and not payload.reason:
        raise HTTPException(422, "Vui lòng nhập lý do từ chối.")
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "select ap.*, a.title as activity_title, a.capacity, a.applied,a.status as activity_status,a.event_date as activity_date,a.deadline_date, a.id as locked_activity_id from public.applications ap join public.activities a on a.id=ap.activity_id join public.organizations o on o.id=a.organization_id where ap.id=$1 and o.owner_id=$2 for update of a, ap",
            application_id,
            user.id,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy đơn thuộc hoạt động của tổ chức.")
        if row["status"] != "pending":
            raise HTTPException(409, "Đơn này đã được xử lý.")
        if payload.decision == "approve":
            ensure_open_for_registration(
                {
                    "status": row["activity_status"],
                    "event_date": row["activity_date"],
                    "deadline_date": None,
                }
            )
            if row["applied"] >= row["capacity"]:
                raise HTTPException(409, "Hoạt động đã đủ chỉ tiêu.")
            status, status_text, reason = "approved", "Đã duyệt", None
        else:
            status, status_text, reason = "rejected", "Từ chối", payload.reason
        updated = await conn.fetchrow(
            "update public.applications set status=$2,status_text=$3,reject_reason=$4,reviewed_at=now(),reviewed_by=$5 where id=$1 returning *",
            application_id,
            status,
            status_text,
            reason,
            user.id,
        )
        await conn.execute(
            "insert into public.notifications(id,user_id,type,title,description,link,source_activity_id) values($1,$2,$3,$4,$5,$6,$7)",
            f"NOTIF-{uuid4().hex[:12].upper()}",
            row["user_id"],
            "success" if payload.decision == "approve" else "warning",
            "Đơn tham gia đã được phê duyệt"
            if payload.decision == "approve"
            else "Đơn tham gia chưa được tiếp nhận",
            f"{row['activity_title']}: {reason or status_text}",
            "/volunteer/dashboard",
            row["activity_id"],
        )
        await write_audit(
            conn,
            user,
            f"application_{payload.decision}",
            application_id,
            reason,
            request,
        )
    return ok(
        {**dict(updated), "activity_id": str(updated["activity_id"])},
        "Đã cập nhật trạng thái đơn.",
    )


@router.post("/organizer/applications/{application_id}/checkin")
async def checkin_application(
    application_id: str,
    request: Request,
    checked_in: bool = True,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "select ap.*, a.title as activity_title, a.verified_hours as activity_hours, a.organizer_name,a.event_date as activity_date from public.applications ap join public.activities a on a.id=ap.activity_id join public.organizations o on o.id=a.organization_id where ap.id=$1 and o.owner_id=$2 for update of ap",
            application_id,
            user.id,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy đơn thuộc tổ chức.")
        if row["status"] != "approved":
            raise HTTPException(409, "Chỉ đơn đã duyệt mới được điểm danh.")
        if checked_in and row["activity_date"] > business_today():
            raise HTTPException(409, "Chưa đến ngày hoạt động để điểm danh.")
        if checked_in and row["checkin_status"] != "checked_in":
            if not row["user_id"]:
                raise HTTPException(
                    409, "Đơn cũ chưa được liên kết với tài khoản xác thực."
                )
            code_number = await conn.fetchval(
                "select nextval('public.certificate_code_seq')"
            )
            year = datetime.now(timezone.utc).year
            code = f"CERT-{year}-{code_number:03d}"
            cert_id = f"CERT-{year}-{code_number:03d}"
            hours = row["activity_hours"]
            await conn.execute(
                "insert into public.certificates(id,certificate_code,application_id,user_id,recipient_name,activity_id,title,issuer,hours) values($1,$2,$3,$4,$5,$6,$7,$8,$9)",
                cert_id,
                code,
                application_id,
                row["user_id"],
                row["user_name"],
                row["activity_id"],
                row["activity_title"],
                row["organizer_name"],
                hours,
            )
            await conn.execute(
                "update public.applications set checkin_status='checked_in',verified_hours=$2,has_certificate=true where id=$1",
                application_id,
                hours,
            )
            await conn.execute(
                "insert into public.notifications(id,user_id,type,title,description,link,source_activity_id) values($1,$2,'success',$3,$4,$5,$6)",
                f"NOTIF-{uuid4().hex[:12].upper()}",
                row["user_id"],
                "Bạn đã được ghi nhận giờ tình nguyện",
                f"Đã xác nhận {hours} giờ và cấp chứng nhận {code}.",
                "/certificates",
                row["activity_id"],
            )
            result = {"checked_in": True, "certificate_code": code, "hours": hours}
        elif not checked_in and row["checkin_status"] == "checked_in":
            await conn.execute(
                "delete from public.certificates where application_id=$1",
                application_id,
            )
            await conn.execute(
                "update public.applications set checkin_status='not_yet',verified_hours=0,has_certificate=false where id=$1",
                application_id,
            )
            result = {"checked_in": False, "revoked": True}
        else:
            result = {"checked_in": checked_in, "changed": False}
        if result.get("changed", True):
            await write_audit(
                conn,
                user,
                "application_checked_in"
                if checked_in
                else "application_checkin_revoked",
                application_id,
                None,
                request,
            )
    return ok(result, "Đã cập nhật điểm danh.")


@router.get("/me/certificates")
async def my_certificates(
    user: CurrentUser = Depends(require_roles("volunteer")), db=Depends(get_db)
):
    rows = await db.fetch(
        "select * from public.certificates where user_id=$1 order by issue_date desc",
        user.id,
    )
    return ok(
        [
            {
                **dict(row),
                "activity_id": str(row["activity_id"]) if row["activity_id"] else None,
            }
            for row in rows
        ]
    )


@router.get("/certificates/verify/{code}")
async def verify_certificate(code: str, db=Depends(get_db)):
    row = await db.fetchrow(
        "select c.certificate_code,c.recipient_name,c.title as activity_title,c.issuer,c.hours,c.issue_date,c.qr_verified as valid,c.activity_id "
        "from public.certificates c where c.certificate_code=$1",
        code,
    )
    if not row:
        raise HTTPException(404, "Không tìm thấy chứng nhận.")
    return ok(
        {
            **dict(row),
            "activity_id": str(row["activity_id"]) if row["activity_id"] else None,
        }
    )


@router.get("/notifications/summary")
async def notification_summary(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    async with (
        db.acquire() as conn,
        conn.transaction(isolation="repeatable_read", readonly=True),
    ):
        items = await conn.fetch(
            "select * from public.notifications where user_id=$1 order by created_at desc,id desc limit 5",
            user.id,
        )
        unread = await conn.fetchval(
            "select count(*) from public.notifications where user_id=$1 and unread",
            user.id,
        )
    return ok({"items": [dict(row) for row in items], "unread_total": unread})


@router.get("/notifications")
async def notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    search: str = Query("", max_length=200),
    unread: bool | None = None,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    where = "where user_id=$1 and ($2::boolean is null or unread=$2) and ($3='' or concat_ws(' ',title,description) ilike $3)"
    args = [user.id, unread, f"%{search.strip()}%" if search.strip() else ""]
    async with (
        db.acquire() as conn,
        conn.transaction(isolation="repeatable_read", readonly=True),
    ):
        total = await conn.fetchval(
            f"select count(*) from public.notifications {where}", *args
        )
        rows = await conn.fetch(
            f"select * from public.notifications {where} order by created_at desc,id desc limit $4 offset $5",
            *args,
            limit,
            (page - 1) * limit,
        )
        count = await conn.fetchval(
            "select count(*) from public.notifications where user_id=$1 and unread",
            user.id,
        )
    return ok(page_result(rows, total, page, limit, unread_total=count))


@router.post("/notifications/read-all")
async def mark_notifications_read(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    await db.execute(
        "update public.notifications set unread=false where user_id=$1 and unread=true",
        user.id,
    )
    return ok({"updated": True}, "Đã đánh dấu tất cả thông báo đã đọc.")


@router.patch("/notifications/{notification_id}")
async def update_notification(
    notification_id: str,
    payload: NotificationReadInput,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    row = await db.fetchrow(
        "update public.notifications set unread=$3 where id=$1 and user_id=$2 returning *",
        notification_id,
        user.id,
        payload.unread,
    )
    if not row:
        raise HTTPException(404, "Không tìm thấy thông báo.")
    return ok(dict(row), "Đã cập nhật thông báo.")


async def store_activity(payload, user, conn, activity_id=None):
    organization = await conn.fetchrow(
        "select id,name,verified,status from public.organizations where owner_id=$1 for share",
        user.id,
    )
    if not organization or (payload.publish and organization["status"] != "approved"):
        raise HTTPException(403, "Tổ chức cần được duyệt trước khi gửi hoạt động.")
    if activity_id:
        previous = await conn.fetchrow(
            "select * from public.activities where id=$1 and created_by=$2 for update",
            activity_id,
            user.id,
        )
        if not previous:
            raise HTTPException(404, "Không tìm thấy bản nháp.")
        if previous["status"] != "draft":
            # Repeating a successful submission is safe; it cannot overwrite approved content.
            if previous["idempotency_key"] == payload.idempotency_key:
                return previous
            raise HTTPException(409, "Chỉ bản nháp mới được chỉnh sửa.")
    elif payload.idempotency_key:
        await conn.execute(
            "select pg_advisory_xact_lock(hashtextextended($1,0))",
            str(user.id) + str(payload.idempotency_key),
        )
        previous = await conn.fetchrow(
            "select * from public.activities where created_by=$1 and idempotency_key=$2",
            user.id,
            payload.idempotency_key,
        )
        if previous:
            return previous
    fields = payload.model_dump(exclude={"schedule", "publish"})
    if activity_id and "banner_url" not in payload.model_fields_set:
        fields.pop("banner_url", None)
    fields["draft_payload"] = (
        json.dumps(payload.draft_payload, ensure_ascii=False)
        if payload.draft_payload
        else None
    )
    fields.update(
        organization_id=organization["id"],
        organizer_name=organization["name"],
        organizer_verified=organization["verified"],
        status="pending" if payload.publish else "draft",
    )
    if activity_id:
        columns = list(fields)
        assignment = ",".join(f"{column}=${i + 2}" for i, column in enumerate(columns))
        row = await conn.fetchrow(
            f"update public.activities set {assignment} where id=$1 returning *",
            activity_id,
            *fields.values(),
        )
        await conn.execute(
            "delete from public.activity_schedules where activity_id=$1", activity_id
        )
    else:
        activity_id = f"ACT-{uuid4().hex[:10].upper()}"
        fields.update(
            id=activity_id,
            slug=f"{make_slug(payload.title)}-{activity_id.lower()}",
            created_by=user.id,
        )
        columns = list(fields)
        binds = ",".join(f"${i + 1}" for i in range(len(columns)))
        row = await conn.fetchrow(
            f"insert into public.activities({','.join(columns)}) values({binds}) returning *",
            *fields.values(),
        )
    for order, item in enumerate(payload.schedule, 1):
        await conn.execute(
            "insert into public.activity_schedules(activity_id,step_order,time_frame,content) values($1,$2,$3,$4)",
            activity_id,
            order,
            item.time_frame,
            item.content,
        )
    return row


@router.post("/organizer/activities", status_code=201)
async def create_activity(
    payload: ActivityCreate,
    request: Request,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await store_activity(payload, user, conn)
        await write_audit(
            conn, user, "activity_saved", row["id"], row["status"], request
        )
    return ok(dict(row))


@router.put("/organizer/activities/{activity_id}")
async def save_activity_draft(
    activity_id: str,
    payload: ActivityCreate,
    request: Request,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await store_activity(payload, user, conn, activity_id)
        await write_audit(
            conn, user, "activity_saved", row["id"], row["status"], request
        )
    return ok(dict(row))


@router.get("/organizer/activities/{activity_id}")
async def get_activity_draft(
    activity_id: str,
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    row = await db.fetchrow(
        "select * from public.activities where id=$1 and created_by=$2",
        activity_id,
        user.id,
    )
    if not row:
        raise HTTPException(404, "Không tìm thấy hoạt động.")
    schedule = await db.fetch(
        "select time_frame,content from public.activity_schedules where activity_id=$1 order by step_order",
        activity_id,
    )
    return ok(
        {
            **dict(row),
            "draft_payload": json.loads(row["draft_payload"])
            if row["draft_payload"]
            else None,
            "schedule": [dict(item) for item in schedule],
        }
    )


@router.post("/organizer/activities/{activity_id}/banner")
async def upload_activity_banner(
    activity_id: str,
    file: UploadFile = File(...),
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    settings = get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503, "Storage chưa được cấu hình ở backend.")
    activity = await db.fetchrow(
        "select a.id from public.activities a join public.organizations o on o.id=a.organization_id where a.id=$1 and o.owner_id=$2",
        activity_id,
        user.id,
    )
    if not activity:
        raise HTTPException(404, "Không tìm thấy hoạt động thuộc tổ chức của bạn.")
    mime = (file.content_type or "").lower()
    allowed = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
    if mime not in allowed:
        raise HTTPException(415, "Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.")
    content = await file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "Ảnh vượt quá dung lượng tối đa 10 MB.")
    object_path = f"{user.id}/{activity_id}/{uuid4().hex}.{allowed[mime]}"
    url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/activity-banners/{quote(object_path, safe='/')}"
    upload = urllib.request.Request(
        url,
        data=content,
        method="POST",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": mime,
            "x-upsert": "false",
        },
    )
    try:
        await asyncio.to_thread(
            lambda: urllib.request.urlopen(upload, timeout=20).read()
        )
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, "Supabase Storage từ chối tải ảnh lên.") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(502, "Không thể kết nối Supabase Storage.") from exc
    public_url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/public/activity-banners/{quote(object_path, safe='/')}"
    await db.execute(
        "update public.activities set banner_url=$2 where id=$1",
        activity_id,
        public_url,
    )
    return ok({"path": object_path, "url": public_url}, "Đã tải ảnh hoạt động lên.")


@router.post("/organizer/organization/documents")
async def upload_organization_document(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(require_roles("organizer")),
    db=Depends(get_db),
):
    settings = get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503, "Storage chưa được cấu hình ở backend.")
    organization = await db.fetchrow(
        "select id from public.organizations where owner_id=$1", user.id
    )
    if not organization:
        raise HTTPException(404, "Tài khoản chưa liên kết với tổ chức.")
    mime = (file.content_type or "").lower()
    allowed = {"application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png"}
    if mime not in allowed:
        raise HTTPException(415, "Chỉ chấp nhận tệp PDF, JPG hoặc PNG.")
    content = await file.read(15 * 1024 * 1024 + 1)
    if len(content) > 15 * 1024 * 1024:
        raise HTTPException(413, "Tệp vượt quá dung lượng tối đa 15 MB.")
    object_path = f"{user.id}/{organization['id']}/{uuid4().hex}.{allowed[mime]}"
    url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/organization-docs/{quote(object_path, safe='/')}"
    request_obj = urllib.request.Request(
        url,
        data=content,
        method="POST",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": mime,
            "x-upsert": "false",
        },
    )
    try:
        await asyncio.to_thread(
            lambda: urllib.request.urlopen(request_obj, timeout=20).read()
        )
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, "Supabase Storage từ chối tải tài liệu lên.") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(502, "Không thể kết nối Supabase Storage.") from exc
    await db.execute(
        "update public.organizations set doc_url=$2,doc_name=$3 where id=$1",
        organization["id"],
        object_path,
        (file.filename or f"document.{allowed[mime]}")[:255],
    )
    return ok(
        {"path": object_path, "name": file.filename}, "Đã tải tài liệu tổ chức lên."
    )


@router.get("/admin/organizations/{organization_id}/document-url")
async def organization_document_url(
    organization_id: str,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    settings = get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503, "Storage chưa được cấu hình ở backend.")
    organization = await db.fetchrow(
        "select doc_url from public.organizations where id=$1", organization_id
    )
    if not organization or not organization["doc_url"]:
        raise HTTPException(404, "Tổ chức chưa tải tài liệu.")
    path = quote(organization["doc_url"], safe="/")
    sign_request = urllib.request.Request(
        f"{settings.supabase_url.rstrip('/')}/storage/v1/object/sign/organization-docs/{path}",
        data=json.dumps({"expiresIn": 300}).encode(),
        method="POST",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": "application/json",
        },
    )
    try:
        response = await asyncio.to_thread(
            lambda: urllib.request.urlopen(sign_request, timeout=10).read()
        )
        result = json.loads(response.decode())
    except (
        urllib.error.URLError,
        TimeoutError,
        urllib.error.HTTPError,
        json.JSONDecodeError,
    ) as exc:
        raise HTTPException(502, "Không thể tạo liên kết xem tài liệu.") from exc
    signed_path = result.get("signedURL") or result.get("signedUrl")
    if not signed_path:
        raise HTTPException(502, "Supabase không trả về liên kết tài liệu.")
    signed_url = (
        signed_path
        if signed_path.startswith("http")
        else f"{settings.supabase_url.rstrip('/')}/storage/v1{signed_path}"
    )
    return ok({"url": signed_url, "expires_in": 300})


@router.get("/admin/organizations")
async def admin_organizations(
    status: str | None = Query(default=None, pattern="^(pending|approved|rejected)$"),
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    if status:
        rows = await db.fetch(
            "select * from public.organizations where status=$1 order by registered_at desc",
            status,
        )
    else:
        rows = await db.fetch(
            "select * from public.organizations order by registered_at desc"
        )
    return ok(
        [
            {**dict(row), "owner_id": str(row["owner_id"]) if row["owner_id"] else None}
            for row in rows
        ]
    )


@router.post("/admin/organizations/{organization_id}/review")
async def review_organization(
    organization_id: str,
    payload: AdminDecision,
    request: Request,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    if payload.decision == "reject" and not payload.reason:
        raise HTTPException(422, "Vui lòng nhập lý do từ chối.")
    status = "approved" if payload.decision == "approve" else "rejected"
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "update public.organizations set status=$2,verified=($2='approved') where id=$1 returning *",
            organization_id,
            status,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy tổ chức.")
        if status == "approved" and row["owner_id"]:
            await conn.execute(
                "update public.profiles set role='organizer',role_title='Ban tổ chức' where id=$1",
                row["owner_id"],
            )
        await write_audit(
            conn,
            user,
            f"organization_{payload.decision}",
            organization_id,
            payload.reason,
            request,
        )
    return ok(
        {**dict(row), "owner_id": str(row["owner_id"]) if row["owner_id"] else None},
        "Đã cập nhật trạng thái tổ chức.",
    )


@router.post("/admin/activities/{activity_id}/review")
async def review_activity(
    activity_id: str,
    payload: AdminDecision,
    request: Request,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    if payload.decision == "reject" and not payload.reason:
        raise HTTPException(422, "Vui lòng nhập lý do từ chối.")
    status = "recruiting" if payload.decision == "approve" else "rejected"
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "update public.activities set status=$2 where id=$1 and status in ('pending','Chờ Admin duyệt') returning *",
            activity_id,
            status,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy hoạt động chờ duyệt.")
        await write_audit(
            conn,
            user,
            f"activity_{payload.decision}",
            activity_id,
            payload.reason,
            request,
        )
    return ok({**dict(row), "id": str(row["id"])}, "Đã cập nhật trạng thái hoạt động.")


@router.get("/admin/activities/pending")
async def admin_pending_activities(
    user: CurrentUser = Depends(require_roles("admin")), db=Depends(get_db)
):
    rows = await db.fetch(
        "select * from public.activities where status in ('pending','Chờ Admin duyệt') order by created_at"
    )
    return ok([{**dict(row), "id": str(row["id"])} for row in rows])


@router.get("/admin/audit-logs")
async def admin_audit_logs(
    limit: int = Query(default=100, ge=1, le=500),
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    rows = await db.fetch(
        "select * from public.audit_logs order by created_at desc limit $1", limit
    )
    return ok(
        [
            {**dict(row), "actor_id": str(row["actor_id"]) if row["actor_id"] else None}
            for row in rows
        ]
    )


@router.get("/admin/stories/stats")
async def admin_stories_stats(
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    async with db.acquire() as conn:
        total_stories = await conn.fetchval("select count(*) from public.stories")
        total_likes = await conn.fetchval(
            "select coalesce(sum(s.legacy_likes), 0) + (select count(*) from public.story_likes) from public.stories s"
        )
        categories = await conn.fetch(
            "select category, count(*) as count from public.stories group by category order by count desc"
        )
    return ok({
        "total_stories": total_stories or 0,
        "total_likes": total_likes or 0,
        "categories": [dict(c) for c in categories],
    })


@router.get("/admin/stories")
async def admin_stories(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    search: str = Query(default="", max_length=200),
    category: str = Query(default="all", max_length=100),
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    where = "where ($1='all' or s.category=$1) and ($2='' or concat_ws(' ', s.title, s.body, coalesce(p.name, s.author_name), p.email) ilike $2)"
    source = "from public.stories s left join public.profiles p on p.id=s.user_id"
    args = [category, f"%{search.strip()}%" if search.strip() else ""]
    async with (
        db.acquire() as conn,
        conn.transaction(isolation="repeatable_read", readonly=True),
    ):
        total = await conn.fetchval(f"select count(*) {source} {where}", *args)
        rows = await conn.fetch(
            f"""select s.*,
                s.legacy_likes + (select count(*) from public.story_likes l where l.story_id=s.id) as likes,
                coalesce(p.name, s.author_name, 'Tình nguyện viên') as author_name,
                coalesce(p.email, '') as author_email,
                coalesce(p.avatar_url, s.author_avatar, '/legacy/images/profile-avatar.jpg') as author_avatar,
                s.thumbnail_url
                {source} {where}
                order by s.created_at desc, s.id desc
                limit $3 offset $4""",
            *args,
            limit,
            (page - 1) * limit,
        )
    return ok(page_result(rows, total, page, limit))


@router.delete("/admin/stories/{story_id}")
async def admin_delete_story(
    story_id: str,
    request: Request,
    payload: AdminDeleteStoryInput | None = None,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        story = await conn.fetchrow(
            "select s.id, s.title, s.user_id, p.name as author_name from public.stories s left join public.profiles p on p.id=s.user_id where s.id=$1",
            story_id,
        )
        if not story:
            raise HTTPException(404, "Không tìm thấy câu chuyện.")
        await conn.execute("delete from public.stories where id=$1", story_id)
        reason = payload.reason.strip() if payload and payload.reason else "Quản trị viên xóa bài viết vi phạm."
        await write_audit(
            conn,
            user,
            "admin_delete_story",
            story_id,
            f"Tiêu đề: {story['title']} | Tác giả: {story['author_name'] or 'Ẩn danh'} | Lý do: {reason}",
            request,
        )
    return ok({"id": story_id}, "Đã xóa câu chuyện và lưu nhật ký thành công.")



@router.get("/admin/themes")
async def admin_themes(
    user: CurrentUser = Depends(require_roles("admin")), db=Depends(get_db)
):
    rows = await db.fetch("select * from public.system_themes order by id")
    return ok([{**dict(row), "id": int(row["id"])} for row in rows])


@router.post("/admin/themes", status_code=201)
async def create_theme(
    payload: ThemeUpdate,
    request: Request,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "insert into public.system_themes(name,primary_color,cta_color,cta_hover_color,surface_color,mode,meaning) values($1,$2,$3,$4,$5,$6,$7) returning *",
            payload.name.strip(),
            payload.primary_color,
            payload.cta_color,
            payload.cta_hover_color,
            payload.surface_color,
            payload.mode,
            payload.meaning,
        )
        await write_audit(
            conn, user, "theme_created", str(row["id"]), payload.name, request
        )
    return ok({**dict(row), "id": int(row["id"])}, "Đã tạo bảng màu.")


@router.put("/admin/themes/{theme_id}/activate")
async def activate_theme(
    theme_id: int,
    request: Request,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "select id from public.system_themes where id=$1 for update", theme_id
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy giao diện màu.")
        await conn.execute("update public.system_themes set is_active=false")
        active = await conn.fetchrow(
            "update public.system_themes set is_active=true where id=$1 returning *",
            theme_id,
        )
        await write_audit(conn, user, "theme_activated", str(theme_id), None, request)
    return ok({**dict(active), "id": int(active["id"])}, "Đã áp dụng giao diện màu.")


@router.put("/admin/themes/{theme_id}")
async def update_theme(
    theme_id: int,
    payload: ThemeUpdate,
    request: Request,
    user: CurrentUser = Depends(require_roles("admin")),
    db=Depends(get_db),
):
    async with db.acquire() as conn, conn.transaction():
        row = await conn.fetchrow(
            "update public.system_themes set name=$2,primary_color=$3,cta_color=$4,cta_hover_color=$5,surface_color=$6,mode=$7,meaning=$8 where id=$1 returning *",
            theme_id,
            payload.name.strip(),
            payload.primary_color,
            payload.cta_color,
            payload.cta_hover_color,
            payload.surface_color,
            payload.mode,
            payload.meaning,
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy giao diện màu.")
        await write_audit(conn, user, "theme_updated", str(theme_id), None, request)
    return ok({**dict(row), "id": int(row["id"])}, "Đã lưu cấu hình giao diện.")


@router.get("/admin/metrics")
async def admin_metrics(
    user: CurrentUser = Depends(require_roles("admin")), db=Depends(get_db)
):
    activities, applications, organizations, pending = await db.fetchrow(
        "select (select count(*) from public.activities), (select count(*) from public.applications), (select count(*) from public.organizations), (select count(*) from public.activities where status in ('pending','Chờ Admin duyệt'))"
    )
    return ok(
        {
            "activities": activities,
            "applications": applications,
            "organizations": organizations,
            "pending_activities": pending,
        }
    )


@router.get("/admin/audit-logs/export")
async def export_audit_logs(
    user: CurrentUser = Depends(require_roles("admin")), db=Depends(get_db)
):
    rows = await db.fetch(
        "select created_at,actor,action,target,details,ip from public.audit_logs order by created_at desc"
    )
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow(
        ["Thời gian", "Người thực hiện", "Hành động", "Đối tượng", "Chi tiết", "IP"]
    )
    for row in rows:
        writer.writerow(
            [
                row["created_at"].isoformat(),
                row["actor"],
                row["action"],
                row["target"],
                row["details"] or "",
                str(row["ip"]) if row["ip"] else "",
            ]
        )
    return StreamingResponse(
        iter(["\ufeff" + output.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="audit-logs.csv"'},
    )


@router.get("/me/notifications")
async def my_notifications(
    limit: int = Query(default=20, ge=1, le=100),
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    rows = await db.fetch(
        "select * from public.notifications where user_id=$1 order by created_at desc limit $2",
        user.id,
        limit,
    )
    return ok([{**dict(row), "id": str(row["id"])} for row in rows])


@router.patch("/me/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    await db.execute(
        "update public.notifications set unread=false where id=$1 and user_id=$2",
        notification_id,
        user.id,
    )
    return ok({"id": notification_id}, "Đã cập nhật trạng thái thông báo.")


@router.post("/me/notifications/read-all")
async def mark_all_notifications_read(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    await db.execute(
        "update public.notifications set unread=false where user_id=$1", user.id
    )
    return ok({"updated": True}, "Đã đánh dấu đã đọc tất cả thông báo.")


@router.get("/health/ready")
async def ready(db=Depends(get_db)):
    await db.fetchval("select 1")
    return ok({"status": "ready", "database": "connected"})


@router.get("/certificates/{code}/pdf")
async def download_certificate(
    code: str, user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    content, hit = await certificate_file(code, user, db)
    return StreamingResponse(
        iter([content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{quote(code, safe="")}.pdf"',
            "Cache-Control": "private, no-store",
            "X-PDF-Cache": "HIT" if hit else "MISS",
        },
    )


@router.get("/stories")
async def stories(
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=100),
    search: str = Query("", max_length=200),
    category: str = Query("all", max_length=100),
    db=Depends(get_db),
):
    where = "where ($1='all' or s.category=$1) and ($2='' or concat_ws(' ', s.title, s.body, coalesce(p.name, s.author_name)) ilike $2)"
    source = "from public.stories s left join public.profiles p on p.id=s.user_id"
    args = [category, f"%{search.strip()}%" if search.strip() else ""]
    async with (
        db.acquire() as conn,
        conn.transaction(isolation="repeatable_read", readonly=True),
    ):
        total = await conn.fetchval(f"select count(*) {source} {where}", *args)
        rows = await conn.fetch(
            f"""select s.*,
                s.legacy_likes + (select count(*) from public.story_likes l where l.story_id=s.id) as likes,
                coalesce(p.name, s.author_name, 'Tình nguyện viên') as author,
                coalesce(p.name, s.author_name, 'Tình nguyện viên') as author_name,
                coalesce(p.avatar_url, s.author_avatar, '/legacy/images/profile-avatar.jpg') as author_avatar,
                s.thumbnail_url
                {source} {where}
                order by s.created_at desc, s.id desc
                limit $3 offset $4""",
            *args,
            limit,
            (page - 1) * limit,
        )
    return ok(page_result(rows, total, page, limit))


@router.post("/stories", status_code=201)
async def share_story(
    payload: StoryInput,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    if not payload.title.strip() or not payload.body.strip():
        raise HTTPException(422, "Nội dung không được để trống.")
    row = await db.fetchrow(
        """insert into public.stories(user_id, title, body, category, author_name, author_avatar, thumbnail_url)
           values($1, $2, $3, $4, $5, $6, $7) returning *""",
        user.id,
        payload.title.strip(),
        payload.body.strip(),
        payload.category,
        user.name,
        user.avatar_url or "/legacy/images/profile-avatar.jpg",
        payload.thumbnail_url or "/legacy/images/profile-cover.jpg",
    )
    return ok(dict(row))


@router.post("/stories/upload-image")
async def upload_story_image(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
):
    settings = get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503, "Storage chưa được cấu hình ở backend.")
    mime = (file.content_type or "").lower()
    allowed = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
    }
    if mime not in allowed:
        raise HTTPException(415, "Chỉ chấp nhận ảnh định dạng JPG, PNG, WebP hoặc GIF.")
    content = await file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "Ảnh vượt quá dung lượng tối đa 10 MB.")
    object_path = f"stories/{user.id}/{uuid4().hex}.{allowed[mime]}"
    url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/activity-banners/{quote(object_path, safe='/')}"
    upload = urllib.request.Request(
        url,
        data=content,
        method="POST",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": mime,
            "x-upsert": "false",
        },
    )
    try:
        await asyncio.to_thread(
            lambda: urllib.request.urlopen(upload, timeout=20).read()
        )
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, "Supabase Storage từ chối tải ảnh lên.") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(502, "Không thể kết nối Supabase Storage.") from exc
    public_url = f"{settings.supabase_url.rstrip('/')}/storage/v1/object/public/activity-banners/{quote(object_path, safe='/')}"
    return ok({"path": object_path, "url": public_url}, "Đã tải ảnh câu chuyện lên thành công.")



@router.put("/stories/{story_id}/like")
async def like_story(
    story_id: str,
    liked: bool = True,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    if not await db.fetchval("select 1 from public.stories where id=$1", story_id):
        raise HTTPException(404, "Không tìm thấy câu chuyện.")
    if liked:
        await db.execute(
            "insert into public.story_likes(story_id,user_id) values($1,$2) on conflict do nothing",
            story_id,
            user.id,
        )
    else:
        await db.execute(
            "delete from public.story_likes where story_id=$1 and user_id=$2",
            story_id,
            user.id,
        )
    return ok({"liked": liked})


@router.get("/me/story-likes")
async def my_story_likes(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    return ok(
        [
            r["story_id"]
            for r in await db.fetch(
                "select story_id from public.story_likes where user_id=$1", user.id
            )
        ]
    )


@router.get("/me/documents")
async def profile_documents(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    return ok(
        [
            dict(row)
            for row in await db.fetch(
                "select id,name,created_at from public.profile_documents where user_id=$1 order by created_at desc",
                user.id,
            )
        ]
    )


@router.post("/me/documents", status_code=201)
async def add_profile_document(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
):
    path = await upload_document("profile-docs", str(user.id), file)
    row = await db.fetchrow(
        "insert into public.profile_documents(user_id,name,path) values($1,$2,$3) returning id,name,created_at",
        user.id,
        (file.filename or "Tài liệu")[:255],
        path,
    )
    return ok(dict(row))


@router.get("/me/documents/{document_id}/url")
async def profile_document_url(
    document_id: str, user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    from uuid import UUID

    try:
        identifier = UUID(document_id)
    except ValueError:
        raise HTTPException(422, "Mã tài liệu không hợp lệ.")
    path = await db.fetchval(
        "select path from public.profile_documents where id=$1 and user_id=$2",
        identifier,
        user.id,
    )
    if not path:
        raise HTTPException(404, "Không tìm thấy tài liệu của bạn.")
    return ok({"url": await signed_url("profile-docs", path)})
