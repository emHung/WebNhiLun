# Xác minh chứng nhận

Đường dẫn: `/certificates/verify`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/certificates/verify/page.tsx](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

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

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| VerifyForm | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | Không có | JSX giao diện | useSearchParams, useState, params.get, useLoad, encodeURIComponent, formatDate | [frontend/app/certificates/verify/page.tsx:10](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:10) |
| inline onSubmit | Handler trực tiếp tại thuộc tính onSubmit; xem các lời gọi và bảng sự kiện. | VerifyForm | e: FormEvent | Không return tường minh; xem hiệu ứng state/API | e.preventDefault, setCode, input.trim | [frontend/app/certificates/verify/page.tsx:28](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:28) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | VerifyForm | e | setInput(e.target.value) | setInput | [frontend/app/certificates/verify/page.tsx:37](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:37) |
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/certificates/verify/page.tsx:58](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:58) |
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

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| form | onSubmit | `{submitNavSearch}` | [frontend/components/portal/shared.tsx:160](D:/WebNhiLun/frontend/components/portal/shared.tsx:160) |
| input | onChange | `{(event) => setNavSearch(event.target.value)}` | [frontend/components/portal/shared.tsx:164](D:/WebNhiLun/frontend/components/portal/shared.tsx:164) |
| button | onClick | `{() => setUserMenuOpen((open) => !open)}` | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| button | onClick | `{signOut}` | [frontend/components/portal/shared.tsx:243](D:/WebNhiLun/frontend/components/portal/shared.tsx:243) |
| button | onClick | `{() => setMobileOpen((open) => !open)}` | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| VerifyForm | useLoad | `code ? ˋ/certificates/verify/${encodeURIComponent(code)}ˋ : null` | [frontend/app/certificates/verify/page.tsx:14](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:14) |
| PortalShell | useLoad | `workspace ? null : "/auth/me"` | [frontend/components/portal/shared.tsx:34](D:/WebNhiLun/frontend/components/portal/shared.tsx:34) |
| signOut | createClient().auth.signOut | `` | [frontend/components/portal/shared.tsx:39](D:/WebNhiLun/frontend/components/portal/shared.tsx:39) |
| signOut | router.replace | `"/auth"` | [frontend/components/portal/shared.tsx:40](D:/WebNhiLun/frontend/components/portal/shared.tsx:40) |
| submitNavSearch | router.push | `ˋ/activities?search=${encodeURIComponent(query)}ˋ` | [frontend/components/portal/shared.tsx:46](D:/WebNhiLun/frontend/components/portal/shared.tsx:46) |
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

- [frontend/app/certificates/verify/page.tsx](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx)
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
