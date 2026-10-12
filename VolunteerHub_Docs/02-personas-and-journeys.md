# 02 — Persona, Jobs-to-be-Done & User Journey

## Persona A — Sinh viên tình nguyện
Mục tiêu: tìm sự kiện phù hợp lịch học, đăng ký nhanh, biết cần chuẩn bị gì, có xác nhận tham gia. Trở ngại: thông tin mơ hồ, form dài, không rõ đã được duyệt hay chưa. Thiết bị chính: điện thoại.

## Persona B — Người đi làm
Mục tiêu: tìm hoạt động cuối tuần gần nơi sinh sống, lọc theo thời gian và kỹ năng. Trở ngại: lịch trình khó theo dõi, khó đổi lịch.

## Persona C — Điều phối viên
Mục tiêu: đăng sự kiện, quản lý chỉ tiêu, duyệt danh sách, xuất dữ liệu, điểm danh. Trở ngại: bảng tính thủ công, dữ liệu trùng, thiếu lịch sử thay đổi.

## Persona D — Moderator
Mục tiêu: kiểm soát độ tin cậy của tổ chức, kiểm duyệt nội dung và giải quyết báo cáo. Trở ngại: thiếu bằng chứng, thiếu audit.

## Journey tình nguyện viên
| Giai đoạn | Nhu cầu | Touchpoint | UI đáp ứng | Chỉ số |
|---|---|---|---|---|
| Discover | Tìm cơ hội | Home/Search | Tìm kiếm, lọc, thẻ hoạt động | CTR |
| Evaluate | Kiểm tra phù hợp | Detail | Lịch, yêu cầu, số chỗ, organizer | Detail-to-start |
| Apply | Đăng ký nhanh | Form | Điền sẵn, validation, tiến trình | Completion rate |
| Wait | Biết trạng thái | Dashboard/Email | Trạng thái, thời gian, lý do | Response time |
| Attend | Đến đúng nơi | Schedule | Nhắc lịch, bản đồ, hướng dẫn | Show-up rate |
| Reflect | Ghi nhận đóng góp | History | Giờ xác nhận, chứng nhận | Verified hours |

## User stories ưu tiên
- Là khách, tôi muốn lọc theo ngày, địa điểm, chủ đề để tìm hoạt động phù hợp.
- Là tình nguyện viên, tôi muốn biết đơn của tôi đang ở trạng thái nào.
- Là người đăng ký, tôi muốn hủy trong hạn và hiểu hậu quả của việc hủy.
- Là organizer, tôi muốn duyệt nhiều đơn theo tiêu chí công khai và giới hạn chỗ.
- Là moderator, tôi muốn xem lịch sử thay đổi và bằng chứng khi xử lý báo cáo.

## Nguyên tắc UX
Minh bạch trước khi đăng ký; tối thiểu hóa thông tin cần thu; không tạo cảm giác tội lỗi khi người dùng không thể tham gia; không hiển thị số giờ chưa xác minh như thành tích chính thức.
