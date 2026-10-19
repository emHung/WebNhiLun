from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from typing import Literal

from app.core.config import get_settings
from app.core.database import get_db
from app.core.protection import auth_limit
from app.core.security import CurrentUser, get_current_user
from app.schemas import OrganizationCreate

router = APIRouter(prefix="/api/v1/auth")


class CaptchaSecurity(BaseModel):
    model_config = ConfigDict(extra="forbid", hide_input_in_errors=True)
    captcha_token: str | None = Field(default=None, max_length=4096)


class AuthEmail(BaseModel):
    model_config = ConfigDict(extra="forbid", hide_input_in_errors=True)
    email: EmailStr = Field(max_length=254)
    gotrue_meta_security: CaptchaSecurity = Field(default_factory=CaptchaSecurity)


class AuthLogin(AuthEmail):
    password: str = Field(min_length=1, max_length=1024, repr=False)


class AuthMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=2, max_length=150)
    role: Literal["volunteer", "organizer"] = "volunteer"
    organization_registration_draft: OrganizationCreate | None = None


class AuthRecovery(AuthEmail):
    code_challenge: str = Field(min_length=43, max_length=128, pattern="^[A-Za-z0-9_-]+$")
    code_challenge_method: Literal["s256"]


class AuthRegister(AuthLogin):
    password: str = Field(min_length=8, max_length=72, repr=False)
    data: AuthMetadata
    code_challenge: str = Field(min_length=43, max_length=128, pattern="^[A-Za-z0-9_-]+$")
    code_challenge_method: Literal["s256"]

    @field_validator("password")
    @classmethod
    def password_byte_limit(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Mật khẩu vượt giới hạn 72 byte.")
        return value


async def upstream(path, payload):
    settings = get_settings()
    if not settings.supabase_publishable_key:
        raise HTTPException(503, "Dịch vụ đăng nhập tạm thời không khả dụng.")
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"{settings.supabase_url.rstrip('/')}/auth/v1/{path}",
                headers={"apikey": settings.supabase_publishable_key}, json=payload,
            )
    except httpx.HTTPError as error:
        raise HTTPException(503, "Dịch vụ đăng nhập tạm thời không khả dụng.") from error
    if response.status_code == 429:
        raise HTTPException(429, "Bạn thao tác quá nhanh. Vui lòng thử lại sau.", headers={"Retry-After": "60"})
    if response.status_code >= 400:
        raise HTTPException(400, "Không hoàn tất được xác thực. Vui lòng kiểm tra thông tin hoặc thử lại sau.")
    try:
        return response.json()
    except ValueError as error:
        raise HTTPException(503, "Dịch vụ đăng nhập tạm thời không khả dụng.") from error


def envelope(data):
    return {"success": True, "data": data}


def callback(request):
    settings = get_settings()
    origin = request.headers.get("origin")
    if origin not in settings.allowed_origins:
        origin = settings.allowed_origins[0]
    suffix = "?next=/auth/reset" if request.url.path.endswith("/recover") else ""
    return f"{origin.rstrip('/')}/auth/callback{suffix}"


@router.post("/login")
async def login(payload: AuthLogin, request: Request, db=Depends(get_db)):
    await auth_limit(db, request, "login", str(payload.email), get_settings().auth_login_limit)
    return await upstream("token?grant_type=password", payload.model_dump())


@router.post("/register")
async def register(payload: AuthRegister, request: Request, db=Depends(get_db)):
    await auth_limit(db, request, "register", str(payload.email), get_settings().auth_register_limit)
    return await upstream("signup?" + urlencode({"redirect_to": callback(request)}), payload.model_dump(exclude_none=True))


@router.post("/recover")
async def recover(payload: AuthRecovery, request: Request, db=Depends(get_db)):
    await auth_limit(db, request, "recover", str(payload.email), get_settings().auth_recover_limit)
    await upstream("recover?" + urlencode({"redirect_to": callback(request)}), payload.model_dump())
    return {}


@router.post("/activity")
async def activity(user: CurrentUser = Depends(get_current_user), db=Depends(get_db)):
    settings = get_settings()
    await db.fetchval("select private.check_api_session($1,$2,$3,$4,true)", user.id, user.session_id, settings.session_max_age_seconds, settings.session_idle_seconds)
    return envelope({"active": True})
