# 05 — Public Pages: Kịch bản màn hình chi tiết

## P01 — Trang chủ `/`
**Mục tiêu:** chuyển từ nhận biết → khám phá hoạt động; KPI: click khám phá, CTR card, conversion đăng ký.

**Desktop (trên xuống):**
1. Utility/skip link + header cao 72px: logo, Hoạt động, Giới thiệu, FAQ, Đăng nhập, CTA "Tham gia".
2. Hero 2 cột (55/45) trong container 1200px, padding 80px: eyebrow "Cộng đồng thiện nguyện", H1 "Kết nối trái tim, lan tỏa hành động", mô tả 2 dòng, CTA chính "Khám phá hoạt động", CTA phụ "Cách tham gia"; ảnh thực tế có quyền sử dụng, góc bo 20px.
3. Quick-search: từ khóa, địa điểm, lĩnh vực, ngày, nút Tìm kiếm.
4. Trust stats: 3–4 ô, chỉ hiển thị số liệu được xác minh và chú thích thời điểm cập nhật.
5. Hoạt động nổi bật: heading + xem tất cả; grid 3 card, mỗi card ảnh 16:10, tag, ngày, địa điểm, chỉ tiêu, CTA chi tiết.
6. Danh mục hoạt động: môi trường, giáo dục, cộng đồng, sức khỏe cộng đồng, hỗ trợ thiên tai (theo chính sách).
7. Quy trình 3 bước: Tìm → Đăng ký → Tham gia.
8. Câu chuyện cộng đồng: 1 ảnh + quote có sự đồng ý của người được giới thiệu.
9. CTA cho tổ chức: "Đăng ký tổ chức".
10. Footer 4 cột: nền tảng, hỗ trợ, chính sách, liên hệ.

**Mobile:** header 56px; hero ảnh xuống dưới text; quick-search thành nút mở bộ lọc; card 1 cột; stats 2 cột; footer accordion tùy độ dài.
**States:** không có hoạt động → gợi ý chủ đề; tải ảnh thất bại → placeholder; stats chưa xác minh → ẩn.

## P02 — Danh sách `/activities`
**Desktop:** breadcrumb; H1; thanh tìm kiếm + số kết quả; sidebar filter 260px (từ khóa, chủ đề, tỉnh/thành, ngày, trạng thái tuyển, hình thức); phần phải toolbar sort (gần nhất/mới nhất/sắp diễn ra) + view grid 3 cột; phân trang. Card: ảnh, tag lĩnh vực, tiêu đề tối đa 2 dòng, tổ chức, lịch, nơi, chỗ còn, CTA.
**Mobile:** search sticky dưới header; nút "Bộ lọc (n)" mở bottom sheet; sort dropdown; list 1 cột; giữ filter trong URL để back/forward hoạt động.
**States:** skeleton 6 card; empty kèm nút Xóa bộ lọc; lỗi mạng với Thử lại; không cho filter gây giật layout.
**Behavior:** debounce search 300ms, URL query `?q=&category=&city=&date=&sort=&page=`; filter thay đổi reset page 1; không đưa dữ liệu riêng tư vào URL.

## P03 — Chi tiết `/activities/[slug]`
**Desktop:** breadcrumb; hero cover 16:6; title + verified organizer + status; main 8 cột gồm mục tiêu, nội dung, thời gian, lịch trình, địa điểm/tập trung, tiêu chí tham gia, đồ chuẩn bị, an toàn, liên hệ, FAQ; aside 4 cột sticky với lịch, địa điểm, hạn đăng ký, số chỗ, nút đăng ký, lưu/chia sẻ.
**Mobile:** hero 16:9; meta dạng stack; accordion cho lịch trình/FAQ; bottom CTA sticky; map link chỉ khi có địa chỉ đã xác nhận.
**States:** full → "Hết chỗ" + danh sách chờ nếu được bật; closed → vô hiệu đăng ký; canceled → banner nổi bật; already applied → "Xem đơn của tôi"; unauthenticated → lưu return URL sau login.
**Privacy:** chỉ hiển thị thông tin organizer công khai, không công bố danh sách số điện thoại tình nguyện viên.

## P04 — Giới thiệu `/about`
Hero tuyên bố sứ mệnh, 3 nguyên tắc minh bạch/an toàn/kết nối, quy trình xác minh tổ chức, cách nền tảng vận hành, CTA tham gia/đăng ký tổ chức. Tránh tuyên bố "đã giúp X người" khi chưa có bằng chứng.

## P05 — FAQ `/faq`
Tìm kiếm câu hỏi, accordion theo nhóm (tài khoản, đăng ký, điểm danh, chứng nhận, hủy), CTA liên hệ khi không giải quyết được. Nội dung trả lời liên kết tới chính sách cụ thể.

## P06 — Liên hệ `/contact`
Thông tin hỗ trợ, giờ phản hồi dự kiến (nếu được cam kết), form tên/email/chủ đề/nội dung, chống spam, xác nhận đã nhận; không yêu cầu dữ liệu nhạy cảm trong mô tả.

## P07 — Chính sách `/privacy`, `/terms`
Mục lục neo, ngày cập nhật, mục đích thu thập, quyền người dùng, liên hệ yêu cầu dữ liệu, quy tắc sử dụng, chính sách hủy, quy trình khiếu nại; phiên bản hóa nội dung.
