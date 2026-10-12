# 11 — Security, Privacy, Accessibility & QA

## Threat model tối thiểu
- Broken access control/IDOR: check ownership & org membership cho từng endpoint.
- Injection/XSS: parameterized queries, sanitize rich text, CSP, escaping output.
- CSRF: bảo vệ mutation khi dùng cookie auth, SameSite và token phù hợp.
- Auth abuse: rate limit, email verification, session expiry, password reset tokens ngắn hạn.
- File upload: giới hạn MIME/size, quét file, random path, signed URL cho file riêng tư.
- Race capacity: transaction + lock + idempotency.
- QR replay: token ngắn hạn, scope event, check-in một lần, fallback thủ công có audit.
- Data leakage: tách public/private, field-level allowlist, hạn chế export.

## Privacy by design
Thu thập tối thiểu, thông báo mục đích, quyền truy cập/sửa/xóa theo quy định áp dụng, retention schedule, xử lý yêu cầu dữ liệu, bảo vệ thông tin liên hệ và giấy tờ xác minh. Với người chưa thành niên: điều kiện tham gia, sự đồng ý phù hợp và giới hạn thông tin theo quy định hiện hành; không công khai dữ liệu nhạy cảm. Rà soát pháp lý tại Việt Nam trước vận hành thật.

## Accessibility checklist
[ ] Mọi chức năng dùng keyboard; [ ] focus rõ; [ ] contrast đạt WCAG 2.2 AA; [ ] form label/error; [ ] toast được công bố phù hợp; [ ] alt text; [ ] heading đúng cấp; [ ] 200% zoom; [ ] reduced motion; [ ] màn 320px không mất nội dung.

## Test matrix
| Test | Expected |
|---|---|
| Visitor mở trang công khai | 200, không lộ PII |
| Volunteer submit hợp lệ | 1 application, mã duy nhất |
| Double submit | Không tạo 2 đơn |
| 2 người tranh suất cuối | Không vượt capacity |
| Volunteer đọc đơn người khác | 403/404 |
| Organizer truy cập event org khác | 403/404 |
| Admin đổi quyền | Audit đầy đủ |
| Event đóng tuyển | Không nhận đơn mới |
| Event đổi lịch | Thông báo người liên quan |
| Điểm danh trùng | Chặn hoặc xử lý idempotent |
| Mạng chập chờn khi submit | Trạng thái rõ, không báo thành công giả |
| Mobile 360px | Không tràn ngang |

## QA layers
Unit (validation, state transitions), integration (DB transactions, RBAC), E2E (Playwright flows), visual regression (desktop/tablet/mobile), accessibility (axe + manual), security review (OWASP ASVS phù hợp), load test (listing/apply spike).

## Operational readiness
Monitoring, alert lỗi API, backup daily theo chính sách, diễn tập restore, runbook hủy event khẩn, incident response, audit retention, kiểm thử môi trường staging trước production.
