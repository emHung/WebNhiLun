# Quản lý ban tổ chức

Đường dẫn: `/organizer/manage`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/organizer/manage/page.tsx](D:/WebNhiLun/frontend/app/organizer/manage/page.tsx).

**Truy cập theo middleware:** Organizer; riêng /organizer/manage?onboard=1 cho phép volunteer làm hồ sơ tổ chức. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### OrganizerManagePage.tsx

Nguồn: [frontend/components/portal/OrganizerManagePage.tsx](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx).

```text
OrganizerManagePage
  PortalShell
    CheckinDialog
    div.container.organizer-manage-page
      PageIntro
        div.organizer-manage-actions
          button.btn.btn-outline
          Link.btn.btn-primary
      StatusMessage
      div.portal-message
      form.portal-form-card
        h2
        p
        div.portal-form-grid
          label
          label
          label
          label
          label.portal-form-wide
        button.btn.btn-primary
      section.portal-form-card
        h2
        label
          input
        button.btn.btn-primary
      div.portal-message
      section.portal-card
        h2
        Link.profile-recent-row
      div.portal-kpis
        div.portal-kpi
          strong
          small
        div.portal-kpi
          strong
          small
        div.portal-kpi
          strong
          small
        div.portal-kpi
          strong
          small
      div.portal-toolbar.organizer-applicant-filters
        input
        select
        select
        button.btn.btn-outline
      StatusMessage
      div.portal-table-wrap
        h2.organizer-table-title
        table.portal-table
          thead
          tbody
      EmptyState
      Pagination
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/OrganizerManagePage.tsx](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx) | `PortalShell`, `CheckinDialog`, `PageIntro`, `Link`, `StatusMessage`, `EmptyState`, `Pagination` | `<div>`, `<button>`, `<i>`, `<form>`, `<h2>`, `<p>`, `<label>`, `<input>`, `<textarea>`, `<section>`, `<span>`, `<strong>`, `<small>`, `<select>`, `<option>`, `<table>`, `<thead>`, `<tr>`, `<th>`, `<tbody>`, `<td>` |
| [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx) | — | `<nav>`, `<button>`, `<span>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Đăng ký tổ chức · Hoàn tất giấy tờ xác minh · Bản nháp của bạn · Danh Sách Tình Nguyện Viên Nộp Đơn


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/organizer/manage/page.tsx:3](D:/WebNhiLun/frontend/app/organizer/manage/page.tsx:3) |
| callback dynamic | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | module | Không có | import("./CheckinDialog").then((module) => module.CheckinDialog) | import("./CheckinDialog").then, import | [frontend/components/portal/OrganizerManagePage.tsx:10](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:10) |
| callback import("./CheckinDialog").then | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback dynamic | module | module.CheckinDialog | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:11](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:11) |
| OrganizerManagePage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useLoad, useState, useEffect, useDebouncedValue, String, listParams.set, activities?.filter, activities?.find, drafts.map, activities?.map, rows.map | [frontend/components/portal/OrganizerManagePage.tsx:25](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:25) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | OrganizerManagePage | Không có | () => document.body.classList.remove("organizer-manage-layout") | document.body.classList.add | [frontend/components/portal/OrganizerManagePage.tsx:53](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:53) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | OrganizerManagePage | Không có | Không return tường minh; xem hiệu ứng state/API | window.localStorage.getItem, setOrganizationForm, window.localStorage.removeItem, createClient() .auth.getUser() .then, createClient() .auth.getUser, createClient | [frontend/components/portal/OrganizerManagePage.tsx:57](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:57) |
| callback setOrganizationForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | current | ({ ...current, ...JSON.parse(stored), }) | JSON.parse | [frontend/components/portal/OrganizerManagePage.tsx:63](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:63) |
| callback createClient() .auth.getUser() .then | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | { data } | Không return tường minh; xem hiệu ứng state/API | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:75](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:75) |
| callback setOrganizationForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback createClient() .auth.getUser() .then | current | ({ ...current, ...draft }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:79](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:79) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | OrganizerManagePage | Không có | Không return tường minh; xem hiệu ứng state/API | setPage | [frontend/components/portal/OrganizerManagePage.tsx:106](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:106) |
| registerOrganization | Gửi hồ sơ tổ chức và giấy tờ xác minh. | OrganizerManagePage | event: FormEvent<HTMLFormElement> | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setRegistering, setMessage, apiRequest, JSON.stringify, form.append, window.localStorage.removeItem, createClient().auth.updateUser, createClient, window.location.assign | [frontend/components/portal/OrganizerManagePage.tsx:109](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:109) |
| retryOrganizationDocument | Gửi lại giấy tờ xác minh tổ chức. | OrganizerManagePage | Không có | undefined / dừng xử lý | setMessage, setRegistering, form.append, apiRequest, window.localStorage.removeItem, setDocumentFile, refreshOrganization | [frontend/components/portal/OrganizerManagePage.tsx:144](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:144) |
| review | Duyệt hoặc từ chối đơn ứng viên. | OrganizerManagePage | application: Application, decision: "approve" \| "reject" | undefined / dừng xử lý | window.prompt, reason?.trim, apiRequest, encodeURIComponent, JSON.stringify, setMessage, refresh, refreshApplicants | [frontend/components/portal/OrganizerManagePage.tsx:171](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:171) |
| checkin | Cập nhật trạng thái điểm danh. | OrganizerManagePage | application: Application | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, setMessage, refreshApplicants | [frontend/components/portal/OrganizerManagePage.tsx:192](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:192) |
| exportCsv | Tải danh sách ứng viên dạng CSV. | OrganizerManagePage | Không có | undefined / dừng xử lý | apiDownload, encodeURIComponent, setMessage | [frontend/components/portal/OrganizerManagePage.tsx:211](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:211) |
| callback activities?.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | OrganizerManagePage | item | item.status === "draft" | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:224](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:224) |
| callback activities?.find | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | OrganizerManagePage | item | item.id === activityId | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:225](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:225) |
| inline close | Handler trực tiếp tại thuộc tính close; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | Không có | setQrTarget(null) | setQrTarget | [frontend/components/portal/OrganizerManagePage.tsx:232](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:232) |
| inline confirm | Handler trực tiếp tại thuộc tính confirm; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | id | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, refreshApplicants, setMessage | [frontend/components/portal/OrganizerManagePage.tsx:233](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:233) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, name: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:281](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:281) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, representative: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:295](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:295) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, category: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:309](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:309) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setDocumentFile(event.target.files?.[0] ?? null) | setDocumentFile | [frontend/components/portal/OrganizerManagePage.tsx:322](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:322) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, description: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:332](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:332) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setDocumentFile(event.target.files?.[0] ?? null) | setDocumentFile | [frontend/components/portal/OrganizerManagePage.tsx:356](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:356) |
| callback drafts.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | OrganizerManagePage | item | ( <Link className="profile-recent-row" key={item.id} href={`/organizer/create-event?draft=${encodeURIComponent(item.id)}`} > {item.title} <span>Tiếp tục chỉnh s | encodeURIComponent | [frontend/components/portal/OrganizerManagePage.tsx:379](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:379) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setSearchTerm(event.target.value) | setSearchTerm | [frontend/components/portal/OrganizerManagePage.tsx:417](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:417) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setActivityId(event.target.value) | setActivityId | [frontend/components/portal/OrganizerManagePage.tsx:423](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:423) |
| callback activities?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | OrganizerManagePage | item | ( <option key={item.id} value={item.id}> {item.title} </option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:427](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:427) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | OrganizerManagePage | event | setStatusFilter(event.target.value) | setStatusFilter | [frontend/components/portal/OrganizerManagePage.tsx:435](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:435) |
| callback rows.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | OrganizerManagePage | item | ( <tr key={item.id}> <td> <strong>{item.id}</strong> </td> <td> <strong>{item.user_name}</strong> <small style={{ display: "block" }}> {item.user_email} </small | Không gọi hàm khác trực tiếp | [frontend/components/portal/OrganizerManagePage.tsx:476](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:476) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback rows.map | Không có | review(item, "approve") | review | [frontend/components/portal/OrganizerManagePage.tsx:502](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:502) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback rows.map | Không có | review(item, "reject") | review | [frontend/components/portal/OrganizerManagePage.tsx:508](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:508) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback rows.map | Không có | setQrTarget(item) | setQrTarget | [frontend/components/portal/OrganizerManagePage.tsx:518](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:518) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback rows.map | Không có | checkin(item) | checkin | [frontend/components/portal/OrganizerManagePage.tsx:526](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:526) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{exportCsv}` | [frontend/components/portal/OrganizerManagePage.tsx:253](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:253) |
| form | onSubmit | `{registerOrganization}` | [frontend/components/portal/OrganizerManagePage.tsx:271](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:271) |
| input | onChange | `{(event) => setOrganizationForm({ ...organizationForm, name: event.target.value, }) }` | [frontend/components/portal/OrganizerManagePage.tsx:281](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:281) |
| input | onChange | `{(event) => setOrganizationForm({ ...organizationForm, representative: event.target.value, }) }` | [frontend/components/portal/OrganizerManagePage.tsx:295](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:295) |
| input | onChange | `{(event) => setOrganizationForm({ ...organizationForm, category: event.target.value, }) }` | [frontend/components/portal/OrganizerManagePage.tsx:309](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:309) |
| input | onChange | `{(event) => setDocumentFile(event.target.files?.[0] ?? null) }` | [frontend/components/portal/OrganizerManagePage.tsx:322](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:322) |
| textarea | onChange | `{(event) => setOrganizationForm({ ...organizationForm, description: event.target.value, }) }` | [frontend/components/portal/OrganizerManagePage.tsx:332](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:332) |
| input | onChange | `{(event) => setDocumentFile(event.target.files?.[0] ?? null) }` | [frontend/components/portal/OrganizerManagePage.tsx:356](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:356) |
| button | onClick | `{retryOrganizationDocument}` | [frontend/components/portal/OrganizerManagePage.tsx:365](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:365) |
| input | onChange | `{(event) => setSearchTerm(event.target.value)}` | [frontend/components/portal/OrganizerManagePage.tsx:417](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:417) |
| select | onChange | `{(event) => setActivityId(event.target.value)}` | [frontend/components/portal/OrganizerManagePage.tsx:423](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:423) |
| select | onChange | `{(event) => setStatusFilter(event.target.value)}` | [frontend/components/portal/OrganizerManagePage.tsx:435](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:435) |
| button | onClick | `{exportCsv}` | [frontend/components/portal/OrganizerManagePage.tsx:452](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:452) |
| button | onClick | `{() => review(item, "approve")}` | [frontend/components/portal/OrganizerManagePage.tsx:502](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:502) |
| button | onClick | `{() => review(item, "reject")}` | [frontend/components/portal/OrganizerManagePage.tsx:508](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:508) |
| button | onClick | `{() => setQrTarget(item)}` | [frontend/components/portal/OrganizerManagePage.tsx:518](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:518) |
| button | onClick | `{() => checkin(item)}` | [frontend/components/portal/OrganizerManagePage.tsx:526](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:526) |
| Pagination | onChange | `{setPage}` | [frontend/components/portal/OrganizerManagePage.tsx:549](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:549) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| OrganizerManagePage | useLoad | `"/auth/me"` | [frontend/components/portal/OrganizerManagePage.tsx:26](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:26) |
| OrganizerManagePage | useLoad | `organizationProfile?.role === "organizer" ? "/organizer/activities" : null` | [frontend/components/portal/OrganizerManagePage.tsx:32](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:32) |
| OrganizerManagePage | useLoad | `"/organizer/organization"` | [frontend/components/portal/OrganizerManagePage.tsx:35](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:35) |
| OrganizerManagePage | useLoad | `organizationProfile?.role === "organizer" ? ˋ/organizer/applicants?${listParams}ˋ : null` | [frontend/components/portal/OrganizerManagePage.tsx:97](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:97) |
| registerOrganization | apiRequest | `"/organizer/organization", { method: "POST", body: JSON.stringify(organizationForm), }` | [frontend/components/portal/OrganizerManagePage.tsx:116](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:116) |
| registerOrganization | apiRequest | `"/organizer/organization/documents", { method: "POST", body: form, }` | [frontend/components/portal/OrganizerManagePage.tsx:122](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:122) |
| registerOrganization | createClient().auth.updateUser | `{ data: { organization_registration_draft: null }, }` | [frontend/components/portal/OrganizerManagePage.tsx:129](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:129) |
| retryOrganizationDocument | apiRequest | `"/organizer/organization/documents", { method: "POST", body: form, }` | [frontend/components/portal/OrganizerManagePage.tsx:153](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:153) |
| review | apiRequest | `ˋ/organizer/applications/${encodeURIComponent(application.id)}/reviewˋ, { method: "POST", body: JSON.stringify({ decision, reason }) }` | [frontend/components/portal/OrganizerManagePage.tsx:179](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:179) |
| checkin | apiRequest | `ˋ/organizer/applications/${encodeURIComponent(application.id)}/checkin?checked_in=${checkedIn}ˋ, { method: "POST" }` | [frontend/components/portal/OrganizerManagePage.tsx:195](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:195) |
| exportCsv | apiDownload | `ˋ/organizer/export-csv?activity_id=${encodeURIComponent(activityId)}ˋ, ˋung-vien-${activityId}.csvˋ` | [frontend/components/portal/OrganizerManagePage.tsx:214](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:214) |
| inline confirm | apiRequest | `ˋ/organizer/applications/${encodeURIComponent(id)}/checkinˋ, { method: "POST" }` | [frontend/components/portal/OrganizerManagePage.tsx:234](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:234) |
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

- [frontend/app/organizer/manage/page.tsx](D:/WebNhiLun/frontend/app/organizer/manage/page.tsx)
- [frontend/components/portal/OrganizerManagePage.tsx](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx)
- [frontend/components/portal/Pagination.tsx](D:/WebNhiLun/frontend/components/portal/Pagination.tsx)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
