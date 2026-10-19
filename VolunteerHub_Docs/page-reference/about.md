# Giới thiệu

Đường dẫn: `/about`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/about/page.tsx](D:/WebNhiLun/frontend/app/about/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### LegacyMarketingPage.tsx

Nguồn: [frontend/components/portal/LegacyMarketingPage.tsx](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx).

```text
LegacyMarketingPage
  PortalShell
    p.container.portal-message
    main.container
      p
    LegacyMarkup
    StatusMessage
    StoryCard
    p
    div.stories-pagination
      Pagination
    Modal
      form.portal-form
        div
          div
          p
        label
          input
        div
          label
        div
          div
          input
          div
        label
          textarea
        div
          button.btn.btn-outline
          button.btn.btn-primary
      iframe.story-video-player
      article
        div
          img
          div
          div
        div
        h2
        div
          div
          button
        div
        div
          button.btn.btn-outline
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/LegacyMarketingPage.tsx](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx) | `PortalShell`, `LegacyMarkup`, `StatusMessage`, `StoryCard`, `Pagination`, `Modal` | `<p>`, `<main>`, `<div>`, `<form>`, `<i>`, `<h2>`, `<label>`, `<span>`, `<input>`, `<select>`, `<option>`, `<button>`, `<img>`, `<textarea>`, `<iframe>`, `<article>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx) | — | `<nav>`, `<button>`, `<span>` |
| [frontend/components/portal/StoryCard.tsx](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx) | — | `<article>`, `<div>`, `<h3>`, `<p>`, `<span>`, `<button>`, `<i>` |

**Tiêu đề trực tiếp trong JSX:** Chia sẻ câu chuyện


Nội dung HTML được chèn qua `dangerouslySetInnerHTML`/template: cây JSX không chứa đầy đủ các thẻ bên trong chuỗi HTML hoặc nội dung lấy từ database. Không suy diễn những thẻ đó thành JSX đã kiểm kê.


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/about/page.tsx:3](D:/WebNhiLun/frontend/app/about/page.tsx:3) |
| LegacyMarketingPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { page }: { page: MarketingPage } | JSX giao diện | useRef, useLoad, useState, useDebouncedValue, String, useCallback, useEffect, createPortal, storyPage?.items.map, formatDate, Boolean, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:30](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:30) |
| callback useCallback | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | setModal, setPreviewUrl, setUploadingImage | [frontend/components/portal/LegacyMarketingPage.tsx:73](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:73) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | setCurrentPage | [frontend/components/portal/LegacyMarketingPage.tsx:78](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:78) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | optimizeHtmlImages, DOMPurify.sanitize, new DOMParser().parseFromString, doc .querySelectorAll<HTMLElement>(".story-card-item") .forEach, doc .querySelectorAll, setTemplates, setContent | [frontend/components/portal/LegacyMarketingPage.tsx:81](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:81) |
| callback doc .querySelectorAll<HTMLElement>(".story-card-item") .forEach | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | card, index | Không return tường minh; xem hiệu ứng state/API | card.remove | [frontend/components/portal/LegacyMarketingPage.tsx:92](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:92) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | LegacyMarketingPage | Không có | undefined / dừng xử lý; () => { root.removeEventListener("click", click); root.removeEventListener("input", input); } | setTarget, root.querySelector, root.addEventListener | [frontend/components/portal/LegacyMarketingPage.tsx:100](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:100) |
| click | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | callback useEffect | event: Event | undefined / dừng xử lý | element?.closest, root .querySelectorAll(".story-pill-btn") .forEach, root .querySelectorAll, setFilter, event.preventDefault, setMessage, setModal, root.querySelector, url?.startsWith, setVideo | [frontend/components/portal/LegacyMarketingPage.tsx:104](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:104) |
| callback root .querySelectorAll(".story-pill-btn") .forEach | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | click | item | item.classList.toggle("active", item === pill) | item.classList.toggle | [frontend/components/portal/LegacyMarketingPage.tsx:110](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:110) |
| input | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | callback useEffect | event: Event | Không return tường minh; xem hiệu ứng state/API | event.target.closest, setQuery | [frontend/components/portal/LegacyMarketingPage.tsx:134](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:134) |
| like | Thay đổi lượt thích Stories qua API. | LegacyMarketingPage | story: Story | undefined / dừng xử lý | setMessage, apiRequest, encodeURIComponent, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:148](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:148) |
| handleImageSelect | Xử lý ảnh được chọn cho nội dung Stories. | LegacyMarketingPage | event: ChangeEvent<HTMLInputElement> | undefined / dừng xử lý | setMessage, URL.createObjectURL, setPreviewUrl, setUploadingImage, formData.append, apiRequest, setThumbnailUrl, reader.readAsDataURL | [frontend/components/portal/LegacyMarketingPage.tsx:164](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:164) |
| handleRemoveImage | Bỏ ảnh đang chọn khỏi biểu mẫu. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | setPreviewUrl, setThumbnailUrl | [frontend/components/portal/LegacyMarketingPage.tsx:201](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:201) |
| share | Chia sẻ nội dung hoặc sao chép liên kết. | LegacyMarketingPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setBusy, apiRequest, JSON.stringify, thumbnailUrl.trim, close, setTitle, setBody, setThumbnailUrl, setPreviewUrl, setCurrentPage, setMessage, refresh | [frontend/components/portal/LegacyMarketingPage.tsx:209](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:209) |
| callback storyPage?.items.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | LegacyMarketingPage | story | ( <StoryCard key={story.id} story={story} template={templates[story.id]} liked={Boolean(likes?.includes(story.id))} onLike={() => { void like(story); }} onOpen= | Boolean, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:264](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:264) |
| inline onLike | Handler trực tiếp tại thuộc tính onLike; xem các lời gọi và bảng sự kiện. | callback storyPage?.items.map | Không có | Không return tường minh; xem hiệu ứng state/API | like | [frontend/components/portal/LegacyMarketingPage.tsx:270](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:270) |
| inline onOpen | Handler trực tiếp tại thuộc tính onOpen; xem các lời gọi và bảng sự kiện. | callback storyPage?.items.map | Không có | Không return tường minh; xem hiệu ứng state/API | setSelected, setModal | [frontend/components/portal/LegacyMarketingPage.tsx:273](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:273) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | event | setTitle(event.target.value) | setTitle | [frontend/components/portal/LegacyMarketingPage.tsx:333](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:333) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/LegacyMarketingPage.tsx:348](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:348) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | setUseUrlInput, setPreviewUrl | [frontend/components/portal/LegacyMarketingPage.tsx:372](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:372) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | event | Không return tường minh; xem hiệu ứng state/API | setThumbnailUrl, setPreviewUrl | [frontend/components/portal/LegacyMarketingPage.tsx:398](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:398) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | Không có | fileInputRef.current?.click() | fileInputRef.current?.click | [frontend/components/portal/LegacyMarketingPage.tsx:488](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:488) |
| inline onMouseEnter | Handler trực tiếp tại thuộc tính onMouseEnter; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | e | Không return tường minh; xem hiệu ứng state/API | Không gọi hàm khác trực tiếp | [frontend/components/portal/LegacyMarketingPage.tsx:502](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:502) |
| inline onMouseLeave | Handler trực tiếp tại thuộc tính onMouseLeave; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | e | Không return tường minh; xem hiệu ứng state/API | Không gọi hàm khác trực tiếp | [frontend/components/portal/LegacyMarketingPage.tsx:506](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:506) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | event | setBody(event.target.value) | setBody | [frontend/components/portal/LegacyMarketingPage.tsx:553](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:553) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | LegacyMarketingPage | Không có | Không return tường minh; xem hiệu ứng state/API | like, Boolean, likes?.includes, setSelected, Math.max | [frontend/components/portal/LegacyMarketingPage.tsx:717](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:717) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| StoryCard | onLike | `{() => { void like(story); }}` | [frontend/components/portal/LegacyMarketingPage.tsx:270](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:270) |
| StoryCard | onOpen | `{() => { setSelected(story); setModal("detail"); }}` | [frontend/components/portal/LegacyMarketingPage.tsx:273](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:273) |
| Pagination | onChange | `{setCurrentPage}` | [frontend/components/portal/LegacyMarketingPage.tsx:287](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:287) |
| Modal | onClose | `{close}` | [frontend/components/portal/LegacyMarketingPage.tsx:295](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:295) |
| form | onSubmit | `{share}` | [frontend/components/portal/LegacyMarketingPage.tsx:297](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:297) |
| input | onChange | `{(event) => setTitle(event.target.value)}` | [frontend/components/portal/LegacyMarketingPage.tsx:333](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:333) |
| select | onChange | `{(event) => setCategory(event.target.value)}` | [frontend/components/portal/LegacyMarketingPage.tsx:348](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:348) |
| button | onClick | `{() => { setUseUrlInput(!useUrlInput); if (!useUrlInput) { setPreviewUrl(thumbnailUrl); } }}` | [frontend/components/portal/LegacyMarketingPage.tsx:372](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:372) |
| input | onChange | `{(event) => { setThumbnailUrl(event.target.value); setPreviewUrl(event.target.value); }}` | [frontend/components/portal/LegacyMarketingPage.tsx:398](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:398) |
| input | onChange | `{handleImageSelect}` | [frontend/components/portal/LegacyMarketingPage.tsx:416](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:416) |
| button | onClick | `{handleRemoveImage}` | [frontend/components/portal/LegacyMarketingPage.tsx:463](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:463) |
| div | onClick | `{() => fileInputRef.current?.click()}` | [frontend/components/portal/LegacyMarketingPage.tsx:488](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:488) |
| div | onMouseEnter | `{(e) => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.background = "#f0fdf4"; }}` | [frontend/components/portal/LegacyMarketingPage.tsx:502](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:502) |
| div | onMouseLeave | `{(e) => { e.currentTarget.style.borderColor = "var(--border-default, #cbd5e1)"; e.currentTarget.style.background = "var(--canvas, #f8fafc)"; }}` | [frontend/components/portal/LegacyMarketingPage.tsx:506](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:506) |
| textarea | onChange | `{(event) => setBody(event.target.value)}` | [frontend/components/portal/LegacyMarketingPage.tsx:553](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:553) |
| button | onClick | `{close}` | [frontend/components/portal/LegacyMarketingPage.tsx:570](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:570) |
| button | onClick | `{() => { if (selected) { void like(selected); const isLiked = Boolean(likes?.includes(selected.id)); setSelected({ ...selected, likes: isLiked ? Math.max(0, (selected.likes \|\| 1) - 1) : (selected.like` | [frontend/components/portal/LegacyMarketingPage.tsx:717](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:717) |
| button | onClick | `{close}` | [frontend/components/portal/LegacyMarketingPage.tsx:770](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:770) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| LegacyMarketingPage | useLoad | `ˋ/site-content/${page === "about" ? "aboutContent" : "storiesContent"}ˋ` | [frontend/components/portal/LegacyMarketingPage.tsx:32](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:32) |
| LegacyMarketingPage | useLoad | `"/auth/me"` | [frontend/components/portal/LegacyMarketingPage.tsx:35](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:35) |
| LegacyMarketingPage | useLoad | `page === "stories" ? ˋ/stories?${params}ˋ : null` | [frontend/components/portal/LegacyMarketingPage.tsx:51](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:51) |
| LegacyMarketingPage | useLoad | `page === "stories" && me ? "/me/story-likes" : null` | [frontend/components/portal/LegacyMarketingPage.tsx:54](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:54) |
| like | apiRequest | `ˋ/stories/${encodeURIComponent(story.id)}/like?liked=${!likes?.includes(story.id)}ˋ, { method: "PUT" }` | [frontend/components/portal/LegacyMarketingPage.tsx:154](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:154) |
| handleImageSelect | apiRequest | `"/stories/upload-image", { method: "POST", body: formData, }` | [frontend/components/portal/LegacyMarketingPage.tsx:177](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:177) |
| share | apiRequest | `"/stories", { method: "POST", body: JSON.stringify({ title, body, category, thumbnail_url: thumbnailUrl.trim() \|\| undefined, }), }` | [frontend/components/portal/LegacyMarketingPage.tsx:213](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:213) |
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

- [frontend/app/about/page.tsx](D:/WebNhiLun/frontend/app/about/page.tsx)
- [frontend/components/portal/LegacyMarketingPage.tsx](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx)
- [frontend/components/portal/Modal.tsx](D:/WebNhiLun/frontend/components/portal/Modal.tsx)
- [frontend/components/portal/LegacyMarkup.tsx](D:/WebNhiLun/frontend/components/portal/LegacyMarkup.tsx)
- [frontend/components/portal/StoryCard.tsx](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx)
