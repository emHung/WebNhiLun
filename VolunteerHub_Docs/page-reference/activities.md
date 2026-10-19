# Danh sách hoạt động

Đường dẫn: `/activities`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/activities/page.tsx](D:/WebNhiLun/frontend/app/activities/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### ActivitiesPage.tsx

Nguồn: [frontend/components/portal/ActivitiesPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx).

```text
ActivitiesPage
  PortalShell
    main.act-container
      section.act-hero-banner-new
        div.act-breadcrumb-new
          Link
        div.act-hero-top-flex
          div
          div.act-hero-quote-side
        form.act-embedded-search-wrap
          div.act-embedded-search-inner
          button.btn-embedded-search-submit
      div
        button.act-filter-backdrop
        aside.act-filter-panel
          div.act-filter-panel-header
          div.act-filter-group
          div.act-filter-group
          div.act-filter-group
          div.act-filter-group
          div.act-filter-actions-bottom
        section.act-list-container
          div.act-list-header-bar
          StatusMessage
          div.portal-message
          div
      Pagination
categoryClass
statusClass
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/ActivitiesPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx) | `PortalShell`, `Link`, `MediaImage`, `StatusMessage`, `Pagination` | `<main>`, `<section>`, `<div>`, `<span>`, `<h1>`, `<p>`, `<br>`, `<form>`, `<i>`, `<input>`, `<button>`, `<aside>`, `<h3>`, `<label>`, `<select>`, `<option>`, `<article>` |
| [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx) | — | `<nav>`, `<button>`, `<span>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Danh sách hoạt động · Bộ lọc nâng cao


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/activities/page.tsx:4](D:/WebNhiLun/frontend/app/activities/page.tsx:4) |
| ActivitiesPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useSearchParams, useState, params.get, Math.max, Number.isSafeInteger, Number, String, queryString.set, queryString.toString, useEffect, useRef, JSON.stringify, useLoad, categories.map, (filters?.cities ?? []).map, filters?.statuses?.map, data?.items.map | [frontend/components/portal/ActivitiesPage.tsx:21](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:21) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | ActivitiesPage | Không có | Không return tường minh; xem hiệu ứng state/API | window.history.replaceState | [frontend/components/portal/ActivitiesPage.tsx:46](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:46) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | ActivitiesPage | Không có | Không return tường minh; xem hiệu ứng state/API | JSON.stringify, setPage | [frontend/components/portal/ActivitiesPage.tsx:52](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:52) |
| favorite | Thêm hoặc bỏ hoạt động yêu thích. | ActivitiesPage | activity: Activity | Không return tường minh; xem hiệu ứng state/API | apiRequest, JSON.stringify, setMessage | [frontend/components/portal/ActivitiesPage.tsx:68](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:68) |
| search | Áp dụng điều kiện tìm kiếm. | ActivitiesPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setQuery, term.trim | [frontend/components/portal/ActivitiesPage.tsx:83](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:83) |
| resetFilters | Đặt lại các bộ lọc. | ActivitiesPage | Không có | Không return tường minh; xem hiệu ứng state/API | setCategory, setCity, setTerm, setQuery, setTime, setStatus, setPage | [frontend/components/portal/ActivitiesPage.tsx:90](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:90) |
| categoryClass | Chọn lớp CSS theo lĩnh vực. | ActivitiesPage | value: string | value.includes("Giáo dục") ? "edu" : value.includes("Y tế") ? "med" : value.includes("thiên tai") ? "relief" : value.includes("Cộng đồng") ? "comm" : "env" | value.includes | [frontend/components/portal/ActivitiesPage.tsx:99](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:99) |
| statusClass | Chọn lớp CSS theo trạng thái. | ActivitiesPage | value: string | value.includes("hoàn thành") \|\| value.includes("kết thúc") ? "closed" : value.includes("Sắp") ? "upcoming" : value.includes("diễn ra") ? "ongoing" : "open" | value.includes | [frontend/components/portal/ActivitiesPage.tsx:110](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:110) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | event | setTerm(event.target.value) | setTerm | [frontend/components/portal/ActivitiesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:154) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:171) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:190](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:190) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setCategory("") | setCategory | [frontend/components/portal/ActivitiesPage.tsx:205](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:205) |
| callback categories.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivitiesPage | item | ( <label className="act-filter-label" key={item}> <input type="radio" name="activity-category" checked={category === item} onChange={() => setCategory(item)} /> | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivitiesPage.tsx:209](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:209) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | callback categories.map | Không có | setCategory(item) | setCategory | [frontend/components/portal/ActivitiesPage.tsx:215](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:215) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | event | setCity(event.target.value) | setCity | [frontend/components/portal/ActivitiesPage.tsx:227](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:227) |
| callback (filters?.cities ?? []).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivitiesPage | item | ( <option key={item}>{item}</option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivitiesPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:230) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | e | setTime(e.target.value) | setTime | [frontend/components/portal/ActivitiesPage.tsx:241](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:241) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | e | setStatus(e.target.value) | setStatus | [frontend/components/portal/ActivitiesPage.tsx:255](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:255) |
| callback filters?.statuses?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivitiesPage | value | ( <option key={value} value={value}> {value} </option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivitiesPage.tsx:258](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:258) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:277](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:277) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setMobileFilterOpen(true) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:289](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:289) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setView("grid") | setView | [frontend/components/portal/ActivitiesPage.tsx:303](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:303) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivitiesPage | Không có | setView("list") | setView | [frontend/components/portal/ActivitiesPage.tsx:311](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:311) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ActivitiesPage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/ActivitiesPage.tsx:330](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:330) |
| callback categories.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivitiesPage | item | ( <option key={item}>{item}</option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ActivitiesPage.tsx:333](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:333) |
| callback data?.items.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ActivitiesPage | activity | ( <article className="act-card-horizontal" key={activity.id}> <Link href={`/activities/${activity.slug}`} className="act-card-thumb-area" > <MediaImage src={ im | imageUrl, categoryClass, statusClass, descriptionText, formatDate, Math.min, Math.max, Math.round | [frontend/components/portal/ActivitiesPage.tsx:350](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:350) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback data?.items.map | Không có | favorite(activity) | favorite | [frontend/components/portal/ActivitiesPage.tsx:450](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:450) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| form | onSubmit | `{search}` | [frontend/components/portal/ActivitiesPage.tsx:149](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:149) |
| input | onChange | `{(event) => setTerm(event.target.value)}` | [frontend/components/portal/ActivitiesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:154) |
| button | onClick | `{() => setMobileFilterOpen(false)}` | [frontend/components/portal/ActivitiesPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:171) |
| button | onClick | `{resetFilters}` | [frontend/components/portal/ActivitiesPage.tsx:183](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:183) |
| button | onClick | `{() => setMobileFilterOpen(false)}` | [frontend/components/portal/ActivitiesPage.tsx:190](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:190) |
| input | onChange | `{() => setCategory("")}` | [frontend/components/portal/ActivitiesPage.tsx:205](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:205) |
| input | onChange | `{() => setCategory(item)}` | [frontend/components/portal/ActivitiesPage.tsx:215](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:215) |
| select | onChange | `{(event) => setCity(event.target.value)}` | [frontend/components/portal/ActivitiesPage.tsx:227](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:227) |
| select | onChange | `{(e) => setTime(e.target.value)}` | [frontend/components/portal/ActivitiesPage.tsx:241](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:241) |
| select | onChange | `{(e) => setStatus(e.target.value)}` | [frontend/components/portal/ActivitiesPage.tsx:255](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:255) |
| button | onClick | `{resetFilters}` | [frontend/components/portal/ActivitiesPage.tsx:270](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:270) |
| button | onClick | `{() => setMobileFilterOpen(false)}` | [frontend/components/portal/ActivitiesPage.tsx:277](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:277) |
| button | onClick | `{() => setMobileFilterOpen(true)}` | [frontend/components/portal/ActivitiesPage.tsx:289](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:289) |
| button | onClick | `{() => setView("grid")}` | [frontend/components/portal/ActivitiesPage.tsx:303](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:303) |
| button | onClick | `{() => setView("list")}` | [frontend/components/portal/ActivitiesPage.tsx:311](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:311) |
| select | onChange | `{(event) => setCategory(event.target.value)}` | [frontend/components/portal/ActivitiesPage.tsx:330](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:330) |
| button | onClick | `{() => favorite(activity)}` | [frontend/components/portal/ActivitiesPage.tsx:450](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:450) |
| Pagination | onChange | `{setPage}` | [frontend/components/portal/ActivitiesPage.tsx:469](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:469) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| ActivitiesPage | useLoad | `ˋ/activities?${queryString.toString()}ˋ` | [frontend/components/portal/ActivitiesPage.tsx:59](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:59) |
| ActivitiesPage | useLoad | `"/activities/filters"` | [frontend/components/portal/ActivitiesPage.tsx:62](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:62) |
| favorite | apiRequest | `ˋ/me/favoritesˋ, { method: "POST", body: JSON.stringify({ activity_id: activity.id }), }` | [frontend/components/portal/ActivitiesPage.tsx:70](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:70) |
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

- [frontend/app/activities/page.tsx](D:/WebNhiLun/frontend/app/activities/page.tsx)
- [frontend/components/portal/ActivitiesPage.tsx](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx)
- [frontend/lib/rich-text.ts](D:/WebNhiLun/frontend/lib/rich-text.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/lib/api-types.ts](D:/WebNhiLun/frontend/lib/api-types.ts)
