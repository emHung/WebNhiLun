# Chứng nhận

Đường dẫn: `/certificates`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/certificates/page.tsx](D:/WebNhiLun/frontend/app/certificates/page.tsx).

**Truy cập theo middleware:** Volunteer. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### CertificatesPage.tsx

Nguồn: [frontend/components/portal/CertificatesPage.tsx](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx).

```text
CertificatesPage
  PortalShell
    VolunteerWorkspaceFrame
      div.certificates-page-content
        header.cert-page-heading
          h1
          p
        StatusMessage
        p.cert-copy-message
        div.cert-gallery-grid
          article.cert-card-item
        EmptyState
        section.cert-verify-section
          h2
          form.portal-toolbar
          div.portal-message.portal-error
          div.portal-message
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/CertificatesPage.tsx](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx) | `PortalShell`, `VolunteerWorkspaceFrame`, `StatusMessage`, `CertificateQr`, `Link`, `EmptyState` | `<div>`, `<header>`, `<h1>`, `<i>`, `<p>`, `<article>`, `<h2>`, `<strong>`, `<code>`, `<span>`, `<small>`, `<button>`, `<section>`, `<form>`, `<input>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |

**Tiêu đề trực tiếp trong JSX:** Chứng Nhận &amp; Giấy Khen Điện Tử · Tra cứu chứng nhận


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/certificates/page.tsx:4](D:/WebNhiLun/frontend/app/certificates/page.tsx:4) |
| CertificatesPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useSearchParams, useState, searchParams.get, (data ?? []).filter, visibleCertificates.map | [frontend/components/portal/CertificatesPage.tsx:21](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:21) |
| callback (data ?? []).filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | CertificatesPage | cert | !search.trim() \|\| `${cert.certificate_code} ${cert.issuer} ${cert.title}` .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLowerCase("vi")) | search.trim, ….includes, `${cert.certificate_code} ${cert.issuer} ${cert.title}` .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/CertificatesPage.tsx:38](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:38) |
| copyCertificateLink | Sao chép liên kết xác minh chứng nhận. | CertificatesPage | cert: Certificate | Không return tường minh; xem hiệu ứng state/API | navigator.clipboard.writeText, encodeURIComponent, setCopyMessage | [frontend/components/portal/CertificatesPage.tsx:44](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:44) |
| verify | Mở hoặc thực hiện xác minh chứng nhận theo mã. | CertificatesPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setMessage, setVerified, apiRequest, encodeURIComponent, code.trim | [frontend/components/portal/CertificatesPage.tsx:54](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:54) |
| callback visibleCertificates.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | CertificatesPage | cert, index | ( <article className="cert-card-item" key={cert.id}> <div className="cert-gold-header" style={{ background: index % 3 === 0 ? "linear-gradient(135deg,#0d9d74,#1 | formatDate, encodeURIComponent | [frontend/components/portal/CertificatesPage.tsx:102](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:102) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback visibleCertificates.map | Không có | Không return tường minh; xem hiệu ứng state/API | ….catch, apiDownload, encodeURIComponent | [frontend/components/portal/CertificatesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:154) |
| callback ….catch | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | error | setCopyMessage(error.message) | setCopyMessage | [frontend/components/portal/CertificatesPage.tsx:158](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:158) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback visibleCertificates.map | Không có | void copyCertificateLink(cert) | copyCertificateLink | [frontend/components/portal/CertificatesPage.tsx:166](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:166) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CertificatesPage | event | setCode(event.target.value) | setCode | [frontend/components/portal/CertificatesPage.tsx:196](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:196) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| VolunteerWorkspaceFrame | onSearchChange | `{setSearch}` | [frontend/components/portal/CertificatesPage.tsx:82](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:82) |
| button | onClick | `{() => { void apiDownload( ˋ/certificates/${encodeURIComponent(cert.certificate_code)}/pdfˋ, ˋ${cert.certificate_code}.pdfˋ, ).catch((error) => setCopyMessage(error.message)); }}` | [frontend/components/portal/CertificatesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:154) |
| button | onClick | `{() => void copyCertificateLink(cert)}` | [frontend/components/portal/CertificatesPage.tsx:166](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:166) |
| form | onSubmit | `{verify}` | [frontend/components/portal/CertificatesPage.tsx:193](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:193) |
| input | onChange | `{(event) => setCode(event.target.value)}` | [frontend/components/portal/CertificatesPage.tsx:196](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:196) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| CertificatesPage | useLoad | `"/me/certificates"` | [frontend/components/portal/CertificatesPage.tsx:22](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:22) |
| CertificatesPage | useLoad | `"/me/profile"` | [frontend/components/portal/CertificatesPage.tsx:23](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:23) |
| verify | apiRequest | `ˋ/certificates/verify/${encodeURIComponent(code.trim())}ˋ` | [frontend/components/portal/CertificatesPage.tsx:60](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:60) |
| inline onClick | apiDownload(                             `/certificates/${encodeURIComponent(cert.certificate_code)}/pdf`,                             `${cert.certificate_code}.pdf`,                           ).catch | `(error) => setCopyMessage(error.message)` | [frontend/components/portal/CertificatesPage.tsx:155](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:155) |
| inline onClick | apiDownload | `ˋ/certificates/${encodeURIComponent(cert.certificate_code)}/pdfˋ, ˋ${cert.certificate_code}.pdfˋ` | [frontend/components/portal/CertificatesPage.tsx:155](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:155) |
| markAll | apiRequest | `"/notifications/read-all", { method: "POST" }` | [frontend/components/portal/NotificationBell.tsx:18](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:18) |
| inline onClick | apiRequest(                       `/notifications/${encodeURIComponent(item.id)}`,                       {                         method: "PATCH",                         body: JSON.stringify({ unread: false }),                       },                     ).catch | `(e) => setError(e.message)` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |
| inline onClick | apiRequest | `ˋ/notifications/${encodeURIComponent(item.id)}ˋ, { method: "PATCH", body: JSON.stringify({ unread: false }), }` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |
| useNotificationSummary | useLoad | `enabled ? "/notifications/summary" : null` | [frontend/hooks/use-notifications.ts:9](D:/WebNhiLun/frontend/hooks/use-notifications.ts:9) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/certificates/page.tsx](D:/WebNhiLun/frontend/app/certificates/page.tsx)
- [frontend/components/portal/CertificatesPage.tsx](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx)
- [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/CertificateQr.tsx](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx)
