# 07 — Volunteer Portal: Kịch bản chi tiết

## Shell
Desktop sidebar 248px: Tổng quan, Đơn của tôi, Lịch, Lịch sử, Chứng nhận, Hồ sơ, Cài đặt; topbar search nhanh, chuông thông báo, avatar. Mobile bottom nav Khám phá/Đơn/Lịch/Tài khoản; subpage qua back header.

## V01 — `/me` Tổng quan
Header "Xin chào" + CTA khám phá; 3 KPI (hoạt động đã tham gia, giờ đã xác nhận, chứng nhận), hoạt động gần nhất, đơn cần chú ý, lịch sắp tới, gợi ý hoạt động dựa trên bộ lọc (không cần tracking nhạy cảm). Empty: "Bạn chưa đăng ký hoạt động nào" + CTA.

## V02 — `/me/applications` Đơn của tôi
Tabs Tất cả/Chờ duyệt/Đã duyệt/Danh sách chờ/Hoàn tất/Đã hủy. Desktop table: mã, hoạt động, ngày, trạng thái, cập nhật, thao tác. Mobile card. Click mở drawer chi tiết: timeline trạng thái, lý do từ chối, hướng dẫn, nút hủy khi còn hạn. Xác nhận hủy có mô tả hệ quả và dialog.

## V03 — `/me/calendar` Lịch
Desktop month/week/list, mobile agenda list; sự kiện đã duyệt là nổi bật, chờ duyệt phân biệt bằng chữ; timezone Asia/Ho_Chi_Minh mặc định theo ngữ cảnh triển khai, lưu UTC trong DB; có link thêm vào lịch cá nhân qua file ICS nếu hỗ trợ.

## V04 — `/me/history` Lịch sử
Danh sách hoạt động đã kết thúc, trạng thái điểm danh, giờ đã xác nhận, ghi chú nếu có tranh chấp; chỉ hiển thị số giờ được duyệt. Cho gửi yêu cầu xem xét khi có sai lệch.

## V05 — `/me/certificates` Chứng nhận
Grid chứng nhận có mã kiểm tra, tên hoạt động, đơn vị phát hành, ngày cấp, giờ xác nhận; PDF được cấp qua server với link có quyền, có trang kiểm tra công khai chỉ hiển thị dữ liệu tối thiểu khi có sự đồng ý/phù hợp chính sách.

## V06 — `/me/profile` Hồ sơ
Tên hiển thị, avatar tùy chọn, liên hệ, sở thích chủ đề, địa phương (tùy chọn), thông tin khẩn cấp theo từng sự kiện khi cần. Có cập nhật email qua xác minh. Mọi field ghi mục đích sử dụng.

## V07 — `/me/settings` Cài đặt
Thông báo email/in-app, bảo mật phiên, đổi mật khẩu, xuất dữ liệu, yêu cầu xóa tài khoản theo chính sách, tùy chọn accessibility nếu cần.

## V08 — Notifications
Các loại: nộp đơn, duyệt/từ chối, thay đổi lịch, nhắc trước sự kiện, điểm danh, chứng nhận; mỗi thông báo dẫn đúng trang và có trạng thái đọc/chưa đọc. Không tiết lộ dữ liệu riêng tư trong push preview.
