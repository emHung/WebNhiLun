# Điều hướng đường dẫn HTML cũ

Đường dẫn: `/[...legacy]`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/[...legacy]/page.tsx](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### page.tsx

Nguồn: [frontend/app/[...legacy]/page.tsx](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx).

```text
Trang chuyển hướng hoặc nội dung được dựng qua component nhập vào.
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/app/[...legacy]/page.tsx](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx) | — | — |

## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| LegacyRoute | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | { params: paramsPromise, searchParams: searchPromise, }: { params: Promise<{ legacy: string[] }>; searchParams: Promise<Record<string, string \| string[] \| undefined>>; } | Không return tường minh; xem hiệu ứng state/API | params.legacy.join, notFound, Object.entries, Array.isArray, query.append, query.has, query.get, query.delete, redirect, encodeURIComponent, target.split, query.forEach | [frontend/app/[...legacy]/page.tsx:32](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:32) |
| callback query.forEach | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | LegacyRoute | value, key | merged.set(key, value) | merged.set | [frontend/app/[...legacy]/page.tsx:68](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:68) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| LegacyRoute | redirect | `ˋ/activities/${encodeURIComponent(id ?? "")}${suffix}ˋ` | [frontend/app/[...legacy]/page.tsx:57](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:57) |
| LegacyRoute | redirect | `ˋ/volunteer/apply/${encodeURIComponent(id)}${suffix}ˋ` | [frontend/app/[...legacy]/page.tsx:64](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:64) |
| LegacyRoute | redirect | `ˋ${pathname}${suffix}ˋ` | [frontend/app/[...legacy]/page.tsx:70](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:70) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/[...legacy]/page.tsx](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx)
