# Tổng hợp tài liệu và dọn chú thích

Ngày thực hiện: 19/10/2026. Các báo cáo cũ được giữ nguyên để tra cứu lịch sử; tài liệu mới phản ánh code đang có trong checkout.

## Đọc từ đâu

1. [Bản đồ trang, bố cục, component và thẻ](21-pages-layout-functions.md).
2. Chọn trang trong bảng route để xem sơ đồ JSX, hàm, sự kiện, API và file liên quan.
3. [Tra tất cả hàm frontend](22-function-catalog.md).
4. [Tra endpoint và hàm backend](23-backend-api-reference.md).

## Các tài liệu hiện có

Nội dung tóm tắt dưới đây lấy từ tiêu đề/mục của từng file, không phải xác nhận lại kết quả kiểm thử hay triển khai của báo cáo cũ.

| Tài liệu | Tên và các mục chính |
|---|---|
| [README.md](D:/WebNhiLun/README.md) | 🌟 Giới Thiệu Tổng Quan · 🗺️ Sơ Đồ Cấu Trúc Trang & Điều Hướng (Site Map) · 🏗️ Kiến Trúc Kỹ Thuật (Architecture) · 🛠️ Hướng Dẫn Cài Đặt Môi Trường & Khởi Chạy (Step-by-Step) · Di chuyển vào thư mục backend · Khởi tạo virtual environment · Kích hoạt virtual environment: · Trên Windows (PowerShell): · Trên Windows (Command Prompt): · Trên macOS / Linux: · Nâng cấp pip và cài đặt dependencies · 1. Supabase Project Credentials · 2. Kết nối PostgreSQL trực tiếp qua asyncpg · 3. Cấu hình CORS & Môi trường · 4. Bật chế độ Đăng nhập nhanh Demo (Chỉ dùng khi DEV) · Tự động thực thi toàn bộ thư mục supabase/migrations và nạp supabase/seed.sql: · 1. Áp dụng schema migration lên CSDL · 2. Nạp dữ liệu mẫu chuẩn hóa vào Supabase · Di chuyển vào thư mục frontend · Cài đặt các thư viện React, Next.js, Supabase SSR · Kiểm tra Type, Lint và build production bundle: · Khởi chạy server production: · 👥 Tài Khoản Kiểm Thử (Demo Accounts) · 📸 Bộ Ảnh Chụp Màn Hình Minh Họa 15 Trang · 📁 Cấu Trúc Thư Mục Dự Án (Directory Structure) · 📄 Bản Quyền & Giấy Phép · Bản đồ trang và chức năng |
| [frontend/README.md](D:/WebNhiLun/frontend/README.md) | VolunteerHub Next.js · Code dùng chung và ảnh tối ưu |
| [backend/README.md](D:/WebNhiLun/backend/README.md) | VolunteerHub FastAPI · Chạy ở máy phát triển · API đã có · Giới hạn đã biết · Migration và kiểm tra sau sửa · Tối ưu truy vấn và PDF (16/10/2026) |
| [supabase/README.md](D:/WebNhiLun/supabase/README.md) | Supabase setup status |
| [VolunteerHub_Docs/15-upgrade-blueprint-nextjs-fastapi-supabase.md](D:/WebNhiLun/VolunteerHub_Docs/15-upgrade-blueprint-nextjs-fastapi-supabase.md) | BLUEPRINT NÂNG CẤP KIẾN TRÚC TOÀN DIỆN: NEXT.JS + FASTAPI + SUPABASE · Dự án: VolunteerHub / NhiLun (Cổng Kết Nối & Quản Lý Hoạt Động Tình Nguyện) · 1. KHẢO SÁT HIỆN TRẠNG HỆ THỐNG (AS-IS AUDIT) · 2. THIẾT KẾ KIẾN TRÚC MỤC TIÊU (TO-BE ARCHITECTURE) · 3. CÁC GIẢ ĐỊNH NGHIỆP VỤ & CÂU HỎI CẦN THỐNG NHẤT |
| [VolunteerHub_Docs/16-system-review-nextjs-fastapi-supabase.md](D:/WebNhiLun/VolunteerHub_Docs/16-system-review-nextjs-fastapi-supabase.md) | Rà soát hệ thống Next.js – FastAPI – Supabase · Kết luận · Kiến trúc hiện tại · Bằng chứng đã kiểm tra · Những việc cần sửa · Đối chiếu route HTML → Next.js · Thứ tự sửa đề xuất |
| [VolunteerHub_Docs/17-repair-verification.md](D:/WebNhiLun/VolunteerHub_Docs/17-repair-verification.md) | Kết quả sửa và kiểm tra hệ thống · Phạm vi đã sửa · Bằng chứng kiểm tra · Đối chiếu giao diện thực tế · Cách chạy lại · Giới hạn nghiệm thu còn lại |
| [VolunteerHub_Docs/18-security-performance-review.md](D:/WebNhiLun/VolunteerHub_Docs/18-security-performance-review.md) | Rà soát bảo mật và tối ưu hệ thống · Kết luận · Kết quả đã xác minh lại · 1. Việc cần làm trước production · 2. Tối ưu có bằng chứng · 3. Lộ trình đề xuất · Giới hạn |
| [VolunteerHub_Docs/19-performance-implementation.md](D:/WebNhiLun/VolunteerHub_Docs/19-performance-implementation.md) | Tối ưu Realtime, API, ảnh, PDF và cấu trúc code · 1. Realtime chỉ cập nhật nhóm dữ liệu liên quan · 2. JWT/JWKS không chặn event loop · 3. Hợp đồng API phân trang · 4. Tối ưu ảnh · 5. Tái sử dụng PDF riêng tư · 6. Code chung và module boundary · 7. Bằng chứng kiểm tra |

## Phạm vi xóa comment

Đã xóa **224 chú thích** trong **33 file**. Có 25 entry trang Next.js và 66 khai báo endpoint backend được kiểm kê.

- JavaScript/TypeScript/TSX: xóa comment thông thường, đối chiếu cây AST trước/sau; giữ literal, regex, template và JSX text.
- Python: xóa token COMMENT thông thường, đối chiếu token thực thi trước/sau; giữ docstring vì có thể được dùng làm metadata runtime.
- CSS/HTML: nhận diện comment ngoài chuỗi CSS và bằng HTML parser; giữ nội dung chuỗi, URL và conditional comment.
- Giữ chỉ thị công cụ, copyright/license, shebang, reference TypeScript và file sinh tự động `next-env.d.ts`.
- Không sửa migration SQL đã áp dụng vì runner đối chiếu checksum. Comment trong dữ liệu/chuỗi HTML/SQL không được xóa như comment của ngôn ngữ chủ.
- Không quét dependency, cache build, thư mục graft, file bị gitignore hoặc biến môi trường chứa bí mật.
- Không đổi layout, logic, cấu hình quyền hay dữ liệu Supabase.

### File đã dọn

| File | Số comment |
|---|---|
| [backend/app/api.py](D:/WebNhiLun/backend/app/api.py) | 1 |
| [backend/app/services/certificate_files.py](D:/WebNhiLun/backend/app/services/certificate_files.py) | 2 |
| [backend/scripts/generate_seed_sql.py](D:/WebNhiLun/backend/scripts/generate_seed_sql.py) | 9 |
| [backend/scripts/import_story_content.py](D:/WebNhiLun/backend/scripts/import_story_content.py) | 1 |
| [backend/scripts/seed_supabase.py](D:/WebNhiLun/backend/scripts/seed_supabase.py) | 2 |
| [backend/scripts/verify_system.py](D:/WebNhiLun/backend/scripts/verify_system.py) | 1 |
| [data/seedData.js](D:/WebNhiLun/data/seedData.js) | 1 |
| [frontend/app/auth/callback/route.ts](D:/WebNhiLun/frontend/app/auth/callback/route.ts) | 1 |
| [frontend/app/globals.css](D:/WebNhiLun/frontend/app/globals.css) | 2 |
| [frontend/components/portal/LegacyMarkup.tsx](D:/WebNhiLun/frontend/components/portal/LegacyMarkup.tsx) | 1 |
| [frontend/components/portal/StoryCard.tsx](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx) | 1 |
| [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts) | 3 |
| [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts) | 1 |
| [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts) | 1 |
| [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts) | 1 |
| [frontend/lib/supabase/server.ts](D:/WebNhiLun/frontend/lib/supabase/server.ts) | 1 |
| [frontend/public/legacy/css/about.css](D:/WebNhiLun/frontend/public/legacy/css/about.css) | 7 |
| [frontend/public/legacy/css/activities.css](D:/WebNhiLun/frontend/public/legacy/css/activities.css) | 12 |
| [frontend/public/legacy/css/admin.css](D:/WebNhiLun/frontend/public/legacy/css/admin.css) | 7 |
| [frontend/public/legacy/css/auth.css](D:/WebNhiLun/frontend/public/legacy/css/auth.css) | 14 |
| [frontend/public/legacy/css/base.css](D:/WebNhiLun/frontend/public/legacy/css/base.css) | 23 |
| [frontend/public/legacy/css/certificates.css](D:/WebNhiLun/frontend/public/legacy/css/certificates.css) | 1 |
| [frontend/public/legacy/css/components.css](D:/WebNhiLun/frontend/public/legacy/css/components.css) | 27 |
| [frontend/public/legacy/css/dashboard.css](D:/WebNhiLun/frontend/public/legacy/css/dashboard.css) | 7 |
| [frontend/public/legacy/css/detail.css](D:/WebNhiLun/frontend/public/legacy/css/detail.css) | 9 |
| [frontend/public/legacy/css/home.css](D:/WebNhiLun/frontend/public/legacy/css/home.css) | 10 |
| [frontend/public/legacy/css/notifications.css](D:/WebNhiLun/frontend/public/legacy/css/notifications.css) | 1 |
| [frontend/public/legacy/css/organizer.css](D:/WebNhiLun/frontend/public/legacy/css/organizer.css) | 21 |
| [frontend/public/legacy/css/profile.css](D:/WebNhiLun/frontend/public/legacy/css/profile.css) | 22 |
| [frontend/public/legacy/css/schedule.css](D:/WebNhiLun/frontend/public/legacy/css/schedule.css) | 2 |
| [frontend/public/legacy/css/stories.css](D:/WebNhiLun/frontend/public/legacy/css/stories.css) | 10 |
| [frontend/public/legacy/css/volunteer.css](D:/WebNhiLun/frontend/public/legacy/css/volunteer.css) | 18 |
| [scripts/take_screenshots.py](D:/WebNhiLun/scripts/take_screenshots.py) | 4 |

## Bằng chứng → kết quả → cách tra

- Bằng chứng: bộ phân tích TypeScript/Python, import, JSX, handler và decorator API trong source.
- Kết quả: comment được loại bỏ với kiểm tra cấu trúc; tài liệu liên kết đúng file và số dòng giữ nguyên.
- Cách tra: mở báo cáo 21 → chọn route → xem bảng handler/API → theo liên kết đến hàm hoặc báo cáo 23.

## Giới hạn

Đợt này không thực hiện migration hoặc thay dữ liệu. Việc kiểm kê tĩnh không chứng minh pixel-perfect, quyền truy cập thực tế hoặc mọi luồng runtime. Các screenshot trong `docs/screenshots` và báo cáo 17–19 thuộc đợt trước.


## Kiểm tra sau khi dọn (19/10/2026)

- Next.js production build thành công, bao gồm kiểm tra kiểu TypeScript.
- Cây AST JavaScript/TypeScript và token thực thi Python trước/sau xóa comment không đổi.
- 17 file CSS có cấu trúc rule/declaration không đổi sau khi chuẩn hóa khác biệt xuống dòng LF/CRLF khi đối chiếu Git.
- 22 file Python backend phân tích cú pháp thành công.
- 29 tài liệu mới có 2.407 liên kết file hợp lệ tại thời điểm đối chiếu.
- Quét dry-run lần hai không phát hiện comment thông thường còn cần xóa; `git diff --check` không báo lỗi.
- Không chạy lại bộ kiểm thử API/Supabase hoặc kiểm thử trình duyệt trong đợt này.
