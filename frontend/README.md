# VolunteerHub Next.js

Next.js 15.5.28 App Router workspace. Copy `.env.example` to `.env.local` and set only the Supabase Project URL, publishable key, and API URL. Never add a Supabase secret/service key, database password, or JWT signing secret here.

The public pages, volunteer portal, organizer workspace, and admin views are implemented as React routes. Legacy `.html` URLs redirect to those routes; static legacy files remain in `public/legacy` as visual/CSS references. Sign-in uses Supabase Auth; protected data and business operations go through FastAPI. Start the API using `backend/README.md` before running the frontend.

Development: `npm run dev`; production check: `npm run build`. Development output uses `.next-dev`, production output uses `.next`, so building does not overwrite development chunks.

Use `API_INTERNAL_URL=http://127.0.0.1:8000` for server requests and API rewrites. Keep this aligned with the backend port. Browser requests use same-origin `/api/v1`; never put secret credentials here.

Profile, schedule, certificates, favorites, notifications and volunteer dashboard share VolunteerWorkspaceFrame. Page styles load by route through LegacyStyles. Images imported as relative legacy paths are normalized through lib/media.ts.

Realtime joins after installing the session token and rejoins when the account changes. It only receives authorized change signals and reloads protected data through FastAPI. Disconnected clients use a 30 second refresh fallback.

Configure Supabase Auth redirect URLs for the deployment origin and `/auth/callback`; recovery continues to `/auth/reset`. Test email delivery separately with a real inbox.

## Code dùng chung và ảnh tối ưu

- Mỗi trang có module riêng trong components/portal; PublicPages/VolunteerPages/OrganizerPages chỉ còn re-export tương thích. Route mới import trực tiếp component của trang để giảm bundle.
- hooks/use-api-query.ts giữ cơ chế tải/refetch; lib/data-events.ts khai báo bảng dữ liệu phụ thuộc theo endpoint. Thêm endpoint mới phải bổ sung mapping này. Chỉ auth/reconnect/focus mới làm mới toàn bộ query đang mở.
- apiRequest gộp các GET đồng thời cùng session/path/revision, không lưu cache riêng tồn tại qua đổi tài khoản. Yêu cầu có custom headers/signal không gộp.
- Pagination, NotificationBell, Modal, MediaImage và StoryCard là component chung. Models ở lib/models.ts; kiểu paged response dùng PageResult.
- Tạo lại ảnh từ frontend: `python scripts/optimize-images.py --dry-run`, sau đó bỏ --dry-run. Cần Python + Pillow cho bước tạo asset, không cần Pillow trong runtime Next.js. Script giữ JPG gốc, tạo WebP 120/240/480/960/1600px khi kích thước nguồn cho phép, cập nhật manifest và tham chiếu CSS public.
- MediaImage chọn srcset/sizes, lazy mặc định; hero trang chủ eager/high priority. HTML marketing từ DB được chuẩn hóa đường dẫn và ảnh trước render. Khi thêm ảnh JPG, chạy lại generator và build.
