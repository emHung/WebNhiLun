from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    volunteer_points_per_hour: int = 4
    volunteer_rank_thresholds: str = "200,500,1000"
    app_env: str = "development"
    supabase_url: str = "https://placeholder-project.supabase.co"
    supabase_publishable_key: str | None = None
    supabase_secret_key: str | None = None
    supabase_jwt_secret: str | None = None
    supabase_jwks_url: str | None = None
    supabase_db_url: str = "postgresql://postgres:placeholder@db.placeholder.supabase.co:5432/postgres"
    frontend_origins: str = "http://localhost:3000"
    demo_login_enabled: bool = False
    demo_password_usr_001: str | None = None
    demo_password_usr_002: str | None = None
    demo_password_usr_003: str | None = None

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
