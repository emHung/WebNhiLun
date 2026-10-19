import asyncio
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated
from uuid import UUID

import jwt
from asyncpg import Pool
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import get_settings
from app.core.database import get_db

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    id: UUID
    role: str
    name: str
    email: str
    avatar_url: str | None = None
    session_id: UUID | None = None
    aal: str = "aal1"


@lru_cache
def _jwks_client(url: str) -> PyJWKClient:
    return PyJWKClient(url, cache_keys=True, timeout=5)


def _verified_claims(token: str) -> dict:
    """Network cache misses and signature verification must not block the event loop."""
    settings = get_settings()
    issuer = f"{settings.supabase_url.rstrip('/')}/auth/v1"
    try:
        if len(token) > 8192:
            raise jwt.InvalidTokenError("Token too large")
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")
        if algorithm == "HS256" and settings.supabase_jwt_secret:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=issuer,
                options={"require": ["exp", "iat", "sub", "aud", "iss", "session_id"]},
            )
        elif algorithm in {"RS256", "ES256"}:
            jwks_url = settings.supabase_jwks_url or f"{issuer}/.well-known/jwks.json"
            key = _jwks_client(jwks_url).get_signing_key_from_jwt(token).key
            payload = jwt.decode(
                token,
                key,
                algorithms=[algorithm],
                audience="authenticated",
                issuer=issuer,
                options={"require": ["exp", "iat", "sub", "aud", "iss", "session_id"]},
            )
        else:
            raise jwt.InvalidTokenError("Unsupported signing algorithm")
        UUID(payload["sub"])
        UUID(payload["session_id"])
        return payload
    except (jwt.PyJWTError, KeyError, ValueError, TypeError, RecursionError) as exc:
        raise HTTPException(
            status_code=401, detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn."
        ) from exc


def _verified_subject(token: str) -> UUID:
    return UUID(_verified_claims(token)["sub"])


async def get_current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    db: Annotated[Pool, Depends(get_db)],
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập.")
    claims = await asyncio.to_thread(_verified_claims, credentials.credentials)
    user_id = UUID(claims["sub"])
    session_id = UUID(claims["session_id"])
    settings = get_settings()
    active = await db.fetchval(
        "select private.check_api_session($1,$2,$3,$4,false)",
        user_id, session_id, settings.session_max_age_seconds, settings.session_idle_seconds,
    )
    if not active:
        raise HTTPException(401, "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại.")

    row = await db.fetchrow(
        "select id, role, name, email, avatar_url from public.profiles where id=$1", user_id
    )
    if row is None:
        raise HTTPException(status_code=403, detail="Tài khoản chưa có hồ sơ hợp lệ.")
    if row["role"] == "admin" and settings.admin_mfa_required and claims.get("aal") != "aal2" and request.url.path not in {"/api/v1/auth/me", "/api/v1/auth/activity"}:
        raise HTTPException(403, "Vui lòng xác thực hai lớp trước khi sử dụng chức năng quản trị.", headers={"X-Auth-Action": "mfa"})
    return CurrentUser(**dict(row), session_id=session_id, aal=claims.get("aal", "aal1"))


def require_roles(*roles: str):
    async def dependency(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(
                status_code=403, detail="Bạn không có quyền thực hiện thao tác này."
            )
        if user.role == "admin" and get_settings().admin_mfa_required and user.aal != "aal2":
            raise HTTPException(403, "Vui lòng xác thực hai lớp trước khi sử dụng chức năng quản trị.", headers={"X-Auth-Action": "mfa"})
        return user

    return dependency
