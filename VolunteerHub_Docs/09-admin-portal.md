# 09 — System Admin & Moderation

## A01 — `/admin` Dashboard
KPI: user active, tổ chức chờ xác minh, hoạt động chờ duyệt, báo cáo mới, lỗi xử lý; biểu đồ theo thời gian; danh sách ưu tiên. Không trộn số đơn đăng ký với số người tham gia thực tế.

## A02 — `/admin/organizations`
Bảng tổ chức: tên, ngày tạo, trạng thái, tài liệu kiểm chứng (private), người phụ trách, quyết định. Workflow: mở hồ sơ → checklist xác minh → approve/reject/request-more-info → lưu lý do và người duyệt. Có chống tự duyệt nếu chính sách yêu cầu phân tách nhiệm vụ.

## A03 — `/admin/activities`
Queue kiểm duyệt: nội dung, lịch, địa điểm, yêu cầu, tổ chức, ảnh; flag nội dung rủi ro; quyết định duyệt/từ chối/yêu cầu sửa. Sau publish, thay đổi quan trọng có thể yêu cầu duyệt lại.

## A04 — `/admin/users`
Search theo định danh tối thiểu, xem vai trò, trạng thái, thời điểm tạo, khóa/mở khóa với lý do; thay đổi role qua hành động đặc quyền, xác thực lại khi cần; không cho admin đọc mật khẩu.

## A05 — `/admin/reports`
Danh sách báo cáo về nội dung/tổ chức/hành vi; phân loại, ưu tiên, người xử lý, lịch sử, kết quả; báo cáo lạm dụng cần cơ chế bảo mật và chống trả đũa.

## A06 — `/admin/audit`
Bộ lọc actor, action, entity, thời gian, request ID; append-only log, giới hạn truy cập, thời hạn lưu; export chỉ khi được phép. Ghi các hành động duyệt, từ chối, thay đổi quyền, điểm danh sửa, xuất dữ liệu.

## A07 — `/admin/settings`
Danh mục chủ đề, template thông báo, chính sách đăng ký, giới hạn file, thời hạn lưu dữ liệu, feature flags; mọi thay đổi cấu hình nhạy cảm có audit và rollback plan.

**Quản lý Bảng màu & Giao diện (Theme Management):**
- Bảng chọn nhanh Theme áp dụng toàn trang (preview tức thì qua CSS Variables).
- Thao tác CRUD bảng màu: Thêm chủ đề mới (Color Pickers cho màu chính, màu CTA, màu nền thẻ), Chỉnh sửa mã HEX, Xóa bảng màu tùy biến (không cho phép xóa Theme mặc định).
- Cơ chế lưu trữ: Hỗ trợ `localStorage` (chạy độc lập trên Frontend) hoặc đồng bộ qua file `themes.json` / REST API.

## Layout
Desktop sidebar 248px + topbar + content max linh hoạt 1440px; bảng có cột cố định cho hành động, bulk actions có đếm số dòng. Mobile ưu tiên xem/duyệt đơn lẻ, bảng phức tạp chuyển card; không giả định admin chỉ dùng desktop.

## Permission matrix
| Action | Moderator | System Admin |
|---|---|---|
| Duyệt tổ chức | Theo quyền cấp | Có |
| Duyệt hoạt động | Theo quyền cấp | Có |
| Xử lý report | Theo quyền cấp | Có |
| Thay đổi role admin | Không | Có + xác minh tăng cường |
| Xem audit | Giới hạn | Có |
| Cấu hình hệ thống | Không | Có |
