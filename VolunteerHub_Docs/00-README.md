# VolunteerHub — Product & UI/UX Master Blueprint v1.0

> Ngôn ngữ: Tiếng Việt | Trạng thái: Thiết kế đề xuất, chưa triển khai | Ngày: 12/10/2026

## Tầm nhìn
Nền tảng kết nối tình nguyện viên với các tổ chức thực hiện hoạt động thiện nguyện; công khai cơ hội tham gia, quản lý đăng ký, xét duyệt, điểm danh và xác nhận đóng góp minh bạch.

## Phạm vi MVP
- Khách: xem, tìm kiếm, lọc, xem chi tiết hoạt động.
- Tình nguyện viên: tài khoản, hồ sơ, đăng ký, hủy, theo dõi, nhận thông báo.
- Ban tổ chức: hồ sơ tổ chức, tạo hoạt động, duyệt người tham gia, điểm danh, báo cáo.
- Quản trị hệ thống: duyệt tổ chức và hoạt động, quản lý tài khoản, audit, báo cáo.
- Ngoài MVP: quyên góp tiền, thanh toán, chatbot AI, gamification, app native.

## Mục lục
| File | Nội dung |
|---|---|
| 01-business-and-governance.md | Mô hình tổ chức, stakeholder, RACI, quy tắc vận hành |
| 02-personas-and-journeys.md | Persona, hành trình, user stories |
| 03-information-architecture.md | Sitemap, điều hướng, route, trạng thái |
| 04-design-system.md | Tone màu, font, spacing, components, accessibility |
| 05-public-pages.md | Kịch bản UI trang chủ, danh sách, chi tiết và trang thông tin |
| 06-auth-and-registration.md | Đăng nhập, đăng ký, multi-step form, lỗi |
| 07-volunteer-portal.md | Hồ sơ, lịch, đơn, chứng nhận, thông báo |
| 08-organizer-portal.md | Quản lý tổ chức, hoạt động, duyệt đơn, điểm danh |
| 09-admin-portal.md | Quản trị, moderation, báo cáo, cấu hình |
| 10-data-and-api.md | ERD, bảng dữ liệu, API contract |
| 11-security-and-quality.md | Bảo mật, quyền riêng tư, WCAG, test |
| 12-roadmap-and-acceptance.md | Kế hoạch triển khai, backlog, nghiệm thu |
| 13-content-and-seo.md | Microcopy, content strategy, SEO, thông báo |
| 14-presentation-flows.md | Kịch bản các luồng nghiệp vụ & hướng dẫn thuyết trình |

## Quy ước
- Mọi số liệu, sự kiện và tên tổ chức trong mockup là dữ liệu giả lập.
- Phân biệt `application.status` và `event.status`.
- Giao diện tiếng Việt trước, chuẩn bị khả năng i18n.
- Các sơ đồ Mermaid có thể xem trực tiếp trên GitHub hoặc trình Markdown hỗ trợ Mermaid.
- Không coi tài liệu là tuyên bố tuân thủ pháp lý; cần rà soát quy định hiện hành trước khi vận hành thật.

## Definition of Done
UI đủ desktop/tablet/mobile; trạng thái loading/empty/error/success; phân quyền ở server; dữ liệu được kiểm tra; test luồng quan trọng; audit cho hành động nhạy cảm.
