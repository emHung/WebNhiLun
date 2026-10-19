import hashlib
import hmac

from fastapi import HTTPException, Request

from app.core.config import get_settings


def private_key(value: str) -> str:
    return hmac.new(get_settings().security_hash_key.encode(), value.encode(), hashlib.sha256).hexdigest()


async def limit(db, namespace: str, identity: str, maximum: int, window: int, amount: int = 1):
    row = await db.fetchrow(
        "select * from private.take_security_limit($1,$2,$3,$4)",
        private_key(f"{namespace}:{identity}"), maximum, window, amount,
    )
    if not row["allowed"]:
        raise HTTPException(429, "Bạn thao tác quá nhanh hoặc đã vượt hạn mức. Vui lòng thử lại sau.", headers={"Retry-After": str(row["retry_after"])})


async def auth_limit(db, request: Request, action: str, email: str, maximum: int):
    peer = request.client.host if request.client else "unknown"
    await limit(db, f"auth:{action}:ip", peer, maximum * 3, 900)
    await limit(db, f"auth:{action}:account", email.strip().casefold(), maximum, 900)
