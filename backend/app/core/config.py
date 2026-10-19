from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from pydantic import Field, model_validator

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        hide_input_in_errors=True,
    )

    volunteer_points_per_hour: int = 4
    volunteer_rank_thresholds: str = "200,500,1000"
    app_env: Literal["development", "test", "production"] = "development"
    supabase_url: str = "https://placeholder-project.supabase.co"
    supabase_publishable_key: str | None = None
    supabase_secret_key: str | None = None
    supabase_jwt_secret: str | None = None
    supabase_jwks_url: str | None = None
    supabase_db_url: str = "postgresql://postgres:placeholder@db.placeholder.supabase.co:5432/postgres"
    supabase_db_ca_file: str = str(Path(__file__).resolve().parents[2] / "certs/supabase-ca.crt")
    frontend_origins: str = "http://localhost:3000"
    demo_login_enabled: bool = False
    demo_password_usr_001: str | None = None
    demo_password_usr_002: str | None = None
    demo_password_usr_003: str | None = None
    security_hash_key: str = "development-only-change-before-production"
    session_max_age_seconds: int = Field(default=43200, ge=300, le=604800)
    session_idle_seconds: int = Field(default=1800, ge=60, le=86400)
    admin_mfa_required: bool = True
    max_request_body_bytes: int = Field(default=16 * 1024 * 1024, ge=1024, le=32 * 1024 * 1024)
    max_image_pixels: int = Field(default=20000000, ge=1000000, le=40000000)
    upload_daily_bytes: int = Field(default=100 * 1024 * 1024, ge=1048576, le=1073741824)
    upload_requests_per_hour: int = Field(default=30, ge=1, le=1000)
    auth_login_limit: int = Field(default=10, ge=1, le=100)
    auth_register_limit: int = Field(default=3, ge=1, le=20)
    auth_recover_limit: int = Field(default=3, ge=1, le=20)

    @model_validator(mode="after")
    def production_security(self):
        if self.app_env == "production":
            if self.demo_login_enabled or not self.admin_mfa_required:
                raise ValueError("Production requires demo disabled and admin MFA enabled.")
            if len(self.security_hash_key) < 32 or self.security_hash_key.startswith("development"):
                raise ValueError("Production requires a private SECURITY_HASH_KEY.")
            if urlsplit(self.supabase_db_url).username != "volunteerhub_api":
                raise ValueError("Production requires the restricted runtime database account.")
            if not self.allowed_origins or any(urlsplit(x).scheme != "https" or urlsplit(x).path not in ("", "/") or not urlsplit(x).hostname or urlsplit(x).hostname in ("localhost", "127.0.0.1") for x in self.allowed_origins):
                raise ValueError("Production requires explicit HTTPS frontend origins.")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
