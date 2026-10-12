# 12 — Roadmap, Backlog & Acceptance Criteria

## Giai đoạn 0 — Discovery (1 tuần dự kiến)
Chốt persona, phạm vi, policies, sitemap, event/application state machine, yêu cầu pháp lý. Deliverable: PRD & wireflow. Gate: stakeholder xác nhận.

## Giai đoạn 1 — Design System & Public (2 tuần)
Tokens, typography, components, responsive shell, homepage, listing, detail, FAQ, policies. Gate: 3 breakpoint và state loading/empty/error.

## Giai đoạn 2 — Auth & Apply (2 tuần)
Login/register, profile, multi-step application, validation, idempotency, notification cơ bản. Gate: E2E đăng ký thành công/thất bại và race capacity.

## Giai đoạn 3 — Organizer (2–3 tuần)
Organization onboarding, event wizard, moderation submit, application review, check-in. Gate: phân quyền chéo tổ chức không bị vượt qua.

## Giai đoạn 4 — Admin (2 tuần)
Queues, users, reports, audit, basic analytics. Gate: audit mọi action đặc quyền, test RBAC.

## Giai đoạn 5 — Hardening & Launch (1–2 tuần)
Accessibility, performance, security, backup, seed demo, tài liệu hướng dẫn, staging UAT. Gate: không còn lỗi nghiêm trọng mở.

Thời lượng là ước tính cho nhóm nhỏ; điều chỉnh theo nguồn lực và yêu cầu đồ án.

## Prioritized backlog
P0: xem/tìm/chi tiết hoạt động; auth; apply; organizer create/review; admin moderation; RBAC; audit; responsive. P1: waitlist, check-in, notification, certificate, reports. P2: calendar sync, recommendations, gamification.

## Acceptance Criteria theo trang
- Home: CTA dẫn đúng listing; không có dữ liệu giả bị hiểu là thật; mobile không vỡ layout.
- Listing: filter đồng bộ URL; reset được; empty rõ; phân trang hoạt động.
- Detail: status/availability đúng dữ liệu server; CTA tương ứng trạng thái.
- Apply: validation, chống trùng, không vượt chỗ, có mã đơn và trạng thái.
- Volunteer: chỉ xem đơn mình; timeline rõ; hủy có xác nhận.
- Organizer: chỉ thao tác org được cấp quyền; event draft/review/publish; duyệt có audit.
- Admin: kiểm duyệt và quản lý quyền có audit; dữ liệu export hạn chế.

## Deliverables bàn giao
Figma hoặc mockup; component catalog; Markdown spec; source code; migration SQL; OpenAPI; seed data; E2E tests; hướng dẫn cài đặt; demo script; checklist nghiệm thu.

## Demo 10 phút
0–1 giới thiệu; 1–3 tìm và xem chi tiết; 3–4 đăng ký; 4–6 organizer duyệt; 6–7 tình nguyện viên thấy cập nhật; 7–8 check-in; 8–9 admin audit; 9–10 responsive + kết luận.
