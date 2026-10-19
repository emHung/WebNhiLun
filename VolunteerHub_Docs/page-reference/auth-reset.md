# Đặt lại mật khẩu

Đường dẫn: `/auth/reset`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/auth/reset/page.tsx](D:/WebNhiLun/frontend/app/auth/reset/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### page.tsx

Nguồn: [frontend/app/auth/reset/page.tsx](D:/WebNhiLun/frontend/app/auth/reset/page.tsx).

```text
ResetPage
  main.auth-page-wrapper
    form.auth-glass-card.portal-form
      h1
      label
        input.auth-input
      label
        input.auth-input
      p
      button.auth-submit-btn
      a
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/app/auth/reset/page.tsx](D:/WebNhiLun/frontend/app/auth/reset/page.tsx) | — | `<main>`, `<form>`, `<h1>`, `<label>`, `<input>`, `<p>`, `<button>`, `<a>` |

**Tiêu đề trực tiếp trong JSX:** Đặt lại mật khẩu


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| ResetPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | useState, useEffect | [frontend/app/auth/reset/page.tsx:4](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:4) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | ResetPage | Không có | () => { active = false; } | createClient() .auth.getUser() .then, createClient() .auth.getUser, createClient | [frontend/app/auth/reset/page.tsx:10](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:10) |
| callback createClient() .auth.getUser() .then | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | callback useEffect | { data } | Không return tường minh; xem hiệu ứng state/API | setReady, Boolean, setMessage | [frontend/app/auth/reset/page.tsx:14](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:14) |
| submit | Xử lý gửi biểu mẫu và phản hồi thành công/lỗi. | ResetPage | event: FormEvent | undefined / dừng xử lý | event.preventDefault, setMessage, setBusy, createClient().auth.updateUser, createClient, createClient().auth.signOut, setReady | [frontend/app/auth/reset/page.tsx:27](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:27) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ResetPage | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/reset/page.tsx:62](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:62) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | ResetPage | e | setConfirm(e.target.value) | setConfirm | [frontend/app/auth/reset/page.tsx:75](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:75) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| form | onSubmit | `{submit}` | [frontend/app/auth/reset/page.tsx:50](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:50) |
| input | onChange | `{(e) => setPassword(e.target.value)}` | [frontend/app/auth/reset/page.tsx:62](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:62) |
| input | onChange | `{(e) => setConfirm(e.target.value)}` | [frontend/app/auth/reset/page.tsx:75](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:75) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| submit | createClient().auth.updateUser | `{ password }` | [frontend/app/auth/reset/page.tsx:35](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:35) |
| submit | createClient().auth.signOut | `` | [frontend/app/auth/reset/page.tsx:37](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:37) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/auth/reset/page.tsx](D:/WebNhiLun/frontend/app/auth/reset/page.tsx)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
