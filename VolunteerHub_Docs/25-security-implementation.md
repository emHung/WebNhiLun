# Triển khai bảo mật

Ngày bắt đầu: 19/10/2026. Phạm vi đã được người dùng duyệt: credential, Data API, runtime DB, Auth/session/MFA, upload, log/error, validation, HTTPS/headers/CORS, backup và alert.

## Thiết kế trước triển khai

- `backend/app/core/config.py`: cấu hình có giới hạn, kiểm tra production fail-closed.
- `backend/app/core/security.py`: JWT bắt buộc claim, đối chiếu phiên Auth đang tồn tại và hạn/idle, MFA admin tại dependency phân quyền.
- `backend/app/core/protection.py`: limiter/quota dùng PostgreSQL chung cho mọi worker; khóa HMAC không lưu IP/email thô.
- `backend/app/auth_routes.py`: proxy login/register/recover qua Supabase Auth, có rate limit trước khi gọi upstream. Không lưu password.
- `backend/app/services/uploads.py`: một lớp kiểm tra MIME, nội dung, pixel, byte; ảnh decode/re-encode bỏ metadata.
- `backend/app/core/http_security.py`: giới hạn body trước multipart, HTTPS ở production, security headers, request ID do server tạo và log tối thiểu.
- `frontend/app/auth/mfa/page.tsx`: enrollment/challenge TOTP do chủ tài khoản thực hiện; secret không ghi log/DB ứng dụng.
- Cookie: giữ Supabase browser/SSR để phục vụ private Realtime và Bearer API; SameSite=Lax, Secure trên HTTPS. Không tuyên bố HttpOnly. Chuyển BFF hoàn toàn là một migration khác khi sản phẩm yêu cầu token chỉ tồn tại server.
- `supabase/migrations/*security_runtime_hardening.sql`: thu hẹp projection tổ chức; role service chỉ dành backend, NOBYPASSRLS/NOCREATEDB/NOCREATEROLE, explicit grants và policies cho tập thao tác backend cần. FastAPI vẫn chịu trách nhiệm phân quyền từng request, không giả định role service tương đương người dùng cuối.
- Runtime role không được đọc auth.users, không có DDL hoặc EXECUTE function tùy ý. Hàm phiên trong private chỉ trả metadata phiên của cặp user/session được backend xác thực. Limiter/quota trong private không public qua Data API.
- `backend/scripts/security_provision.py`: dry-run mặc định, xác minh target, tạo mật khẩu runtime ngẫu nhiên và lưu env bị Git ignore; tách credential migration khỏi env runtime. Rotation không in secret.
- `ops/`: tài liệu và script backup DB + Storage, restore có kiểm tra, probe và alert; cấu hình domain/destination thực tế phải được xác nhận.

## Thứ tự và kiểm chứng

1. Chụp metadata và bảo toàn dữ liệu; tạo migration, áp dụng nguyên tử và xác minh grant/RLS.
2. Tạo runtime credential, kiểm tra hoạt động trước khi chuyển cấu hình. Đổi mật khẩu quản trị sau khi có nơi lưu credential và đường kết nối mới được kiểm tra.
3. Tích hợp Auth/session/MFA và upload; kiểm thử quyền, session expiry/revocation, MIME giả, file quá lớn, limiter nhiều connection và role hạn chế.
4. Build frontend và chạy lại suite nghiệp vụ/nội dung/Realtime bằng runtime role. Không sửa các ID/dữ liệu demo hoặc bố cục ngoài màn hình bảo mật cần thêm.
5. Ghi kết quả thực tế, tách rõ code đã sẵn sàng và thao tác cloud/rotation/backup chưa thực hiện được.

## Ràng buộc vận hành

Không tự suy đoán domain, kênh cảnh báo hoặc nơi lưu backup. Không tắt policy Storage/Realtime cần thiết. Không coi giới hạn ở frontend hoặc CORS là phân quyền. Không coi source script backup là đã có backup/restore thành công.

## Kết quả nghiệm thu ngày 19/10/2026

### Đã áp dụng

- Ba migration bảo mật đã áp dụng vào đúng project `ythbxwcabvbsucdmxrnz`: giới hạn cột tổ chức qua Data API, thu hồi RPC công khai không cần thiết, role runtime `volunteerhub_api`, hàm kiểm tra phiên/limiter private, quyền sequence và trigger.
- Runtime đã chuyển sang tài khoản riêng, không có quyền quản trị, DDL, đọc `auth.users` hay xóa audit. Đây là service role giới hạn với policy backend; quyền của người dùng cuối vẫn được FastAPI kiểm tra trên từng request.
- TLS DB kiểm tra CA và hostname. Credential quản trị chuyển sang `.secrets/admin.env`, không nằm trong cấu hình runtime. Không in secret trong báo cáo.
- Login/register/recover có bộ đếm PostgreSQL chia sẻ giữa worker. SDK vẫn giữ PKCE khi đăng ký/khôi phục mật khẩu. Giới hạn ở Supabase Auth vẫn cần bật/kiểm tra để bảo vệ lời gọi trực tiếp tới nhà cung cấp.
- API kiểm tra phiên còn tồn tại, hết hạn tuyệt đối 12 giờ, không hoạt động 30 phút; heartbeat không tự kéo dài phiên. Admin bắt buộc AAL2, có màn hình TOTP. Tài khoản Admin thật chưa bị tự enroll.
- Upload kiểm tra MIME thực, giới hạn byte/pixel, ảnh decode/re-encode loại metadata; PDF kiểm tra trong tiến trình con có timeout; giới hạn request body và quota. Đã thu hồi quyền ghi Storage trực tiếp từ browser để không bỏ qua lớp kiểm tra.
- Lỗi trả về chung, validation không trả input nhạy cảm; log lỗi có rotation, không ghi token/IP/body. Audit cũ được giữ lại.
- Security headers/CSP nonce, HTTPS và cấu hình production fail-closed đã có. Cookie Supabase vẫn đọc được bởi SDK: SameSite Lax, Secure trên HTTPS, KHÔNG HttpOnly. Root render theo request phục vụ nonce, mất khả năng cache HTML tĩnh; asset tĩnh vẫn cache được.

### Bằng chứng kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| Nghiệp vụ, ownership, capacity, check-in, PDF cache, MFA | 44/44 |
| Role DB, Data API, limiter, JWT, expiry/revocation, upload, HTTPS/headers/CORS | 33/33 |
| Stories/like/tài liệu riêng tư | 12/12 |
| Phân trang và tối ưu dữ liệu | 14/14 |
| Realtime public/private, không polling | 3 kiểm tra đạt |
| Supabase SDK qua proxy đăng nhập + contract PKCE | 2 kiểm tra đạt; không gửi email thử |
| Build production Next.js | Đạt, gồm route `/auth/mfa` |
| Browser | TNV vào admin bị chuyển `/forbidden`; Admin chuyển `/auth/mfa` trước khi dùng quyền quản trị |

Các kiểm thử dùng tài khoản/fixture tạm và dọn dữ liệu đã tạo. Có một lượt kiểm tra bảo mật không đạt khi chạy đồng thời; lượt chạy lại độc lập đạt đủ 33/33. Không dùng kết quả chạy đồng thời làm bằng chứng đạt.

### Chưa hoàn tất, cần chủ project / môi trường triển khai

1. **Secret Key đã lộ chưa được rotate/thu hồi.** MCP hiện không có thao tác quản lý key; dashboard yêu cầu đăng nhập. Thực hiện tại dashboard, cập nhật trực tiếp `backend/.env`, kiểm tra rồi thu hồi key cũ. Không gửi key vào chat.
2. **Password quản trị postgres đã lộ chưa đổi.** Supabase từ chối ALTER ROLE postgres qua SQL. Đổi trên dashboard và cập nhật `SUPABASE_MIGRATION_DB_URL` trong `.secrets/admin.env`. Password runtime đã khác và không dùng credential cũ.
3. Advisor còn cảnh báo **Leaked Password Protection Disabled**. Bật nếu gói hỗ trợ; rà Auth rate limits, password policy và redirect allowlist trên dashboard.
4. Admin thật cần tự thiết lập TOTP tại `/auth/mfa`. TOTP đã kiểm thử bằng tài khoản tạm, không đăng ký thay người sở hữu.
5. Chưa có domain/máy production: chưa bật HTTPS công khai, Cloudflare, CORS domain thật. `ops/Caddyfile` là cấu hình chuẩn bị, chưa triển khai thực tế.
6. Backup mã hóa hiện ở cùng máy, chưa có offsite/retention/lịch production. Chưa có kênh webhook nên chưa gửi được cảnh báo từ xa. Xem `ops/README.md`.

Không kết luận hệ thống đã sẵn sàng mở Internet cho đến khi hoàn tất các mục trên. Báo cáo không thay thế kiểm thử giao diện toàn bộ viewport hoặc kiểm thử email thật.

### Backup đã thực hiện

Bản mã hóa `backups/20261019T140849Z-72bafab3.vhb`: 334.180 byte, 16 bảng và 1 object Storage. Restore drill đạt trên PostgreSQL tạm localhost, checksum dữ liệu/file được đối chiếu; không ghi lên Supabase thật. Khóa giải mã lưu riêng trong `.secrets/backup.key`. Chưa có bản sao ngoài máy.

Kiểm tra dependency `pip check` đạt; `git diff --check` không có lỗi khoảng trắng. Git thông báo chuẩn hóa LF/CRLF ở một số file có thay đổi từ trước, không phải lỗi runtime.
