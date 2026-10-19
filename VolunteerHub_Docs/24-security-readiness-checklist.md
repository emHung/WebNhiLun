# Đối chiếu 19 yêu cầu bảo mật và thứ tự nâng cấp

Ngày kiểm tra: 19/10/2026 (Asia/Saigon).

## Kết luận

Nên xử lý quyền dữ liệu, credential, đăng nhập và cấu hình production trước khi thêm Cloudflare. Hiện có các lớp bảo vệ hoạt động, nhưng chưa đủ bằng chứng để kết luận hệ thống sẵn sàng tiếp nhận dữ liệu thật trên Internet.

Đợt này chỉ đọc mã nguồn/cấu hình, truy vấn metadata DB trong transaction read-only và kiểm tra một số request qua FastAPI ASGI. Không sửa mã ứng dụng, grants, migration, DNS hoặc cấu hình cloud. Đăng nhập demo để kiểm tra quyền tạo phiên Auth thông thường; không tạo dữ liệu nghiệp vụ thử nghiệm.

## Bằng chứng đã xác minh hôm nay

- URL project ứng dụng khớp host DB. Không dùng MCP để truy vấn một project khác; dùng kết nối ứng dụng và transaction read-only của đúng project.
- 4 bản ghi mật khẩu khác rỗng có định dạng bcrypt; không có định dạng khác trong phép đếm. Không đọc/in giá trị hash ra báo cáo.
- 16/16 bảng thường thuộc schema public bật RLS.
- Runtime backend kết nối bằng `postgres`: `BYPASSRLS`, `CREATEROLE`, `CREATEDB` đều bật, `SUPERUSER` tắt. Đây là quyền rộng hơn nhu cầu runtime.
- `anon` và `authenticated` còn SELECT các cột `organizations.doc_url`, `doc_name`, `representative`.
- Data API ẩn danh với publishable key chấp nhận projection `doc_url,representative` và `limit=0`: HTTP 200. Phép kiểm tra không tải nội dung cá nhân; xác nhận projection được phép, không chứng minh tải được tài liệu Storage riêng tư.
- Các bucket đều có MIME allowlist và file-size limit. `organization-docs`, `profile-docs`, `certificates` private; `avatars`, `activity-banners` public.
- Quét không tìm thấy secret key hiện tại trong file tracked; không thấy secret key/DB URL trong JavaScript tại `.next/static` và `.next-dev/static`. Frontend `.env.local` không có tên biến secret/service-role/DB-password được kiểm tra. Không bao phủ toàn bộ Git history, CI artifact hoặc máy production.
- Cấu hình local: `APP_ENV=development`, demo login bật, CORS chỉ `http://localhost:3000`. Không suy ra local server đang được mở Internet.
- Request qua ASGI với DB/JWT thật: `/auth/me` HTTP 200 và role volunteer; truy cập `/admin/metrics`, `/admin/audit-logs`, `/admin/themes` đều HTTP 403. Anonymous tới admin: 401; token sai: 401. Chưa chạy lại giao diện admin trong trình duyệt.
- Preflight từ origin không tin cậy bị HTTP 400, không có `Access-Control-Allow-Origin`.
- Response API trực tiếp không có HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy hoặc Permissions-Policy. Chưa xác minh header do proxy production thêm vào.

## Bảng đối chiếu 19 mục

P0: xử lý ngay trong đợt siết bảo mật, trước dữ liệu thật/public deployment. P1: hoàn tất trước production. P2: cải tiến tiếp sau nền tảng, theo nhu cầu.

| # | Yêu cầu | Hiện trạng và việc cần làm | Ưu tiên |
|---|---|---|---|
| 1 | Hash password | Đã dùng Supabase Auth; DB xác nhận định dạng bcrypt. Không tự thêm hash ở frontend hoặc lưu một bản password trong profiles. Kiểm tra tiếp password policy và MFA. | Đã có; duy trì |
| 2 | Rate login | Supabase Auth có rate limit riêng; chưa đọc được cấu hình Auth dashboard của project. Demo endpoint local giới hạn 5 lần/phút/IP nhưng lưu RAM từng process. Cần chính sách login/reset/signup và limiter dùng chung khi nhiều instance; không chỉ giới hạn nút UI. | P1 |
| 3 | Session hết hạn | Backend dùng PyJWT để xác minh expiry khi claim có mặt. Chưa có kiểm tra session revocation/timebox/idle ở API nhạy cảm; chưa xác minh timebox/idle trên dashboard. Cần phân biệt JWT expiry với thời hạn toàn phiên có refresh. Nên yêu cầu các claim bắt buộc, kiểm tra session khi cần thu hồi ngay. | P1 |
| 4 | Log không lộ dữ liệu | Không thấy lệnh log token trực tiếp trong runtime đã quét. Có console.error với object lỗi, logger.exception toàn traceback, audit ghi tên/IP. Cần bộ lọc redaction, bỏ log debug thừa, cấu hình access log/proxy và thời hạn lưu. Không xóa toàn bộ audit trail có mục đích. | P1 |
| 5 | Secret không ở frontend | Quét hiện tại đạt trong phạm vi nêu trên. Secret/DB password từng được gửi trong hội thoại: chưa xác minh đã thu hồi. Cần xoay/thu hồi credential cũ và kiểm tra lịch sử/artifact. Publishable key được phép có ở browser. | P0 cho credential; frontend duy trì |
| 6 | Không show lỗi chi tiết | Lỗi 500 đã trả thông báo chung. HTTPException chuyển tiếp detail; thông báo DB mất kết nối còn nhắc backend/.env và connection string. Cần tách lỗi hướng dẫn developer khỏi lỗi production, giữ validation hữu ích và request ID. | P1 |
| 7 | Giới hạn loại upload | Có allowlist MIME trong API và bucket. Avatar/banner/giấy tờ tổ chức còn chủ yếu tin Content-Type; profile-docs có magic bytes nhưng chưa kiểm tra đầy đủ nội dung. Cần decode/re-encode ảnh, pixel limit, kiểm tra PDF. Stories cho GIF nhưng bucket activity-banners không nhận GIF: cần đồng bộ. | P1 |
| 8 | Giới hạn dung lượng | Đã chặn số byte ở API và bucket: avatar 2 MiB; banner/Stories 10 MiB; giấy tờ 15 MiB; certificates bucket 5 MiB. Cần thêm giới hạn request body trước multipart parsing, quota tổng/user và rate upload. | Giữ phần đã có; bổ sung P1 |
| 9 | Validate server | Đã có Pydantic, giới hạn chuỗi/số/ngày, kiểm tra role/chủ sở hữu/trạng thái và ràng buộc DB. Một số schema chưa forbid extra; URL/file cần quy tắc chặt hơn. Cần regression test payload sai và trường cố sửa quyền. | Đã có một phần; P1 hoàn thiện |
| 10 | User thường vào admin | Ba API đọc admin đã trả 403 cho volunteer; middleware cũng chặn /admin theo role lấy từ backend. Cần giữ test, bổ sung mọi method/endpoint nhạy cảm và trình duyệt. Production phải tắt demo admin, thêm MFA/AAL2 cho thao tác quan trọng. | Phần đã thử đạt; P0/P1 cho demo/MFA |
| 11 | Parameterized SQL | Giá trị truy vấn dùng asyncpg `$1...`; SQL động ghép placeholder/column từ Pydantic hoặc các đoạn cố định. Các đường đã rà chưa thấy giá trị người dùng nối thẳng vào SQL. Giữ allowlist identifier, không cho client truyền tên cột/order tự do. Không kết luận chỉ vì có f-string là SQL injection. | Đã có; kiểm thử hồi quy |
| 12 | HTTPS | Supabase URL dùng HTTPS, kết nối DB dùng SSL require. Chưa thấy ứng dụng bắt buộc HTTPS public hoặc config proxy production. Cần TLS trên các chặng public, redirect HTTP, cấu hình trusted proxy, HSTS sau khi xác minh HTTPS ổn định. | P1 trước public |
| 13 | Security headers | Next config chưa khai báo headers; API trực tiếp thiếu các header đã kiểm tra. Cần CSP phù hợp inline styles/script/ảnh hiện có, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy; HSTS tại HTTPS edge. Có thể chạy CSP Report-Only trước khi enforce. | P1 |
| 14 | Cookie HttpOnly/Secure/SameSite | Client tự đọc/ghi document.cookie. @supabase/ssr cài hiện tại mặc định SameSite=Lax, HttpOnly=false; ứng dụng chưa đặt Secure rõ ràng cho cookie auth. SameSite đã có nền tảng, cần Secure trên HTTPS. Nếu yêu cầu HttpOnly tuyệt đối, chuyển quản lý phiên/token về server/BFF, sửa API client/refresh và cách xác thực Realtime; không chỉ bật một flag. Khi chuyển cookie-auth cần bảo vệ CSRF/Origin cho request ghi. | P1; quyết định kiến trúc sớm |
| 15 | CORS domain cần thiết | Local allowlist hẹp, origin lạ bị từ chối. Khi triển khai chỉ thêm origin HTTPS thực sự dùng; không dùng wildcard kèm credentials. CORS không thay thế auth và không chặn script ngoài trình duyệt. | Nền tảng đạt; P1 cấu hình production |
| 16 | DB không public khi không cần | Phải tách ba nghĩa: schema public, Data API grants và network DB. RLS đã bật nhưng organizations vẫn lộ projection nội bộ qua Data API. Thu hẹp grant/view/projection; rà bảng/function exposed không dùng. Network allowlist cần kiểm tra trên dashboard; không suy ra đang mở toàn Internet chỉ vì workstation kết nối được. Không tắt mù quáng Data API/Realtime/Storage. | P0 cho lộ cột; P1 cho exposure/network |
| 17 | DB user ít quyền | Runtime đang dùng postgres với BYPASSRLS/CREATEROLE/CREATEDB. Cần tách migration account khỏi runtime account; chỉ cấp bảng/cột/function thực sự dùng, không có DDL/quản trị role. Phải thiết kế RLS/transaction context phù hợp FastAPI, không đổi username rồi giả định auth.uid tự hoạt động. | P0 thiết kế và triển khai có kiểm thử |
| 18 | Cloudflare | Chưa xác minh domain/zone/tài khoản hoặc cấu hình edge. Có thể thêm DNS proxy/CDN/WAF sau nền tảng. Dùng TLS Full (strict), bảo vệ origin, bypass cache auth/private/API cá nhân và response Set-Cookie. Cloudflare ở domain web không tự bảo vệ các request đi thẳng tới Supabase Auth/Data API. | P2; có thể cùng đợt triển khai |
| 19 | Backup và theo dõi lỗi | Chưa xác minh lịch backup/retention/PITR thực tế, restore drill hoặc alert cloud. Repo chưa có tích hợp error tracker đã kiểm tra. Backup DB + Storage riêng, thử restore, uptime/error alert và scrub dữ liệu nhạy cảm phải có trước dữ liệu thật. PITR/observability nâng cao làm tiếp theo nhu cầu. | P1 nền tảng; P2 nâng cao |

## Các điểm cần giải thích trước khi sửa

### Session không hết hạn chỉ bằng cookie Max-Age

JWT có thời điểm hết hạn; refresh token có thể tạo JWT mới. Việc bỏ chọn ghi nhớ hoặc giảm tuổi cookie không tương đương cưỡng chế kết thúc phiên ở server. API nhạy cảm đang xác minh JWT và profile, chưa đối chiếu `session_id` với session đang hiệu lực. Cần xác định idle timeout, thời hạn tuyệt đối và yêu cầu thu hồi ngay; cấu hình Auth phải được kiểm chứng trên đúng project.

### HttpOnly cần phù hợp kiến trúc

Hiện browser dùng Supabase Auth và lấy access token để gửi Bearer cho FastAPI, đồng thời xác thực Realtime. Đây là lý do cookie được JavaScript đọc. Nếu chuyển sang HttpOnly, server cần giữ token và chuyển tiếp API; private Realtime cũng cần thiết kế lại. Nên thực hiện thành thay đổi có blueprint và regression test, thay vì sửa flag gây hỏng đăng nhập.

### Log an toàn vẫn phải đủ để điều tra

Giữ error code, request ID, nhóm route, thời gian và trạng thái. Không ghi Authorization/Cookie, refresh token, password, body giấy tờ hoặc toàn bộ hồ sơ. IP/tên trong audit cần mục đích rõ, phân quyền và retention; có thể che hoặc băm khi phù hợp. Cần kiểm tra cả access log mặc định của Uvicorn/Next.js/reverse proxy, không chỉ console.log trong source.

### public schema không đồng nghĩa cần chuyển mọi bảng

Điểm cần xử lý đã xác nhận là quyền/projection Data API và tài khoản runtime. Network restrictions cho DB và quyền truy cập Data API là hai lớp khác nhau. Nếu giữ dữ liệu trong public schema, vẫn phải giới hạn grants và policies đúng đối tượng. Nếu tách schema private, cần migration và kiểm tra mọi query/function liên quan.

## Thứ tự triển khai đề xuất

1. Kiểm kê credential đã lộ, xoay và thu hồi chúng; cấu hình môi trường production cấm demo. Tránh làm đứt kết nối bằng cách cập nhật secret mới trước khi thu hồi secret cũ khi cơ chế cho phép.
2. Thu hẹp organizations/Data API, tách quyền runtime DB khỏi migration; kiểm thử lại các vai trò và quyền đối tượng.
3. Chốt mô hình phiên/cookie; áp dụng thời hạn phiên, kiểm tra thu hồi cho thao tác nhạy cảm, MFA admin và rate limit đăng nhập/reset.
4. Chuẩn hóa log/error, kiểm tra nội dung tệp, đồng bộ MIME và giới hạn body/quota.
5. Trước public deployment: HTTPS, Secure cookie, security headers, CORS allowlist đúng domain, backup/restore và alert.
6. Sau nền tảng: Cloudflare WAF/cache có kiểm soát; bổ sung PITR và cảnh báo nâng cao theo nhu cầu vận hành.

## Nguồn mã cần sửa khi triển khai

- [JWT và kiểm tra vai trò](D:/WebNhiLun/backend/app/core/security.py:34).
- [Cấu hình và CORS allowlist](D:/WebNhiLun/backend/app/core/config.py:7).
- [Xử lý lỗi và middleware API](D:/WebNhiLun/backend/app/main.py:30).
- [Kết nối DB và lỗi chưa cấu hình](D:/WebNhiLun/backend/app/core/database.py:14).
- [Rate demo login](D:/WebNhiLun/backend/app/api.py:318).
- [Audit IP/tên](D:/WebNhiLun/backend/app/api.py:57).
- [Upload avatar](D:/WebNhiLun/backend/app/api.py:238), [banner](D:/WebNhiLun/backend/app/api.py:1161), [giấy tờ tổ chức](D:/WebNhiLun/backend/app/api.py:1214), [ảnh Stories](D:/WebNhiLun/backend/app/api.py:1756).
- [Upload giấy tờ cá nhân](D:/WebNhiLun/backend/app/services/storage.py:10).
- [Schema server](D:/WebNhiLun/backend/app/schemas.py:26).
- [Cookie browser](D:/WebNhiLun/frontend/lib/supabase/client.ts:7), [cookie server](D:/WebNhiLun/frontend/lib/supabase/server.ts:4), [middleware frontend](D:/WebNhiLun/frontend/middleware.ts:4).
- [Bearer API client](D:/WebNhiLun/frontend/lib/api.ts:20), [Realtime client](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:6).
- [Cấu hình Next.js](D:/WebNhiLun/frontend/next.config.mjs:2).

## Tài liệu chính thức đối chiếu

- Supabase xác nhận lưu password bằng bcrypt: [Password security](https://supabase.com/docs/guides/auth/password-security).
- Phân biệt JWT, refresh và thời hạn toàn phiên: [User sessions](https://supabase.com/docs/guides/auth/sessions).
- Phạm vi giới hạn Auth và cấu hình: [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).
- Cookie SSR, SameSite/Secure, HttpOnly và cache response có phiên: [SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide).
- Giới hạn grants/schema và tắt exposure khi không cần: [Securing your API](https://supabase.com/docs/guides/api/securing-your-api).
- Phạm vi network restrictions: [Network restrictions](https://supabase.com/docs/guides/platform/network-restrictions).
- Database backup không gồm nội dung object Storage: [Database backups](https://supabase.com/docs/guides/platform/backups).
- Chứng chỉ và mã hóa edge–origin: [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

## Giới hạn kiểm tra

Không có bằng chứng quản trị trực tiếp về thời hạn phiên/rate-limit tùy chỉnh, network restrictions, backup/PITR, Cloudflare hoặc headers của production. Không chạy brute force, tạo file độc hại hoặc thử lỗi phá hoại. Test admin chỉ gồm ba API đọc đã nêu, không đại diện toàn bộ matrix quyền. Không rà toàn bộ lịch sử Git và log hạ tầng. Các phần chưa xác minh được đánh dấu như vậy, không coi là đã đạt hoặc chắc chắn chưa có.
