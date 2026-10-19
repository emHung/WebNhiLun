# Trang chủ

Đường dẫn: `/`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/page.tsx](D:/WebNhiLun/frontend/app/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### HomePage.tsx

Nguồn: [frontend/components/portal/HomePage.tsx](D:/WebNhiLun/frontend/components/portal/HomePage.tsx).

```text
HomePage
  PortalShell
    div.container
      section.home-hero-wrap
        div.home-hero-content
          div
          div.home-hero-visual
      section.home-stats-filter-bar
        div.stats-three-counters
          div.stat-single-box
        form.quick-filter-form
          select.quick-select-control
          select.quick-select-control
          select.quick-select-control
          button.btn-quick-search
      section
        div.section-header-row
          h2.section-main-title
          Link.section-view-all-link
        StatusMessage
        EmptyState
        div.featured-activities-grid
          article.featured-act-card
          aside.featured-join-promo-card
      section
        h2.section-main-title
        div.categories-card-grid
          Link.category-item-card
      section.home-bottom-grid
        div.story-video-card
          div.story-card-content
          div.story-play-btn
        div.testimonials-card-box
          div.section-header-row
          div.testimonials-grid-row
      div
        div
          div
          div
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/HomePage.tsx](D:/WebNhiLun/frontend/components/portal/HomePage.tsx) | `PortalShell`, `Link`, `MediaImage`, `StatusMessage`, `EmptyState` | `<div>`, `<section>`, `<i>`, `<span>`, `<h1>`, `<br>`, `<p>`, `<button>`, `<form>`, `<select>`, `<option>`, `<h2>`, `<article>`, `<h3>`, `<aside>`, `<ul>`, `<li>`, `<strong>`, `<iframe>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Cùng nhau làm nên những điều tốt đẹp hơn ♡ · Hoạt động nổi bật · Trở thành tình nguyện viên ngay hôm nay · Lĩnh vực hoạt động · Những câu chuyện lan tỏa yêu thương · Video giới thiệu NhiLun


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/page.tsx:3](D:/WebNhiLun/frontend/app/page.tsx:3) |
| HomePage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, data?.items.slice, useState, ….map, filters?.categories.map, filters?.cities.map, featuredActivities.map, (filters?.categories ?? []).map | [frontend/components/portal/HomePage.tsx:21](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:21) |
| submitQuickSearch | Chuyển điều kiện tìm nhanh sang trang hoạt động. | HomePage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, params.set, window.location.assign, params.toString | [frontend/components/portal/HomePage.tsx:37](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:37) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | Không có | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:76](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:76) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | HomePage | [icon, color, value, label] | ( <div className="stat-single-box" key={label}> <div className="stat-single-icon"> <i className={String(icon)} style={{ color: String(color), fontSize: "1.35rem | String | [frontend/components/portal/HomePage.tsx:131](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:131) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | HomePage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/HomePage.tsx:153](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:153) |
| callback filters?.categories.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | HomePage | value | ( <option key={value}>{value}</option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/HomePage.tsx:157](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:157) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | HomePage | event | setCity(event.target.value) | setCity | [frontend/components/portal/HomePage.tsx:164](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:164) |
| callback filters?.cities.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | HomePage | value | ( <option key={value}>{value}</option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/HomePage.tsx:168](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:168) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | HomePage | event | setTime(event.target.value) | setTime | [frontend/components/portal/HomePage.tsx:175](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:175) |
| callback featuredActivities.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | HomePage | activity, index | ( <article className="featured-act-card" key={activity.id}> <div className="act-card-thumb-wrap"> <Link href={`/activities/${activity.slug}`}> {activity.banner_ | imageUrl, descriptionText, formatDate | [frontend/components/portal/HomePage.tsx:205](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:205) |
| callback (filters?.categories ?? []).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | HomePage | name, index | JSX giao diện | encodeURIComponent | [frontend/components/portal/HomePage.tsx:287](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:287) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | Không có | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:321](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:321) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | Không có | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:341](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:341) |
| inline onKeyDown | Handler trực tiếp tại thuộc tính onKeyDown; xem các lời gọi và bảng sự kiện. | HomePage | e | Không return tường minh; xem hiệu ứng state/API | setVideoOpen | [frontend/components/portal/HomePage.tsx:344](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:344) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | Không có | setVideoOpen(false) | setVideoOpen | [frontend/components/portal/HomePage.tsx:473](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:473) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | event | event.stopPropagation() | event.stopPropagation | [frontend/components/portal/HomePage.tsx:488](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:488) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | HomePage | Không có | setVideoOpen(false) | setVideoOpen | [frontend/components/portal/HomePage.tsx:511](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:511) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => setVideoOpen(true)}` | [frontend/components/portal/HomePage.tsx:76](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:76) |
| form | onSubmit | `{submitQuickSearch}` | [frontend/components/portal/HomePage.tsx:146](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:146) |
| select | onChange | `{(event) => setCategory(event.target.value)}` | [frontend/components/portal/HomePage.tsx:153](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:153) |
| select | onChange | `{(event) => setCity(event.target.value)}` | [frontend/components/portal/HomePage.tsx:164](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:164) |
| select | onChange | `{(event) => setTime(event.target.value)}` | [frontend/components/portal/HomePage.tsx:175](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:175) |
| button | onClick | `{() => setVideoOpen(true)}` | [frontend/components/portal/HomePage.tsx:321](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:321) |
| div | onClick | `{() => setVideoOpen(true)}` | [frontend/components/portal/HomePage.tsx:341](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:341) |
| div | onKeyDown | `{(e) => { if (e.key === "Enter" \|\| e.key === " ") setVideoOpen(true); }}` | [frontend/components/portal/HomePage.tsx:344](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:344) |
| div | onClick | `{() => setVideoOpen(false)}` | [frontend/components/portal/HomePage.tsx:473](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:473) |
| div | onClick | `{(event) => event.stopPropagation()}` | [frontend/components/portal/HomePage.tsx:488](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:488) |
| button | onClick | `{() => setVideoOpen(false)}` | [frontend/components/portal/HomePage.tsx:511](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:511) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| HomePage | useLoad | `"/home/metrics"` | [frontend/components/portal/HomePage.tsx:22](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:22) |
| HomePage | useLoad | `"/activities?page=1&limit=6&featured=true"` | [frontend/components/portal/HomePage.tsx:23](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:23) |
| HomePage | useLoad | `"/activities/filters"` | [frontend/components/portal/HomePage.tsx:26](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:26) |
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

- [frontend/app/page.tsx](D:/WebNhiLun/frontend/app/page.tsx)
- [frontend/components/portal/HomePage.tsx](D:/WebNhiLun/frontend/components/portal/HomePage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/lib/rich-text.ts](D:/WebNhiLun/frontend/lib/rich-text.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/lib/api-types.ts](D:/WebNhiLun/frontend/lib/api-types.ts)
