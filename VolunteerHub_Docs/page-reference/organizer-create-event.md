# Tạo hoạt động

Đường dẫn: `/organizer/create-event`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/organizer/create-event/page.tsx](D:/WebNhiLun/frontend/app/organizer/create-event/page.tsx).

**Truy cập theo middleware:** Organizer; riêng /organizer/manage?onboard=1 cho phép volunteer làm hồ sơ tổ chức. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### CreateActivityPage.tsx

Nguồn: [frontend/components/portal/CreateActivityPage.tsx](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx).

```text
CreateActivityPage
  PortalShell
    main.organizer-create-page
      div.organizer-container
        aside.organizer-sidebar
          div.org-badge-card
          nav.org-menu-card
          div.org-promo-card
        section.organizer-main
          div.org-hero-banner
          nav.org-stepper-bar
          div.portal-message
          form.org-form-card
        aside.organizer-preview-col
          div.org-preview-card
persist
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/CreateActivityPage.tsx](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx) | `PortalShell`, `Link`, `MediaImage`, `Fragment`, `ActivityEditor`, `ActivityDescription` | `<main>`, `<div>`, `<aside>`, `<i>`, `<nav>`, `<span>`, `<p>`, `<section>`, `<h1>`, `<h2>`, `<br>`, `<button>`, `<form>`, `<label>`, `<input>`, `<select>`, `<option>`, `<small>`, `<textarea>`, `<h3>`, `<strong>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Lan tỏa yêu thương · Bắt đầu từ những hành động nhỏ · Lịch trình


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/organizer/create-event/page.tsx:4](D:/WebNhiLun/frontend/app/organizer/create-event/page.tsx:4) |
| CreateActivityPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useState, useSearchParams, useLoad, params.get, useRef, encodeURIComponent, useEffect, useRouter, steps.map, [ "Môi trường", "Giáo dục", "Cộng đồng", "Y tế", "Động vật", "Khác", ].map, schedule.map, formatDate | [frontend/components/portal/CreateActivityPage.tsx:18](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:18) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | CreateActivityPage | Không có | Không return tường minh; xem hiệu ứng state/API | setRequestKey, crypto.randomUUID | [frontend/components/portal/CreateActivityPage.tsx:57](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:57) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | CreateActivityPage | Không có | Không return tường minh; xem hiệu ứng state/API | window.localStorage.getItem, setDraftId | [frontend/components/portal/CreateActivityPage.tsx:60](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:60) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | CreateActivityPage | Không có | Không return tường minh; xem hiệu ứng state/API | setForm, setSchedule, record.schedule?.map, setRequestKey, setSavedBanner | [frontend/components/portal/CreateActivityPage.tsx:66](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:66) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | current | Object.fromEntries( Object.keys(current).map((key) => [ key, record.draft_payload?.[key as keyof typeof form] ?? record[key as keyof Activity], ]), ) as typeof  | Object.fromEntries, Object.keys(current).map, Object.keys | [frontend/components/portal/CreateActivityPage.tsx:74](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:74) |
| callback Object.keys(current).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback setForm | key | [ key, record.draft_payload?.[key as keyof typeof form] ?? record[key as keyof Activity], ] | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:76](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:76) |
| callback record.schedule?.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | item | ({ time_frame: item.time_frame, content: item.content, }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:84](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:84) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | CreateActivityPage | Không có | undefined / dừng xử lý; () => URL.revokeObjectURL(objectUrl) | setBannerPreview, URL.createObjectURL | [frontend/components/portal/CreateActivityPage.tsx:95](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:95) |
| set | Cập nhật một trường trong state biểu mẫu. | CreateActivityPage | key: K, value: (typeof form)[K] | Không return tường minh; xem hiệu ứng state/API | setForm | [frontend/components/portal/CreateActivityPage.tsx:104](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:104) |
| callback setForm | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | set | current | ({ ...current, [key]: value }) | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:105](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:105) |
| nextStep | Kiểm tra trường bắt buộc trước khi sang bước kế tiếp. | CreateActivityPage | Không có | undefined / dừng xử lý | (required[step] ?? []).some, setMessage, setStep | [frontend/components/portal/CreateActivityPage.tsx:107](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:107) |
| callback (required[step] ?? []).some | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | nextStep | value | !value.trim() | value.trim | [frontend/components/portal/CreateActivityPage.tsx:113](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:113) |
| callback setStep | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | nextStep | current | current + 1 | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:118](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:118) |
| persist | Lưu bản nháp hoặc gửi hoạt động theo cờ publish. | CreateActivityPage | publish: boolean | record | new Date().toLocaleDateString, Number, schedule.filter, apiRequest, JSON.stringify, setDraftId, window.localStorage.setItem | [frontend/components/portal/CreateActivityPage.tsx:120](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:120) |
| callback schedule.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | persist | item | item.time_frame.trim() && item.content.trim() | item.time_frame.trim, item.content.trim | [frontend/components/portal/CreateActivityPage.tsx:135](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:135) |
| saveDraft | Lưu hoạt động ở trạng thái nháp. | CreateActivityPage | Không có | Không return tường minh; xem hiệu ứng state/API | setBusy, setMessage, persist | [frontend/components/portal/CreateActivityPage.tsx:147](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:147) |
| submit | Xử lý gửi biểu mẫu và phản hồi thành công/lỗi. | CreateActivityPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setBusy, setMessage, form.title.trim, form.event_time.trim, form.city.trim, form.location.trim, descriptionText, persist, upload.append, apiRequest, setBanner, JSON.stringify, schedule.filter, window.localStorage.removeItem, router.push | [frontend/components/portal/CreateActivityPage.tsx:161](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:161) |
| callback schedule.filter | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | submit | item | item.time_frame.trim() && item.content.trim() | item.time_frame.trim, item.content.trim | [frontend/components/portal/CreateActivityPage.tsx:195](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:195) |
| callback steps.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | CreateActivityPage | [title, subtitle], index | ( <Fragment key={title}> <button type="button" className={`org-step-node${step === index + 1 ? " active" : ""}${step > index + 1 ? " completed" : ""}`} onClick= | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:296](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:296) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback steps.map | Không có | Không return tường minh; xem hiệu ứng state/API | setStep | [frontend/components/portal/CreateActivityPage.tsx:301](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:301) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("title", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:348](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:348) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("category", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:358](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:358) |
| callback [ "Môi trường", "Giáo dục", "Cộng đồng", "Y tế", "Động vật", "Khác", ].map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | CreateActivityPage | value | ( <option key={value}>{value}</option> ) | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:369](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:369) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | setBanner(event.target.files?.[0] ?? null) | setBanner | [frontend/components/portal/CreateActivityPage.tsx:389](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:389) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("capacity", Number(event.target.value)) | set, Number | [frontend/components/portal/CreateActivityPage.tsx:408](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:408) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("verified_hours", Number(event.target.value)) | set, Number | [frontend/components/portal/CreateActivityPage.tsx:422](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:422) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("event_date", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:439](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:439) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("event_time", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:451](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:451) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("city", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:462](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:462) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("location", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:471](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:471) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("deadline_date", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:484](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:484) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | e | set("short_description", e.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:495](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:495) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | value | set("description", value) | set | [frontend/components/portal/CreateActivityPage.tsx:502](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:502) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("requirements", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:512](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:512) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("items_to_bring", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:528](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:528) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | CreateActivityPage | event | set("contact", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:539](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:539) |
| callback schedule.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | CreateActivityPage | item, index | ( <div className="org-form-group org-two-col" key={index}> <label className="org-form-label"> Thời gian <input className="org-input" value={item.time_frame} onC | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:543](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:543) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | callback schedule.map | event | setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, time_frame: event.target.value } : row, ), ) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:550](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:550) |
| callback setSchedule | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | rows | rows.map((row, i) => i === index ? { ...row, time_frame: event.target.value } : row, ) | rows.map | [frontend/components/portal/CreateActivityPage.tsx:551](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:551) |
| callback rows.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback setSchedule | row, i | i === index ? { ...row, time_frame: event.target.value } : row | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:552](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:552) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | callback schedule.map | event | setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, content: event.target.value } : row, ), ) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:566](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:566) |
| callback setSchedule | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onChange | rows | rows.map((row, i) => i === index ? { ...row, content: event.target.value } : row, ) | rows.map | [frontend/components/portal/CreateActivityPage.tsx:567](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:567) |
| callback rows.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback setSchedule | row, i | i === index ? { ...row, content: event.target.value } : row | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:568](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:568) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | CreateActivityPage | Không có | setSchedule((rows) => [ ...rows, { time_frame: "", content: "" }, ]) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:583](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:583) |
| callback setSchedule | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | rows | [ ...rows, { time_frame: "", content: "" }, ] | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:584](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:584) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | CreateActivityPage | Không có | setStep((current) => current - 1) | setStep | [frontend/components/portal/CreateActivityPage.tsx:625](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:625) |
| callback setStep | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | current | current - 1 | Không gọi hàm khác trực tiếp | [frontend/components/portal/CreateActivityPage.tsx:625](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:625) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => { if (index + 1 <= step) setStep(index + 1); }}` | [frontend/components/portal/CreateActivityPage.tsx:301](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:301) |
| form | onSubmit | `{submit}` | [frontend/components/portal/CreateActivityPage.tsx:322](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:322) |
| input | onChange | `{(event) => set("title", event.target.value)}` | [frontend/components/portal/CreateActivityPage.tsx:348](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:348) |
| select | onChange | `{(event) => set("category", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:358](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:358) |
| input | onChange | `{(event) => setBanner(event.target.files?.[0] ?? null) }` | [frontend/components/portal/CreateActivityPage.tsx:389](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:389) |
| input | onChange | `{(event) => set("capacity", Number(event.target.value)) }` | [frontend/components/portal/CreateActivityPage.tsx:408](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:408) |
| input | onChange | `{(event) => set("verified_hours", Number(event.target.value)) }` | [frontend/components/portal/CreateActivityPage.tsx:422](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:422) |
| input | onChange | `{(event) => set("event_date", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:439](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:439) |
| input | onChange | `{(event) => set("event_time", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:451](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:451) |
| input | onChange | `{(event) => set("city", event.target.value)}` | [frontend/components/portal/CreateActivityPage.tsx:462](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:462) |
| input | onChange | `{(event) => set("location", event.target.value)}` | [frontend/components/portal/CreateActivityPage.tsx:471](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:471) |
| input | onChange | `{(event) => set("deadline_date", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:484](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:484) |
| input | onChange | `{(e) => set("short_description", e.target.value)}` | [frontend/components/portal/CreateActivityPage.tsx:495](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:495) |
| ActivityEditor | onChange | `{(value) => set("description", value)}` | [frontend/components/portal/CreateActivityPage.tsx:502](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:502) |
| textarea | onChange | `{(event) => set("requirements", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:512](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:512) |
| textarea | onChange | `{(event) => set("items_to_bring", event.target.value) }` | [frontend/components/portal/CreateActivityPage.tsx:528](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:528) |
| input | onChange | `{(event) => set("contact", event.target.value)}` | [frontend/components/portal/CreateActivityPage.tsx:539](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:539) |
| input | onChange | `{(event) => setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, time_frame: event.target.value } : row, ), ) }` | [frontend/components/portal/CreateActivityPage.tsx:550](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:550) |
| input | onChange | `{(event) => setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, content: event.target.value } : row, ), ) }` | [frontend/components/portal/CreateActivityPage.tsx:566](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:566) |
| button | onClick | `{() => setSchedule((rows) => [ ...rows, { time_frame: "", content: "" }, ]) }` | [frontend/components/portal/CreateActivityPage.tsx:583](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:583) |
| button | onClick | `{() => setStep((current) => current - 1)}` | [frontend/components/portal/CreateActivityPage.tsx:625](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:625) |
| button | onClick | `{nextStep}` | [frontend/components/portal/CreateActivityPage.tsx:634](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:634) |
| button | onClick | `{saveDraft}` | [frontend/components/portal/CreateActivityPage.tsx:647](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:647) |
| button | onClick | `{nextStep}` | [frontend/components/portal/CreateActivityPage.tsx:689](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:689) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| CreateActivityPage | useLoad | `"/organizer/organization"` | [frontend/components/portal/CreateActivityPage.tsx:44](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:44) |
| CreateActivityPage | useLoad | `"/auth/me"` | [frontend/components/portal/CreateActivityPage.tsx:45](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:45) |
| CreateActivityPage | useLoad | `draftId ? ˋ/organizer/activities/${encodeURIComponent(draftId)}ˋ : null` | [frontend/components/portal/CreateActivityPage.tsx:50](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:50) |
| persist | apiRequest | `draftId ? ˋ/organizer/activities/${draftId}ˋ : "/organizer/activities", { method: draftId ? "PUT" : "POST", body: JSON.stringify(payload) }` | [frontend/components/portal/CreateActivityPage.tsx:138](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:138) |
| submit | apiRequest | `ˋ/organizer/activities/${record.id}/bannerˋ, { method: "POST", body: upload, }` | [frontend/components/portal/CreateActivityPage.tsx:181](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:181) |
| submit | apiRequest | `ˋ/organizer/activities/${record.id}ˋ, { method: "PUT", body: JSON.stringify({ ...form, publish: true, idempotency_key: requestKey, deadline_date: form.deadline_date \|\| null, schedule: schedule.filter( (item) => item.time_frame.trim() && item.content.trim(), ), }), }` | [frontend/components/portal/CreateActivityPage.tsx:187](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:187) |
| submit | router.push | `"/organizer/manage"` | [frontend/components/portal/CreateActivityPage.tsx:200](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:200) |
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

- [frontend/app/organizer/create-event/page.tsx](D:/WebNhiLun/frontend/app/organizer/create-event/page.tsx)
- [frontend/components/portal/CreateActivityPage.tsx](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx)
- [frontend/components/portal/MediaImage.tsx](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx)
- [frontend/lib/media.ts](D:/WebNhiLun/frontend/lib/media.ts)
- [frontend/components/portal/ActivityEditor.tsx](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx)
- [frontend/lib/rich-text.ts](D:/WebNhiLun/frontend/lib/rich-text.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx)
- [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx)
- [frontend/hooks/use-notifications.ts](D:/WebNhiLun/frontend/hooks/use-notifications.ts)
- [frontend/hooks/use-api-query.ts](D:/WebNhiLun/frontend/hooks/use-api-query.ts)
- [frontend/lib/models.ts](D:/WebNhiLun/frontend/lib/models.ts)
