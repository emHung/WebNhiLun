# Tối ưu Realtime, API, ảnh, PDF và cấu trúc code

Ngày hoàn tất: 16/10/2026 (Asia/Saigon). Phạm vi: 6 mục người dùng chọn từ báo cáo 18. Báo cáo 18 giữ nguyên trạng thái khảo sát trước sửa.

## 1. Realtime chỉ cập nhật nhóm dữ liệu liên quan

- `frontend/lib/data-events.ts`: ánh xạ endpoint → entity. Thay đổi likes cập nhật Stories/lượt thích, notifications cập nhật danh sách và summary, theme cập nhật theme; không tải lại toàn bộ trang.
- `LiveDataSync`: gom các entity nhận được trong một đợt tín hiệu rồi phát CustomEvent có danh sách entity. Auth, reconnect và focus vẫn có full refresh để khôi phục dữ liệu có thể bỏ lỡ.
- `hooks/use-api-query.ts`: hook useLoad dùng chung, chỉ subscribe nhóm endpoint liên quan, loại phản hồi cũ bằng generation khi auth/invalidation đổi.
- `apiRequest`: gộp GET đang chạy cùng session/path/revision; không lưu cache kết quả riêng qua đổi tài khoản. Custom headers và AbortSignal không gộp. Khi dữ liệu thay đổi, revision mới ngăn tái dùng GET cũ còn đang chạy.
- `NotificationBell` và sidebar dùng chung `/notifications/summary`. Header bị ẩn ở workspace không gọi lại /auth/me. ThemeSync dùng hook thay vì nghe mọi sự kiện rồi tự fetch.

## 2. JWT/JWKS không chặn event loop

`backend/app/core/security.py` tách `_verified_subject` đồng bộ rồi gọi bằng `asyncio.to_thread`. Chữ ký, JWKS HTTP/cache vẫn được kiểm tra như trước; truy vấn profile/role vẫn qua asyncpg. Không chuyển quyền sang metadata client hoặc bỏ kiểm tra JWT để tăng tốc.

Kiểm tra mô phỏng một lần lấy khóa mất 200ms: coroutine heartbeat 20ms vẫn chạy sau khoảng 22ms. Đây là kiểm tra khả năng không chặn, không phải số đo độ trễ Auth thật ngoài Internet.

## 3. Hợp đồng API phân trang

Các response vẫn có envelope `{success,data,message,meta}`. Ba endpoint sau đổi `data` từ mảng sang object; toàn bộ consumer trong repo và script kiểm thử đã cập nhật.

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 12,
  "pages": 1
}
```

| Endpoint | Query | Giá trị bổ sung |
|---|---|---|
| GET /api/v1/notifications | page≥1; limit 1..100, mặc định 12; search≤200; unread=true/false hoặc bỏ qua | unread_total: toàn tài khoản, không phụ thuộc trang/bộ lọc |
| GET /api/v1/notifications/summary | Không phân trang | items tối đa 5, unread_total toàn tài khoản |
| GET /api/v1/stories | page≥1; limit 1..100, mặc định 6; search≤200; category, mặc định all | Không |
| GET /api/v1/organizer/applicants | page≥1; limit 1..100, mặc định 20; activity_id; status; search≤200 | stats.total/approved/checked_in của toàn tổ chức, độc lập với trang/bộ lọc |

- Lọc/tìm kiếm chạy ở SQL trước LIMIT/OFFSET; thứ tự có timestamp + id để xử lý ngày trùng.
- Count và danh sách chạy trong transaction repeatable-read chỉ đọc để cùng một snapshot.
- `services/pagination.py` gom response; `Pagination.tsx` dùng cho Activities, Notifications, Stories và Applicants, tự đưa về trang hợp lệ khi tổng dữ liệu giảm.
- Các route luôn giữ ownership/role. `/me/notifications?limit=...` cũ vẫn là preview giới hạn, nhưng UI hiện dùng summary.
- Thêm index Stories theo ngày/id và category/ngày/id; thêm index organization_id cho hoạt động. Migration `20261016102757_paginated_query_indexes.sql` đã áp dụng đúng project ứng dụng; không đổi grants/RLS.
- OFFSET phù hợp quy mô hiện tại; nếu dữ liệu rất lớn cần đo và xem xét cursor pagination. Chưa tuyên bố đã chịu tải production.

## 4. Tối ưu ảnh

- 11 JPEG gốc: **9.791.555 byte = 9,34 MiB**.
- Tổng bản WebP lớn nhất tương ứng: **1.381.778 byte = 1,32 MiB**, giảm **85,9%**.
- Có 55 biến thể ở 120/240/480/960/1600px (giới hạn theo kích thước ảnh nguồn). Con số 1,32 MiB là tổng bản lớn nhất của 11 ảnh, không phải tổng 55 biến thể hoặc kích thước repo. JPG gốc được giữ để tham chiếu.
- `MediaImage`: srcset/sizes, lazy mặc định, decoding async, width/height; hero trang chủ eager/high priority. Ảnh remote, blob upload và data URI QR được giữ đúng URL.
- `lib/media.ts` dùng Map tra metadata; HTML marketing từ DB được chuẩn hóa ảnh; CSS public dùng background WebP. Không đổi ảnh gốc hoặc DB sang dữ liệu demo hard-code.
- Generator `frontend/scripts/optimize-images.py` có dry-run, tạo manifest + tham chiếu CSS public; chạy lại đã kiểm tra cùng 55 SHA-256, JPEG tham chiếu vẫn khớp.

Chạy lại từ frontend:

```powershell
python scripts/optimize-images.py --dry-run
python scripts/optimize-images.py
npm run build
```

Đây là WebP nén mất dữ liệu ở quality 78; đã xem trên trình duyệt, không khẳng định giống từng pixel JPEG gốc. Giữ CSS/kích thước khung ảnh hiện tại.

## 5. Tái sử dụng PDF riêng tư

- `services/certificate_files.py`: hash người nhận, nội dung, mã, đơn vị cấp, giờ, ngày, URL xác minh và version template.
- Tệp lưu riêng tại `<user>/<code>/<hash>.pdf`. Nội dung không đổi → đọc lại Storage; không sinh/upload/update  DB lại.
- Cache HIT không giữ kết nối DB trong lúc đọc Storage và kiểm tra lại quyền/phiên bản sau khi đọc.
- Cache MISS dùng advisory lock transaction theo mã rồi khóa row, kiểm tra lại ownership/phiên bản; nhiều worker không sinh cùng tệp đồng thời.
- Tệp mất được tạo lại; xử lý đúng Storage trả HTTP 400 nhưng error/statusCode báo not_found/404. Lỗi quyền/kết nối không bị coi nhầm là cache miss.
- Chứng nhận bị thu hồi vẫn trả 404, không phục vụ tệp chỉ dựa trên đường dẫn cache. Response giữ `private, no-store` và có `X-PDF-Cache: HIT/MISS` để chẩn đoán.
- Khi sửa thiết kế/font policy của template, tăng version trong helper `artifact`. Không đổi bucket thành public. Tệp version cũ vẫn private; chưa thêm tác vụ xóa phiên bản cũ tự động.

## 6. Code chung và module boundary

- `lib/models.ts`: kiểu dữ liệu nghiệp vụ; `lib/api-types.ts`: kiểu response; `hooks/`: tải dữ liệu, debounce và summary.
- Component dùng chung: **Pagination, NotificationBell, MediaImage, Modal, StoryCard, VolunteerWorkspaceFrame**.
- `LegacyMarkup` memo giữ ổn định HTML chứa portal React: cập nhật query/like không xóa thẻ Stories khỏi DOM.
- PublicPages, VolunteerPages, OrganizerPages chỉ còn barrel re-export tương thích; mỗi trang có file riêng, route import trực tiếp để không kéo cả cụm trang vào client bundle.
- Editor text helper tách khỏi editor, nên Home/Activities không cần tải DOMPurify/editor. Dialog QR của organizer lazy-load khi mở.
- Đã format code và kiểm tra lint các helper Python thay đổi. Một trang vẫn có thể dài khi chứa nhiều trạng thái UI; không ép chia nhỏ cơ học chỉ để giảm số dòng.

## 7. Bằng chứng kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| Build Next.js + TypeScript | Thành công, 25 trang ở static generation |
| First Load JS trang chủ | khoảng 201 → 184 kB |
| First Load JS Notifications / Profile / Organizer Manage | khoảng 184 / 187 / 186 kB sau sửa |
| verify_system.py | 42/42, có kiểm tra byte PDF được tái sử dụng |
| verify_content.py | 12/12 |
| verify_optimizations.py | 14/14: phân trang, count, filter, quyền |
| Kiểm tra query mapping/dedupe/account separation | 9 điều kiện đạt bằng dữ liệu giả cục bộ |
| Kiểm tra JWKS thread | Heartbeat không bị block bởi giả lập 200ms |
| PDF cache helper | HIT không sinh lại; đổi nội dung tạo version mới; tệp mất sinh lại; thu hồi trả 404 |
| Image helper | URL legacy/WebP/remote/blob/QR hợp lệ |
| verify-realtime.mjs | Tín hiệu public/private đến đúng người |
| Generator ảnh | Chạy lặp cùng 55 file hash; ảnh gốc giữ nguyên |
| Lint helper Python | Ruff đạt |

Đã thử thực tế Thông báo trang 2: 6 dòng, tổng 18; Stories trang 2: 1 thẻ, tổng 7. Sau dọn dữ liệu tạm, Stories tự trở về trang 1 với 6 bản ghi. Trang quản lý organizer hiển thị 2 dòng và tổng đúng. QR có đủ 3 ảnh data URI tải thành công; không thấy ảnh lỗi ở các màn hình kiểm tra này.

Dữ liệu UI tạm được dọn theo ID chính xác; truy vấn sau dọn không còn activity/story/notification QA. Không đổi dữ liệu demo thật để làm đẹp số liệu.

Các số JS là số build, không phải thời gian tải hay điểm Lighthouse. Chưa đo Core Web Vitals, băng thông thực tế hoặc p95 dưới tải. Các công việc bảo mật còn lại của báo cáo 18 (xoay khóa, nâng dependency Python, hardening Data API/MFA/quota) không nằm trong 6 mục được chọn lần này.
