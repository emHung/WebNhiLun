import sys
import asyncio
from contextlib import asynccontextmanager
import logging
from uuid import uuid4

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api import router
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
logger = logging.getLogger("volunteerhub.api")


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid4())
    request.state.request_id = request_id
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled API error request_id=%s path=%s", request_id, request.url.path)
        response = JSONResponse(status_code=500, content={"success": False, "detail": "Đã xảy ra lỗi hệ thống.", "error": {"code": "INTERNAL_ERROR", "message": "Đã xảy ra lỗi hệ thống."}, "meta": {"requestId": request_id}})
    response.headers["X-Request-ID"] = request_id
    return response


@app.exception_handler(HTTPException)
async def http_error(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={"success": False, "detail": exc.detail, "error": {"code": "REQUEST_FAILED", "message": exc.detail if isinstance(exc.detail, str) else "Yêu cầu không hợp lệ."}, "meta": {"requestId": getattr(request.state, "request_id", None)}},
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

