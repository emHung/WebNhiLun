"""Private, versioned certificate artifacts; serialize generation across API workers."""

import asyncio
import hashlib
import json
import urllib.error
import urllib.request
from urllib.parse import quote

from fastapi import HTTPException

from app.core.config import get_settings
from app.services.certificates import certificate_pdf


def _object(settings, path, content=None):
    request = urllib.request.Request(
        f"{settings.supabase_url.rstrip('/')}/storage/v1/object/certificates/{quote(path, safe='/')}",
        data=content,
        method="POST" if content is not None else "GET",
        headers={
            "apikey": settings.supabase_secret_key,
            "Content-Type": "application/pdf",
            "x-upsert": "true",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return response.read()
    except urllib.error.HTTPError as exc:
        if content is None:
            if exc.code == 404:
                return None
            if exc.code == 400:
                try:
                    error = json.loads(exc.read())
                except (ValueError, UnicodeError):
                    error = {}
                if (
                    error.get("error") == "not_found"
                    or str(error.get("statusCode")) == "404"
                ):
                    return None
        raise HTTPException(502, "Không đọc hoặc lưu được PDF trong Storage.") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(502, "Không kết nối được Storage chứng nhận.") from exc


AUTHORIZED_CERTIFICATE = "select * from public.certificates where certificate_code=$1 and (user_id=$2 or $3='admin')"


def artifact(row, settings):
    verify_url = (
        settings.allowed_origins[0]
        + "/certificates/verify?code="
        + quote(row["certificate_code"], safe="")
    )
    fields = {
        key: row[key]
        for key in (
            "certificate_code",
            "recipient_name",
            "title",
            "issuer",
            "hours",
            "issue_date",
        )
    }
    fingerprint = hashlib.sha256(
        json.dumps(
            {**fields, "url": verify_url, "template": 1}, sort_keys=True, default=str
        ).encode()
    ).hexdigest()[:24]
    return f"{row['user_id']}/{row['certificate_code']}/{fingerprint}.pdf", verify_url


async def certificate_file(code, user, db):
    settings = get_settings()
    row = await db.fetchrow(AUTHORIZED_CERTIFICATE, code, user.id, user.role)
    if not row:
        raise HTTPException(404, "Không tìm thấy chứng nhận của bạn.")
    path, _ = artifact(row, settings)
    if settings.supabase_secret_key and row["pdf_url"] == path:
        cached = await asyncio.to_thread(_object, settings, path)
        # Cache hits do not hold a database connection during Storage I/O.
        latest = await db.fetchrow(AUTHORIZED_CERTIFICATE, code, user.id, user.role)
        if not latest:
            raise HTTPException(404, "Không tìm thấy chứng nhận của bạn.")
        if (
            cached is not None
            and latest["pdf_url"] == path
            and artifact(latest, settings)[0] == path
        ):
            return cached, True
    # Only misses serialize generation. All workers recheck ownership/version under the lock.
    async with db.acquire() as conn, conn.transaction():
        await conn.execute(
            "select pg_advisory_xact_lock(hashtextextended($1,0))",
            "certificate-pdf:" + code,
        )
        row = await conn.fetchrow(
            AUTHORIZED_CERTIFICATE + " for update", code, user.id, user.role
        )
        if not row:
            raise HTTPException(404, "Không tìm thấy chứng nhận của bạn.")
        path, verify_url = artifact(row, settings)
        if settings.supabase_secret_key and row["pdf_url"] == path:
            cached = await asyncio.to_thread(_object, settings, path)
            if cached is not None:
                return cached, True
        content = await asyncio.to_thread(certificate_pdf, dict(row), verify_url)
        if settings.supabase_secret_key:
            await asyncio.to_thread(_object, settings, path, content)
            await conn.execute(
                "update public.certificates set pdf_url=$2 where id=$1 and pdf_url is distinct from $2",
                row["id"],
                path,
            )
        return content, False
