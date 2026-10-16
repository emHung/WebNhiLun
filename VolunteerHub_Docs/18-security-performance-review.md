# Rà soát bảo mật và tối ưu hệ thống

Ngày kiểm tra: 16/10/2026 (Asia/Saigon).
Phạm vi: mã frontend/backend, build production, dependency frontend và các package Python thực tế đang cài, metadata và quyền của đúng Supabase project ứng dụng. Truy vấn DB trong transaction read-only; một yêu cầu GET ẩn danh chỉ kiểm chứng quyền đọc trường tổ chức. Không đổi khóa, quyền, dữ liệu nghiệp vụ hoặc phiên bản ứng dụng trong lượt đánh giá này.

## Kết luận

Nền tảng phân quyền và dữ liệu đã có nhiều lớp bảo vệ, nhưng chưa nên coi là sẵn sàng production. Ưu tiên xử lý credential đã xuất hiện trong hội thoại, dependency Python thực tế, giới hạn dữ liệu công khai và cấu hình production trước khi tăng tài nguyên máy chủ.

## Kết quả đã xác minh lại

- Build Next.js 15.5.28 thành công, gồm TypeScript và tạo 25 trang ở static generation.
- npm audit: 0 cảnh báo tại thời điểm kiểm tra; đây không phải chứng nhận an toàn toàn hệ thống.
- Đúng DB project ứng dụng; tất cả 16 bảng public đang bật RLS.
- applications/audit_logs/certificates/profiles/profile_documents không có quyền SELECT cấp bảng cho anon. Profile không có quyền sửa role/verified_hours cho authenticated; chỉ có quyền UPDATE một số cột cá nhân. Không kết luận leo quyền từ policy UPDATE dựa trên id khi các cột nhạy cảm đã bị chặn bằng grants.
- organization-docs, profile-docs và certificates đều private; các bucket đều có giới hạn MIME/dung lượng.
- Trigger SECURITY DEFINER nội bộ nằm schema private, search_path rỗng, anon/authenticated không được EXECUTE.
- Runtime backend kết nối bằng postgres có BYPASSRLS; phân quyền ứng dụng do FastAPI thực thi.
- .env backend và .env.local frontend được Git ignore, không nằm danh sách tracked env hiện tại. Quét file nguồn không phát hiện sb_secret literal; chuỗi DB URI mẫu trong config.py là placeholder, không phải secret thật. Chưa quét toàn bộ lịch sử Git, artifact từ CI hoặc máy triển khai.

## 1. Việc cần làm trước production

### S01 — Luân chuyển credential từng xuất hiện trong hội thoại (khẩn cấp)

Secret Key và mật khẩu database thật đã được gửi trực tiếp trong lịch sử hội thoại. Cần tạo secret mới, cập nhật backend, đổi mật khẩu DB và thu hồi secret cũ. Không cần đổi publishable key chỉ vì frontend chứa key đó. Chưa xác nhận các credential cũ đã được thu hồi; lượt này không tự xoay khóa để tránh làm đứt các kết nối đang dùng.

Nguồn: nội dung người dùng đã cung cấp; backend/.env chỉ được đọc qua settings, không in giá trị. Supabase giải thích secret bypass RLS tại https://supabase.com/docs/guides/getting-started/api-keys .

### S02 — Dependency Python đang cài có cảnh báo (P1)

Kiểm tra hai cách cho kết quả khác nhau:

1. Resolve lại khoảng phiên bản trong requirements.txt chọn các phiên bản mới và không có cảnh báo.
2. Chốt đúng 32 dependency thực tế đang cài, rồi audit: 59 dòng cảnh báo, loại trùng theo package + advisory ID còn **38 mã riêng ở 5 package**.

Không được dùng kết quả (1) để khẳng định môi trường thực tế sạch lỗi.

| Package | Đang cài | Mã cảnh báo riêng | Mốc sửa cao nhất trong kết quả audit |
|---|---:|---:|---:|
| PyJWT | 2.13.0 | 14 | 2.15.0 |
| cryptography | 48.0.1 | 3 | 50.0.0 |
| Pillow | 11.3.0 | 18 | 12.3.0 |
| AnyIO | 4.13.0 | 2 | 4.14.2 |
| idna | 3.11 | 1 | 3.15 |

Đây là các mốc sửa do advisory trả về, không phải lockfile đã nghiệm thu tương thích. Cần nâng trong môi trường riêng, resolve đầy đủ, khóa cả transitive dependency/hashes và chạy lại kiểm thử auth, multipart, PDF và Storage.

Ví dụ đã đối chiếu nguồn chính thức: PyJWT 2.13.0 có lỗi RecursionError khi parse header JSON lồng sâu, bản sửa 2.14.0: https://github.com/jpadilla/pyjwt/security/advisories/GHSA-8wjv-2p76-3863 . Ứng dụng nhận token qua Authorization header, nên giới hạn header ở proxy/server có thể chặn payload đó; không khẳng định đã khai thác thành công qua HTTP. Các advisory về OKP/DPoP, PSD/FITS hay TLS domain quốc tế cần kiểm tra đường gọi tương ứng, không mặc định đều áp dụng.

Bằng chứng tổng hợp: 18-dependency-audit-summary.json. Bản đầy đủ và manifest dependency thực tế nằm backend/logs/security-installed-audit.json và backend/logs/audit-installed.txt (artifact cục bộ, không chứa credential).

### S03 — Data API công khai cả cột nội bộ tổ chức (P1)

public.organizations có GRANT SELECT toàn bảng cho anon/authenticated và policy cho tổ chức approved. GET Data API ẩn danh với publishable key trả HTTP 200 cho projection doc_url, doc_name, representative. Không ghi nội dung cá nhân vào báo cáo.

Đường dẫn object riêng không tương đương tải được tệp: bucket organization-docs vẫn private. Vấn đề xác nhận là lộ metadata và ranh giới dữ liệu công khai chưa tối thiểu.

Sửa: thu hồi SELECT toàn bảng cho anon; dùng projection công khai qua FastAPI hoặc view security_invoker với grants/cột phù hợp, đưa giấy tờ và thông tin nội bộ sang bảng/schema riêng. Không chỉ sửa endpoint frontend vì Data API đi thẳng tới DB.

Nguồn: supabase/migrations/202610140001_initial_schema.sql:188 và :237; grants/policies trực tiếp trên DB. Tham chiếu https://supabase.com/docs/guides/database/postgres/row-level-security .

### S04 — Khóa cấu hình demo và tăng bảo vệ Admin (P1, trước triển khai)

Cấu hình máy hiện tại: APP_ENV=development, DEMO_LOGIN_ENABLED=true. Endpoint có chặn khi app_env bằng production; đây là điểm bảo vệ đã có. Tuy nhiên cấu hình mặc định development và kiểm tra chuỗi production không ngăn được việc triển khai nhầm env hoặc dùng tên prod.

Cần fail-fast với enum môi trường, cấm demo trong cấu hình triển khai, tài khoản demo tách dữ liệu thật. Admin nên có MFA và kiểm tra AAL2 tại API nhạy cảm; hiện get_current_user chỉ kiểm tra JWT/profile/role, chưa có cổng MFA. Không khẳng định instance development này đang được mở công khai.

Nguồn: backend/app/api.py:199, backend/app/core/config.py, backend/app/core/security.py:29. MFA: https://supabase.com/docs/guides/auth/auth-mfa .

### S05 — Quota/rate limit và mã tra cứu công khai (P1/P2)

Rate limit ở mã ứng dụng mới có cho demo login, lưu trong bộ nhớ từng process. Chưa thấy quota theo user/IP cho share_story, upload, PDF và tra cứu chứng nhận. Redis chỉ cần khi chạy nhiều worker/instance; có thể bắt đầu bằng limit tại reverse proxy cùng quota user phía API.

Mã CERT-year-sequence dễ đoán; verify API trả tên người nhận và thông tin công nhận. public.verify_certificate(text) còn là RPC anon có thể gọi trực tiếp, nên chỉ rate-limit FastAPI sẽ không đủ. Cần thống nhất mức dữ liệu được công khai, mã tra cứu ngẫu nhiên khó đoán, thu hẹp/bỏ RPC nếu không cần, có giới hạn tại điểm truy cập thật. Đây là nguy cơ thu thập hàng loạt dữ liệu công khai, không phải đọc được PDF riêng.

Nguồn: backend/app/api.py:496, :828, :853; public.verify_certificate đã kiểm tra định nghĩa trong DB; migration gốc:276–284.

### S06 — Upload mới kiểm tra MIME là chưa đủ (P2)

upload_avatar, upload_activity_banner và upload_organization_document kiểm tra Content-Type/dung lượng nhưng chưa decode tệp xác minh định dạng. profile-docs có kiểm tra magic bytes, vẫn chưa đủ xác minh tệp hoàn chỉnh hoặc ảnh giải nén rất lớn.

Cần decode/re-encode ảnh bằng thư viện đã vá, giới hạn pixel, bỏ metadata, kiểm tra PDF và giới hạn tổng quota. Có thể thêm hàng đợi quét tệp nếu nhận giấy tờ từ nguồn không tin cậy. Không kết luận đã có RCE/XSS từ đường upload hiện tại; bucket cũng đã chặn MIME ngoài danh sách.

Nguồn: backend/app/api.py:147, :595, :631; backend/app/services/storage.py:10.

### S07 — Quyền DB runtime và header bảo vệ (P2)

Backend đang dùng postgres BYPASSRLS; một lỗi kiểm tra ownership ở API sẽ không được RLS chặn lại. Nên tách role migration và role runtime, cấp đúng bảng/operation hoặc dùng các function hẹp khi cần quyền đặc biệt. Chuyển đổi phải kiểm thử transaction/trigger và ownership, không chỉ đổi connection string.

Next config chưa khai báo CSP, frame-ancestors, nosniff hoặc referrer policy; FastAPI mới đặt X-Request-ID. Chưa kiểm tra CDN/reverse proxy triển khai, nên chưa thể kết luận response production thiếu header. Áp CSP report-only trước để tránh làm hỏng CSS inline, font CDN và video legacy; HSTS chỉ bật trên domain HTTPS.

Nguồn: frontend/next.config.mjs; backend/app/main.py:29; metadata role DB. CSP: https://nextjs.org/docs/app/guides/content-security-policy .

## 2. Tối ưu có bằng chứng

### P01 — Realtime làm mới quá rộng

LiveDataSync nhận mọi INSERT change_events rồi phát một event chung. Mọi useLoad đều tải lại, không phân biệt bảng/entity. PortalShell và VolunteerWorkspaceFrame còn gọi trùng profile/notifications ở một số màn hình dù header ngoài bị CSS ẩn. Một lượt like hoặc thay đổi profile có thể kéo theo tải lại hoạt động, chứng nhận, thông báo và theme không liên quan.

Nâng cấp: gửi entity vào invalidation, cache/dedupe theo query key và theo tài khoản, gộp nguồn profile/notifications, cập nhật đúng query liên quan; giữ RLS và kiểm thử hai tab. Không cache chung dữ liệu riêng giữa người dùng.

Nguồn: frontend/components/portal/LiveDataSync.tsx:18; shared.tsx:115, :154, :167; VolunteerWorkspaceFrame.tsx.

### P02 — JWT/JWKS có thể chặn event loop

get_current_user là async nhưng gọi PyJWKClient.get_signing_key_from_jwt đồng bộ. Khi cache miss/kid chưa biết, nó có thể mở HTTP với timeout 5 giây ngay trong event loop. Khả năng xảy ra được xác định từ mã; chưa đo tải thực tế. Token có kid lạ có thể tạo thêm refresh JWKS nên cần rate limit và giới hạn token/header.

Nâng cấp: cache JWKS với refresh có kiểm soát, đưa I/O đồng bộ sang worker thread hoặc dùng client async; prewarm, timeout và theo dõi số lần refresh. Không bỏ xác minh chữ ký để giảm độ trễ.

Nguồn: backend/app/core/security.py:25, :50. Bổ sung require exp/iss/aud/sub khi decode để reject token thiếu claim thay vì chỉ kiểm tra claim có sẵn.

### P03 — Danh sách chưa phân trang đầy đủ

/notifications, /stories, danh sách ứng viên BTC và một số danh sách riêng fetch toàn bộ. Stories dùng correlated count lượt thích cho mỗi story; có PK(story_id,user_id) hỗ trợ nhưng vẫn cần pagination và đo truy vấn khi lớn.

Nâng cấp: cursor pagination, SELECT đúng cột, unread count riêng, giới hạn export hoặc stream export. Tìm kiếm ilike %term% không được giải quyết chỉ bằng B-tree city/category; khi số liệu lớn hãy EXPLAIN trên dữ liệu đại diện rồi cân nhắc pg_trgm/FTS.

Nguồn: backend/app/api.py:383, :508, :847, :241. DB hiện chỉ 6 hoạt động, 4 đơn, 6 stories, 3 notifications; không dùng dữ liệu này để cam kết chịu tải.

### P04 — Dọn sự kiện ngay trong mỗi giao dịch

private.notify_change chạy DELETE sự kiện cũ sau mọi thay đổi nghiệp vụ. Cần chuyển retention sang job định kỳ theo batch; xem xét index created_at khi có số liệu lớn. EXPLAIN read-only hiện cho thấy PostgreSQL đã dùng index change_events_owner_time cho điều kiện ngày; không báo sai rằng truy vấn hiện chắc chắn quét toàn bảng hoặc đang chậm.

Nguồn: supabase/migrations/20261014201646_system_consistency.sql:44–62. Không chạy DELETE thực tế trong lượt audit.

### P05 — Ảnh và JavaScript có thể giảm

11 ảnh legacy tổng 9,34 MiB; ảnh lớn nhất khoảng 1.085 KiB. Nhiều img chưa có responsive srcset/lazy loading/kích thước rõ ràng. First Load JS theo build: phần lớn trang công khai khoảng 201 kB, organizer khoảng 209 kB; đây là số build, không phải thời gian tải.

Nâng cấp: tạo WebP/AVIF nhiều kích thước hoặc dùng next/image, lazy ảnh dưới màn hình, ưu tiên ảnh hero; tách ActivityEditor khỏi module PublicPages và lazy-load QR/editor/modal chỉ khi cần. Chỉ tối ưu ảnh bản Next/public theo quy trình tái tạo, giữ HTML gốc làm chuẩn.

Nguồn: thư mục frontend/public/legacy/images; build 16/10; PublicPages.tsx import ActivityEditor; hướng dẫn https://nextjs.org/docs/app/api-reference/components/image .

### P06 — PDF bị sinh và upload lại mỗi lần GET

download_certificate luôn tạo PDF rồi upsert Storage và update certificate. Nên tái dùng PDF đã sinh theo version/hash nội dung, trả signed URL có hạn sau kiểm tra quyền, invalidate khi thu hồi/chỉnh chứng nhận. Tránh cache public hoặc giữ link sống quá lâu sau thu hồi.

Nguồn: backend/app/api.py:828.

## 3. Lộ trình đề xuất

1. Khẩn cấp: rotate credential từng chia sẻ; cập nhật backend dependency trong môi trường riêng, khóa manifest và chạy lại kiểm thử.
2. Trước production: thu hẹp organizations Data API/RPC chứng nhận, khóa demo, MFA Admin, quota/rate limit, kiểm tra upload.
3. Tối ưu ứng dụng: invalidation theo entity + dedupe, I/O JWKS không chặn, pagination và cache public có TTL phù hợp.
4. Tối ưu tài nguyên: responsive images, chia bundle, PDF version cache; sau đó đo Lighthouse/Web Vitals và p95 API với dữ liệu đại diện.
5. Vận hành: kiểm thử restore backup/PITR theo gói Supabase đang có, cảnh báo lỗi/readiness, log không chứa token; CI dependency/secret scanning. Chưa xác minh quyền backup/PITR hoặc cấu hình Auth Dashboard nên không kết luận đã bật/tắt.

Chưa cần đổi stack hoặc nâng gói máy chủ dựa trên số liệu hiện tại. Không thể kết luận cần Redis, read replica hoặc sharding khi chưa đo tải và số lượng kết nối thực tế. Pool hiện max_size=10 mỗi process; nhân số worker khi tính ngân sách connection.

## Giới hạn

Không chạy tấn công tải, không gửi tệp độc hại, không brute-force chứng nhận, không đổi dữ liệu thật. Chưa đo Lighthouse/Web Vitals/p95 hoặc pentest triển khai HTTPS. Chưa kiểm tra cấu hình MFA/email/network restriction qua Management API. Kết quả là đánh giá mã + quyền DB sống + dependency và build, không phải bảo đảm hệ thống không còn lỗ hổng.
