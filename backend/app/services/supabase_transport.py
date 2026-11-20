import urllib.error
import urllib.request
from urllib.parse import urlsplit

from app.core.config import get_settings


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def open_supabase(request: urllib.request.Request, timeout: int):
    origin = urlsplit(get_settings().supabase_url)
    target = urlsplit(request.full_url)
    if (
        origin.scheme != "https"
        or target.scheme != "https"
        or not origin.hostname
        or target.hostname != origin.hostname
        or target.port != origin.port
        or target.username is not None
        or target.password is not None
        or target.fragment
        or not target.path.startswith(("/auth/v1/", "/storage/v1/"))
    ):
        raise urllib.error.URLError("Supabase endpoint is not permitted")
    return urllib.request.build_opener(NoRedirect()).open(request, timeout=timeout)
