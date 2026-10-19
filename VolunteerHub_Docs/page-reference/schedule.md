# Lịch hoạt động

Đường dẫn: `/schedule`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/schedule/page.tsx](D:/WebNhiLun/frontend/app/schedule/page.tsx).

**Truy cập theo middleware:** Tài khoản đã đăng nhập; /dashboard điều hướng theo vai trò thực tế. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### SchedulePage.tsx

Nguồn: [frontend/components/portal/SchedulePage.tsx](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx).

```text
SchedulePage
  PortalShell
    VolunteerWorkspaceFrame
      div.schedule-page-content
        div.schedule-header-controls
          div
          div.month-navigator-box
        StatusMessage
        div.calendar-month-grid
          div.cal-header-day
          button
        section.shift-timeline-card
          h3
          article.shift-item-row
          div.schedule-empty
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/SchedulePage.tsx](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx) | `PortalShell`, `VolunteerWorkspaceFrame`, `StatusMessage`, `Link` | `<div>`, `<h1>`, `<i>`, `<p>`, `<button>`, `<h2>`, `<span>`, `<section>`, `<h3>`, `<article>`, `<strong>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |

**Tiêu đề trực tiếp trong JSX:** Lịch Hoạt Động Thiện Nguyện · Chi tiết các ca trực trong tháng


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/schedule/page.tsx:3](D:/WebNhiLun/frontend/app/schedule/page.tsx:3) |
| SchedulePage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, ….sort, ….filter, (data ?? []) .filter, month.getDay, new Date( month.getFullYear(), month.getMonth() + 1, 0, ).getDate, month.getFullYear, month.getMonth, Array.from, Math.ceil, scheduled.filter, monthEvents.filter, month.toLocaleDateString, ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map, dates.map, selectedEvents.map | [frontend/components/portal/SchedulePage.tsx:18](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:18) |
| callback useState | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | Không có | new Date(new Date().getFullYear(), new Date().getMonth(), 1) | new Date().getFullYear, new Date().getMonth | [frontend/components/portal/SchedulePage.tsx:23](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:23) |
| callback (data ?? []) .filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | item | ["approved", "completed"].includes(item.status) && item.event_date | ["approved", "completed"].includes | [frontend/components/portal/SchedulePage.tsx:28](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:28) |
| callback ….filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | item | !search.trim() \|\| item.activity_title .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLowerCase("vi")) | search.trim, item.activity_title .toLocaleLowerCase("vi") .includes, item.activity_title .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/SchedulePage.tsx:32](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:32) |
| callback ….sort | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | a, b | (a.event_date ?? "").localeCompare(b.event_date ?? "") | (a.event_date ?? "").localeCompare | [frontend/components/portal/SchedulePage.tsx:38](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:38) |
| callback Array.from | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | _, index | index - offset + 1 | Không gọi hàm khác trực tiếp | [frontend/components/portal/SchedulePage.tsx:47](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:47) |
| callback scheduled.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | item | ( date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear() ) | date.getMonth, month.getMonth, date.getFullYear, month.getFullYear | [frontend/components/portal/SchedulePage.tsx:49](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:49) |
| callback monthEvents.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | item | selectedDate === null \|\| new Date(`${item.event_date}T00:00:00`).getDate() === selectedDate | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/SchedulePage.tsx:58](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:58) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | SchedulePage | Không có | Không return tường minh; xem hiệu ứng state/API | setMonth, setSelectedDate | [frontend/components/portal/SchedulePage.tsx:87](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:87) |
| callback setMonth | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | new Date( current.getFullYear(), current.getMonth() - 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/SchedulePage.tsx:89](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:89) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | SchedulePage | Không có | Không return tường minh; xem hiệu ứng state/API | setMonth, setSelectedDate | [frontend/components/portal/SchedulePage.tsx:110](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:110) |
| callback setMonth | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | new Date( current.getFullYear(), current.getMonth() + 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/SchedulePage.tsx:112](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:112) |
| callback ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | day, index | ( <div className="cal-header-day" key={day} style={ index === 5 ? { color: "#059669" } : index === 6 ? { color: "#ef4444" } : {} } > {day} </div> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/SchedulePage.tsx:128](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:128) |
| callback dates.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | day, index | JSX giao diện | month.getFullYear, month.getMonth, date.getMonth, monthEvents.some, date.toDateString, new Date().toDateString, monthEvents.filter | [frontend/components/portal/SchedulePage.tsx:143](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:143) |
| callback monthEvents.some | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback dates.map | item | new Date(`${item.event_date}T00:00:00`).getDate() === day | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/SchedulePage.tsx:149](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:149) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback dates.map | Không có | inMonth && setSelectedDate((current) => (current === day ? null : day)) | setSelectedDate | [frontend/components/portal/SchedulePage.tsx:159](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:159) |
| callback setSelectedDate | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | (current === day ? null : day) | Không gọi hàm khác trực tiếp | [frontend/components/portal/SchedulePage.tsx:161](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:161) |
| callback monthEvents.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback dates.map | item | new Date( `${item.event_date}T00:00:00`, ).getDate() === day | new Date( `${item.event_date}T00:00:00`, ).getDate | [frontend/components/portal/SchedulePage.tsx:173](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:173) |
| callback selectedEvents.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | SchedulePage | item | ( <article className="shift-item-row" key={item.id}> <span className="shift-date-badge"> {formatDate(item.event_date)} </span> <div className="shift-event-info" | formatDate | [frontend/components/portal/SchedulePage.tsx:192](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:192) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| VolunteerWorkspaceFrame | onSearchChange | `{setSearch}` | [frontend/components/portal/SchedulePage.tsx:69](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:69) |
| button | onClick | `{() => { setMonth( (current) => new Date( current.getFullYear(), current.getMonth() - 1, 1, ), ); setSelectedDate(null); }}` | [frontend/components/portal/SchedulePage.tsx:87](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:87) |
| button | onClick | `{() => { setMonth( (current) => new Date( current.getFullYear(), current.getMonth() + 1, 1, ), ); setSelectedDate(null); }}` | [frontend/components/portal/SchedulePage.tsx:110](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:110) |
| button | onClick | `{() => inMonth && setSelectedDate((current) => (current === day ? null : day)) }` | [frontend/components/portal/SchedulePage.tsx:159](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:159) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| SchedulePage | useLoad | `"/me/applications"` | [frontend/components/portal/SchedulePage.tsx:20](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:20) |
| SchedulePage | useLoad | `"/me/profile"` | [frontend/components/portal/SchedulePage.tsx:21](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:21) |
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

- [frontend/app/schedule/page.tsx](D:/WebNhiLun/frontend/app/schedule/page.tsx)
- [frontend/components/portal/SchedulePage.tsx](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx)
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
