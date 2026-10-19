# Yêu thích

Đường dẫn: `/favorites`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/favorites/page.tsx](D:/WebNhiLun/frontend/app/favorites/page.tsx).

**Truy cập theo middleware:** Tài khoản đã đăng nhập; /dashboard điều hướng theo vai trò thực tế. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### shared.tsx

Nguồn: [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx).

```text
PortalShell
  header
    div.vh-navbar-container
      Link.vh-brand-group
      ul.vh-nav-menu-list
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
        li.vh-nav-item
          Link
      form.vh-nav-search-bar
        input
      div.vh-nav-actions
        NotificationBell
        div
          button.vh-user-pill-btn
          div
        Link.btn.btn-primary.btn-sm
        button.vh-mobile-toggle-btn
  div.portal-main
  footer.app-footer
    div.container
      p
      div
        Link
        Link
PageIntro
  div.portal-page-intro
    div
      h1
      p
StatusMessage
  div.portal-message.portal-error
EmptyState
  div.portal-empty
    p
formatDate
```

### ActivityCard.tsx

Nguồn: [frontend/components/portal/ActivityCard.tsx](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx).

```text
ActivityCard
  article.portal-card.portal-activity-card
    Link
      MediaImage.portal-activity-image
      div.portal-activity-image
    div.portal-meta
    h3
      Link
    p
    div.portal-meta
    div
      div.portal-meta
      div.portal-progress
    div.portal-form-actions
      Link.btn.btn-primary.btn-sm
      button.btn.btn-outline.btn-sm
```

### VolunteerWorkspaceFrame.tsx

Nguồn: [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx).

```text
VolunteerWorkspaceFrame
  div.profile-app-container.volunteer-workspace
    aside.profile-sidebar
      Link.sidebar-brand-box
      ul.sidebar-menu-list
        li
          Link
      div.sidebar-mini-promo
        div.mini-promo-graphic
        p.mini-promo-title
        Link.mini-promo-btn
    main.profile-main-area
      div.profile-topbar
        form.topbar-search-box
          input.topbar-search-input
        div.topbar-right-actions
          NotificationBell
          div.workspace-account
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/ActivityCard.tsx](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx) | `Link`, `MediaImage` | `<article>`, `<div>`, `<span>`, `<h3>`, `<p>`, `<i>`, `<button>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, data?.map | [frontend/app/favorites/page.tsx:14](D:/WebNhiLun/frontend/app/favorites/page.tsx:14) |
| callback data?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | Page | item | ( <article key={item.id}> <ActivityCard activity={item} /> <button className="btn btn-outline" onClick={async () => { try { await apiRequest( `/me/favorites/${e | Không gọi hàm khác trực tiếp | [frontend/app/favorites/page.tsx:27](D:/WebNhiLun/frontend/app/favorites/page.tsx:27) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback data?.map | Không có | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, refresh, setMessage | [frontend/app/favorites/page.tsx:32](D:/WebNhiLun/frontend/app/favorites/page.tsx:32) |
| PortalShell | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { children }: { children: ReactNode } | JSX giao diện | usePathname, useRouter, ….includes, useLoad, useState, user?.role?.toLowerCase, role.includes, useEffect, pathname.startsWith, Boolean, imageUrl | [frontend/components/portal/shared.tsx:23](D:/WebNhiLun/frontend/components/portal/shared.tsx:23) |
| signOut | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | PortalShell | Không có | Không return tường minh; xem hiệu ứng state/API | createClient().auth.signOut, createClient, router.replace, router.refresh | [frontend/components/portal/shared.tsx:38](D:/WebNhiLun/frontend/components/portal/shared.tsx:38) |
| submitNavSearch | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | PortalShell | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, navSearch.trim, router.push, encodeURIComponent | [frontend/components/portal/shared.tsx:43](D:/WebNhiLun/frontend/components/portal/shared.tsx:43) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | PortalShell | Không có | () => document.body.classList.remove("act-page-wrapper") | pathname.startsWith, document.body.classList.remove, document.body.classList.add | [frontend/components/portal/shared.tsx:61](D:/WebNhiLun/frontend/components/portal/shared.tsx:61) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | PortalShell | event | setNavSearch(event.target.value) | setNavSearch | [frontend/components/portal/shared.tsx:164](D:/WebNhiLun/frontend/components/portal/shared.tsx:164) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | PortalShell | Không có | setUserMenuOpen((open) => !open) | setUserMenuOpen | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| callback setUserMenuOpen | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | open | !open | Không gọi hàm khác trực tiếp | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | PortalShell | Không có | setMobileOpen((open) => !open) | setMobileOpen | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |
| callback setMobileOpen | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | open | !open | Không gọi hàm khác trực tiếp | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |
| PageIntro | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { eyebrow, title, description, action, }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; } | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/components/portal/shared.tsx:306](D:/WebNhiLun/frontend/components/portal/shared.tsx:306) |
| StatusMessage | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { error, loading, }: { error?: string; loading?: boolean; } | JSX giao diện; null | Không gọi hàm khác trực tiếp | [frontend/components/portal/shared.tsx:329](D:/WebNhiLun/frontend/components/portal/shared.tsx:329) |
| EmptyState | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { children }: { children: ReactNode } | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/components/portal/shared.tsx:351](D:/WebNhiLun/frontend/components/portal/shared.tsx:351) |
| formatDate | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | value?: string | "Chưa cập nhật"; Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date) | value.slice, Number.isNaN, date.valueOf, new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format | [frontend/components/portal/shared.tsx:360](D:/WebNhiLun/frontend/components/portal/shared.tsx:360) |
| ActivityCard | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { activity, onFavorite, }: { activity: Activity; onFavorite?: (activity: Activity) => void; } | JSX giao diện | Math.min, Math.round, Math.max, imageUrl, formatDate, descriptionText | [frontend/components/portal/ActivityCard.tsx:11](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx:11) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ActivityCard | Không có | onFavorite(activity) | onFavorite | [frontend/components/portal/ActivityCard.tsx:75](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx:75) |
| VolunteerWorkspaceFrame | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { active, profile, searchPlaceholder = "Tìm kiếm hoạt động, địa điểm...", searchValue, onSearchChange, children, }: { active: string; profile?: Profile \| null; unreadCount?: number; searchPlaceholder?: string; searchValue?: string; onSearchChange?: (value: string) => void; children: ReactNode; } | JSX giao diện | useNotificationSummary, useState, useRouter, useEffect, ….concat, menu .filter, links.map, imageUrl | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:31](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:31) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | VolunteerWorkspaceFrame | Không có | () => document.body.classList.remove("profile-layout") | document.body.classList.add | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:52](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:52) |
| callback menu .filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerWorkspaceFrame | row | !["Dashboard", "Hoạt động của tôi", "Chứng nhận"].includes( row[1], ) | ["Dashboard", "Hoạt động của tôi", "Chứng nhận"].includes | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:60](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:60) |
| callback links.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | VolunteerWorkspaceFrame | [icon, label, href] | ( <li key={label} className={`sidebar-menu-item${active === href ? " active" : ""}`} > <Link href={href} aria-current={active === href ? "page" : undefined} > < | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:85](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:85) |
| inline onSubmit | Handler trực tiếp tại thuộc tính onSubmit; xem các lời gọi và bảng sự kiện. | VolunteerWorkspaceFrame | event | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, router.push, encodeURIComponent | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:123](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:123) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | VolunteerWorkspaceFrame | e | onSearchChange ? onSearchChange(e.target.value) : setSearch(e.target.value) | onSearchChange, setSearch | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:133](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:133) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerWorkspaceFrame | Không có | setUserOpen((value) => !value) | setUserOpen | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:148](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:148) |
| callback setUserOpen | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | value | !value | Không gọi hàm khác trực tiếp | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:148](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:148) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | VolunteerWorkspaceFrame | Không có | Không return tường minh; xem hiệu ứng state/API | createClient().auth.signOut, createClient, router.replace, router.refresh | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:164](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:164) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| form | onSubmit | `{submitNavSearch}` | [frontend/components/portal/shared.tsx:160](D:/WebNhiLun/frontend/components/portal/shared.tsx:160) |
| input | onChange | `{(event) => setNavSearch(event.target.value)}` | [frontend/components/portal/shared.tsx:164](D:/WebNhiLun/frontend/components/portal/shared.tsx:164) |
| button | onClick | `{() => setUserMenuOpen((open) => !open)}` | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| button | onClick | `{signOut}` | [frontend/components/portal/shared.tsx:243](D:/WebNhiLun/frontend/components/portal/shared.tsx:243) |
| button | onClick | `{() => setMobileOpen((open) => !open)}` | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |
| button | onClick | `{() => onFavorite(activity)}` | [frontend/components/portal/ActivityCard.tsx:75](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx:75) |
| form | onSubmit | `{(event) => { event.preventDefault(); if (!onSearchChange) router.push(ˋ/activities?search=${encodeURIComponent(search)}ˋ); }}` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:123](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:123) |
| input | onChange | `{(e) => onSearchChange ? onSearchChange(e.target.value) : setSearch(e.target.value) }` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:133](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:133) |
| button | onClick | `{() => setUserOpen((value) => !value)}` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:148](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:148) |
| button | onClick | `{async () => { await createClient().auth.signOut(); router.replace("/auth"); router.refresh(); }}` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:164](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:164) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| Page | useLoad | `"/me/profile"` | [frontend/app/favorites/page.tsx:15](D:/WebNhiLun/frontend/app/favorites/page.tsx:15) |
| Page | useLoad | `"/me/favorites"` | [frontend/app/favorites/page.tsx:17](D:/WebNhiLun/frontend/app/favorites/page.tsx:17) |
| inline onClick | apiRequest | `ˋ/me/favorites/${encodeURIComponent(item.id)}ˋ, { method: "DELETE" }` | [frontend/app/favorites/page.tsx:34](D:/WebNhiLun/frontend/app/favorites/page.tsx:34) |
| PortalShell | useLoad | `workspace ? null : "/auth/me"` | [frontend/components/portal/shared.tsx:34](D:/WebNhiLun/frontend/components/portal/shared.tsx:34) |
| signOut | createClient().auth.signOut | `` | [frontend/components/portal/shared.tsx:39](D:/WebNhiLun/frontend/components/portal/shared.tsx:39) |
| signOut | router.replace | `"/auth"` | [frontend/components/portal/shared.tsx:40](D:/WebNhiLun/frontend/components/portal/shared.tsx:40) |
| submitNavSearch | router.push | `ˋ/activities?search=${encodeURIComponent(query)}ˋ` | [frontend/components/portal/shared.tsx:46](D:/WebNhiLun/frontend/components/portal/shared.tsx:46) |
| inline onSubmit | router.push | `ˋ/activities?search=${encodeURIComponent(search)}ˋ` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:126](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:126) |
| inline onClick | createClient().auth.signOut | `` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:165](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:165) |
| inline onClick | router.replace | `"/auth"` | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:166](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:166) |
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

- [frontend/app/favorites/page.tsx](D:/WebNhiLun/frontend/app/favorites/page.tsx)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/ActivityCard.tsx](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx)
- [frontend/lib/rich-text.ts](D:/WebNhiLun/frontend/lib/rich-text.ts)
- [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx)
