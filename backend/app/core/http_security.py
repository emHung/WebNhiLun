import json

from starlette.responses import JSONResponse

from app.core.config import get_settings

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "Cache-Control": "private, no-store",
}


class RequestProtection:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        settings = get_settings()

        async def secure_send(message):
            if message["type"] == "http.response.start":
                headers = {key.lower(): value for key, value in message.get("headers", [])}
                for key, value in SECURITY_HEADERS.items():
                    headers[key.lower().encode()] = value.encode()
                if settings.app_env == "production":
                    headers[b"strict-transport-security"] = b"max-age=31536000"
                message["headers"] = list(headers.items())
            await send(message)

        async def reject(status, text):
            response = JSONResponse({"success": False, "error": {"code": "REQUEST_REJECTED", "message": text}}, status_code=status)
            await response(scope, receive, secure_send)

        if settings.app_env == "production" and scope.get("scheme") != "https":
            return await reject(400, "Yêu cầu phải sử dụng kết nối HTTPS.")
        if scope["method"] in {"POST", "PUT", "PATCH", "DELETE"}:
            headers = dict(scope.get("headers", []))
            content_type = headers.get(b"content-type", b"").lower()
            maximum = settings.max_request_body_bytes if b"multipart/form-data" in content_type else 65536
            try:
                if int(headers.get(b"content-length", b"0")) > maximum:
                    return await reject(413, "Yêu cầu vượt quá dung lượng cho phép.")
            except ValueError:
                return await reject(400, "Yêu cầu không hợp lệ.")
            chunks, size = [], 0
            while True:
                message = await receive()
                if message["type"] == "http.disconnect":
                    return
                size += len(message.get("body", b""))
                if size > maximum:
                    return await reject(413, "Yêu cầu vượt quá dung lượng cho phép.")
                chunks.append(message)
                if not message.get("more_body", False):
                    break
            position = 0

            async def replay():
                nonlocal position
                if position < len(chunks):
                    message = chunks[position]
                    position += 1
                    return message
                return await receive()

            return await self.app(scope, replay, secure_send)
        await self.app(scope, receive, secure_send)
