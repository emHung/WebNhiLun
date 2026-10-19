# Cài đặt giao diện

Đường dẫn: `/admin/theme-settings`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/admin/theme-settings/page.tsx](D:/WebNhiLun/frontend/app/admin/theme-settings/page.tsx).

**Truy cập theo middleware:** Admin. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### AdminPages.tsx

Nguồn: [frontend/components/portal/AdminPages.tsx](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx).

```text
AdminNavTabs
  div
    Link
    Link
    Link
AdminModerationPage
  PortalShell
    div.container
      PageIntro
      AdminNavTabs
      StatusMessage
      div.portal-message
      div.portal-kpis
        div.portal-kpi
          strong
        div.portal-kpi
          strong
        div.portal-kpi
          strong
        div.portal-kpi
          strong
      section.portal-card
        h2
        div.portal-table-wrap
          table.portal-table
        EmptyState
      section.portal-card
        h2
        div.portal-table-wrap
          table.portal-table
        EmptyState
      section.portal-card
        h2
        div.portal-table-wrap
          table.portal-table
        EmptyState
ThemeSettingsPage
  PortalShell
    div.container
      PageIntro
      AdminNavTabs
      StatusMessage
      div.portal-message
      div.portal-grid
        article.portal-card
          div.portal-theme-swatch
          h3
          p
          div.portal-form-actions
      form.portal-card.portal-form
        h2
        div.portal-form-grid
          label
          label
          label
        label
          textarea
        div.portal-form-actions
          button.btn.btn-primary
          button.btn.btn-outline
AdminStoriesPage
  PortalShell
    div.container
      PageIntro
      AdminNavTabs
      div.portal-message
      StatusMessage
      div
        div
          div
          div
        div
          div
          div
        div
          div
          div
      section.portal-card
        form
          div
          div
      section.portal-card
        div
          h3
        div
          p
        EmptyState
        div.portal-table-wrap
          table
        div
          Pagination
      Modal
        div
          div
          div
          h3
          div
          div
          div
      Modal
        form
          div
          div
          label
          div
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/AdminPages.tsx](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx) | `Link`, `PortalShell`, `PageIntro`, `AdminNavTabs`, `StatusMessage`, `EmptyState`, `Pagination`, `Modal` | `<div>`, `<i>`, `<strong>`, `<section>`, `<h2>`, `<table>`, `<thead>`, `<tr>`, `<th>`, `<tbody>`, `<td>`, `<small>`, `<button>`, `<article>`, `<span>`, `<h3>`, `<p>`, `<form>`, `<label>`, `<input>`, `<select>`, `<option>`, `<textarea>`, `<img>`, `<h4>`, `<br>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |
| [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx) | — | `<nav>`, `<button>`, `<span>` |

**Tiêu đề trực tiếp trong JSX:** Hồ sơ tổ chức chờ duyệt · Hoạt động chờ duyệt · Nhật ký kiểm toán · Danh sách bài viết ( ) · Xác nhận gỡ bỏ bài viết?


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/admin/theme-settings/page.tsx:3](D:/WebNhiLun/frontend/app/admin/theme-settings/page.tsx:3) |
| AdminNavTabs | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | { current }: { current: "moderation" \| "stories" \| "themes" } | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:17](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:17) |
| AdminModerationPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, orgs.data.map, activities.data.map, logs.data.map | [frontend/components/portal/AdminPages.tsx:99](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:99) |
| decide | Gửi quyết định kiểm duyệt lên API. | AdminModerationPage | path: string, decision: "approve" \| "reject", target: string | undefined / dừng xử lý | window.prompt, reason?.trim, apiRequest, JSON.stringify, setMessage, orgs.refresh, activities.refresh, logs.refresh, metrics.refresh | [frontend/components/portal/AdminPages.tsx:105](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:105) |
| callback orgs.data.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | AdminModerationPage | org | ( <tr key={org.id}> <td> <strong>{org.name}</strong> <small style={{ display: "block" }}>{org.id}</small> </td> <td>{org.representative}</td> <td>{org.category} | formatDate | [frontend/components/portal/AdminPages.tsx:181](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:181) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback orgs.data.map | Không có | decide( `/admin/organizations/${org.id}/review`, "approve", org.name, ) | decide | [frontend/components/portal/AdminPages.tsx:194](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:194) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback orgs.data.map | Không có | decide( `/admin/organizations/${org.id}/review`, "reject", org.name, ) | decide | [frontend/components/portal/AdminPages.tsx:206](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:206) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback orgs.data.map | Không có | Không return tường minh; xem hiệu ứng state/API | apiRequest, window.open, setMessage | [frontend/components/portal/AdminPages.tsx:219](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:219) |
| callback activities.data.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | AdminModerationPage | activity | ( <tr key={activity.id}> <td> <strong>{activity.title}</strong> <small style={{ display: "block" }}> {activity.id} </small> </td> <td>{activity.organizer_name}< | formatDate | [frontend/components/portal/AdminPages.tsx:271](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:271) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback activities.data.map | Không có | decide( `/admin/activities/${activity.id}/review`, "approve", activity.title, ) | decide | [frontend/components/portal/AdminPages.tsx:288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:288) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback activities.data.map | Không có | decide( `/admin/activities/${activity.id}/review`, "reject", activity.title, ) | decide | [frontend/components/portal/AdminPages.tsx:300](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:300) |
| callback logs.data.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | AdminModerationPage | log | ( <tr key={log.id}> <td> {new Date(log.created_at).toLocaleString("vi-VN")} </td> <td>{log.actor}</td> <td>{log.action}</td> <td>{log.target}</td> <td>{log.deta | new Date(log.created_at).toLocaleString | [frontend/components/portal/AdminPages.tsx:336](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:336) |
| ThemeSettingsPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, themes?.map, ….map | [frontend/components/portal/AdminPages.tsx:369](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:369) |
| save | Lưu dữ liệu biểu mẫu; xem endpoint và handler ở bảng bên dưới. | ThemeSettingsPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, apiRequest, JSON.stringify, setMessage, setEditId, setForm, refresh | [frontend/components/portal/AdminPages.tsx:379](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:379) |
| activate | Kích hoạt bộ màu đã chọn. | ThemeSettingsPage | id: number | Không return tường minh; xem hiệu ứng state/API | apiRequest, setMessage, window.dispatchEvent, refresh | [frontend/components/portal/AdminPages.tsx:397](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:397) |
| edit | Đưa dữ liệu đã chọn vào trạng thái chỉnh sửa. | ThemeSettingsPage | theme: Theme | Không return tường minh; xem hiệu ứng state/API | setEditId, setForm | [frontend/components/portal/AdminPages.tsx:409](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:409) |
| callback themes?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ThemeSettingsPage | theme | ( <article className="portal-card" key={theme.id}> <div className="portal-theme-swatch" style={{ background: theme.surface_color }} > <span style={{ background: | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:437](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:437) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback themes?.map | Không có | edit(theme) | edit | [frontend/components/portal/AdminPages.tsx:461](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:461) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback themes?.map | Không có | activate(theme.id) | activate | [frontend/components/portal/AdminPages.tsx:468](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:468) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ThemeSettingsPage | event | setForm((value) => ({ ...value, name: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:488](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:488) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | value | ({ ...value, name: event.target.value }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:489](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:489) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ThemeSettingsPage | event | setForm((value) => ({ ...value, mode: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:499](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:499) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | value | ({ ...value, mode: event.target.value }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:500](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:500) |
| callback ….map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ThemeSettingsPage | key | ( <label key={key}> {key} <input type="color" value={form[key] \|\| "#066963"} onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value, })) | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:514](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:514) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | callback ….map | event | setForm((value) => ({ ...value, [key]: event.target.value, })) | setForm | [frontend/components/portal/AdminPages.tsx:520](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:520) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | value | ({ ...value, [key]: event.target.value, }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:521](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:521) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ThemeSettingsPage | event | setForm((value) => ({ ...value, meaning: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:534](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:534) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | value | ({ ...value, meaning: event.target.value }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/AdminPages.tsx:535](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:535) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ThemeSettingsPage | Không có | Không return tường minh; xem hiệu ứng state/API | setEditId, setForm | [frontend/components/portal/AdminPages.tsx:546](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:546) |
| AdminStoriesPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useState, String, useLoad, params.toString, data.items.map, formatDate | [frontend/components/portal/AdminPages.tsx:582](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:582) |
| handleSearchSubmit | Gửi điều kiện tìm kiếm từ biểu mẫu. | AdminStoriesPage | e: FormEvent | Không return tường minh; xem hiệu ứng state/API | e.preventDefault, setSearch, query.trim, setPage | [frontend/components/portal/AdminPages.tsx:609](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:609) |
| handleResetFilter | Xóa điều kiện lọc đang chọn. | AdminStoriesPage | Không có | Không return tường minh; xem hiệu ứng state/API | setQuery, setSearch, setCategory, setPage | [frontend/components/portal/AdminPages.tsx:615](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:615) |
| handleDeleteStory | Gửi yêu cầu xóa Stories. | AdminStoriesPage | e: FormEvent | undefined / dừng xử lý | e.preventDefault, setBusy, setMessage, apiRequest, JSON.stringify, deleteReason.trim, setDeleteTarget, setDeleteReason, refresh, refreshStats | [frontend/components/portal/AdminPages.tsx:622](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:622) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | e | setQuery(e.target.value) | setQuery | [frontend/components/portal/AdminPages.tsx:806](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:806) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | e | Không return tường minh; xem hiệu ứng state/API | setCategory, setPage | [frontend/components/portal/AdminPages.tsx:826](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:826) |
| callback data.items.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | AdminStoriesPage | story | ( <tr key={story.id} style={{ borderBottom: "1px solid var(--border-default, #f1f5f9)", fontSize: "0.86rem", }} > <td style={{ padding: "12px 10px" }}> <div sty | formatDate | [frontend/components/portal/AdminPages.tsx:908](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:908) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback data.items.map | Không có | setViewStory(story) | setViewStory | [frontend/components/portal/AdminPages.tsx:1029](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1029) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback data.items.map | Không có | Không return tường minh; xem hiệu ứng state/API | setDeleteTarget, setDeleteReason | [frontend/components/portal/AdminPages.tsx:1038](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1038) |
| inline onClose | Handler trực tiếp tại thuộc tính onClose; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | Không có | setViewStory(null) | setViewStory | [frontend/components/portal/AdminPages.tsx:1072](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1072) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | Không có | setViewStory(null) | setViewStory | [frontend/components/portal/AdminPages.tsx:1220](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1220) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | Không có | Không return tường minh; xem hiệu ứng state/API | setDeleteTarget, setViewStory | [frontend/components/portal/AdminPages.tsx:1227](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1227) |
| inline onClose | Handler trực tiếp tại thuộc tính onClose; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | Không có | setDeleteTarget(null) | setDeleteTarget | [frontend/components/portal/AdminPages.tsx:1241](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1241) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | e | setDeleteReason(e.target.value) | setDeleteReason | [frontend/components/portal/AdminPages.tsx:1288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1288) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AdminStoriesPage | Không có | setDeleteTarget(null) | setDeleteTarget | [frontend/components/portal/AdminPages.tsx:1305](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1305) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => decide( ˋ/admin/organizations/${org.id}/reviewˋ, "approve", org.name, ) }` | [frontend/components/portal/AdminPages.tsx:194](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:194) |
| button | onClick | `{() => decide( ˋ/admin/organizations/${org.id}/reviewˋ, "reject", org.name, ) }` | [frontend/components/portal/AdminPages.tsx:206](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:206) |
| button | onClick | `{async () => { try { const signed = await apiRequest<{ url: string; }>( ˋ/admin/organizations/${org.id}/document-urlˋ, ); window.open( signed.url, "_blank", "noopener,noreferrer", ); } catch (error) {` | [frontend/components/portal/AdminPages.tsx:219](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:219) |
| button | onClick | `{() => decide( ˋ/admin/activities/${activity.id}/reviewˋ, "approve", activity.title, ) }` | [frontend/components/portal/AdminPages.tsx:288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:288) |
| button | onClick | `{() => decide( ˋ/admin/activities/${activity.id}/reviewˋ, "reject", activity.title, ) }` | [frontend/components/portal/AdminPages.tsx:300](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:300) |
| button | onClick | `{() => edit(theme)}` | [frontend/components/portal/AdminPages.tsx:461](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:461) |
| button | onClick | `{() => activate(theme.id)}` | [frontend/components/portal/AdminPages.tsx:468](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:468) |
| form | onSubmit | `{save}` | [frontend/components/portal/AdminPages.tsx:480](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:480) |
| input | onChange | `{(event) => setForm((value) => ({ ...value, name: event.target.value })) }` | [frontend/components/portal/AdminPages.tsx:488](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:488) |
| select | onChange | `{(event) => setForm((value) => ({ ...value, mode: event.target.value })) }` | [frontend/components/portal/AdminPages.tsx:499](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:499) |
| input | onChange | `{(event) => setForm((value) => ({ ...value, [key]: event.target.value, })) }` | [frontend/components/portal/AdminPages.tsx:520](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:520) |
| textarea | onChange | `{(event) => setForm((value) => ({ ...value, meaning: event.target.value })) }` | [frontend/components/portal/AdminPages.tsx:534](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:534) |
| button | onClick | `{() => { setEditId(null); setForm(blankTheme); }}` | [frontend/components/portal/AdminPages.tsx:546](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:546) |
| form | onSubmit | `{handleSearchSubmit}` | [frontend/components/portal/AdminPages.tsx:792](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:792) |
| input | onChange | `{(e) => setQuery(e.target.value)}` | [frontend/components/portal/AdminPages.tsx:806](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:806) |
| select | onChange | `{(e) => { setCategory(e.target.value); setPage(1); }}` | [frontend/components/portal/AdminPages.tsx:826](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:826) |
| button | onClick | `{handleResetFilter}` | [frontend/components/portal/AdminPages.tsx:848](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:848) |
| button | onClick | `{() => setViewStory(story)}` | [frontend/components/portal/AdminPages.tsx:1029](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1029) |
| button | onClick | `{() => { setDeleteTarget(story); setDeleteReason(""); }}` | [frontend/components/portal/AdminPages.tsx:1038](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1038) |
| Pagination | onChange | `{setPage}` | [frontend/components/portal/AdminPages.tsx:1063](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1063) |
| Modal | onClose | `{() => setViewStory(null)}` | [frontend/components/portal/AdminPages.tsx:1072](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1072) |
| button | onClick | `{() => setViewStory(null)}` | [frontend/components/portal/AdminPages.tsx:1220](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1220) |
| button | onClick | `{() => { setDeleteTarget(viewStory); setViewStory(null); }}` | [frontend/components/portal/AdminPages.tsx:1227](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1227) |
| Modal | onClose | `{() => setDeleteTarget(null)}` | [frontend/components/portal/AdminPages.tsx:1241](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1241) |
| form | onSubmit | `{handleDeleteStory}` | [frontend/components/portal/AdminPages.tsx:1242](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1242) |
| textarea | onChange | `{(e) => setDeleteReason(e.target.value)}` | [frontend/components/portal/AdminPages.tsx:1288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1288) |
| button | onClick | `{() => setDeleteTarget(null)}` | [frontend/components/portal/AdminPages.tsx:1305](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1305) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| AdminModerationPage | useLoad | `"/admin/metrics"` | [frontend/components/portal/AdminPages.tsx:100](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:100) |
| AdminModerationPage | useLoad | `"/admin/organizations?status=pending"` | [frontend/components/portal/AdminPages.tsx:101](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:101) |
| AdminModerationPage | useLoad | `"/admin/activities/pending"` | [frontend/components/portal/AdminPages.tsx:102](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:102) |
| AdminModerationPage | useLoad | `"/admin/audit-logs?limit=100"` | [frontend/components/portal/AdminPages.tsx:103](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:103) |
| decide | apiRequest | `path, { method: "POST", body: JSON.stringify({ decision, reason }), }` | [frontend/components/portal/AdminPages.tsx:116](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:116) |
| inline onClick | apiRequest | `ˋ/admin/organizations/${org.id}/document-urlˋ` | [frontend/components/portal/AdminPages.tsx:221](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:221) |
| ThemeSettingsPage | useLoad | `"/admin/themes"` | [frontend/components/portal/AdminPages.tsx:375](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:375) |
| save | apiRequest | `path, { method: editId ? "PUT" : "POST", body: JSON.stringify(form), }` | [frontend/components/portal/AdminPages.tsx:383](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:383) |
| activate | apiRequest | `ˋ/admin/themes/${id}/activateˋ, { method: "PUT" }` | [frontend/components/portal/AdminPages.tsx:399](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:399) |
| AdminStoriesPage | useLoad | `ˋ/admin/stories?${params.toString()}ˋ` | [frontend/components/portal/AdminPages.tsx:602](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:602) |
| AdminStoriesPage | useLoad | `"/admin/stories/stats"` | [frontend/components/portal/AdminPages.tsx:605](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:605) |
| handleDeleteStory | apiRequest | `ˋ/admin/stories/${deleteTarget.id}ˋ, { method: "DELETE", body: JSON.stringify({ reason: deleteReason.trim() }), }` | [frontend/components/portal/AdminPages.tsx:628](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:628) |
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

- [frontend/app/admin/theme-settings/page.tsx](D:/WebNhiLun/frontend/app/admin/theme-settings/page.tsx)
- [frontend/components/portal/AdminPages.tsx](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
- [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx)
- [frontend/components/portal/Modal.tsx](D:/WebNhiLun/frontend/components/portal/Modal.tsx)
