# 08 — Organizer Portal

## O01 — Tổng quan `/organizer`
Sidebar: Tổng quan, Hoạt động, Đơn đăng ký, Điểm danh, Báo cáo, Thành viên, Hồ sơ tổ chức. KPI: hoạt động đang mở, đơn chờ, chỉ tiêu còn lại, tỷ lệ điểm danh; danh sách cần xử lý; biểu đồ 6 tháng có filter theo sự kiện.

## O02 — Hồ sơ tổ chức
Tên pháp lý/tên hiển thị, giới thiệu, logo, kênh liên hệ, bằng chứng xác minh theo chính sách; trạng thái draft/pending/verified/rejected/suspended; không công bố tài liệu xác minh riêng tư. Chỉ owner chỉnh thông tin quan trọng.

## O03 — Tạo hoạt động `/organizer/activities/new`
Wizard 5 bước:
1. Cơ bản: tiêu đề (5–100 ký tự), lĩnh vực, tóm tắt, mô tả rich text an toàn, ảnh cover có bản quyền.
2. Lịch & địa điểm: ngày bắt đầu/kết thúc, timezone, địa điểm/tọa độ tùy chọn, điểm tập trung, hạn đăng ký, online/offline.
3. Tuyển người: chỉ tiêu, yêu cầu, ca tham gia, chính sách hủy, waitlist, phương thức duyệt.
4. Hướng dẫn: lịch trình, đồ chuẩn bị, thông tin an toàn, liên hệ điều phối.
5. Xem trước & gửi duyệt: hiển thị desktop/mobile preview, validation, xác nhận chính sách.
Autosave draft, cảnh báo khi rời trang, chỉ publish sau duyệt nếu bật moderation.

## O04 — Danh sách hoạt động
Tabs Nháp/Chờ duyệt/Đang tuyển/Đang diễn ra/Hoàn thành/Đã hủy; search, filter, clone draft, chỉnh sửa, đóng tuyển, hủy có lý do. Thay đổi lịch quan trọng gửi notification và ghi audit.

## O05 — Duyệt đơn
Desktop table: mã, tên, ngày đăng ký, trạng thái, câu trả lời cần thiết, thao tác; filter và bulk approve chỉ với quyền hợp lệ. Khi duyệt, server kiểm tra capacity bằng transaction/locking. Từ chối yêu cầu lý do có thể hiển thị cho ứng viên. Waitlist lên approved khi có chỗ theo chính sách minh bạch.

## O06 — Điểm danh
Danh sách người đã duyệt, check-in thủ công hoặc QR token ngắn hạn, chống điểm danh lặp; organizer có thể điều chỉnh với lý do và audit. Có chế độ xuất danh sách dự phòng, nhưng file chứa PII phải giới hạn quyền và thời hạn lưu. Sau sự kiện, xác nhận tham gia và số giờ thực tế.

## O07 — Báo cáo
KPI theo event, số đăng ký/duyệt/đến, số giờ xác nhận, breakdown theo tháng; CSV xuất có giới hạn trường dữ liệu, audit export; không công khai thông tin cá nhân.

## O08 — Thành viên tổ chức
Owner mời email, gán `owner/manager/checkin_staff/viewer`, thu hồi quyền; invitation hết hạn; không tự thêm người ngoài tổ chức bằng ID tùy ý.

## Trạng thái UI
Mỗi màn có skeleton, empty với CTA, error có retry, permission denied, success có liên kết kết quả; destructive action luôn có xác nhận.
