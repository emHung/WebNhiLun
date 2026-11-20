import io
import unittest
import urllib.error
import urllib.request
from datetime import date, timedelta
from unittest.mock import patch

import httpx
from fastapi import FastAPI, HTTPException, UploadFile
from PIL import Image
from pydantic import ValidationError
from reportlab.pdfgen import canvas
from starlette.datastructures import Headers

from app.auth_routes import AuthRecovery, AuthRegister
from app.core.config import Settings
from app.core.http_security import RequestProtection
from app.core.security import _verified_claims
from app.schemas import ActivityCreate, ProfileUpdate, safe_image_url
from app.services.uploads import validated_upload
from app.services.supabase_transport import NoRedirect, open_supabase


class SupabaseTransportTests(unittest.TestCase):
    def test_rejects_untrusted_destinations(self):
        settings = Settings(_env_file=None, supabase_url="https://project.supabase.co")
        for url in ("http://project.supabase.co/auth/v1/token", "file:///etc/passwd", "https://evil.example/auth/v1/token", "https://project.supabase.co:444/auth/v1/token", "https://user:pass@project.supabase.co/auth/v1/token", "https://project.supabase.co/other"):
            with self.subTest(url=url), patch("app.services.supabase_transport.get_settings", return_value=settings), self.assertRaises(urllib.error.URLError):
                open_supabase(urllib.request.Request(url), 10)

    def test_uses_timeout_for_trusted_destination(self):
        settings = Settings(_env_file=None, supabase_url="https://project.supabase.co")
        request = urllib.request.Request("https://project.supabase.co/storage/v1/object/bucket/file")
        with patch("app.services.supabase_transport.get_settings", return_value=settings), patch("app.services.supabase_transport.urllib.request.build_opener") as opener:
            open_supabase(request, 10)
            opener.return_value.open.assert_called_once_with(request, timeout=10)

    def test_redirect_is_not_followed(self):
        self.assertIsNone(NoRedirect().redirect_request(None, None, 302, "Found", {}, "https://evil.example"))


class InputSecurityTests(unittest.TestCase):
    def test_profile_cannot_assign_role(self):
        with self.assertRaises(ValidationError):
            ProfileUpdate(role="admin")

    def test_profile_name_cannot_be_empty(self):
        for value in (None, "", "  "):
            with self.subTest(value=value), self.assertRaises(ValidationError):
                ProfileUpdate(name=value)

    def test_images_reject_unsafe_urls(self):
        for value in ("javascript:alert(1)", "data:image/png;base64,abc", "http://example.com/a", "https://user:pass@example.com/a", "/legacy/../secret"):
            with self.subTest(value=value), self.assertRaises(ValueError):
                safe_image_url(value)

    def test_images_accept_safe_urls(self):
        for value in ("https://example.com/image.png", "/legacy/images/banner.webp", None):
            self.assertEqual(safe_image_url(value), value)

    def test_recovery_requires_pkce(self):
        with self.assertRaises(ValidationError):
            AuthRecovery(email="test@example.com")
        recovery = AuthRecovery(email="test@example.com", code_challenge="a" * 43, code_challenge_method="s256")
        self.assertEqual(recovery.code_challenge_method, "s256")

    def test_registration_cannot_assign_admin(self):
        with self.assertRaises(ValidationError):
            AuthRegister(email="test@example.com", password="test-fixture-only", data={"name": "Test", "role": "admin"}, code_challenge="a" * 43, code_challenge_method="s256")

    def test_registration_limits_password_bytes(self):
        with self.assertRaises(ValidationError):
            AuthRegister(email="test@example.com", password="ấ" * 30, data={"name": "Test"}, code_challenge="a" * 43, code_challenge_method="s256")

    def test_activity_deadline_cannot_follow_event(self):
        tomorrow = date.today() + timedelta(days=2)
        with self.assertRaises(ValidationError):
            ActivityCreate(title="Test activity", category="environment", event_date=tomorrow, deadline_date=tomorrow + timedelta(days=1), event_time="08:00", city="Test city", location="Test location", capacity=10)

    def test_production_fails_closed(self):
        with self.assertRaises(ValidationError):
            Settings(_env_file=None, app_env="production", demo_login_enabled=True)

    def test_invalid_jwt_rejected_without_network(self):
        for token in ("invalid", "a" * 8193, "eyJhbGciOiJub25lIn0.e30."):
            with self.subTest(token_length=len(token)), self.assertRaises(HTTPException) as caught:
                _verified_claims(token)
            self.assertEqual(caught.exception.status_code, 401)


class UploadSecurityTests(unittest.IsolatedAsyncioTestCase):
    async def upload(self, content, mime, maximum=10000, document=False):
        file = UploadFile(io.BytesIO(content), headers=Headers({"content-type": mime}))
        try:
            return await validated_upload(file, maximum, document)
        finally:
            await file.close()

    async def test_invalid_uploads(self):
        for content, mime, limit, expected in ((b"not an image", "image/png", 100, 415), (b"<svg/>", "image/svg+xml", 100, 415), (b"a" * 101, "image/png", 100, 413), (b"", "image/png", 100, 415), (b"%PDF-fake", "application/pdf", 100, 415)):
            with self.subTest(mime=mime, expected=expected), self.assertRaises(HTTPException) as caught:
                await self.upload(content, mime, limit, mime == "application/pdf")
            self.assertEqual(caught.exception.status_code, expected)

    async def test_valid_image_reencoded(self):
        content = io.BytesIO()
        Image.new("RGB", (12, 12)).save(content, "PNG")
        output, mime, extension = await self.upload(content.getvalue(), "image/png")
        self.assertTrue(output.startswith(b"\x89PNG"))
        self.assertEqual((mime, extension), ("image/png", "png"))

    async def test_mime_must_match_file(self):
        content = io.BytesIO()
        Image.new("RGB", (12, 12)).save(content, "PNG")
        with self.assertRaises(HTTPException) as caught:
            await self.upload(content.getvalue(), "image/jpeg")
        self.assertEqual(caught.exception.status_code, 415)

    async def test_valid_pdf_accepted(self):
        content = io.BytesIO()
        pdf = canvas.Canvas(content)
        pdf.drawString(10, 50, "Offline CI fixture")
        pdf.save()
        output, mime, extension = await self.upload(content.getvalue(), "application/pdf", document=True)
        self.assertEqual(output, content.getvalue())
        self.assertEqual((mime, extension), ("application/pdf", "pdf"))


class HttpSecurityTests(unittest.IsolatedAsyncioTestCase):
    async def request(self, method="GET", scheme="http", production=False, **kwargs):
        app = FastAPI()

        @app.api_route("/check", methods=["GET", "POST"])
        async def check():
            return {"ok": True}

        app.add_middleware(RequestProtection)
        settings = Settings(_env_file=None)
        if production:
            settings = settings.model_copy(update={"app_env": "production"})
        with patch("app.core.http_security.get_settings", return_value=settings):
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url=f"{scheme}://testserver") as client:
                return await client.request(method, "/check", **kwargs)

    async def test_response_has_security_headers(self):
        response = await self.request()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["x-content-type-options"], "nosniff")
        self.assertEqual(response.headers["x-frame-options"], "DENY")
        self.assertIn("no-store", response.headers["cache-control"])

    async def test_production_rejects_plaintext(self):
        response = await self.request(production=True)
        self.assertEqual(response.status_code, 400)

    async def test_https_has_hsts(self):
        response = await self.request(production=True, scheme="https")
        self.assertEqual(response.status_code, 200)
        self.assertIn("max-age=", response.headers["strict-transport-security"])

    async def test_json_body_limit(self):
        response = await self.request("POST", content=b"x" * 65537)
        self.assertEqual(response.status_code, 413)

    async def test_streaming_body_limit(self):
        async def chunks():
            yield b"x" * 40000
            yield b"x" * 40000

        response = await self.request("POST", content=chunks())
        self.assertEqual(response.status_code, 413)

    async def test_bad_content_length(self):
        response = await self.request("POST", headers={"Content-Length": "invalid"}, content=b"")
        self.assertEqual(response.status_code, 400)
