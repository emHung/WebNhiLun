"""Validate untrusted PDFs in an expendable child process, never log their contents."""
import io
import logging
import sys

from pypdf import PdfReader


def main():
    logging.disable(logging.CRITICAL)
    try:
        import resource
        resource.setrlimit(resource.RLIMIT_AS, (512 * 1024 * 1024, 512 * 1024 * 1024))
        resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    except ImportError:
        pass
    content = sys.stdin.buffer.read(15 * 1024 * 1024 + 1)
    if not content.startswith(b"%PDF-") or len(content) > 15 * 1024 * 1024:
        return 1
    reader = PdfReader(io.BytesIO(content), strict=True)
    if reader.is_encrypted or not 1 <= len(reader.pages) <= 100:
        return 1
    blocked = {"/JavaScript", "/JS", "/OpenAction", "/AA", "/EmbeddedFiles", "/RichMedia", "/Launch", "/XFA", "/SubmitForm", "/ImportData"}
    seen = set()

    def inspect(obj, depth=0):
        if depth > 30 or len(seen) > 10000:
            raise ValueError("PDF complexity limit")
        if hasattr(obj, "get_object"):
            obj = obj.get_object()
        if id(obj) in seen:
            return
        seen.add(id(obj))
        if isinstance(obj, dict):
            if blocked.intersection(obj) or obj.get("/S") in blocked:
                raise ValueError("Active PDF content")
            for key, value in obj.items():
                if key != "/Parent":
                    inspect(value, depth + 1)
        elif isinstance(obj, (list, tuple)):
            for value in obj:
                inspect(value, depth + 1)

    inspect(reader.trailer["/Root"])
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception:
        raise SystemExit(1) from None
