# Kết quả sửa và kiểm tra hệ thống

Ngày: 15/10/2026, Asia/Saigon. Tiếp nối báo cáo khảo sát số 16; báo cáo 16 giữ nguyên làm bằng chứng trước sửa.

## Phạm vi đã sửa

- Nâng Next.js từ 14.2.35 lên 15.5.28, cập nhật các API cookies/params bất đồng bộ, tách thư mục build phát triển và production; npm audit hiện 0 lỗ hổng được báo cáo.
- Middleware bảo vệ trang, kiểm tra vai trò bằng profile FastAPI, trả về đăng nhập/403 phù hợp; menu trên chuyển theo TNV/BTC/Admin. Sửa lỗi gọi backend bằng localhost/IPv6 và frontend trỏ cổng 8001 cũ. API_INTERNAL_URL hiện dùng 127.0.0.1:8000.
- Thêm callback đổi authorization code, màn hình đặt lại mật khẩu, tiếp tục onboarding tổ chức bằng metadata gợi ý; quyền thực tế vẫn do backend xác định. Tùy chọn ghi nhớ điều khiển thời hạn cookie.
- Profile, Dashboard TNV, Lịch, Chứng nhận, Thông báo và Yêu thích dùng VolunteerWorkspaceFrame chung. Khôi phục KPI, cấp bậc, giới thiệu, kỹ năng, tài liệu, hoạt động đã tham gia/sắp tới. Hồ sơ có nút sửa, đổi avatar, ngày sinh và mã tài khoản. Quan tâm legacy thiếu đã được nhập vào DB khi trường đang rỗng.
- Sửa CSS xung đột giữa các trang, chỉ nạp style theo route. Trên điện thoại menu theo hàng ngang như HTML; không còn khối menu 68px bị cắt. Chuẩn hóa đường dẫn ảnh legacy ở cả header và dashboard.
- Bộ lọc hoạt động nhận URL, lọc trạng thái/thời gian thực, phân trang; giữ page hợp lệ khi mở liên kết trực tiếp và tự chuyển về trang cuối nếu URL vượt số trang hiện có.
- Wizard có bản nháp DB, idempotency key, retry theo ID, upload trước gửi duyệt, giữ banner khi PUT không cung cấp lại ảnh. Có mô tả ngắn, nội dung định dạng và xem trước; lọc HTML trước render. Trường nhập đã sửa về đúng chiều rộng. Không nhắc tải xác minh lại với tổ chức đã được duyệt.
- Stories có API lưu nội dung/lượt thích, lượt thích lặp an toàn, modal/đọc thêm/video và lọc được nối lại; loại handler onclick legacy trong nội dung DB.
- Chứng nhận sinh PDF Unicode riêng, mã QR thật dẫn đến trang xác minh; PDF và tài liệu cá nhân được giữ trong bucket riêng. API kiểm tra chủ tài khoản trước khi trả file hoặc signed URL.
- Ngày đăng ký/hạn chót, ngày điểm danh, chống trùng và sức chứa được kiểm tra ở backend. Điểm danh/thu hồi đồng bộ chứng nhận và giờ trong transaction. Đơn hoàn thành không được TNV tự hủy.
- Trigger đối soát tổng giờ và số người; tách baseline lịch sử cùng đơn chứng nhận lịch sử để không biến chứng nhận cũ thành ca trực tương lai.
- Publication chỉ chứa change_events có RLS; không phát nội dung riêng tư của hồ sơ/đơn. Frontend gắn JWT trước khi join và tạo lại subscription khi đổi tài khoản. Có refresh khi mất kết nối.
- Thêm readiness DB và retry kết nối có giới hạn; bỏ route trùng; seed bootstrap tránh ghi đè database đang có hoạt động.

## Bằng chứng kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| Build production và TypeScript | Thành công, 25 trang được tạo ở bước static generation |
| npm audit | 0 lỗ hổng được báo cáo |
| API giao dịch thực tế | 41/41, chạy lại sau sửa |
| Stories và Storage riêng | 12/12 |
| Realtime độc lập | Public đến hai khách và chủ tài khoản; private chỉ đến chủ tài khoản |
| Realtime giao diện hai tab | Đổi thông báo và số chưa đọc xuất hiện ở Thông báo/Hồ sơ, không reload |
| HTTP route | 19 route canonical kiểm tra được; trang riêng chuyển đăng nhập với returnTo |
| DB sau dọn QA | 6 hoạt động, 4 đơn, 3 chứng nhận, 6 stories; không còn activity/story/notification QA |
| Ledger giờ và sức chứa | 0 bản ghi sai công thức đối soát |
| Bucket organization-docs/certificates/profile-docs | Đều private |

Bộ API kiểm tra đăng nhập ba vai trò, 403 trái quyền, null input 422, nháp/idempotency, giữ banner, duyệt công khai, nộp trùng, hai lượt duyệt cạnh tranh capacity=1, hai lượt điểm danh đồng thời, cộng giờ một lần, PDF ownership, thu hồi và trả giờ, hủy trả chỗ, hết hạn, hạn chót sau ngày diễn ra và điểm danh tương lai. Dữ liệu mỗi lượt được dọn trong finally, gồm tài khoản tạm và PDF do lượt chạy tạo.

Bộ nội dung kiểm tra đăng story, like/unlike, idempotency/count, upload PDF sinh riêng cho QA, mở signed URL đúng PDF và chặn người khác. Chỉ xóa đúng story/document/object do lượt chạy tạo.

## Đối chiếu giao diện thực tế

Đã xem trên trình duyệt: Auth, Profile, Schedule, Notifications, Certificates, Volunteer Dashboard, Organizer Manage/Create Event, Admin Moderation/Theme Settings, About và Stories. Hồ sơ/Lịch/Thông báo có cùng 12 đường dẫn menu và chỉ đổi mục được chọn. Đã kiểm tra ảnh lỗi trên các màn hình này và sửa ảnh dashboard/header. Kiểm tra điện thoại ở viewport 390×844: vùng nội dung rộng 375px sau trừ thanh cuộn, scrollWidth bằng clientWidth, không tràn ngang. Đã trực tiếp nhập nội dung và bấm in đậm trong editor; chưa lưu bản thử UI này.

Đây là đối chiếu bố cục và tương tác, chưa phải bộ so sánh ảnh tự động từng pixel cho toàn bộ 19 HTML ở mọi kích thước. Số liệu thực từ DB có thể khác số trang HTML hard-code; không tạo số liệu giả trên frontend để ép giống ảnh.

## Cách chạy lại

Từ backend:

```powershell
python scripts/verify_system.py
python scripts/verify_content.py
```

Từ frontend:

```powershell
node scripts/verify-realtime.mjs
npm run build
npm audit
```

Cần chạy backend cổng 8000 trước, cấu hình đúng cùng Supabase project, bật demo ở development. Không chạy nhiều bộ đăng nhập đồng thời vì có rate limit. Các script truy cập DB thật nhưng chỉ tạo/dọn dữ liệu kiểm thử có ID riêng; không dùng để stress production.

## Giới hạn nghiệm thu còn lại

- Chưa nghiệm thu gửi/nhận email xác nhận và email khôi phục bằng hộp thư thật; mã callback/reset đã có, redirect allowlist cần đúng domain triển khai.
- Chưa nghiệm thu camera QR trên thiết bị thật; nhập mã có sẵn, camera phụ thuộc BarcodeDetector và quyền trình duyệt.
- Chưa đo Lighthouse/Web Vitals, không kết luận về tốc độ chỉ từ build thành công.
- MCP Supabase ngoài workspace vẫn trỏ khác project. Thao tác sửa cấu hình toàn cục trước đó bị automatic approval review chặn với lý do blocked by policy. Các migration/kiểm tra ở đây dùng kết nối PostgreSQL backend đúng đích, không dùng MCP sai project.
- api.py và các trang lớn còn cần tách tiếp khi phát triển thêm; đợt này đã tách editor, frame, profile overview/documents, QR, Realtime và các service PDF/Storage.
