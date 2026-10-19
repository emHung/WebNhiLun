# Chi tiết hoạt động

Đường dẫn: `/activities/[identifier]`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/activities/[identifier]/page.tsx](D:/WebNhiLun/frontend/app/activities/[identifier]/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### ActivityDetailPage.tsx

Nguồn: [frontend/components/portal/ActivityDetailPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx).

```text
ActivityDetailPage
  PortalShell
    main.container
      StatusMessage
      section.detail-hero-banner
        div
          div.detail-breadcrumb-row
          div.detail-badges-row
          h1.detail-title-h1
          p.detail-sub-desc
          div.detail-meta-icons-grid
        div.detail-hero-visual-right
          div.detail-quote-overlay
          MediaImage.detail-hero-main-img
          div.detail-gallery-strip
      nav.detail-nav-tabs-bar
        button
      div.detail-content-layout
        div.detail-left-col
          section.card
          section.card
          section.card
          section.detail-two-cards-row
          section.card
          section.card
        aside.detail-action-card
          div.action-card-header-badge
          div.action-progress-box
          Link.btn-detail-main-apply
          div.action-sub-guarantee
          div.action-info-rows-list
          div.action-bottom-buttons-row
          p.portal-message
      div.vh-lightbox-overlay.active
        div.vh-lightbox-content
          button.vh-lightbox-close
          button.vh-lightbox-nav.vh-lightbox-prev
          MediaImage.vh-lightbox-img
          button.vh-lightbox-nav.vh-lightbox-next
          div.vh-lightbox-counter
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/ActivityDetailPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx) | `PortalShell`, `StatusMessage`, `Link`, `MediaImage`, `ActivityDescription` | `<main>`, `<section>`, `<div>`, `<span>`, `<i>`, `<h1>`, `<p>`, `<strong>`, `<button>`, `<nav>`, `<h3>`, `<a>`, `<article>`, `<ul>`, `<li>`, `<aside>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Giới thiệu hoạt động · Lịch trình chi tiết · Địa điểm hoạt động · Yêu cầu tham gia · Vật dụng cần chuẩn bị · Đơn vị tổ chức · Thư viện hình ảnh thực tế


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { params: paramsPromise, }: { params: Promise<{ identifier: string }>; } | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/activities/[identifier]/page.tsx:3](D:/WebNhiLun/frontend/app/activities/[identifier]/page.tsx:3) |
| ActivityDetailPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { identifier }: { identifier: string } | JSX giao diện | useLoad, encodeURIComponent, useState, Math.min, Math.round, Math.max, descriptionText, formatDate, gallery.slice(1, 4).map, gallery.slice, ….map, data.schedule.map, ….filter, ….split, gallery.map | [frontend/components/portal/ActivityDetailPage.tsx:19](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:19) |
| saveFavorite | Thay đổi trạng thái yêu thích của hoạt động. | ActivityDetailPage | Không có | undefined / dừng xử lý | apiRequest, JSON.stringify, setMessage | [frontend/components/portal/ActivityDetailPage.tsx:33](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:33) |
| shareActivity | Chia sẻ hoặc sao chép đường dẫn hoạt động. | ActivityDetailPage | Không có | Không return tường minh; xem hiệu ứng state/API | navigator.clipboard.writeText, setMessage | [frontend/components/portal/ActivityDetailPage.tsx:47](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:47) |
| goToSection | Di chuyển đến mục nội dung. | ActivityDetailPage | section: string | Không return tường minh; xem hiệu ứng state/API | setActiveTab, document .getElementById(`tab-pane-${section}`) ?.scrollIntoView, document .getElementById | [frontend/components/portal/ActivityDetailPage.tsx:55](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:55) |
| callback gallery.slice(1, 4).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | image, index | ( <button type="button" key={image} onClick={() => setLightboxIndex(index + 1)} aria-label={`Xem ảnh ${index + 1}`} > <MediaImage src={image} alt="" className=" | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:154](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:154) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback gallery.slice(1, 4).map | Không có | setLightboxIndex(index + 1) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:158](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:158) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | Không có | setLightboxIndex(0) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:171) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | [key, label] | ( <button key={key} type="button" className={`detail-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => goToSection(key)} > {label} </button> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:189](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:189) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback ….map | Không có | goToSection(key) | goToSection | [frontend/components/portal/ActivityDetailPage.tsx:194](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:194) |
| callback data.schedule.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | item | ( <div className="detail-timeline-step" key={item.step_order} > <span className="timeline-time-badge"> {item.time_frame} </span> <div className="timeline-step-t | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:230) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | item | ( <li key={item}> <i className="ri-checkbox-circle-fill" style={{ color: "#10b981" }} /> {item} </li> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:299](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:299) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | item | ( <li key={item}> <i className="ri-checkbox-circle-fill" style={{ color: "#10b981" }} /> {item} </li> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:325](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:325) |
| callback gallery.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivityDetailPage | image, index | ( <button type="button" key={image} onClick={() => setLightboxIndex(index)} > <MediaImage src={image} alt={`${data.title} ${index + 1}`} style={{ width: "100%", | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivityDetailPage.tsx:372](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:372) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback gallery.map | Không có | setLightboxIndex(index) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:376](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:376) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | Không có | setLightboxIndex(null) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:487](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:487) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | event | event.stopPropagation() | event.stopPropagation | [frontend/components/portal/ActivityDetailPage.tsx:491](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:491) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | Không có | setLightboxIndex(null) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:496](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:496) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | Không có | setLightboxIndex( (lightboxIndex + gallery.length - 1) % gallery.length, ) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:503](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:503) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityDetailPage | Không có | setLightboxIndex((lightboxIndex + 1) % gallery.length) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:519](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:519) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => setLightboxIndex(index + 1)}` | [frontend/components/portal/ActivityDetailPage.tsx:158](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:158) |
| button | onClick | `{() => setLightboxIndex(0)}` | [frontend/components/portal/ActivityDetailPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:171) |
| button | onClick | `{() => goToSection(key)}` | [frontend/components/portal/ActivityDetailPage.tsx:194](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:194) |
| button | onClick | `{() => setLightboxIndex(index)}` | [frontend/components/portal/ActivityDetailPage.tsx:376](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:376) |
| button | onClick | `{saveFavorite}` | [frontend/components/portal/ActivityDetailPage.tsx:465](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:465) |
| button | onClick | `{shareActivity}` | [frontend/components/portal/ActivityDetailPage.tsx:472](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:472) |
| div | onClick | `{() => setLightboxIndex(null)}` | [frontend/components/portal/ActivityDetailPage.tsx:487](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:487) |
| div | onClick | `{(event) => event.stopPropagation()}` | [frontend/components/portal/ActivityDetailPage.tsx:491](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:491) |
| button | onClick | `{() => setLightboxIndex(null)}` | [frontend/components/portal/ActivityDetailPage.tsx:496](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:496) |
| button | onClick | `{() => setLightboxIndex( (lightboxIndex + gallery.length - 1) % gallery.length, ) }` | [frontend/components/portal/ActivityDetailPage.tsx:503](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:503) |
| button | onClick | `{() => setLightboxIndex((lightboxIndex + 1) % gallery.length) }` | [frontend/components/portal/ActivityDetailPage.tsx:519](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:519) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| ActivityDetailPage | useLoad | `ˋ/activities/${encodeURIComponent(identifier)}ˋ` | [frontend/components/portal/ActivityDetailPage.tsx:20](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:20) |
| saveFavorite | apiRequest | `"/me/favorites", { method: "POST", body: JSON.stringify({ activity_id: data.id }), }` | [frontend/components/portal/ActivityDetailPage.tsx:36](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:36) |
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

- [frontend/app/activities/[identifier]/page.tsx](D:/WebNhiLun/frontend/app/activities/[identifier]/page.tsx)
- [frontend/components/portal/ActivityDetailPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/ActivityEditor.tsx](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx)
- [frontend/lib/rich-text.ts](D:/WebNhiLun/frontend/lib/rich-text.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
