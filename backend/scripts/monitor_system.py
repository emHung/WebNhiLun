"""One bounded health/error probe; schedule with the OS or deployment platform."""
import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import time
from urllib.parse import urlsplit

import httpx
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".secrets/operations.env")


def run(apply):
    base = os.getenv("MONITOR_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
    webhook = os.getenv("ALERT_WEBHOOK_URL")
    if urlsplit(base).scheme != "https" and urlsplit(base).hostname not in {"localhost", "127.0.0.1"}:
        raise RuntimeError("Remote monitoring must use HTTPS.")
    if webhook and urlsplit(webhook).scheme != "https":
        raise RuntimeError("Alert webhooks must use HTTPS.")
    statuses = {}
    with httpx.Client(timeout=5, follow_redirects=False) as client:
        for path in ("/api/v1/health", "/api/v1/health/ready"):
            status = 0
            for attempt in range(3):
                try:
                    status = client.get(base + path).status_code
                except httpx.HTTPError:
                    status = 0
                if status == 200:
                    break
                if attempt < 2:
                    time.sleep(2 ** attempt)
            statuses[path] = status
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
        errors = 0
        log = ROOT / "backend/logs/errors.jsonl"
        if log.exists():
            for line in log.read_text(encoding="utf-8").splitlines():
                try:
                    event = json.loads(line)
                    errors += int(datetime.fromisoformat(event["time"]) >= cutoff)
                except (ValueError, KeyError, TypeError):
                    continue
        failed = any(status != 200 for status in statuses.values()) or errors >= 5
        event = {"time": datetime.now(timezone.utc).isoformat(), "healthy": not failed, "checks": statuses, "errors_last_five_minutes": errors, "alert_configured": bool(webhook)}
        state_path = ROOT / "backend/logs/monitor-state.json"
        state_path.parent.mkdir(exist_ok=True)
        previous = json.loads(state_path.read_text(encoding="utf-8")) if state_path.exists() else {}
        changed = previous.get("healthy") != event["healthy"]
        if apply:
            state_path.write_text(json.dumps(event), encoding="utf-8")
            if webhook and changed and (failed or previous.get("healthy") is False):
                response = client.post(webhook, json={"text": "VolunteerHub: " + ("dịch vụ gặp lỗi, cần kiểm tra" if failed else "dịch vụ đã phục hồi")})
                response.raise_for_status()
        print(json.dumps({**event, "preview": not apply, "alert_sent": bool(apply and webhook and changed and (failed or previous.get("healthy") is False))}))
        return 1 if failed else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    try:
        raise SystemExit(run(parser.parse_args().apply))
    except Exception as error:
        print(json.dumps({"healthy": False, "error_type": type(error).__name__}))
        raise SystemExit(1) from None
