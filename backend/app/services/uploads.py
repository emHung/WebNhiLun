import asyncio
import io
import sys
import warnings
import subprocess
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import get_settings
from app.core.protection import limit

_decoders = asyncio.Semaphore(2)


def normalize_image(content, mime, maximum):
    formats = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP", "image/gif": "GIF"}
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(content), formats=list(formats.values())) as image:
                if image.format != formats[mime] or image.width * image.height > get_settings().max_image_pixels:
                    raise ValueError("Image limits")
                image.verify()
            with Image.open(io.BytesIO(content)) as image:
                image.load()
                image = ImageOps.exif_transpose(image)
                image = image.convert("RGB" if mime == "image/jpeg" else "RGBA")
                output = io.BytesIO()
                target = "JPEG" if mime == "image/jpeg" else "PNG" if mime == "image/png" else "WEBP"
                image.save(output, format=target, quality=85)
        data = output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError, Image.DecompressionBombError, Image.DecompressionBombWarning) as error:
        raise HTTPException(415, "Ảnh không hợp lệ, sai định dạng hoặc vượt giới hạn kích thước ảnh.") from error
    if len(data) > maximum:
        raise HTTPException(413, "Ảnh sau xử lý vượt quá dung lượng cho phép.")
    return data, {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}[target], {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}[target]


async def validated_upload(file: UploadFile, maximum: int, document=False):
    mime = (file.content_type or "").lower()
    accepted = {"image/jpeg", "image/png"} if document else {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if document:
        accepted.add("application/pdf")
    if mime not in accepted:
        raise HTTPException(415, "Loại tệp không được hỗ trợ.")
    content = await file.read(maximum + 1)
    if len(content) > maximum:
        raise HTTPException(413, "Tệp vượt quá dung lượng cho phép.")
    if not content:
        raise HTTPException(415, "Tệp không có nội dung.")
    async with _decoders:
        if mime != "application/pdf":
            return await asyncio.to_thread(normalize_image, content, mime, maximum)
        try:
            result = await asyncio.to_thread(subprocess.run, [sys.executable, "-m", "app.services.pdf_check"], input=content, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=8, cwd=Path(__file__).resolve().parents[2])
        except subprocess.TimeoutExpired:
            raise HTTPException(415, "Không thể kiểm tra tệp PDF an toàn.") from None
        if result.returncode:
            raise HTTPException(415, "PDF không hợp lệ, có mã thực thi hoặc nội dung không được hỗ trợ.")
    return content, mime, "pdf"


async def protected_upload(db, user_id, file, maximum, document=False):
    settings = get_settings()
    await limit(db, "upload:requests", str(user_id), settings.upload_requests_per_hour, 3600)
    result = await validated_upload(file, maximum, document)
    await limit(db, "upload:bytes", str(user_id), settings.upload_daily_bytes, 86400, len(result[0]))
    return result
