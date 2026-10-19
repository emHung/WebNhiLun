"""Use a disposable admin for MFA tests; never enroll the user's real admin account."""
import asyncio
import base64
import hashlib
import hmac
import json
import struct
import time
import urllib.request
import uuid
from pathlib import Path

import asyncpg
from dotenv import dotenv_values

from app.core.config import get_settings


def auth(path, payload=None, token=None, method="POST", privileged=False):
    settings = get_settings()
    headers = {"apikey": settings.supabase_secret_key if privileged else settings.supabase_publishable_key, "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(settings.supabase_url + "/auth/v1" + path, data=json.dumps(payload).encode() if payload is not None else None, method=method, headers=headers)
    with urllib.request.urlopen(request, timeout=20) as response:
        data = response.read()
        return json.loads(data) if data else {}


def admin_dsn():
    path = Path(__file__).resolve().parents[2] / ".secrets/admin.env"
    return dotenv_values(path)["SUPABASE_MIGRATION_DB_URL"]


def totp(secret):
    key = base64.b32decode(secret.upper() + "=" * ((8 - len(secret) % 8) % 8))
    digest = hmac.new(key, struct.pack(">Q", int(time.time()) // 30), hashlib.sha1).digest()
    offset = digest[-1] & 15
    return f"{(int.from_bytes(digest[offset:offset + 4], 'big') & 0x7fffffff) % 1000000:06d}"


def create_verified_admin():
    tag = "qa-mfa-" + uuid.uuid4().hex
    password = uuid.uuid4().hex + "!aA1"
    email = tag + "@example.test"
    user = auth("/admin/users", {"email": email, "password": password, "email_confirm": True, "user_metadata": {"name": tag}}, privileged=True)
    try:
        async def promote():
            conn = await asyncpg.connect(admin_dsn(), ssl="require", timeout=15)
            try:
                await conn.execute("update public.profiles set role='admin',role_title='QA isolated admin' where id=$1", uuid.UUID(user["id"]))
            finally:
                await conn.close()
        asyncio.run(promote())
        session = auth("/token?grant_type=password", {"email": email, "password": password})
        factor = auth("/factors", {"factor_type": "totp", "friendly_name": "isolated QA"}, session["access_token"])
        challenge = auth("/factors/" + factor["id"] + "/challenge", {}, session["access_token"])
        verified = auth("/factors/" + factor["id"] + "/verify", {"challenge_id": challenge["id"], "code": totp(factor["totp"]["secret"])}, session["access_token"])
        return user["id"], verified["access_token"]
    except BaseException:
        auth("/admin/users/" + user["id"], method="DELETE", privileged=True)
        raise
