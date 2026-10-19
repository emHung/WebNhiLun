import asyncio
import json
import urllib.request
import urllib.error
from urllib.parse import quote
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from app.core.config import get_settings
from app.services.uploads import protected_upload

async def upload_document(bucket: str, owner: str, file: UploadFile, db):
    settings=get_settings()
    if not settings.supabase_secret_key:
        raise HTTPException(503,"Storage chưa được cấu hình.")
    content,mime,extension=await protected_upload(db,owner,file,15*1024*1024,document=True)
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
