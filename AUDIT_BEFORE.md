# BÁO CÁO RÀ SOÁT TRƯỚC TRIỂN KHAI (AUDIT_BEFORE.md)
**Dự án:** VolunteerHub — Nền Tảng Đăng Ký Hoạt Động Thiện Nguyện Toàn Quốc  
**Thời gian rà soát:** 12/10/2026  
**Mục tiêu:** Đối chiếu yêu cầu kỹ thuật & nghiệp vụ với mã nguồn thực tế hiện tại, xác định toàn bộ các khoảng trống (gaps), nút bấm thiếu chức năng, và lập lộ trình triển khai chuẩn xác.

---

## I. ĐỐI CHIẾU CÁC NGUYÊN TẮC KỸ THUẬT & YÊU CẦU CỐT LÕI

| Yêu cầu | Hiện trạng mã nguồn | Đánh giá | Giải pháp áp dụng |
| :--- | :--- | :--- | :--- |
| **1. Giữ nguyên HTML/CSS/JS thuần** | Dự án đang viết bằng HTML5, Vanilla CSS và JavaScript ES6. Không sử dụng thư viện/framework bên thứ ba (React, Vue, Tailwind,...). | **TUÂN THỦ** | Duy trì 100% cấu trúc thuần, tổ chức module qua script tag và global namespace objects. |
| **2. Giữ nguyên giao diện, animation, responsive & theme** | Đã có hệ thống CSS: `base.css`, `components.css`, `home.css`, `activities.css`, `organizer.css`, `profile.css`,... hỗ trợ responsive và biến màu `:root`. | **TUÂN THỦ** | Không đập đi xây lại CSS; chỉ bổ sung các class hỗ trợ modal/empty/loading nếu thiếu. |
| **3. Chuẩn hóa dữ liệu bằng JSON Seed + LocalStorage + Repository Layer** | Hiện tại mỗi trang đọc/ghi `localStorage` rời rạc với các key không thống nhất (`vh_user_apps`, `vh_applicants`, `vh_pending_events`, hardcoded HTML). | **CHƯA ĐẠT** | Xây dựng `shared/useRepository.js` làm tầng trung gian duy nhất, tích hợp auto-seed từ `data/activities.json` và cấu trúc ERD chuẩn. |
| **4. Không dùng alert/toast giả lập khi chưa cập nhật dữ liệu** | Rất nhiều nút bấm dùng `alert(...)` hoặc chỉ gọi `useToast.show(...)` mà không cập nhật state. | **CHƯA ĐẠT** | Thay thế toàn bộ `alert()` bằng Modal/Dialog UI thuần hoặc xử lý Clipboard/Print thật; bắt buộc mutation storage thành công mới toast. |
| **5. Hoàn thiện luồng nghiệp vụ khép kín** | Chưa có sự liên kết dữ liệu giữa các phân hệ: Organizer tạo sự kiện nhưng không truyền sang Admin duyệt; Admin duyệt nhưng không đẩy sang trang Listing công khai. | **CHƯA ĐẠT** | Kết nối Data Repository Layer xuyên suốt 3 vai trò: Organizer ➔ Admin ➔ Volunteer. |

---

## II. RÀ SOÁT CHI TIẾT TỪNG TRANG & CÁC NÚT BẤM (BUTTON AUDIT)

### 1. Trang Chủ (`index.html`)
- **Nút Yêu thích trên thẻ hoạt động (`.act-thumb-heart-btn`):**
  - *Hiện trạng:* Thẻ `<button>` tĩnh, không có handler click.
  - *Yêu cầu:* Toggle trạng thái yêu thích, lưu vào `useRepository.toggleFavorite(activityId)`, cập nhật icon tim đỏ/trắng, đồng bộ với Dashboard.
- **Form Lọc Nhanh Hero (`.quick-filter-form`):**
  - *Hiện trạng:* `onsubmit` chỉ redirect `window.location.href='activities.html'` mà không truyền tham số danh mục, tỉnh thành hay thời gian.
  - *Yêu cầu:* Đọc giá trị `#homeCatSelect`, `#homeCitySelect`, chuyển hướng với query parameters `activities.html?category=...&city=...`.
- **Nút "Xem video giới thiệu" (`.btn-hero-video` & `.story-play-btn`):**
  - *Hiện trạng:* Gọi `alert('Đang phát video phóng sự...')`.
  - *Yêu cầu:* Mở Video Modal thuần với player video hoặc nhúng nội dung truyền cảm hứng.
- **Liên kết Cảm nhận TNV ("Xem tất cả"):**
  - *Hiện trạng:* `href="javascript:void(0)"`.
  - *Yêu cầu:* Điều hướng đến `stories.html`.
- **Footer Links ("Chính sách bảo mật" & "Quy tắc cộng đồng"):**
  - *Hiện trạng:* Trỏ tới `privacy.html` và `terms.html` (2 file này chưa tồn tại trong repo -> 404).
  - *Yêu cầu:* Tạo file `privacy.html` và `terms.html` chuẩn UX.

### 2. Danh Sách Hoạt Động (`activities.html`)
- **Nút Chuyển Chế Độ Xem Lưới / Danh Sách (`.act-view-btn`):**
  - *Hiện trạng:* 2 nút tĩnh `⊞` và `≡`, không có sự kiện click.
  - *Yêu cầu:* Gắn sự kiện chuyển layout grid/list cho container thẻ.
- **Dropdown Sắp Xếp & Số Lượng:**
  - *Hiện trạng:* Có select nhưng hàm `applyFilters()` chưa cài đặt logic sort và limit.
  - *Yêu cầu:* Cài đặt sắp xếp theo Ngày mới nhất, Sắp diễn ra, Tiến độ nhận đơn; số lượng 10/20 card.
- **Bộ Lọc Thời Gian (Radio 7 ngày, 30 ngày, 3 tháng):**
  - *Hiện trạng:* Có radio nhưng logic lọc trong JS bỏ qua radio này.
  - *Yêu cầu:* Tính toán khoảng cách ngày để lọc chính xác.
- **Phân Trang (`.act-pagination`):**
  - *Hiện trạng:* Các nút `<, 1, 2, 3, >` là thẻ tĩnh không có sự kiện.
  - *Yêu cầu:* Cài đặt logic phân trang động khi danh sách hoạt động nhiều hơn số lượng mỗi trang.
- **Khả năng đọc URL Search Params:**
  - *Hiện trạng:* Không đọc `URLSearchParams` khi load trang, làm gãy trải nghiệm click từ trang chủ sang.
  - *Yêu cầu:* Tự động điền giá trị lọc và kích hoạt tìm kiếm khi có `?category=...`, `?city=...`, `?q=...`.
- **Độ Động Dữ Liệu:**
  - *Hiện trạng:* 5 thẻ bài viết được code cứng trực tiếp trong HTML.
  - *Yêu cầu:* Render động từ Repository (kết hợp các hoạt động đã được Admin công bố).

### 3. Chi Tiết Hoạt Động (`detail.html`)
- **Nội Dung Động:**
  - *Hiện trạng:* Dữ liệu bị fix cứng "Khám bệnh & cấp phát túi thuốc", không đọc `?id=ACT-xxx`.
  - *Yêu cầu:* Đọc `?id=...` hoặc `?slug=...` để nạp dữ liệu từ Repository; hiển thị trạng thái động (Đang mở, Sắp diễn ra, Đã đóng).
- **Thanh Tabs Nội Dung (Lịch trình, Địa điểm, Yêu cầu, BTC, Hình ảnh, Đánh giá):**
  - *Hiện trạng:* Hàm `switchDetailTab()` chỉ bắn Toast mà không đổi nội dung. Các mục BTC, Hình ảnh, Đánh giá không có UI.
  - *Yêu cầu:* Tạo tab panels đầy đủ tương ứng với từng tab.
- **Nút "+12 hình ảnh" (`.gallery-more-badge`):**
  - *Hiện trạng:* Gọi `alert(...)`.
  - *Yêu cầu:* Mở Modal Xem Bộ Sưu Tập Ảnh (Image Gallery Modal).
- **Nút "Lưu hoạt động":**
  - *Hiện trạng:* Chỉ hiện Toast mà không lưu vào `localStorage`.
  - *Yêu cầu:* Gắn vào `useRepository.toggleFavorite(id)` và đổi icon/text thành "Đã lưu".
- **Nút "Chia sẻ":**
  - *Hiện trạng:* Gọi `alert(...)`.
  - *Yêu cầu:* Sao chép URL thực vào Clipboard qua `navigator.clipboard.writeText()` và hiển thị Toast.
- **Nút "Đăng ký tham gia ngay":**
  - *Hiện trạng:* Trỏ cứng `volunteer/apply.html?actId=ACT-005` (trong khi `apply.html` đọc param `id=1`).
  - *Yêu cầu:* Đồng bộ tham số `volunteer/apply.html?id=${currentAct.id}`.

### 4. Đăng Ký Hoạt Động (`volunteer/apply.html`)
- **Đọc Tham Số Sự Kiện:**
  - *Hiện trạng:* Đọc `params.get('id')` nhưng fallback cứng về 1 khi không tìm thấy.
  - *Yêu cầu:* Đọc cả `id` hoặc `actId`, kiểm tra hoạt động có tồn tại không trong Repository.
- **Kiểm Tra Điều Kiện Nộp Đơn (Preflight & Capacity Check):**
  - *Hiện trạng:* Chưa kiểm tra hoạt động đã hết chỗ hay chưa; chưa kiểm tra người dùng đã nộp đơn trước đó hay chưa.
  - *Yêu cầu:* Nếu `applied >= capacity` hoặc đơn đã tồn tại, hiển thị cảnh báo và khóa nút nộp đơn.
- **Lưu Đơn Đăng Ký:**
  - *Hiện trạng:* Lưu vào `vh_user_apps` riêng rẽ, không tạo bản ghi liên kết cho Ban tổ chức xem xét.
  - *Yêu cầu:* Lưu qua `useRepository.submitApplication()`, tạo bản ghi cho Volunteer và xuất hiện ngay trong danh sách xét duyệt của Organizer.
- **Thông Báo Kèm Theo:**
  - *Yêu cầu:* Tự động tạo notification cho Volunteer và Organizer.

### 5. Quản Lý Đơn Tình Nguyện Viên (`volunteer/dashboard.html`)
- **Đồng Bộ Dữ Liệu Đơn Đăng Ký:**
  - *Hiện trạng:* Đọc từ key riêng `vh_user_apps` với mock data cũ.
  - *Yêu cầu:* Đồng bộ với Repository theo ID tài khoản đang đăng nhập.
- **Nút "Hủy đơn":**
  - *Hiện trạng:* Có confirm nhưng chỉ xóa mảng local, không hoàn lại số lượng đã đăng ký (`applied`) của hoạt động.
  - *Yêu cầu:* Cập nhật trạng thái đơn thành `cancelled` và giảm `applied` nếu đơn từng được duyệt.
- **Nút "📜 Chứng nhận":**
  - *Hiện trạng:* Gọi `alert(...)` thô sơ.
  - *Yêu cầu:* Mở Modal Giấy Chứng Nhận Điện Tử có mã QR, có nút in hoặc chuyển sang trang `certificates.html`.

### 6. Hồ Sơ Cá Nhân (`profile.html`)
- 🔴 **Lỗi Crash Runtime Console:**
  - *Hiện trạng:* Dòng 296 gọi `onclick="openSkillModal()"` nhưng hàm này không tồn tại trong script.
  - *Yêu cầu:* Định nghĩa hàm mở Modal thêm/sửa kỹ năng hoặc chuyển sang tab Kỹ năng (`switchProfileTab('skills')`).
- **Nút "Quản lý tài liệu" & "Tải PDF":**
  - *Hiện trạng:* Đang dùng `alert(...)`.
  - *Yêu cầu:* Cài đặt modal tải tài liệu và hàm in chứng chỉ.
- **Lưu Cài Đặt Quyền Riêng Tư & Đổi Mật Khẩu:**
  - *Hiện trạng:* Checkbox không lưu; đổi mật khẩu không validate hay update dữ liệu tài khoản.
  - *Yêu cầu:* Lưu thông tin cài đặt vào Repository.

### 7. Lịch Hoạt Động (`schedule.html`)
- **Điều Hướng Tháng (Tháng trước / Tháng sau):**
  - *Hiện trạng:* Nút chỉ gọi Toast thông báo chữ, lịch bên dưới là HTML cứng không đổi ngày.
  - *Yêu cầu:* Tạo logic render lịch động theo Tháng/Năm, tự động đánh dấu các ngày có hoạt động của tình nguyện viên.
- **Click Ô Ngày Lịch:**
  - *Hiện trạng:* Không có sự kiện click.
  - *Yêu cầu:* Click vào ngày sẽ lọc hoặc hiển thị ca trực tương ứng trong ngày đó.

### 8. Chứng Nhận Điện Tử (`certificates.html`)
- **Nút "Tải bản in PDF":**
  - *Hiện trạng:* Chỉ Toast giả lập.
  - *Yêu cầu:* Sử dụng `window.print()` với CSS `@media print` chuyên biệt chuẩn A4 để in/xuất PDF thật.
- **Nút "Sao chép link":**
  - *Hiện trạng:* Dùng `alert(...)`.
  - *Yêu cầu:* Dùng `navigator.clipboard.writeText()` sao chép link tra cứu thật.

### 9. Ban Tổ Chức Tạo Hoạt Động (`organizer/create-event.html`)
- **Lưu Bản Nháp & Gửi Duyệt:**
  - *Hiện trạng:* Đang lưu vào `vh_pending_events`. Chưa có liên kết để Admin duyệt xuất bản sang danh sách công khai.
  - *Yêu cầu:* Tích hợp vào Repository, trạng thái `pending_approval`, tạo thông báo tới Admin và ghi Audit Log.
- **Xem Trước & Tải Ảnh:**
  - *Hiện trạng:* Đã có kéo thả và preview ảnh, cần giữ nguyên tính năng tốt này.

### 10. Ban Tổ Chức Quản Lý & Điểm Danh (`organizer/manage.html`)
- **Duyệt Đơn & Từ Chối Đơn:**
  - *Hiện trạng:* Nút Từ chối dùng `prompt(...)` trình duyệt thô sơ.
  - *Yêu cầu:* Dùng Modal Nhập Lý Do Từ Chối; khi duyệt hoặc từ chối phải cập nhật trạng thái đơn, gửi thông báo đến TNV.
- **Điểm Danh Tại Sự Kiện:**
  - *Hiện trạng:* Nút toggle check-in thay đổi cờ trạng thái nhưng chưa tự động cấp chứng nhận hay cộng giờ vào Profile TNV.
  - *Yêu cầu:* Khi Điểm Danh thành công ➔ Tự động sinh `certificate` (mã duy nhất) + cộng số giờ `verifiedHours` vào hồ sơ TNV.

### 11. Quản Trị Hệ Thống & Kiểm Duyệt (`admin/moderation.html`)
- **Các Nút Thao Tác Bảng Kiểm Duyệt:**
  - *Hiện trạng:* Nhiều nút "Từ chối", "Xem chi tiết", "Công bố" hoàn toàn không có thuộc tính `onclick`.
  - *Yêu cầu:* Gắn đầy đủ sự kiện:
    - Duyệt tổ chức ➔ Cấp tích xanh xác thực.
    - Công bố hoạt động ➔ Đổi trạng thái sự kiện thành `published` / `Đang tuyển`, lập tức hiển thị trên trang chủ và danh sách hoạt động.
    - Từ chối hoạt động ➔ Modal nhập lý do từ chối.
    - Xem chi tiết ➔ Modal hiển thị toàn bộ hồ sơ sự kiện/tổ chức.
- **Các Bộ Lọc Bảng:**
  - *Hiện trạng:* Ô tìm kiếm và select trạng thái/lĩnh vực là thẻ tĩnh.
  - *Yêu cầu:* Gắn sự kiện `input` và `change` lọc dữ liệu bảng theo thời gian thực.
- **Audit Logs:**
  - *Hiện trạng:* Bảng log tĩnh.
  - *Yêu cầu:* Đọc dữ liệu từ `useRepository.getAuditLogs()` được sinh ra từ các thao tác trước đó.

### 12. Quản Lý Theme (`admin/theme-settings.html`)
- *Hiện trạng:* Logic CRUD theme trong `admin/admin.js` và `useTheme.js` hoạt động tốt.
- *Yêu cầu:* Giữ nguyên toàn bộ cơ chế, đảm bảo tất cả các trang đều gọi `useTheme.init()` đúng cách.

### 13. Câu Chuyện Cộng Đồng (`stories.html`)
- *Hiện trạng:* Chưa gọi `useTheme.init()`; các nút xem video và liên kết sidebar là `href="#"`.
- *Yêu cầu:* Gọi `useTheme.init()`, kết nối modal video và lưu trạng thái like/share.

### 14. Giới Thiệu (`about.html`)
- *Hiện trạng:* Tên thương hiệu vẫn còn sót chữ "NhiLun"; nút video mang `href="#"`.
- *Yêu cầu:* Đổi đồng bộ thương hiệu sang "VolunteerHub", hoàn thiện modal video.

### 15. Trung Tâm Thông Báo (`notifications.html`)
- *Hiện trạng:* Nút "Đánh dấu tất cả đã đọc" chỉ bắn Toast mà không gọi `useNotification.markAllRead()` và không xóa class unread trên giao diện.
- *Yêu cầu:* Gọi hàm `useNotification.markAllRead()`, cập nhật DOM xóa badge và class unread.

---

## III. KẾ HOẠCH TRIỂN KHAI THEO PHASES (P0 ➔ P5)

- **Phase P0: Kiến Trúc Nền Tảng, Repository Layer & Khắc Phục Lỗi Hệ Thống**
  - Xây dựng `shared/useRepository.js` chuẩn hóa toàn bộ thực thể: Users, Organizations, Activities, Applications, Attendance, Certificates, Notifications, AuditLogs, Favorites.
  - Tạo `data/seedData.js` với dữ liệu phong phú, nhất quán, hỗ trợ auto-seed khi localStorage trống.
  - Tạo các trang bị thiếu: `privacy.html`, `terms.html`.
  - Sửa lỗi runtime `openSkillModal()` ở `profile.html`.
  - Đổi thương hiệu "NhiLun" thành "VolunteerHub" trên `about.html` và `shared/useAuth.js`.
  - Kiểm thử P0: Unit test kiểm tra Repository Layer nạp và khởi tạo dữ liệu thành công.

- **Phase P1: Hoàn Thiện Trang Công Khai & Khám Phá Hoạt Động (Public Pages)**
  - Hoàn thiện `index.html`: Bộ lọc nhanh Hero dẫn sang `activities.html`, Thả tim lưu yêu thích, Modal xem video.
  - Hoàn thiện `activities.html`: Đọc search params từ URL, nạp dữ liệu động từ Repository, lọc đa tiêu chí (Lĩnh vực, Địa điểm, Thời gian, Trạng thái), sắp xếp, chuyển chế độ Lưới/Danh sách, phân trang.
  - Hoàn thiện `detail.html`: Nạp dữ liệu động theo `?id=...`, chuyển tab nội dung thực tế, Gallery Modal, Chia sẻ link clipboard, Thả tim, Nút đăng ký chuyển đúng `volunteer/apply.html?id=...`.
  - Hoàn thiện `about.html`, `stories.html`.
  - Kiểm thử P1: Lọc hoạt động từ trang chủ sang danh sách, mở chi tiết hoạt động động theo ID.

- **Phase P2: Hoàn Thiện Phân Hệ Tình Nguyện Viên (Volunteer Portal)**
  - Hoàn thiện `volunteer/apply.html`: Wizard 4 bước, kiểm tra sức chứa (capacity lock), chống nộp trùng, tạo đơn vào Repository, thông báo real-time.
  - Hoàn thiện `volunteer/dashboard.html`: Quản lý đơn nộp, hủy đơn hoàn chỉ tiêu, Modal xem chứng nhận điện tử.
  - Hoàn thiện `profile.html`: Sửa nút kỹ năng, lưu thông tin hồ sơ, avatar, tài liệu, đổi mật khẩu.
  - Hoàn thiện `schedule.html`: Lịch tháng động, chuyển tháng thật, click ngày xem ca trực.
  - Hoàn thiện `certificates.html`: In PDF chuẩn khổ A4 bằng `window.print()`, sao chép link xác thực.
  - Hoàn thiện `notifications.html`: Đánh dấu đọc tất cả cập nhật thật vào Storage và DOM.
  - Kiểm thử P2: Luồng TNV nộp đơn ➔ Đơn xuất hiện trong dashboard ➔ Hủy đơn ➔ Xem chứng nhận.

- **Phase P3: Hoàn Thiện Phân Hệ Ban Tổ Chức (Organizer Portal)**
  - Hoàn thiện `organizer/create-event.html`: Wizard 5 bước tạo hoạt động, lưu nháp hoặc gửi Admin kiểm duyệt, tạo notification & audit log.
  - Hoàn thiện `organizer/manage.html`: Hiển thị danh sách ứng viên từ Repository, Modal từ chối có lý do, Duyệt đơn tăng chỉ tiêu và thông báo TNV.
  - Tích hợp Điểm Danh (Check-in): Quét mã QR/Xác nhận thủ công ➔ tự động cấp `certificate` và cộng giờ cống hiến cho TNV.
  - Kiểm thử P3: BTC tạo sự kiện ➔ kiểm tra trạng thái chờ duyệt ➔ duyệt ứng viên ➔ điểm danh.

- **Phase P4: Hoàn Thiện Phân Hệ Quản Trị & Kiểm Duyệt (Admin Portal)**
  - Hoàn thiện `admin/moderation.html`: Nạp hàng đợi tổ chức và sự kiện từ Repository, duyệt tổ chức cấp tích xanh, duyệt công bố sự kiện để xuất hiện ngay trên trang Listing, từ chối kèm lý do, modal xem chi tiết.
  - Hiển thị bảng Audit Logs động từ Repository.
  - Đảm bảo `admin/theme-settings.html` áp dụng theme toàn hệ thống.
  - Kiểm thử P4: Admin duyệt hoạt động mới từ P3 ➔ hoạt động xuất hiện ngay trên `activities.html`.

- **Phase P5: Kiểm Thử Toàn Diện Chu Trình Nghiệp Vụ Khép Kín (E2E Integration & Verification)**
  - Chạy kịch bản xuyên suốt:
    1. BTC tạo hoạt động "Chiến dịch Tết Ấm Áp 2026".
    2. Admin vào Moderation thấy hoạt động ➔ bấm "Công bố".
    3. Hoạt động lập tức xuất hiện tại `activities.html` và `index.html`.
    4. TNV tìm kiếm hoạt động ➔ xem chi tiết ➔ nộp đơn đăng ký.
    5. BTC vào Manage thấy đơn ➔ duyệt đơn TNV.
    6. BTC thực hiện Điểm danh cho TNV tại sự kiện.
    7. TNV nhận được Chứng nhận điện tử và số giờ được ghi nhận vào Profile & Certificates.
  - Xuất báo cáo nghiệm thu `AUDIT_AFTER.md`.
