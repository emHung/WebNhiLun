# Hồ sơ cá nhân

Đường dẫn: `/profile`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/profile/page.tsx](D:/WebNhiLun/frontend/app/profile/page.tsx).

**Truy cập theo middleware:** Tài khoản đã đăng nhập; /dashboard điều hướng theo vai trò thực tế. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### ProfilePage.tsx

Nguồn: [frontend/components/portal/ProfilePage.tsx](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx).

```text
ProfilePage
  PortalShell
    VolunteerWorkspaceFrame
      div.profile-page-content
        StatusMessage
        div.portal-message
        section.profile-hero-card
          div.profile-cover-banner
          div.profile-meta-bar
        div.profile-nav-tabs-bar
          button
        div.profile-tab-pane.active
          ProfileOverview
          form.profile-box-card.profile-edit-card.portal-form
          section.profile-box-card
          section.profile-box-card
          section.profile-box-card
          section.profile-box-card
          section.profile-box-card
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/ProfilePage.tsx](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx) | `PortalShell`, `VolunteerWorkspaceFrame`, `StatusMessage`, `MediaImage`, `ProfileOverview`, `EmptyState` | `<div>`, `<section>`, `<button>`, `<i>`, `<span>`, `<h1>`, `<form>`, `<h2>`, `<label>`, `<input>`, `<textarea>`, `<p>`, `<strong>`, `<table>`, `<thead>`, `<tr>`, `<th>`, `<tbody>`, `<td>`, `<article>`, `<small>` |
| [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<div>`, `<aside>`, `<span>`, `<i>`, `<ul>`, `<li>`, `<p>`, `<br>`, `<main>`, `<form>`, `<input>`, `<button>`, `<strong>`, `<small>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/ProfileOverview.tsx](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx) | `Link`, `MediaImage`, `ProfileDocuments` | `<div>`, `<section>`, `<i>`, `<span>`, `<h3>`, `<button>`, `<p>`, `<strong>`, `<small>`, `<aside>` |
| [frontend/components/portal/ProfileDocuments.tsx](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx) | `StatusMessage` | `<section>`, `<div>`, `<h3>`, `<i>`, `<label>`, `<input>`, `<p>`, `<span>`, `<button>` |

**Tiêu đề trực tiếp trong JSX:** Cập nhật thông tin cá nhân · Thông tin cá nhân · Kỹ năng &amp; lĩnh vực quan tâm · Lịch sử tham gia · Chứng nhận tình nguyện · Cài đặt hồ sơ


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/profile/page.tsx:4](D:/WebNhiLun/frontend/app/profile/page.tsx:4) |
| ProfilePage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, useSearchParams, useEffect, JSON.stringify, imageUrl, data.name.slice, formatDate, ….map, data.skills.map, applications.map, certificates.map | [frontend/components/portal/ProfilePage.tsx:21](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:21) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | params.get, ["overview", "info", "skills", "history", "certs", "settings"].includes, setActiveTab | [frontend/components/portal/ProfilePage.tsx:35](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:35) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setName, setPhone, setDob, data.dob?.slice, setCity, setBio, setInterests, (data.interests ?? []).join, setSkills, (data.skills ?? []).join | [frontend/components/portal/ProfilePage.tsx:47](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:47) |
| save | Lưu dữ liệu biểu mẫu; xem endpoint và handler ở bảng bên dưới. | ProfilePage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, upload.append, apiRequest, JSON.stringify, interests .split(",") .map((value) => value.trim()) .filter, interests .split(",") .map, interests .split, skills .split(",") .map((value) => value.trim()) .filter, skills .split(",") .map, skills .split, setEditing, setAvatar, setMessage, refresh | [frontend/components/portal/ProfilePage.tsx:58](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:58) |
| callback interests .split(",") .map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | save | value | value.trim() | value.trim | [frontend/components/portal/ProfilePage.tsx:81](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:81) |
| callback skills .split(",") .map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | save | value | value.trim() | value.trim | [frontend/components/portal/ProfilePage.tsx:85](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:85) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | undefined / dừng xử lý | window.prompt, apiRequest, JSON.stringify, refresh, setMessage | [frontend/components/portal/ProfilePage.tsx:132](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:132) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:173](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:173) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:215](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:215) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ProfilePage | [key, label] | ( <button type="button" key={key} className={`profile-tab-button${activeTab === key ? " active" : ""}`} onClick={() => { setActiveTab(key); if (key === "info" \| | Không gọi hàm khác trực tiếp | [frontend/components/portal/ProfilePage.tsx:232](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:232) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback ….map | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:237](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:237) |
| inline edit | Handler trực tiếp tại thuộc tính edit; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:254](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:254) |
| inline skills | Handler trực tiếp tại thuộc tính skills; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:258](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:258) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setName(event.target.value) | setName | [frontend/components/portal/ProfilePage.tsx:276](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:276) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setPhone(event.target.value) | setPhone | [frontend/components/portal/ProfilePage.tsx:289](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:289) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setDob(event.target.value) | setDob | [frontend/components/portal/ProfilePage.tsx:298](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:298) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setCity(event.target.value) | setCity | [frontend/components/portal/ProfilePage.tsx:305](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:305) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setSkills(event.target.value) | setSkills | [frontend/components/portal/ProfilePage.tsx:313](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:313) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setInterests(event.target.value) | setInterests | [frontend/components/portal/ProfilePage.tsx:320](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:320) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setAvatar(event.target.files?.[0] ?? null) | setAvatar | [frontend/components/portal/ProfilePage.tsx:331](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:331) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ProfilePage | event | setBio(event.target.value) | setBio | [frontend/components/portal/ProfilePage.tsx:341](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:341) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | setEditing(false) | setEditing | [frontend/components/portal/ProfilePage.tsx:352](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:352) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | setEditing(true) | setEditing | [frontend/components/portal/ProfilePage.tsx:387](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:387) |
| callback data.skills.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ProfilePage | skill | ( <span key={skill} className="interest-tag-pill green" > {skill} </span> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/ProfilePage.tsx:398](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:398) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:410](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:410) |
| callback applications.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ProfilePage | item | ( <tr key={item.id}> <td>{item.activity_title}</td> <td>{formatDate(item.applied_at)}</td> <td>{item.status_text \|\| item.status}</td> </tr> ) | formatDate | [frontend/components/portal/ProfilePage.tsx:433](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:433) |
| callback certificates.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ProfilePage | item | ( <article className="profile-recent-row" key={item.id}> <div> <strong>{item.title}</strong> <small> {item.issuer} · {formatDate(item.issue_date)} </small> </di | formatDate | [frontend/components/portal/ProfilePage.tsx:454](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:454) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ProfilePage | Không có | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:476](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:476) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{async () => { const url = window.prompt( "URL ảnh bìa", data.cover_url \|\| "", ); if (url === null) return; try { await apiRequest("/me/profile", { method: "PATCH", body: JSON.stringify({ cover_url: u` | [frontend/components/portal/ProfilePage.tsx:132](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:132) |
| button | onClick | `{() => { setActiveTab("info"); setEditing(true); }}` | [frontend/components/portal/ProfilePage.tsx:173](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:173) |
| button | onClick | `{() => { setActiveTab("info"); setEditing(true); }}` | [frontend/components/portal/ProfilePage.tsx:215](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:215) |
| button | onClick | `{() => { setActiveTab(key); if (key === "info" \|\| key === "settings") setEditing(true); else setEditing(false); }}` | [frontend/components/portal/ProfilePage.tsx:237](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:237) |
| form | onSubmit | `{save}` | [frontend/components/portal/ProfilePage.tsx:268](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:268) |
| input | onChange | `{(event) => setName(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:276](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:276) |
| input | onChange | `{(event) => setPhone(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:289](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:289) |
| input | onChange | `{(event) => setDob(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:298](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:298) |
| input | onChange | `{(event) => setCity(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:305](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:305) |
| input | onChange | `{(event) => setSkills(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:313](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:313) |
| input | onChange | `{(event) => setInterests(event.target.value) }` | [frontend/components/portal/ProfilePage.tsx:320](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:320) |
| input | onChange | `{(event) => setAvatar(event.target.files?.[0] ?? null) }` | [frontend/components/portal/ProfilePage.tsx:331](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:331) |
| textarea | onChange | `{(event) => setBio(event.target.value)}` | [frontend/components/portal/ProfilePage.tsx:341](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:341) |
| button | onClick | `{() => setEditing(false)}` | [frontend/components/portal/ProfilePage.tsx:352](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:352) |
| button | onClick | `{() => setEditing(true)}` | [frontend/components/portal/ProfilePage.tsx:387](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:387) |
| button | onClick | `{() => { setActiveTab("info"); setEditing(true); }}` | [frontend/components/portal/ProfilePage.tsx:410](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:410) |
| button | onClick | `{() => { setActiveTab("info"); setEditing(true); }}` | [frontend/components/portal/ProfilePage.tsx:476](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:476) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| ProfilePage | useLoad | `"/me/profile"` | [frontend/components/portal/ProfilePage.tsx:22](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:22) |
| ProfilePage | useLoad | `"/me/applications"` | [frontend/components/portal/ProfilePage.tsx:45](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:45) |
| ProfilePage | useLoad | `"/me/certificates"` | [frontend/components/portal/ProfilePage.tsx:46](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:46) |
| save | apiRequest | `"/me/avatar", { method: "POST", body: upload, }` | [frontend/components/portal/ProfilePage.tsx:65](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:65) |
| save | apiRequest | `"/me/profile", { method: "PATCH", body: JSON.stringify({ name, phone, dob: dob \|\| null, city, bio, interests: interests .split(",") .map((value) => value.trim()) .filter(Boolean), skills: skills .split(",") .map((value) => value.trim()) .filter(Boolean), avatar_url, }), }` | [frontend/components/portal/ProfilePage.tsx:71](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:71) |
| inline onClick | apiRequest | `"/me/profile", { method: "PATCH", body: JSON.stringify({ cover_url: url }), }` | [frontend/components/portal/ProfilePage.tsx:139](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:139) |
| markAll | apiRequest | `"/notifications/read-all", { method: "POST" }` | [frontend/components/portal/NotificationBell.tsx:18](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:18) |
| inline onClick | apiRequest(                       `/notifications/${encodeURIComponent(item.id)}`,                       {                         method: "PATCH",                         body: JSON.stringify({ unread: false }),                       },                     ).catch | `(e) => setError(e.message)` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |
| inline onClick | apiRequest | `ˋ/notifications/${encodeURIComponent(item.id)}ˋ, { method: "PATCH", body: JSON.stringify({ unread: false }), }` | [frontend/components/portal/NotificationBell.tsx:63](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:63) |
| useNotificationSummary | useLoad | `enabled ? "/notifications/summary" : null` | [frontend/hooks/use-notifications.ts:9](D:/WebNhiLun/frontend/hooks/use-notifications.ts:9) |
| ProfileDocuments | useLoad | `"/me/documents"` | [frontend/components/portal/ProfileDocuments.tsx:8](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:8) |
| inline onChange | apiRequest | `"/me/documents", { method: "POST", body: upload, }` | [frontend/components/portal/ProfileDocuments.tsx:31](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:31) |
| inline onClick | apiRequest | `ˋ/me/documents/${doc.id}/urlˋ` | [frontend/components/portal/ProfileDocuments.tsx:61](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:61) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/profile/page.tsx](D:/WebNhiLun/frontend/app/profile/page.tsx)
- [frontend/components/portal/ProfilePage.tsx](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/VolunteerWorkspaceFrame.tsx](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/ProfileOverview.tsx](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx)
- [frontend/components/portal/ProfileDocuments.tsx](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx)
