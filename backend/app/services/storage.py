import asyncio
import json
import urllib.request
import urllib.error
from urllib.parse import quote
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from app.core.config import get_settings

async def upload_document(bucket: str, owner: str, file: UploadFile):
    settings=get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503,"Storage chưa được cấu hình.")
    types={"application/pdf":("pdf",b"%PDF"),"image/jpeg":("jpg",b"\xff\xd8"),"image/png":("png",b"\x89PNG")}
    mime=(file.content_type or "").lower()
    if mime not in types:
        raise HTTPException(415,"Chỉ nhận PDF, JPG hoặc PNG.")
    content=await file.read(15*1024*1024+1)
    if len(content)>15*1024*1024:
        raise HTTPException(413,"Tài liệu vượt quá 15 MB.")
    extension,magic=types[mime]
    if not content.startswith(magic):
        raise HTTPException(415,"Nội dung tệp không đúng định dạng.")
    path=f"{owner}/{uuid4().hex}.{extension}"
    request=urllib.request.Request(f"{settings.supabase_url.rstrip('/')}/storage/v1/object/{bucket}/{path}",data=content,method="POST",headers={"apikey":settings.supabase_secret_key,"Content-Type":mime})
    try:
        await asyncio.to_thread(lambda:urllib.request.urlopen(request,timeout=20).read())
    except (urllib.error.URLError,TimeoutError) as exc:
        raise HTTPException(502,"Không tải được tài liệu lên Storage.") from exc
    return path

async def signed_url(bucket: str, path: str):
    settings=get_settings()
    request=urllib.request.Request(f"{settings.supabase_url.rstrip('/')}/storage/v1/object/sign/{bucket}/{quote(path,safe='/')}",data=json.dumps({"expiresIn":300}).encode(),method="POST",headers={"apikey":settings.supabase_secret_key or "","Content-Type":"application/json"})
    try:
        result=json.loads(await asyncio.to_thread(lambda:urllib.request.urlopen(request,timeout=10).read()))
        url=result.get("signedURL") or result.get("signedUrl")
        if not url:raise ValueError("Missing signed URL")
        return url if url.startswith("http") else f"{settings.supabase_url.rstrip('/')}/storage/v1{url}"
    except (urllib.error.URLError,TimeoutError,ValueError) as exc:
        raise HTTPException(502,"Không tạo được liên kết xem tài liệu.") from exc
