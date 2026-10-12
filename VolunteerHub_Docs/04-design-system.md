# 04 — Design System & UI Tokens

## Brand personality
Đáng tin cậy, ấm áp vừa đủ, có tổ chức, rõ ràng, không gây áp lực cảm xúc. Ngôn ngữ Việt giản dị, động từ cụ thể.

## Palette
| Token | HEX | Sử dụng |
|---|---|---|
| `brand.navy.900` | `#12304A` | Header, tiêu đề, sidebar |
| `brand.teal.600` | `#087F78` | CTA, link chính, focus |
| `brand.teal.700` | `#066963` | Hover CTA |
| `brand.mint.50` | `#E9F7F3` | Hero, info surface |
| `surface.canvas` | `#F4F7FA` | Nền app |
| `surface.white` | `#FFFFFF` | Card, modal |
| `text.primary` | `#172B3A` | Nội dung |
| `text.secondary` | `#536779` | Phụ đề |
| `border.default` | `#DCE5EA` | Viền |
| `status.success` | `#147D52` | Duyệt, thành công |
| `status.warning` | `#9A5B00` | Chờ duyệt (text) |
| `status.danger` | `#B42318` | Lỗi, từ chối |
| `accent.amber` | `#F5B544` | Điểm nhấn tiết chế |

Trạng thái có nền nhạt tương ứng và **luôn có chữ/icon**, không chỉ màu. Kiểm tra tương phản WCAG cho từng cặp nền/chữ trước khi khóa UI.

## Multi-theme Palettes (Bảng màu chủ đề tùy biến)
Hệ thống hỗ trợ cơ chế chuyển đổi và quản lý bảng màu linh hoạt (hỗ trợ đổi nhanh trong Admin, lưu trữ dạng JSON hoặc `localStorage`):

| Tên chủ đề | Màu chính (`--brand-primary`) | Nút CTA (`--brand-cta`) | Nền nhẹ (`--brand-surface`) | Ý nghĩa phù hợp |
|---|---|---|---|---|
| **Đại dương & Hy vọng (Mặc định)** | Xanh Navy `#12304A` | Xanh Teal `#087F78` | Xanh Mint `#E9F7F3` | Nền tảng tổng quát, kết nối minh bạch |
| **1. Mầm Xanh Tươi** | Xanh rừng đậm `#1B4332` | Xanh ngọc `#2D6A4F` | Xanh mạ non `#E8F5E9` | Môi trường, trồng cây, nhặt rác |
| **2. Trái Tim Ấm Áp** | Đỏ bordeaux `#4A1521` | Cam san hô `#E05D5D` | Hồng kem ấm `#FDF2F0` | Bếp ăn 0 đồng, trẻ em, người già |
| **3. Nắng Mai Hy Vọng** | Xanh than `#1E293B` | Vàng cam hổ phách `#D97706` | Vàng kem nhạt `#FEF3C7` | Giáo dục vùng cao, khuyến học |
| **4. Bình Yên & Chữa Lành** | Xanh chàm `#1E3A8A` | Xanh da trời `#0284C7` | Xanh băng `#F0F9FF` | Cứu trợ thiên tai, y tế cộng đồng |
| **5. Dạ Yến Huyền Bí (Dark Mode)** | Tím chàm `#818CF8` | Xanh lục bảo `#10B981` | Xanh than tối `#1E293B` | Chế độ tối bảo vệ mắt, phong cách công nghệ |

### Cơ chế áp dụng biến CSS & Chế độ Sáng / Tối (Dark / Light Mode)
- **Nhập mã màu HEX:** Form Admin hỗ trợ chọn qua Color Picker hoặc nhập trực tiếp mã HEX (ví dụ `#12304A`) với cơ chế đồng bộ 2 chiều.
- **Chế độ Sáng / Tối:** Mỗi chủ đề có thuộc tính `mode: 'light' | 'dark'`. Khi ở Dark Mode, hệ thống tự động gán `:root[data-mode="dark"]`, biến đổi `--canvas` sang màu tối (`#0B131E`), `--surface-white` (`#162232`), và `--text-primary` (`#F0F6FC`).
- **Nút chuyển đổi nhanh:** Toàn bộ Header có nút `.theme-mode-toggle` giúp đổi nhanh qua lại giữa Sáng và Tối tức thì.
- **Lưu trữ cấu hình:** Lưu cấu hình theme đang chọn vào `localStorage` hoặc đồng bộ qua file `themes.json` / REST API.

## Typography
Font chính `Be Vietnam Pro`, fallback `Inter`, `Arial`, sans-serif. H1 desktop 44/54, mobile 30/40, weight 700; H2 32/42 desktop, 26/36 mobile; H3 24/34; H4 20/30; body 16/26; small 14/22; caption 12/18. Font weight 400/500/600/700. Không dùng body dưới 14px cho nội dung chức năng. Số thống kê dùng tabular nums.

## Spacing, dimensions
Spacing scale 4,8,12,16,20,24,32,40,48,64,80px. Max content 1200px; desktop 12 cột, gutter 24px; tablet 8 cột, gutter 20px; mobile 4 cột, gutter 16px, margin 16px. Radius input/button 10px, card 16px, modal 20px, pill 999px. Button height 44/48px, touch target tối thiểu 44×44px. Sidebar 248px, topbar 64px. Shadows nhẹ, không lạm dụng.

## Component inventory
- `AppHeader`, `AppSidebar`, `MobileBottomNav`, `Breadcrumbs`, `PageHeading`.
- `Button` primary/secondary/ghost/destructive, `IconButton`, `Badge`, `Avatar`, `Tabs`, `Tooltip`.
- `TextField`, `PhoneField`, `Select`, `Combobox`, `DatePicker`, `Checkbox`, `RadioGroup`, `Textarea`, `FileUpload`.
- `ActivityCard`, `ActivityListItem`, `ActivityFilters`, `AvailabilityMeter`, `OrganizerIdentity`.
- `StepForm`, `FormFieldError`, `ConfirmDialog`, `Toast`, `AlertBanner`.
- `DataTable`, `Pagination`, `BulkActionBar`, `StatCard`, `TrendChart`, `CalendarView`.
- `EmptyState`, `Skeleton`, `ErrorState`, `OfflineNotice`, `PermissionDenied`.

## Component state matrix
Mỗi control có default/hover/focus-visible/active/disabled/loading/error; nút submit loading chống gửi lặp; filter có clear-all; bảng có sort/filter/pagination/empty; dialog có focus trap và Escape; toast không phải kênh thông báo duy nhất.

## Motion
150–220ms ease-out cho hover/menu, 200–300ms cho dialog; hỗ trợ `prefers-reduced-motion`. Không dùng animation liên tục gây phân tâm.

## Breakpoints
Mobile <768; tablet 768–1023; desktop ≥1024. Mobile: single column, drawer/bottom sheet cho filter, CTA sticky có safe-area; desktop: 3 card/cột, sidebar lọc 260px, detail 8/4, admin tables rộng. Tablet: 2 cột.

## Accessibility
Semantics heading H1 duy nhất/trang, keyboard navigation, visible focus, alt text có nghĩa, lỗi form gắn `aria-describedby`, live region cho trạng thái gửi, nhãn rõ ràng, kiểm tra 200% zoom và màn hình 320px. Mục tiêu WCAG 2.2 AA.

## CSS token mẫu
```css
:root { --navy:#12304A; --teal:#087F78; --teal-hover:#066963; --mint:#E9F7F3; --canvas:#F4F7FA; --text:#172B3A; --border:#DCE5EA; --radius-card:16px; --content-max:1200px; }
body { font-family:'Be Vietnam Pro',Inter,Arial,sans-serif; color:var(--text); background:var(--canvas); }
```
