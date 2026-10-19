"""Security regression checks use exact disposable fixtures and never print tokens."""
import asyncio
import io
import json
import sys
import uuid
from pathlib import Path
from unittest.mock import patch, AsyncMock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import asyncpg
import httpx
import jwt
from fastapi import HTTPException, UploadFile
from PIL import Image
from reportlab.pdfgen import canvas
from starlette.datastructures import Headers

from app.core.config import Settings, get_settings
from app.core.security import _verified_claims
from app.core.database import close_db, connect_db
from app.core.protection import private_key
from app.main import app
from app.services.uploads import validated_upload
from qa_auth import admin_dsn, auth, create_verified_admin

passed = 0


def check(value, label):
    global passed
    if not value:
        raise AssertionError(label)
    passed += 1
    print("PASS", label)


async def image_checks():
    async def validate(content, mime, cap=2048, document=False):
        return await validated_upload(UploadFile(io.BytesIO(content), headers=Headers({"content-type": mime})), cap, document)
    for content, mime, cap, expected in [(b"not an image", "image/png", 100, 415), (b"<svg/>", "image/svg+xml", 100, 415), (b"a" * 101, "image/png", 100, 413), (b"", "image/png", 100, 415), (b"%PDF-fake", "application/pdf", 100, 415)]:
        try:
            await validate(content, mime, cap, mime == "application/pdf")
        except HTTPException as error:
            check(error.status_code == expected, f"upload rejected {mime} / {expected}")
        else:
            raise AssertionError("Invalid upload accepted")
    data = io.BytesIO()
    image = Image.new("RGB", (12, 12))
    image.save(data, "PNG")
    output, mime, extension = await validate(data.getvalue(), "image/png")
    check(output.startswith(b"\x89PNG") and mime == "image/png" and extension == "png", "real image decoded and re-encoded")
    try:
        await validate(data.getvalue(), "image/jpeg")
    except HTTPException as error:
        check(error.status_code == 415, "declared MIME must match decoded image")
    pdf = io.BytesIO()
    page = canvas.Canvas(pdf); page.drawString(10, 50, "isolated security check"); page.save()
    result = await validate(pdf.getvalue(), "application/pdf", 10000, True)
    check(result[0] == pdf.getvalue(), "valid PDF accepted by bounded child process")


async def run(user_id, token):
    settings = get_settings()
    runtime = await asyncpg.connect(settings.supabase_db_url, ssl="require")
    admin = await asyncpg.connect(admin_dsn(), ssl="require")
    key = private_key("qa-security:" + uuid.uuid4().hex)
    peer = "qa-isolated-" + uuid.uuid4().hex
    claims = jwt.decode(token, options={"verify_signature": False})
    session = uuid.UUID(claims["session_id"])
    try:
        role = await runtime.fetchrow("select current_user,rolsuper,rolbypassrls,rolcreatedb,rolcreaterole from pg_roles where rolname=current_user")
        check(role["current_user"] == "volunteerhub_api" and not any(role[name] for name in ("rolsuper", "rolbypassrls", "rolcreatedb", "rolcreaterole")), "runtime role has no administrative attributes")
        check(not await runtime.fetchval("select has_schema_privilege(current_user,'public','CREATE')"), "runtime cannot create schema objects")
        for query in ["select encrypted_password from auth.users limit 0", "select * from private.api_session_activity limit 0", "delete from public.audit_logs where false"]:
            try:
                await runtime.execute(query)
            except asyncpg.InsufficientPrivilegeError:
                check(True, "runtime cannot access privileged operation")
            else:
                raise AssertionError("Runtime permission unexpectedly granted")
        async def take():
            connection = await asyncpg.connect(settings.supabase_db_url, ssl="require")
            try:
                return await connection.fetchval("select allowed from private.take_security_limit($1,3,60,1)", key)
            finally:
                await connection.close()
        decisions = await asyncio.gather(*(take() for _ in range(8)))
        check(sum(decisions) == 3, "limiter is atomic across independent connections")
        await connect_db(app)
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app, client=(peer, 123)), base_url="http://localhost") as client:
            headers = {"Authorization": "Bearer " + token}
            check((await client.get("/api/v1/admin/metrics", headers=headers)).status_code == 200, "verified MFA admin can use API")
            check((await client.get("/api/v1/admin/metrics")).status_code == 401, "anonymous cannot use admin API")
            check((await client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid"})).status_code == 401, "invalid JWT rejected")
            for payload in [{"role": "admin"}, {"avatar_url": "javascript:alert(1)"}, {"name": ""}]:
                check((await client.patch("/api/v1/me/profile", headers=headers, json=payload)).status_code == 422, "server rejects invalid profile payload")
            response = await client.post("/api/v1/auth/login", headers={"Content-Length": "999999999"}, content=b"")
            check(response.status_code == 413, "oversized request rejected before body parsing")
            email = "qa-rate-" + uuid.uuid4().hex + "@example.com"
            limiter_settings = settings.model_copy(update={"auth_login_limit": 2})
            provider = AsyncMock(return_value={"access_token": "isolated mocked response"})
            with patch("app.auth_routes.get_settings", return_value=limiter_settings), patch("app.auth_routes.upstream", new=provider):
                codes = [(await client.post("/api/v1/auth/login", json={"email": email, "password": "not-a-real-password"})).status_code for _ in range(3)]
            check(codes == [200, 200, 429] and provider.await_count == 2, "login rate limit rejects before contacting Auth provider")
            await admin.execute("delete from private.security_limits where key_hash=$1", private_key("auth:login:account:" + email))
            response = await client.options("/api/v1/me/profile", headers={"Origin": "https://untrusted.invalid", "Access-Control-Request-Method": "GET"})
            check(not response.headers.get("access-control-allow-origin"), "untrusted CORS origin rejected")
            response = await client.get("/api/v1/health")
            check(all(response.headers.get(header) for header in ["content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"]), "API security headers applied")
            await admin.execute("update private.api_session_activity set last_seen=now()-interval '2 hours' where session_id=$1", session)
            check((await client.get("/api/v1/auth/me", headers=headers)).status_code == 401, "idle timeout enforced on server")
            await admin.execute("update private.api_session_activity set last_seen=now() where session_id=$1", session)
            await admin.execute("update auth.sessions set created_at=now()-interval '8 days' where id=$1", session)
            check((await client.get("/api/v1/auth/me", headers=headers)).status_code == 401, "absolute session lifetime enforced on server")
            await admin.execute("update auth.sessions set created_at=now() where id=$1", session)
            check((await client.post("/api/v1/auth/activity", headers=headers)).status_code == 200, "user activity refreshes idle deadline")
            production = Settings(**{**settings.model_dump(), "app_env": "production", "demo_login_enabled": False, "frontend_origins": "https://app.example.test"})
            with patch("app.core.http_security.get_settings", return_value=production):
                check((await client.get("/api/v1/health")).status_code == 400, "production rejects plaintext HTTP")
                response = await client.get("https://app.example.test/api/v1/health")
                check(response.status_code == 200 and response.headers.get("strict-transport-security"), "production HTTPS response has HSTS")
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.supabase_url + "/rest/v1/organizations?select=doc_url,representative&limit=0", headers={"apikey": settings.supabase_publishable_key})
            check(response.status_code in (400, 401, 403), "Data API denies sensitive organization columns")
        await image_checks()
        for oversized in ("a" * 8193, jwt.encode({"sub": user_id}, "", algorithm="none")):
            try:
                _verified_claims(oversized)
            except HTTPException as error:
                check(error.status_code == 401, "oversized or unsigned JWT rejected")
            else:
                raise AssertionError("Unsafe JWT accepted")
    finally:
        await close_db(app)
        await admin.execute("delete from private.security_limits where key_hash=any($1::text[])", [key, private_key("auth:login:ip:" + peer)])
        await admin.execute("delete from private.api_session_activity where user_id=$1", uuid.UUID(user_id))
        await runtime.close(); await admin.close()


if __name__ == "__main__":
    user_id, token = create_verified_admin()
    try:
        asyncio.run(run(user_id, token))
        auth("/logout?scope=local", token=token)
        from verify_system import request
        check(request("/auth/me", token)[0] == 401, "revoked session rejected even before JWT expiry")
        print("SECURITY CHECKS PASSED", passed)
    finally:
        auth("/admin/users/" + user_id, method="DELETE", privileged=True)
