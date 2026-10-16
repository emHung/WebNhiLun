# VolunteerHub FastAPI

FastAPI là lớp API nghiệp vụ của ứng dụng. Dịch vụ xác thực Supabase access token, tải role hiện tại từ `public.profiles`, thực thi truy vấn PostgreSQL và chỉ dùng khóa bí mật cho thao tác Storage phía máy chủ.

## Chạy ở máy phát triển

1. Dùng Python 3.11 trở lên.
2. Tạo `backend/.env` từ `.env.example` và điền `SUPABASE_URL`, `SUPABASE_DB_URL`, publishable key, JWKS URL và Secret Key phía server. Secret Key chỉ được dùng trong backend cho Storage/seed admin; không đặt ở frontend.
3. Đặt mật khẩu riêng tối thiểu 12 ký tự cho ba tài khoản demo trong `DEMO_PASSWORD_USR_001`, `DEMO_PASSWORD_USR_002` và `DEMO_PASSWORD_USR_003`. Bật `DEMO_LOGIN_ENABLED=true` khi cần nút đăng nhập demo ở môi trường phát triển; endpoint luôn bị khóa ở production.
4. Trong thư mục `backend`, cài dependency từ `requirements.txt`.
5. Chạy `uvicorn app.main:app --reload`; tài liệu OpenAPI ở `/docs`, trạng thái API ở `/api/v1/health`.

Schema và dữ liệu đã được kiểm tra trực tiếp qua kết nối PostgreSQL của backend đúng project ứng dụng. MCP hiện vẫn trỏ khác project; không dùng MCP đó để sửa dữ liệu ứng dụng. Migration bổ sung được áp dụng qua `scripts/migrate_repair.py`, có kiểm tra đích, transaction và checksum. Báo cáo kiểm tra hiện tại: `VolunteerHub_Docs/17-repair-verification.md` ở thư mục gốc.

## API đã có

- Auth: `GET /api/v1/auth/me`, đăng nhập demo có giới hạn tốc độ và chỉ bật khi cấu hình.
- Hồ sơ, yêu thích, thông báo và đơn đăng ký cá nhân.
- Danh sách/chi tiết hoạt động công khai, nộp đơn và hủy đơn.
- Organizer: danh sách hoạt động/ứng viên, duyệt đơn, điểm danh, xuất CSV, tạo hoạt động và tải banner/tài liệu tổ chức lên Storage.
- Admin: duyệt tổ chức/hoạt động, xem audit log, xem và kích hoạt theme.
- Chứng nhận: danh sách cá nhân và xác minh công khai theo mã.
- Upload giấy tờ dùng bucket riêng `organization-docs`; API cấp signed URL ngắn hạn cho admin xem tài liệu.

Các thay đổi nghiệp vụ quan trọng chạy trong transaction PostgreSQL. Việc nộp đơn khóa hoạt động để kiểm tra sức chứa; unique constraint ngăn một tài khoản nộp trùng. Điểm danh tạo chứng nhận và cộng giờ trong cùng transaction.

## Giới hạn đã biết

- Tài khoản demo được tạo idempotent trong Supabase Auth bởi seed khi chạy `--apply`; mật khẩu riêng của từng role phải được đặt trong backend `.env`. Không dùng mật khẩu cũ trong dữ liệu legacy.
- Tài khoản đã xác thực có thể đăng ký hồ sơ tổ chức; quyền organizer được cấp sau khi gửi hồ sơ và tổ chức vẫn phải chờ admin duyệt.
- API đã được kiểm tra với database thật bằng bộ kiểm thử có dữ liệu riêng và dọn sau chạy. Email khôi phục/xác nhận cần nghiệm thu bằng hộp thư thật; quét QR bằng camera cần trình duyệt hỗ trợ BarcodeDetector.

## Migration và kiểm tra sau sửa

- Xem trước: `python scripts/migrate_repair.py --file supabase/migrations/TEN_FILE.sql` (đường dẫn tính từ gốc dự án).
- Áp dụng file đã xem: thêm `--apply`. Không sửa nội dung migration đã áp dụng; tạo file tiếp theo.
- Kiểm thử API: từ backend chạy `python scripts/verify_system.py`. Script tạo tài khoản/hoạt động QA, kiểm tra 42 điều kiện rồi xóa đúng dữ liệu và PDF do lượt chạy tạo ra. Không chạy nhiều lượt đồng thời; giới hạn đăng nhập demo áp dụng bình thường.
- Kiểm thử Stories/Storage riêng: từ backend chạy `python scripts/verify_content.py`; 12 điều kiện và dọn bản ghi/tệp riêng.
- Realtime: từ frontend chạy `node scripts/verify-realtime.mjs`; cần backend ở cổng 8000. Chỉ tạo rồi xóa tín hiệu kiểm tra riêng, kiểm tra quyền của chủ tài khoản và khách.
- PDF dùng reportlab và font Unicode. Trên máy Linux đặt `PDF_FONT_PATH` đến font TTF phù hợp; mặc định thử DejaVuSans. Trên Windows thử Arial.
- Readiness DB: `GET /api/v1/health/ready`; liveness vẫn tách riêng.
- Publication chỉ chứa bảng tín hiệu `change_events`, có RLS. Không cấp quyền đọc toàn bộ đơn/hồ sơ cho client.
- `historical_approved_count` giữ số liệu người tham gia legacy chưa có hồ sơ chi tiết; bộ đếm = baseline + đơn approved không phải lịch sử. Giờ = tổng chứng nhận hiện còn hiệu lực.
- Seed bootstrap dừng khi đã có hoạt động trong DB để tránh ghi đè giao dịch thật.

## Tối ưu truy vấn và PDF (16/10/2026)

- `/notifications`, `/stories`, `/organizer/applicants` trả `data={items,total,page,limit,pages}`; xem contract đầy đủ ở `VolunteerHub_Docs/19-performance-implementation.md`.
- `/notifications/summary` trả tối đa 5 thông báo và `unread_total` của toàn tài khoản. KPI ứng viên nằm `stats`, không tính từ số dòng của trang.
- JWT/JWKS chạy trong worker thread, truy vấn profile vẫn qua asyncpg và quyền server giữ nguyên.
- PDF lưu ở `certificates/<user>/<code>/<content-hash>.pdf`. HIT đọc lại tệp riêng; MISS chỉ sinh một lần trong transaction khóa theo mã. Nội dung/ngày/người nhận/giờ/template đổi sẽ dùng hash khác. Không đổi URL thành public.
- `python scripts/verify_optimizations.py`: 14 điều kiện phân trang, count, filter và quyền; dọn đúng ID do lượt chạy tạo.
- Migration indexes: `20261016102757_paginated_query_indexes.sql`. Không cần đổi policies/grants cho các tối ưu này.
