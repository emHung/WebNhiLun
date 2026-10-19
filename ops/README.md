# Vận hành trước khi mở Internet

Hiện chưa có domain, máy production, kho backup ngoài máy hoặc kênh cảnh báo. Các bước dưới đây là cấu hình triển khai đã chuẩn bị; không có nghĩa HTTPS công khai, lịch backup hay thông báo từ xa đã hoạt động.

## 1. Chạy và kiểm tra ở máy hiện tại

Từ thư mục dự án, dùng Python riêng của backend để tránh dùng bộ thư viện cũ của máy:

```powershell
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.lock
backend/.venv/Scripts/python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --no-access-log --limit-concurrency 32 --forwarded-allow-ips 127.0.0.1
```

Chạy Next.js trong terminal khác:

```powershell
npm --prefix frontend run dev -- --hostname 127.0.0.1
```

Giữ development ở localhost. Production cần domain HTTPS và reverse proxy; không mở trực tiếp cổng 3000/8000 ra Internet.

## 2. Hoàn tất các bước Supabase cần quyền quản trị

MCP hiện hỗ trợ SQL và quản trị các phần đã dùng, nhưng không có thao tác rotate API key/password hoặc sửa Auth config trong các tool đang được cấp. Thay password của role postgres qua SQL bị Supabase từ chối.

1. Đăng nhập Supabase Dashboard đúng project WebTinhNguyen.
2. Tạo Secret Key mới, cập nhật `SUPABASE_SECRET_KEY` trong `backend/.env`, khởi động backend và kiểm tra upload/PDF. Sau khi xác nhận mới thu hồi key cũ. Không đưa key vào frontend hoặc chat.
3. Đổi database password trên dashboard. Cập nhật URL quản trị trong `.secrets/admin.env`, biến `SUPABASE_MIGRATION_DB_URL`. Backend đã dùng password riêng của `volunteerhub_api`, không cần đưa password quản trị trở lại env runtime.
4. Kiểm tra Auth Rate Limits, password policy, redirect allowlist, timebox/idle nếu gói hỗ trợ. API đã có limiter PostgreSQL, nhưng publishable key cho phép gọi Auth provider trực tiếp; các giới hạn ở Supabase vẫn cần được quản trị ở đó.
5. Admin đăng nhập → `/auth/mfa` → quét mã bằng ứng dụng TOTP và nhập mã để xác nhận. Không có TOTP của chủ tài khoản thì không thể tự đăng ký thay họ. API từ chối quyền admin nếu JWT chưa AAL2.

## 3. Môi trường production

Tạo cấu hình deployment từ các env example. Trước khi khởi động đặt:

- `APP_ENV=production`, `DEMO_LOGIN_ENABLED=false`, `ADMIN_MFA_REQUIRED=true`.
- `SUPABASE_DB_URL` dùng `volunteerhub_api`, không dùng postgres/service role làm kết nối SQL runtime.
- `SECURITY_HASH_KEY`: khóa riêng ngẫu nhiên, giống nhau giữa các worker; giữ trong secret store của máy chủ.
- `FRONTEND_ORIGINS`: danh sách origin HTTPS thực sự dùng, không wildcard, không có path.
- CA công khai tại `backend/certs/supabase-ca.crt`, hoặc cấu hình `SUPABASE_DB_CA_FILE`. Runtime kiểm tra chain và hostname; không đặt verify=false.
- Frontend chỉ có URL project/publishable key; cấu hình `API_INTERNAL_URL` trỏ backend private. Biến chứa secret không có tiền tố NEXT_PUBLIC.

`ops/Caddyfile` dùng biến `APP_DOMAIN` làm domain thật và tự cấp HTTPS. Caddy phải nhận được cổng 80/443 và DNS trỏ đúng máy; cấu hình này chưa được nghiệm thu trên máy chủ production. Backend chỉ tin forwarded headers từ proxy nội bộ đã chỉ định. Không bật cache response auth, API cá nhân hoặc response có Set-Cookie. CSP của Next dùng nonce, vì vậy các trang render theo request; static JS/CSS/ảnh vẫn có thể cache.

## 4. Backup và khôi phục

PostgreSQL client chính thức đã được đặt cục bộ tại `.tools/pgsql/bin`. Trên máy khác cài client PostgreSQL tương ứng và đặt `PG_BIN` trỏ thư mục bin. Không cài server production từ thư mục công cụ thử nghiệm.

Preview rồi tạo backup:

```powershell
backend/.venv/Scripts/python.exe backend/scripts/backup_system.py backup
backend/.venv/Scripts/python.exe backend/scripts/backup_system.py backup --apply
```

Bundle `.vhb` chứa dump các schema ứng dụng/Auth/Storage cùng nội dung object Storage, manifest/checksum, được mã hóa và xác thực bằng Fernet. Key nằm `.secrets/backup.key`, không nằm trong bundle. Dump có dữ liệu nhạy cảm nên không commit hoặc gửi file đã giải mã. Không mất key; cần giữ một bản key riêng có bảo vệ ngoài máy khi bổ sung kho backup.

Thử khôi phục bằng file vừa tạo:

```powershell
backend/.venv/Scripts/python.exe backend/scripts/backup_system.py restore-drill --file backups/20261019T140849Z-72bafab3.vhb
backend/.venv/Scripts/python.exe backend/scripts/backup_system.py restore-drill --file backups/20261019T140849Z-72bafab3.vhb --apply
```

Drill dựng PostgreSQL tạm trên localhost, restore dump, so số dòng và khôi phục/checksum file Storage ra thư mục tạm. Không ghi đè DB/Supabase thật. Đổi tên file trong ví dụ nếu dùng backup khác. Dump không chứa cấu hình Control Plane/DNS hoặc password các role DB; khi phục hồi trên project khác vẫn cần provision roles/grants và cấu hình Auth/Storage theo runbook. Không phải bản sao toàn bộ nền tảng Supabase.

Hiện backup chỉ nằm trên cùng máy: chưa phải backup offsite và chưa có lịch chạy trên máy production. Khi chọn nơi lưu, dùng kho object ngoài hệ thống, mã hóa, retention và quyền chỉ ghi phù hợp; lập lịch hằng ngày và diễn tập khôi phục định kỳ.

## 5. Theo dõi lỗi

API ghi `backend/logs/errors.jsonl` có rotation 1 MiB × 5 file, chỉ gồm thời gian, request ID, route template, status và loại lỗi. Không ghi body, token, IP hoặc stack trace thô. Audit nghiệp vụ mới dùng vai trò/ID, không ghi tên và IP. Các audit cũ không bị xóa tự động trong đợt này.

```powershell
backend/.venv/Scripts/python.exe backend/scripts/monitor_system.py
backend/.venv/Scripts/python.exe backend/scripts/monitor_system.py --apply
```

Monitor kiểm tra liveness/readiness và lượng lỗi 5 phút, retry có giới hạn, chỉ gửi webhook khi chuyển trạng thái lỗi/phục hồi. Preview không gửi thông báo. Sau khi chọn kênh nhận, đặt `MONITOR_BASE_URL` và `ALERT_WEBHOOK_URL` trong `.secrets/operations.env`, rồi lập lịch trên máy chạy thật. Không có webhook thì không có thông báo từ xa. Không gửi webhook thử đến một địa chỉ chưa được người dùng chọn.

## 6. Kiểm tra sau mỗi thay đổi quyền/khóa

```powershell
backend/.venv/Scripts/python.exe backend/scripts/verify_security.py
backend/.venv/Scripts/python.exe backend/scripts/verify_system.py
backend/.venv/Scripts/python.exe backend/scripts/verify_content.py
backend/.venv/Scripts/python.exe backend/scripts/verify_optimizations.py
npm --prefix frontend run build
```

Các script nghiệp vụ sử dụng tài khoản Admin tạm có TOTP, rồi xóa đúng fixture đã tạo. Không tự enroll MFA trên Admin thật. Kiểm tra thêm thao tác trên trình duyệt trước khi phát hành.
