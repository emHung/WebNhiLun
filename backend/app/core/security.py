import asyncio
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated
from uuid import UUID

import jwt
from asyncpg import Pool
from fastapi import Depends, HTTPException
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


@lru_cache
def _jwks_client(url: str) -> PyJWKClient:
    return PyJWKClient(url, cache_keys=True, timeout=5)


def _verified_subject(token: str) -> UUID:
    """Network cache misses and signature verification must not block the event loop."""
    settings = get_settings()
    issuer = f"{settings.supabase_url.rstrip('/')}/auth/v1"
    try:
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")
        if algorithm == "HS256" and settings.supabase_jwt_secret:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=issuer,
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
            )
        else:
            raise jwt.InvalidTokenError("Unsupported signing algorithm")
        return UUID(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError) as exc:
        raise HTTPException(
            status_code=401, detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn."
        ) from exc


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    db: Annotated[Pool, Depends(get_db)],
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập.")
    user_id = await asyncio.to_thread(_verified_subject, credentials.credentials)

    row = await db.fetchrow(
        "select id, role, name, email from public.profiles where id=$1", user_id
    )
    if row is None:
        raise HTTPException(status_code=403, detail="Tài khoản chưa có hồ sơ hợp lệ.")
    return CurrentUser(**dict(row))


def require_roles(*roles: str):
    async def dependency(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(
                status_code=403, detail="Bạn không có quyền thực hiện thao tác này."
            )
        return user

    return dependency
