# Rà soát hệ thống Next.js – FastAPI – Supabase

Ngày rà soát: 15/10/2026 (Asia/Saigon).

## Kết luận

Kiến trúc chuyển đổi đã có nền tảng, các route chính đã tồn tại và API đang kết nối đúng Supabase. Hệ thống chưa đủ điều kiện coi là hoàn tất chuyển đổi: còn sai lệch dữ liệu, thiếu Realtime, đứt luồng xác thực và thiếu chức năng/layout so với HTML.

Lượt rà soát này đọc mã nguồn, đối chiếu HTML, kiểm tra build, kiểm tra một số trang trên trình duyệt và truy vấn database trong transaction chỉ đọc. Không sửa logic ứng dụng, không seed/migration và không thay đổi bản ghi nghiệp vụ. Chưa chạy vòng tạo sự kiện → duyệt → đăng ký → điểm danh bằng tài khoản thật, chưa nghiệm thu ảnh từng trang ở mọi kích thước.

## Kiến trúc hiện tại

- Next.js App Router: route trong `frontend/app`; các trang chính gom trong `components/portal/*Pages.tsx`; tải dữ liệu qua `useLoad` và `apiRequest`.
- Supabase Auth: frontend tạo/đăng nhập phiên; middleware gọi `getUser` để làm mới cookie. Middleware chưa chặn route theo đăng nhập/vai trò.
- FastAPI: nghiệp vụ chủ yếu trong `backend/app/api.py`; JWT được xác minh; vai trò lấy từ bảng `profiles`, không lấy metadata do client sửa được.
- Database: PostgreSQL qua asyncpg bằng kết nối server; endpoint nghiệp vụ tự kiểm tra quyền và tổ chức sở hữu dữ liệu.
- Storage: API tải avatar, banner, giấy tờ tổ chức; giấy tờ có signed URL cho admin. Chưa có luồng sinh/lưu PDF chứng nhận.
- Layout: nạp toàn bộ CSS legacy ở RootLayout, thêm CSS ghi đè trong globals.css; có sidebar dùng chung nhưng ProfilePage hiện vẫn có sidebar riêng.
- About/Stories: lấy HTML từ bảng site_content và chèn vào giao diện; tương tác được nối lại một phần bằng event delegation.

## Bằng chứng đã kiểm tra

1. `npm run build` của frontend thành công, gồm compile, lint/type và tạo các trang.
2. Backend được đọc/kiểm tra cú pháp; không thay thế cho kiểm thử nghiệp vụ.
3. API `/api/v1/home/metrics` trả HTTP 200: 6 hoạt động, 2 tình nguyện viên, 5 địa điểm. `/activities?limit=1` báo tổng 6 hoạt động.
4. Đúng database tại project `ythbxwcabvbsucdmxrnz`: 6 hoạt động, 4 đơn, 3 chứng nhận.
5. Truy vấn `pg_publication_tables` với `supabase_realtime` trả 0 bảng.
6. `USR-001`: `profiles.verified_hours = 0`, tổng giờ chứng nhận = 30.
7. Bộ đếm applied và số đơn approved khác nhau ở cả 6 hoạt động:

| Hoạt động | applied | Số đơn approved |
|---|---:|---:|
| ACT-001 | 38 | 1 |
| ACT-002 | 22 | 0 |
| ACT-003 | 20 | 0 |
| ACT-004 | 15 | 0 |
| ACT-005 | 14 | 0 |
| ACT-006 | 25 | 1 |

8. Trình duyệt `/auth/reset` hiển thị 404.
9. Trình duyệt `/profile` chưa đăng nhập vẫn render menu riêng 9 mục, thanh nav trên và lỗi yêu cầu đăng nhập; khớp mã ProfilePage hiện tại.
10. API Stories trả HTTP 200 và 15.913 ký tự HTML, còn 14 thuộc tính onclick. Trong phiên trình duyệt kiểm tra, trang Stories báo Failed to fetch; chưa xác định nguyên nhân lỗi tải ở trình duyệt này.
11. MCP Supabase được cấu hình sang project `qafixjninsvalnsllawl`, khác project ứng dụng. Kết quả kiểm tra database ở trên lấy bằng kết nối backend đúng project, không lấy từ MCP sai đích.

## Những việc cần sửa

### P1 — dữ liệu và luồng cốt lõi

**01. Giờ công nhận và chỉ tiêu chưa đối soát.**

Seed ghi chứng nhận nhưng không tính lại giờ trong profiles. Seed cũng chép applied từ demo trong khi chưa có số đơn tương ứng. Dashboard cộng giờ từ certificates, Profile đọc profiles nên hiển thị khác nhau; duyệt đơn dựa trên applied nên số chỗ trống không phản ánh tập đơn đang lưu.

Nguồn: `backend/scripts/seed_supabase.py:199`, `:243`, `:284`, `:311`; `frontend/components/portal/VolunteerPages.tsx:71`, `:210`; số liệu database phía trên.

Cần định nghĩa nguồn chuẩn cho giờ và số người được nhận. Nếu applied bao gồm người tham gia lịch sử, cần chuyển đủ bản ghi hoặc lưu baseline lịch sử rõ ràng. Không tự đặt applied về 0. Đối soát chứng nhận–đơn–điểm danh–hồ sơ trước khi thêm demo.

**02. Nộp đơn chưa chặn hết hạn hoặc sự kiện đã kết thúc.**

API apply chỉ loại một số trạng thái ẩn và kiểm tra capacity; chưa kiểm tra deadline_date/event_date, chưa yêu cầu trạng thái thực sự tuyển. ActivityCreate cũng chưa kiểm tra deadline trước ngày diễn ra.

Nguồn: `backend/app/api.py:256`; `backend/app/schemas.py:58`.

Cần trạng thái chuẩn và quy tắc ngày theo múi giờ nghiệp vụ, kiểm tra ở backend lẫn frontend; thêm điều kiện hợp lệ khi BTC duyệt/điểm danh. Quy tắc cửa sổ điểm danh cần thống nhất theo nghiệp vụ.

**03. Khôi phục mật khẩu bị đứt.**

Frontend gửi email với redirect `/auth/reset`, nhưng route này không tồn tại và không có UI gọi updateUser để đổi mật khẩu. Đã xác nhận 404.

Nguồn: `frontend/app/auth/page.tsx:158`; cây route `frontend/app`.

**04. Onboarding BTC có nhánh không tiếp tục được khi xác nhận email.**

Trigger tạo profiles luôn là volunteer. Khi signUp chưa có session, frontend chỉ lưu bản nháp; đăng nhập thường lại phân luồng theo profile volunteer. Form tiếp tục đăng ký tổ chức ở organizer/manage không được mở tự động trong nhánh đó. Callback phát hiện code nhưng không có exchangeCodeForSession trong mã hiện tại.

Nguồn: `frontend/app/auth/page.tsx:44`, `:65`, `:86`, `:132`; `supabase/migrations/202610140001_initial_schema.sql:193`; `frontend/components/portal/OrganizerPages.tsx:24`.

Cần callback xác thực rõ ràng, tiếp tục bản nháp tổ chức sau login, chỉ dùng metadata như gợi ý onboarding; quyền vẫn phải lấy từ backend. Cần kiểm thử nhánh bật và tắt email confirmation.

**05. Chưa có Realtime từ database tới màn hình.**

Publication có 0 bảng; frontend không có subscription postgres_changes/channel. useLoad chỉ chạy khi path đổi hoặc gọi refresh. Hai người mở hai tab sẽ không tự nhận thay đổi; cả hồ sơ/chứng nhận cũng có thể cũ sau thao tác nếu không được refresh cùng nhau.

Nguồn: `frontend/components/portal/shared.tsx:25`; `frontend/components/portal/VolunteerPages.tsx:74`; publication thực tế.

Cần thiết kế subscription và quyền đọc phù hợp, dùng sự kiện để làm mới dữ liệu qua FastAPI. Không bật publication rồi cấp đọc tất cả hồ sơ/đơn cho mọi người. Đồng thời kiểm soát reconnect và trạng thái mất kết nối.

### P2 — điều hướng, layout và chức năng chưa đủ

**06. Profile vẫn dùng sidebar riêng và thiếu các khối HTML.**

VolunteerWorkspaceFrame có 12 mục; ProfilePage tự render 9 mục với tên Bảng điều khiển thay Dashboard. Profile không có class volunteer-workspace nên thanh nav toàn trang không bị ẩn theo CSS chung. Overview HTML có 4 KPI, kỹ năng, hoạt động sắp tới, cấp bậc, tài liệu; overview Next hiện chỉ có 3 KPI, giới thiệu, hoạt động gần đây và thành tích từ chứng nhận.

Nguồn: `frontend/components/portal/VolunteerPages.tsx:14`, `:201`, `:210`; `profile.html:232`, `:295`, `:387`, `:454`.

Phát hiện này đã xác minh bằng mã và trình duyệt; kết luận đồng bộ ở trao đổi trước chưa phù hợp trạng thái hiện tại.

**07. Yêu thích/Cài đặt/Kỹ năng chưa điều hướng đúng chức năng.**

Các mục dùng chung trỏ `/profile`, nhưng không có query/tab để chọn đúng nội dung. Có API favorites nhưng chưa có màn hình danh sách tương ứng. Dashboard và Hoạt động của tôi cùng trỏ một màn hình nên cần quy định rõ điểm đến/trạng thái chọn.

Nguồn: `frontend/components/portal/VolunteerPages.tsx:14`, `:96`.

**08. Bộ lọc từ trang chủ hoặc tìm kiếm navbar bị bỏ qua.**

Home/nav gửi search/category/city/time bằng URL. ActivitiesPage khởi tạo filter thành chuỗi rỗng và không đọc searchParams; time/status chỉ có lời mô tả, chưa có bộ lọc thật. Danh sách cố định limit 50, chưa có phân trang UI.

Nguồn: `frontend/components/portal/PublicPages.tsx:43`, `:83`, `:116`; `frontend/components/portal/shared.tsx:55`.

**09. Theme lưu được nhưng giao diện đang mở không đổi ngay.**

ThemeSync đọc theme khi mount và nghe volunteerhub-theme-change. ThemeSettingsPage sau activate chỉ refresh danh sách theme, không phát sự kiện mà ThemeSync đang nghe. Không có đồng bộ giữa tab. Một số màu giao diện vẫn viết trực tiếp nên không đổi theo theme.

Nguồn: `frontend/components/portal/ThemeSync.tsx:15`, `:31`; `frontend/components/portal/AdminPages.tsx:48`; `frontend/app/globals.css`.

**10. QR và PDF chứng nhận chưa được thực hiện đầy đủ.**

QR chỉ là icon ri-qr-code-line, không mã hóa link/mã chứng nhận. PDF gọi window.print toàn trang; chưa có chứng nhận riêng chuẩn in hay sinh/lưu file. Manage Next có nút điểm danh trực tiếp, thiếu modal QR tương ứng HTML (HTML gốc mô phỏng QR, không nên gọi là máy quét camera thật).

Nguồn: `frontend/components/portal/VolunteerPages.tsx:138`; `frontend/components/portal/OrganizerPages.tsx:65`; `organizer/manage.html:165`.

**11. Tạo sự kiện thiếu lưu nháp và xử lý lỗi upload có thể tạo trùng.**

Wizard Next không có chức năng lưu nháp như HTML, thiếu phân tách mô tả ngắn/nội dung chi tiết và editor. Submit tạo activity trước, upload banner sau. Nếu upload thất bại, activity đã tồn tại; bấm gửi lại sẽ tạo activity mới.

Nguồn: `frontend/components/portal/OrganizerPages.tsx:108`; `organizer/create-event.html:316`, `:333`, `:639`.

Cần giữ ID activity đã tạo để retry upload hoặc có draft/submit flow và idempotency key, không retry toàn bộ bằng một POST create mới.

**12. Route private chưa có phân luồng bảo vệ ở frontend.**

Middleware chỉ làm mới session; chưa chuyển người chưa đăng nhập về Auth, chưa có màn hình 403 theo vai trò hoặc returnTo sau login. `/dashboard` luôn chuyển về TNV. Backend đã kiểm tra role/owner, nên phát hiện này là lỗi UX/phân luồng, không chứng minh backend lộ dữ liệu.

Nguồn: `frontend/middleware.ts:4`; `frontend/app/dashboard/page.tsx:3`; `backend/app/core/security.py:61`.

**13. Stories còn handler HTML cũ và lượt thích không lưu DB.**

HTML DB còn onclick gọi hàm legacy như openStoryModal/filterStories. LegacyMarketingPage chỉ nối lại lọc/like, không có các hàm global/modal tương ứng. Like tăng giảm DOM, không ghi DB nên mất khi tải lại. Cần port tương tác thành React hoặc lớp delegation đầy đủ và loại handler legacy, định nghĩa API stories/likes nếu giữ chức năng.

Nguồn: `frontend/components/portal/LegacyMarketingPage.tsx:13`, `:32`, `:56`; HTML do API trả có 14 onclick. Chưa kiểm thử được click ở phiên Browser vì trang báo Failed to fetch dù kiểm tra API trực tiếp trả 200.

**14. Hợp đồng dữ liệu thiếu field và xử lý null.**

`/me/applications` chỉ join title/slug/event_date, nhưng UI lịch/thẻ dùng thêm city/location/event_time/banner_url… nên một số thông tin trống hoặc fallback. ProfileUpdate cho phép name/skills là null nhưng update_profile gọi strip/iterate trực tiếp, có thể gây 500 thay vì 422.

Nguồn: `backend/app/api.py:286`, `:115`; `backend/app/schemas.py:24`; `frontend/components/portal/shared.tsx:11`.

### P3 — bảo trì và vận hành

- RootLayout nạp cả CSS của 16 phân hệ toàn cục, có selector trùng/ghi đè; cần scope theo layout và có một nguồn CSS chuẩn thay vì bản gốc và bản public/legacy dễ lệch. Chưa đo hiệu năng, không kết luận tốc độ kém chỉ từ mã nguồn.
- api.py gom toàn bộ nghiệp vụ, các file Pages.tsx rất dài và nhiều JSX một dòng: tách router/service/component khi giúp rõ ownership, không tách máy móc theo số dòng.
- API có health trả ok nhưng không kiểm tra database; lỗi kết nối lúc startup tắt pool đến khi restart. Cần readiness riêng và cơ chế phục hồi có kiểm soát.
- API `/site-content/{content_key}` khai báo trùng hai lần; endpoint cuối trả nội dung rỗng. FastAPI match theo thứ tự nên handler đầu đang trả đúng, nhưng route/OpenAPI cần dọn trùng.
- Seed dùng upsert cập nhật trạng thái/applied/chứng nhận từ dữ liệu cũ; chạy lại trên database đã có thao tác thật có thể ghi đè tiến trình. Cần bootstrap riêng và chế độ chỉ thêm dữ liệu mẫu có namespace.
- `AUDIT_AFTER.md` là nghiệm thu bản HTML ngày 12/10, không phải bằng chứng nghiệm thu Next/FastAPI; các test_phase đã bị xóa khỏi checkout. Cần bộ kiểm thử hiện tại và ghi rõ phạm vi.
- MCP cần trỏ đúng project trước khi dùng sửa schema. Không thay đổi cấu hình MCP trong lượt rà soát.

## Đối chiếu route HTML → Next.js

Hiện có 19 HTML nghiệp vụ gốc, gồm alias dashboard. Đã có route/alias tương ứng, nhưng có route không đồng nghĩa đủ layout và chức năng.

| HTML | Next.js |
|---|---|
| index.html | / |
| auth.html | /auth |
| activities.html | /activities |
| detail.html | /activities/[identifier] |
| about.html | /about |
| stories.html | /stories |
| privacy.html | /privacy |
| terms.html | /terms |
| dashboard.html | /volunteer/dashboard qua alias |
| volunteer/dashboard.html | /volunteer/dashboard |
| volunteer/apply.html | /volunteer/apply/[activityId] |
| profile.html | /profile |
| schedule.html | /schedule |
| certificates.html | /certificates |
| notifications.html | /notifications |
| organizer/manage.html | /organizer/manage |
| organizer/create-event.html | /organizer/create-event |
| admin/moderation.html | /admin/moderation |
| admin/theme-settings.html | /admin/theme-settings |

## Thứ tự sửa đề xuất

1. Đối soát dữ liệu và bổ sung điều kiện nghiệp vụ ở backend; kiểm thử capacity/concurrent approve, duplicate apply, checkin/revoke/cancel.
2. Hoàn thiện Auth callback, reset mật khẩu và onboarding BTC; phân luồng route theo profile server.
3. Hợp đồng API và refresh các dữ liệu liên quan; sau đó bổ sung Realtime với quyền tối thiểu, kiểm tra hai phiên độc lập.
4. Đồng bộ shell/sidebar và phục hồi các khối/chức năng HTML: Profile, Organizer Wizard, QR/certificates, URL filters, Stories.
5. Chạy E2E TNV–BTC–Admin trên dữ liệu kiểm thử riêng; đối chiếu ảnh desktop/mobile từng trang ở cùng viewport và cùng dữ liệu.
6. Dọn CSS/component/API trùng, cập nhật tài liệu và readiness. Chỉ đánh dấu hoàn tất sau các kiểm tra nghiệp vụ và giao diện thực tế.
