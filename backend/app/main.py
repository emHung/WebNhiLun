import sys
import asyncio
from contextlib import asynccontextmanager
import logging
import json
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path
from uuid import uuid4

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api import router
from app.auth_routes import router as auth_router
from app.core.http_security import RequestProtection, SECURITY_HEADERS
from app.core.config import get_settings
from app.core.database import close_db, connect_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db(app)
    yield
    await close_db(app)


app = FastAPI(title="VolunteerHub API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_credentials=True, allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"], allow_headers=["Authorization", "Content-Type", "X-Request-ID"])
app.add_middleware(RequestProtection)
logging.getLogger("uvicorn.access").disabled = True
logger = logging.getLogger("volunteerhub.api")
error_folder = Path(__file__).resolve().parents[1] / "logs"
error_folder.mkdir(exist_ok=True)
if not any(isinstance(handler, RotatingFileHandler) for handler in logger.handlers):
    error_handler = RotatingFileHandler(error_folder / "errors.jsonl", maxBytes=1048576, backupCount=5, encoding="utf-8")
    error_handler.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(error_handler)


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = str(uuid4())
    request.state.request_id = request_id
    error_type = "ServiceUnavailable"
    try:
        response = await call_next(request)
    except Exception as error:
        error_type = type(error).__name__
        response = JSONResponse(status_code=500, content={"success": False, "detail": "Đã xảy ra lỗi hệ thống.", "error": {"code": "INTERNAL_ERROR", "message": "Đã xảy ra lỗi hệ thống."}, "meta": {"requestId": request_id}})
    response.headers["X-Request-ID"] = request_id
    for key, value in SECURITY_HEADERS.items():
        response.headers[key] = value
    if settings.app_env == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000"
    if response.status_code >= 500:
        logger.error(json.dumps({"time": datetime.now(timezone.utc).isoformat(), "event": "api_error", "request_id": request_id, "route": getattr(request.scope.get("route"), "path", "unmatched"), "status": response.status_code, "error_type": error_type}))
    return response


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    detail = "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau." if exc.status_code >= 500 else exc.detail
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={"success": False, "detail": detail, "error": {"code": "REQUEST_FAILED", "message": detail if isinstance(detail, str) else "Yêu cầu không hợp lệ."}, "meta": {"requestId": getattr(request.state, "request_id", None)}},
    )


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "detail": [{"loc":list(e["loc"]),"msg":e["msg"],"type":e["type"]} for e in exc.errors()], "error": {"code": "INPUT_VALIDATION_FAILED", "message": "Dữ liệu gửi lên không hợp lệ."}, "meta": {"requestId": getattr(request.state, "request_id", None)}},
    )

@app.api_route("/mcp{rest:path}", methods=["GET", "POST", "HEAD", "OPTIONS"])
async def mcp_probe(rest: str = ""):
    return JSONResponse(status_code=404, content={"detail": "Not an MCP server"})


@app.api_route("/.well-known/{rest:path}", methods=["GET", "POST", "HEAD", "OPTIONS"])
async def well_known_probe(rest: str = ""):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


app.include_router(router)
app.include_router(auth_router)

