# Thông báo

Đường dẫn: `/notifications`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/notifications/page.tsx](D:/WebNhiLun/frontend/app/notifications/page.tsx).

**Truy cập theo middleware:** Tài khoản đã đăng nhập; /dashboard điều hướng theo vai trò thực tế. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### NotificationsPage.tsx

Nguồn: [frontend/components/portal/NotificationsPage.tsx](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx).

```text
NotificationsPage
  PortalShell
    VolunteerWorkspaceFrame
      div.notification-page
        div.notification-toolbar
          button.btn.btn-sm.btn-outline
        section.notify-container-card
          div.notify-heading
          StatusMessage
          div.portal-message
          div.notify-list
          Pagination
          div.notify-empty
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/NotificationsPage.tsx](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx) | `PortalShell`, `VolunteerWorkspaceFrame`, `StatusMessage`, `Link`, `Pagination` | `<div>`, `<button>`, `<i>`, `<section>`, `<h1>`, `<span>`, `<article>`, `<strong>`, `<p>` |
| [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx) | — | `<nav>`, `<button>`, `<span>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |

**Tiêu đề trực tiếp trong JSX:** Thông Báo Của Bạn


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/notifications/page.tsx:3](D:/WebNhiLun/frontend/app/notifications/page.tsx:3) |
| NotificationsPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, useDebouncedValue, String, params.set, useEffect, [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map, visible.map | [frontend/components/portal/NotificationsPage.tsx:20](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:20) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | NotificationsPage | Không có | Không return tường minh; xem hiệu ứng state/API | setPage | [frontend/components/portal/NotificationsPage.tsx:37](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:37) |
| markOne | Đánh dấu một thông báo đã đọc. | NotificationsPage | item: Notification | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, JSON.stringify, refresh, setMessage | [frontend/components/portal/NotificationsPage.tsx:40](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:40) |
| markAll | Đánh dấu toàn bộ thông báo đã đọc. | NotificationsPage | Không có | Không return tường minh; xem hiệu ứng state/API | apiRequest, refresh, setMessage | [frontend/components/portal/NotificationsPage.tsx:55](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:55) |
| callback [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | NotificationsPage | [key, label] | ( <button type="button" key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)} > {label} </button> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/NotificationsPage.tsx:102](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:102) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map | Không có | setTab(key) | setTab | [frontend/components/portal/NotificationsPage.tsx:107](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:107) |
| callback visible.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | NotificationsPage | item | ( <article className={`notify-item-card${item.unread ? " unread" : ""}`} key={item.id} onClick={() => item.unread && markOne(item)} > <div className={`notify-ic | new Date(item.created_at).toLocaleString | [frontend/components/portal/NotificationsPage.tsx:121](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:121) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback visible.map | Không có | item.unread && markOne(item) | markOne | [frontend/components/portal/NotificationsPage.tsx:125](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:125) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback visible.map | event | Không return tường minh; xem hiệu ứng state/API | event.stopPropagation, markOne | [frontend/components/portal/NotificationsPage.tsx:154](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:154) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback visible.map | event | Không return tường minh; xem hiệu ứng state/API | event.stopPropagation, markOne | [frontend/components/portal/NotificationsPage.tsx:165](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:165) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| VolunteerWorkspaceFrame | onSearchChange | `{setQuery}` | [frontend/components/portal/NotificationsPage.tsx:77](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:77) |
| button | onClick | `{markAll}` | [frontend/components/portal/NotificationsPage.tsx:84](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:84) |
| button | onClick | `{() => setTab(key)}` | [frontend/components/portal/NotificationsPage.tsx:107](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:107) |
| article | onClick | `{() => item.unread && markOne(item)}` | [frontend/components/portal/NotificationsPage.tsx:125](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:125) |
| Link | onClick | `{(event) => { event.stopPropagation(); if (item.unread) void markOne(item); }}` | [frontend/components/portal/NotificationsPage.tsx:154](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:154) |
| button | onClick | `{(event) => { event.stopPropagation(); void markOne(item); }}` | [frontend/components/portal/NotificationsPage.tsx:165](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:165) |
| Pagination | onChange | `{setPage}` | [frontend/components/portal/NotificationsPage.tsx:182](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:182) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| NotificationsPage | useLoad | `"/me/profile"` | [frontend/components/portal/NotificationsPage.tsx:21](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:21) |
| NotificationsPage | useLoad | `ˋ/notifications?${params}ˋ` | [frontend/components/portal/NotificationsPage.tsx:33](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:33) |
| markOne | apiRequest | `ˋ/notifications/${encodeURIComponent(item.id)}ˋ, { method: "PATCH", body: JSON.stringify({ unread: false }), }` | [frontend/components/portal/NotificationsPage.tsx:42](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:42) |
| markAll | apiRequest | `"/notifications/read-all", { method: "POST" }` | [frontend/components/portal/NotificationsPage.tsx:57](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:57) |
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

- [frontend/app/notifications/page.tsx](D:/WebNhiLun/frontend/app/notifications/page.tsx)
- [frontend/components/portal/NotificationsPage.tsx](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx)
- [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
