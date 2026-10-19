# Đăng ký tham gia

Đường dẫn: `/volunteer/apply/[activityId]`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/volunteer/apply/[activityId]/page.tsx](D:/WebNhiLun/frontend/app/volunteer/apply/[activityId]/page.tsx).

**Truy cập theo middleware:** Volunteer. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### ApplyPage.tsx

Nguồn: [frontend/components/portal/ApplyPage.tsx](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx).

```text
ApplyPage
  PortalShell
    main.container
      div.apply-container
        StatusMessage
        section.card
          h2
          p
        div.step-indicator
          div
        section.card
          div.step-pane.active
          div.step-pane.active
          div.step-pane.active
          div.step-pane.active.apply-success-pane
          div.portal-message
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/components/portal/ApplyPage.tsx](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx) | `PortalShell`, `StatusMessage`, `Link` | `<main>`, `<div>`, `<section>`, `<span>`, `<h2>`, `<p>`, `<i>`, `<h3>`, `<label>`, `<input>`, `<button>`, `<textarea>`, `<select>`, `<option>`, `<strong>`, `<br>` |
| [frontend/components/portal/shared.tsx](D:/WebNhiLun/frontend/components/portal/shared.tsx) | `Link`, `NotificationBell`, `MediaImage` | `<header>`, `<div>`, `<span>`, `<svg>`, `<path>`, `<ul>`, `<li>`, `<form>`, `<i>`, `<input>`, `<button>`, `<footer>`, `<p>`, `<h1>` |
| [frontend/components/portal/NotificationBell.tsx](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx) | `Link` | `<div>`, `<button>`, `<i>`, `<span>`, `<strong>`, `<p>`, `<small>` |

**Tiêu đề trực tiếp trong JSX:** Bước 1: Thông tin cá nhân &amp; liên hệ · Bước 2: Khảo sát phù hợp &amp; ca tham gia · Bước 3: Cam kết an toàn &amp; chính sách hủy · Đăng ký thành công!


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| Page | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { params: paramsPromise, }: { params: Promise<{ activityId: string }>; } | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/volunteer/apply/[activityId]/page.tsx:3](D:/WebNhiLun/frontend/app/volunteer/apply/[activityId]/page.tsx:3) |
| ApplyPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { activityId }: { activityId: string } | JSX giao diện | useLoad, encodeURIComponent, useState, useRouter, formatDate, (["Liên hệ", "Khảo sát", "Cam kết", "Xác nhận"] as const).map | [frontend/components/portal/ApplyPage.tsx:18](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:18) |
| submit | Xử lý gửi biểu mẫu và phản hồi thành công/lỗi. | ApplyPage | Không có | undefined / dừng xử lý | setMessage, setBusy, apiRequest, JSON.stringify, setStep | [frontend/components/portal/ApplyPage.tsx:42](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:42) |
| callback (["Liên hệ", "Khảo sát", "Cam kết", "Xác nhận"] as const).map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | ApplyPage | label, index | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/components/portal/ApplyPage.tsx:100](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:100) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ApplyPage | Không có | setStep(2) | setStep | [frontend/components/portal/ApplyPage.tsx:164](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:164) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ApplyPage | event | setExperience(event.target.value) | setExperience | [frontend/components/portal/ApplyPage.tsx:184](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:184) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ApplyPage | event | setSkills(event.target.value) | setSkills | [frontend/components/portal/ApplyPage.tsx:196](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:196) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ApplyPage | event | setShift(event.target.value) | setShift | [frontend/components/portal/ApplyPage.tsx:206](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:206) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ApplyPage | Không có | setStep(1) | setStep | [frontend/components/portal/ApplyPage.tsx:223](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:223) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ApplyPage | Không có | setStep(3) | setStep | [frontend/components/portal/ApplyPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:230) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ApplyPage | event | setAgreed(event.target.checked) | setAgreed | [frontend/components/portal/ApplyPage.tsx:260](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:260) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | ApplyPage | Không có | setStep(2) | setStep | [frontend/components/portal/ApplyPage.tsx:271](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:271) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => setStep(2)}` | [frontend/components/portal/ApplyPage.tsx:164](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:164) |
| textarea | onChange | `{(event) => setExperience(event.target.value)}` | [frontend/components/portal/ApplyPage.tsx:184](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:184) |
| input | onChange | `{(event) => setSkills(event.target.value)}` | [frontend/components/portal/ApplyPage.tsx:196](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:196) |
| select | onChange | `{(event) => setShift(event.target.value)}` | [frontend/components/portal/ApplyPage.tsx:206](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:206) |
| button | onClick | `{() => setStep(1)}` | [frontend/components/portal/ApplyPage.tsx:223](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:223) |
| button | onClick | `{() => setStep(3)}` | [frontend/components/portal/ApplyPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:230) |
| input | onChange | `{(event) => setAgreed(event.target.checked)}` | [frontend/components/portal/ApplyPage.tsx:260](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:260) |
| button | onClick | `{() => setStep(2)}` | [frontend/components/portal/ApplyPage.tsx:271](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:271) |
| button | onClick | `{submit}` | [frontend/components/portal/ApplyPage.tsx:279](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:279) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| ApplyPage | useLoad | `ˋ/activities/${encodeURIComponent(activityId)}ˋ` | [frontend/components/portal/ApplyPage.tsx:23](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:23) |
| ApplyPage | useLoad | `"/me/profile"` | [frontend/components/portal/ApplyPage.tsx:31](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:31) |
| submit | apiRequest | `ˋ/activities/${activity.id}/applyˋ, { method: "POST", body: JSON.stringify({ shift, experience, skills }) }` | [frontend/components/portal/ApplyPage.tsx:50](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:50) |
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

- [frontend/app/volunteer/apply/[activityId]/page.tsx](D:/WebNhiLun/frontend/app/volunteer/apply/[activityId]/page.tsx)
- [frontend/components/portal/ApplyPage.tsx](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx)
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
