import logging
import asyncio
import time
import ssl
from urllib.parse import urlsplit

import asyncpg
from fastapi import HTTPException, Request

from app.core.config import get_settings

logger = logging.getLogger("volunteerhub.database")


def database_ssl(settings):
    """The provider's legacy CA lacks keyUsage; keep CA and hostname verification."""
    context = ssl.create_default_context(cafile=settings.supabase_db_ca_file)
    context.verify_flags &= ~ssl.VERIFY_X509_STRICT
    return context


async def connect_db(app) -> None:
    settings = get_settings()
    if not settings.supabase_db_url or "placeholder" in settings.supabase_db_url:
        logger.warning(
            "SUPABASE_DB_URL is missing or still contains a placeholder; database pool is disabled."
        )
        app.state.db = None
        return

    try:
        app.state.db = await asyncpg.create_pool(
            dsn=settings.supabase_db_url,
            min_size=1,
            max_size=10,
            command_timeout=30,
            ssl=database_ssl(settings),
            server_settings={"application_name": "volunteerhub-api"},
        )
        logger.info("Connected to Supabase PostgreSQL.")
    except Exception as exc:
        parsed_url = urlsplit(settings.supabase_db_url)
        logger.error(
            "Could not connect to Supabase Postgres; using API fallback. host=%s error_type=%s",
            parsed_url.hostname or "unknown",
            type(exc).__name__,
        )
        app.state.db = None


async def close_db(app) -> None:
    pool = getattr(app.state, "db", None)
    if pool:
        await pool.close()


async def get_db(request: Request) -> asyncpg.Pool:
    db = getattr(request.app.state, "db", None)
    if db is None and get_settings().supabase_db_url:
        if not hasattr(request.app.state,"db_reconnect_lock"):
            request.app.state.db_reconnect_lock=asyncio.Lock()
        async with request.app.state.db_reconnect_lock:
            if getattr(request.app.state,"db",None) is None and time.monotonic()>=getattr(request.app.state,"next_db_attempt",0):
                request.app.state.next_db_attempt=time.monotonic()+30
                await connect_db(request.app)
        db=getattr(request.app.state,"db",None)
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="Dịch vụ dữ liệu tạm thời không khả dụng. Vui lòng thử lại sau.",
        )
    return db
