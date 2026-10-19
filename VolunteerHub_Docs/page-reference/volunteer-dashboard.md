# Dashboard tình nguyện viên

Đường dẫn: `/volunteer/dashboard`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/volunteer/dashboard/page.tsx](D:/WebNhiLun/frontend/app/volunteer/dashboard/page.tsx).

**Truy cập theo middleware:** Volunteer. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### VolunteerDashboardPage.tsx

Nguồn: [frontend/components/portal/VolunteerDashboardPage.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx).

```text
VolunteerDashboardPage
  PortalShell
    VolunteerWorkspaceFrame
      div.v-dashboard-page.container
        div.v-dash-layout
          div.v-dash-main-col
          aside.v-dash-side-col
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/VolunteerDashboardPage.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx) | `PortalShell`, `VolunteerWorkspaceFrame`, `Link`, `MediaImage`, `StatusMessage`, `EmptyState` | `<div>`, `<section>`, `<h1>`, `<i>`, `<p>`, `<span>`, `<strong>`, `<h2>`, `<article>`, `<h3>`, `<input>`, `<select>`, `<option>`, `<button>`, `<aside>`, `<small>`, `<h4>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |

**Tiêu đề trực tiếp trong JSX:** Xin chào, ! · Hoạt động sắp tới · Danh Sách Hoạt Động Đã Đăng Ký · Hoạt Động Gợi Ý Cho Bạn · Lịch Hoạt Động Của Tôi · Chứng Nhận Của Tôi · Thông Báo Mới


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/volunteer/dashboard/page.tsx:4](D:/WebNhiLun/frontend/app/volunteer/dashboard/page.tsx:4) |
| VolunteerDashboardPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useNotificationSummary, useState, useSearchParams, ….sort, all .filter, certificates?.reduce, ….slice, ….filter, ….map, (activityPage?.items ?? []).slice, calendarMonth.getDay, Array.from, Math.ceil, new Date( calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0, ).getDate, calendarMonth.getFullYear, calendarMonth.getMonth, all.filter, dashboardParams.get, upcoming.map, filtered.map, recommended.map, imageUrl, Math.min, calendarMonth.toLocaleDateString, ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map, calendarDays.map, formatDate, encodeURIComponent, certificates?.map, notifications?.slice(0, 4).map, notifications?.slice | [frontend/components/portal/VolunteerDashboardPage.tsx:25](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:25) |
| callback useState | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | Không có | new Date(new Date().getFullYear(), new Date().getMonth(), 1) | new Date().getFullYear, new Date().getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:44](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:44) |
| tabFor | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | VolunteerDashboardPage | item: Application | item.checkin_status === "checked_in" \|\| item.status === "completed" ? "completed" : item.status === "approved" ? "accepted" : item.status === "in_progress" ? "i | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:49](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:49) |
| callback all .filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | (tab === "all" \|\| tabFor(item) === tab) && (!search.trim() \|\| `${item.activity_title} ${item.id}` .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLower | tabFor, search.trim, `${item.activity_title} ${item.id}` .toLocaleLowerCase("vi") .includes, `${item.activity_title} ${item.id}` .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/VolunteerDashboardPage.tsx:59](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:59) |
| callback ….sort | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | a, b | sortOrder === "newest" ? b.applied_at.localeCompare(a.applied_at) : a.applied_at.localeCompare(b.applied_at) | b.applied_at.localeCompare, a.applied_at.localeCompare | [frontend/components/portal/VolunteerDashboardPage.tsx:66](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:66) |
| callback certificates?.reduce | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | sum, item | sum + item.hours | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:71](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:71) |
| cancel | Hủy đơn đăng ký hoạt động. | VolunteerDashboardPage | item: Application | undefined / dừng xử lý | window.confirm, apiRequest, encodeURIComponent, setMessage, refresh | [frontend/components/portal/VolunteerDashboardPage.tsx:72](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:72) |
| callback all .filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | item.status === "approved" && item.checkin_status !== "checked_in" | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:89](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:89) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | ({ id: item.activity_id, slug: item.slug, title: item.activity_title, event_date: item.event_date \|\| "", category: item.category, banner_url: item.banner_url, c | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:92](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:92) |
| callback ….filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | new Date(`${item.event_date}T23:59:59`) >= new Date() | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:103](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:103) |
| callback Array.from | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | _, index | index - calendarOffset + 1 | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:120](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:120) |
| callback all.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | item.checkin_status !== "checked_in" && item.event_date && new Date(`${item.event_date}T00:00:00`).getMonth() === calendarMonth.getMonth() && new Date(`${item.e | new Date(`${item.event_date}T00:00:00`).getMonth, calendarMonth.getMonth, new Date(`${item.event_date}T00:00:00`).getFullYear, calendarMonth.getFullYear | [frontend/components/portal/VolunteerDashboardPage.tsx:123](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:123) |
| callback all.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | item.checkin_status !== "checked_in" && item.status === "approved" && new Date(`${item.event_date ?? ""}T23:59:59`) >= new Date() | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:137](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:137) |
| callback upcoming.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | ( <article className="v-sug-card" key={item.id}> <Link href={`/activities/${item.slug \|\| item.id}`} className="v-sug-img-wrap" > <MediaImage className="v-sug-im | imageUrl, formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:255](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:255) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | event | setSearch(event.target.value) | setSearch | [frontend/components/portal/VolunteerDashboardPage.tsx:310](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:310) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | event | setSortOrder(event.target.value) | setSortOrder | [frontend/components/portal/VolunteerDashboardPage.tsx:317](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:317) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | [key, label] | ( <button type="button" key={key} className={`v-tab-btn${tab === key ? " active" : ""}`} onClick={() => setTab(key)} > {label} ( {key === "all" ? all.length : a | all.filter | [frontend/components/portal/VolunteerDashboardPage.tsx:333](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:333) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback ….map | Không có | setTab(key) | setTab | [frontend/components/portal/VolunteerDashboardPage.tsx:338](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:338) |
| callback all.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback ….map | item | tabFor(item) === key | tabFor | [frontend/components/portal/VolunteerDashboardPage.tsx:343](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:343) |
| callback filtered.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | ( <article className="v-reg-item" key={item.id}> <div className="v-reg-left"> <div className="v-reg-thumb" style={{ display: "grid", placeItems: "center", backg | formatDate, ["pending", "approved"].includes | [frontend/components/portal/VolunteerDashboardPage.tsx:355](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:355) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback filtered.map | Không có | cancel(item) | cancel | [frontend/components/portal/VolunteerDashboardPage.tsx:417](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:417) |
| callback recommended.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | ( <article className="v-sug-card" key={item.id}> <Link href={`/activities/${item.slug \|\| item.id}`} className="v-sug-img-wrap" > <MediaImage className="v-sug-im | imageUrl, formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:447](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:447) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | [icon, label, href] | ( <Link key={label} href={href} className="v-prof-action-item" > <span className="v-prof-action-icon"> <i className={icon} /> </span> <span className="v-prof-ac | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:534](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:534) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | Không có | setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() - 1, 1, ), ) | setCalendarMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:557](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:557) |
| callback setCalendarMonth | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | new Date( current.getFullYear(), current.getMonth() - 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:559](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:559) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | Không có | setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() + 1, 1, ), ) | setCalendarMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:573](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:573) |
| callback setCalendarMonth | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | new Date( current.getFullYear(), current.getMonth() + 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:575](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:575) |
| callback ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | day | ( <span key={day}>{day}</span> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:600](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:600) |
| callback calendarDays.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | day, index | JSX giao diện | calendarMonth.getFullYear, calendarMonth.getMonth, date.getMonth, monthEvents.some | [frontend/components/portal/VolunteerDashboardPage.tsx:605](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:605) |
| callback monthEvents.some | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback calendarDays.map | item | new Date(`${item.event_date}T00:00:00`).getDate() === day | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/VolunteerDashboardPage.tsx:616](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:616) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | Không có | Không return tường minh; xem hiệu ứng state/API | ….catch, apiDownload, encodeURIComponent | [frontend/components/portal/VolunteerDashboardPage.tsx:665](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:665) |
| callback ….catch | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | error | setMessage(error.message) | setMessage | [frontend/components/portal/VolunteerDashboardPage.tsx:669](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:669) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | Không có | setCertificateIndex( (index) => (index - 1 + certificates!.length) % certificates!.length, ) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:688](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:688) |
| callback setCertificateIndex | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | index | (index - 1 + certificates!.length) % certificates!.length | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:690](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:690) |
| callback certificates?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | cert, index | ( <button type="button" key={cert.id} className={`v-cert-dot${certificateIndex === index ? " active" : ""}`} aria-label={`Chứng nhận ${index + 1}`} onClick={()  | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:699](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:699) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback certificates?.map | Không có | setCertificateIndex(index) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:705](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:705) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerDashboardPage | Không có | setCertificateIndex( (index) => (index + 1) % certificates!.length, ) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:713](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:713) |
| callback setCertificateIndex | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | index | (index + 1) % certificates!.length | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerDashboardPage.tsx:715](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:715) |
| callback notifications?.slice(0, 4).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerDashboardPage | item | ( <Link href={item.link \|\| "/notifications"} key={item.id} className="v-side-notif-item" > <span className={`v-side-notif-icon ${item.type === "success" ? "gree | formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:737](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:737) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| input | onChange | `{(event) => setSearch(event.target.value)}` | [frontend/components/portal/VolunteerDashboardPage.tsx:310](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:310) |
| select | onChange | `{(event) => setSortOrder(event.target.value)}` | [frontend/components/portal/VolunteerDashboardPage.tsx:317](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:317) |
| button | onClick | `{() => setTab(key)}` | [frontend/components/portal/VolunteerDashboardPage.tsx:338](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:338) |
| button | onClick | `{() => cancel(item)}` | [frontend/components/portal/VolunteerDashboardPage.tsx:417](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:417) |
| button | onClick | `{() => setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() - 1, 1, ), ) }` | [frontend/components/portal/VolunteerDashboardPage.tsx:557](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:557) |
| button | onClick | `{() => setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() + 1, 1, ), ) }` | [frontend/components/portal/VolunteerDashboardPage.tsx:573](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:573) |
| button | onClick | `{() => { void apiDownload( ˋ/certificates/${encodeURIComponent(activeCertificate.certificate_code)}/pdfˋ, ˋ${activeCertificate.certificate_code}.pdfˋ, ).catch((error) => setMessage(error.message)); }}` | [frontend/components/portal/VolunteerDashboardPage.tsx:665](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:665) |
| button | onClick | `{() => setCertificateIndex( (index) => (index - 1 + certificates!.length) % certificates!.length, ) }` | [frontend/components/portal/VolunteerDashboardPage.tsx:688](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:688) |
| button | onClick | `{() => setCertificateIndex(index)}` | [frontend/components/portal/VolunteerDashboardPage.tsx:705](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:705) |
| button | onClick | `{() => setCertificateIndex( (index) => (index + 1) % certificates!.length, ) }` | [frontend/components/portal/VolunteerDashboardPage.tsx:713](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:713) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| VolunteerDashboardPage | useLoad | `"/me/applications"` | [frontend/components/portal/VolunteerDashboardPage.tsx:31](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:31) |
| VolunteerDashboardPage | useLoad | `"/me/certificates"` | [frontend/components/portal/VolunteerDashboardPage.tsx:32](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:32) |
| VolunteerDashboardPage | useLoad | `"/me/profile"` | [frontend/components/portal/VolunteerDashboardPage.tsx:33](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:33) |
| VolunteerDashboardPage | useLoad | `"/activities?limit=12"` | [frontend/components/portal/VolunteerDashboardPage.tsx:34](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:34) |
| cancel | apiRequest | `ˋ/me/applications/${encodeURIComponent(item.id)}/cancelˋ, { method: "POST" }` | [frontend/components/portal/VolunteerDashboardPage.tsx:75](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:75) |
| inline onClick | apiDownload(                               `/certificates/${encodeURIComponent(activeCertificate.certificate_code)}/pdf`,                               `${activeCertificate.certificate_code}.pdf`,                             ).catch | `(error) => setMessage(error.message)` | [frontend/components/portal/VolunteerDashboardPage.tsx:666](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:666) |
| inline onClick | apiDownload | `ˋ/certificates/${encodeURIComponent(activeCertificate.certificate_code)}/pdfˋ, ˋ${activeCertificate.certificate_code}.pdfˋ` | [frontend/components/portal/VolunteerDashboardPage.tsx:666](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:666) |
| useNotificationSummary | useLoad | `enabled ? "/notifications/summary" : null` | [frontend/hooks/use-notifications.ts:9](D:/WebNhiLun/frontend/hooks/use-notifications.ts:9) |
| markAll | apiRequest | `"/notifications/read-all", { method: "POST" }` | [frontend/components/portal/NotificationBell.tsx:18](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:18) |
| inline onClick | apiRequest(                       `/notifications/${encodeURIComponent(item.id)}`,                       {                         method: "PATCH",                         body: JSON.stringify({ unread: false }),                       },                     ).catch | `(e) => setError(e.message)` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |
| inline onClick | apiRequest | `ˋ/notifications/${encodeURIComponent(item.id)}ˋ, { method: "PATCH", body: JSON.stringify({ unread: false }), }` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/volunteer/dashboard/page.tsx](D:/WebNhiLun/frontend/app/volunteer/dashboard/page.tsx)
- [frontend/components/portal/VolunteerDashboardPage.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
