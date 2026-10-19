# Đăng nhập và đăng ký

Đường dẫn: `/auth`. Đối chiếu mã nguồn ngày 19/10/2026.

Entry: [frontend/app/auth/page.tsx](D:/WebNhiLun/frontend/app/auth/page.tsx).

**Truy cập theo middleware:** Không bị middleware bắt buộc đăng nhập; từng thao tác ghi dữ liệu vẫn có kiểm tra riêng. Nguồn: [frontend/middleware.ts](D:/WebNhiLun/frontend/middleware.ts).

## 1. Bố cục và thành phần

Sơ đồ dưới đây trích từ cây JSX trong code, gồm cả nhánh điều kiện; không phải ảnh chụp kết quả trình duyệt. Các khối lặp được thể hiện theo cấu trúc khai báo.

### page.tsx

Nguồn: [frontend/app/auth/page.tsx](D:/WebNhiLun/frontend/app/auth/page.tsx).

```text
AuthForm
  div.auth-page-wrapper
    header.auth-top-nav
      a.nav-brand
        strong
      ul.auth-nav-links
        li
          a
        li
          a
        li
          a
        li
          a
    div.ambient-top-quote
    div.auth-brand-banner
      div.brand-icon-leaf-heart
      h1.auth-brand-name
      p.auth-brand-slogan
    main
      section.demo-accounts-ribbon
        div.demo-ribbon-header
        div.demo-quick-buttons-row
          button.demo-quick-card-btn
      div.auth-nav-tabs
        button
        button
      section.auth-pane.active
        form
          label.auth-field-label
          div.role-selection-grid
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-form-group
          div.auth-checkbox-row
          div.register-pwd-grid
          label.auth-checkbox-row.auth-terms-row
          p.auth-status-message
          button.auth-submit-btn
        div.auth-card-footer-link
          button
    div.ambient-bottom-quote
destinationFromVerifiedProfile
AuthPage
  Suspense
    div.auth-page-wrapper
    AuthForm
```

### Component và thẻ

| File | Component JSX sử dụng | Thẻ HTML trực tiếp |
|---|---|---|
| [frontend/app/auth/page.tsx](D:/WebNhiLun/frontend/app/auth/page.tsx) | `Suspense`, `AuthForm` | `<div>`, `<header>`, `<a>`, `<strong>`, `<span>`, `<ul>`, `<li>`, `<i>`, `<h1>`, `<p>`, `<main>`, `<section>`, `<button>`, `<form>`, `<label>`, `<input>`, `<textarea>` |

**Tiêu đề trực tiếp trong JSX:** Volunteer


## 2. Hàm và thao tác

Bảng này gồm các hàm có tên và callback trực tiếp của trang/component chính. Hàm dùng chung được tra tiếp trong [danh mục hàm](../22-function-catalog.md). Đối số là chữ ký khai báo; đầu ra là annotation hoặc biểu thức return trong source, không phải kết quả đã chạy. Hàm async bọc kết quả trong Promise. Một module dùng chung có thể khai báo nhiều trang; chỉ các nhánh được route gọi mới chạy.

| Hàm | Mục đích | Phạm vi | Đối số | Đầu ra khai báo/return | Lời gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|---|
| AuthForm | Hàm hỗ trợ; tra lời gọi trực tiếp và mã nguồn để xem xử lý đầy đủ. | module | Không có | JSX giao diện | useRouter, useSearchParams, useState, useEffect, demoRoles.map | [frontend/app/auth/page.tsx:37](D:/WebNhiLun/frontend/app/auth/page.tsx:37) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | AuthForm | Không có | Không return tường minh; xem hiệu ứng state/API | searchParams.get, setMode, setAccountRole | [frontend/app/auth/page.tsx:61](D:/WebNhiLun/frontend/app/auth/page.tsx:61) |
| callback useEffect | Đồng bộ state, đăng ký hoặc dọn hiệu ứng theo dependencies. | AuthForm | Không có | Không return tường minh; xem hiệu ứng state/API | searchParams.get, window.location.replace, encodeURIComponent, setMessage | [frontend/app/auth/page.tsx:66](D:/WebNhiLun/frontend/app/auth/page.tsx:66) |
| finishSignIn | Hoàn tất thiết lập phiên đăng nhập và chuyển đến trang đích. | AuthForm | accessToken: string, refreshToken: string, destination = "/dashboard" | Không return tường minh; xem hiệu ứng state/API | createClient, supabase.auth.setSession, router.replace, destinationFromVerifiedProfile, router.refresh | [frontend/app/auth/page.tsx:78](D:/WebNhiLun/frontend/app/auth/page.tsx:78) |
| destinationFromVerifiedProfile | Lấy hồ sơ đã xác thực để xác định trang đích theo vai trò. | AuthForm | Không có | "/organizer/manage?onboard=1"; returnTo; profile.role === "admin" ? "/admin/moderation" : profile.role === "organizer" ? "/organizer/manage" : "/volunteer/dashboard" | apiRequest, createClient().auth.getUser, createClient, searchParams.get, returnTo?.startsWith, returnTo.startsWith | [frontend/app/auth/page.tsx:97](D:/WebNhiLun/frontend/app/auth/page.tsx:97) |
| submit | Xử lý gửi biểu mẫu và phản hồi thành công/lỗi. | AuthForm | event: FormEvent<HTMLFormElement> | undefined / dừng xử lý | event.preventDefault, setBusy, setMessage, createClient, supabase.auth.signInWithPassword, email.trim, router.replace, destinationFromVerifiedProfile, router.refresh, organizationName.trim, representative.trim, organizationCategory.trim, window.localStorage.setItem, JSON.stringify, organizationDescription.trim, supabase.auth.signUp, name.trim, apiRequest, upload.append, window.localStorage.removeItem, supabase.auth.updateUser | [frontend/app/auth/page.tsx:121](D:/WebNhiLun/frontend/app/auth/page.tsx:121) |
| quickLogin | Đăng nhập tài khoản demo theo vai trò, thiết lập phiên và điều hướng. | AuthForm | role: (typeof demoRoles)[number] | Không return tường minh; xem hiệu ứng state/API | setBusy, setMessage, fetch, response.json().catch, response.json, finishSignIn | [frontend/app/auth/page.tsx:233](D:/WebNhiLun/frontend/app/auth/page.tsx:233) |
| callback response.json().catch | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | quickLogin | Không có | null | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:242](D:/WebNhiLun/frontend/app/auth/page.tsx:242) |
| resetPassword | Gửi yêu cầu khôi phục mật khẩu qua Supabase Auth. | AuthForm | Không có | Không return tường minh; xem hiệu ứng state/API | setBusy, createClient, supabase.auth.resetPasswordForEmail, email.trim, setMessage | [frontend/app/auth/page.tsx:266](D:/WebNhiLun/frontend/app/auth/page.tsx:266) |
| callback demoRoles.map | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | AuthForm | role | ( <button key={role.key} type="button" className="demo-quick-card-btn" onClick={() => quickLogin(role)} disabled={busy} > <div className={`demo-avatar-circle ${ | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:337](D:/WebNhiLun/frontend/app/auth/page.tsx:337) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | callback demoRoles.map | Không có | quickLogin(role) | quickLogin | [frontend/app/auth/page.tsx:342](D:/WebNhiLun/frontend/app/auth/page.tsx:342) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setMode("login") | setMode | [frontend/app/auth/page.tsx:360](D:/WebNhiLun/frontend/app/auth/page.tsx:360) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setMode("register") | setMode | [frontend/app/auth/page.tsx:367](D:/WebNhiLun/frontend/app/auth/page.tsx:367) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setAccountRole("volunteer") | setAccountRole | [frontend/app/auth/page.tsx:383](D:/WebNhiLun/frontend/app/auth/page.tsx:383) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setAccountRole("organizer") | setAccountRole | [frontend/app/auth/page.tsx:401](D:/WebNhiLun/frontend/app/auth/page.tsx:401) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setName(e.target.value) | setName | [frontend/app/auth/page.tsx:428](D:/WebNhiLun/frontend/app/auth/page.tsx:428) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setOrganizationName(e.target.value) | setOrganizationName | [frontend/app/auth/page.tsx:447](D:/WebNhiLun/frontend/app/auth/page.tsx:447) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setRepresentative(e.target.value) | setRepresentative | [frontend/app/auth/page.tsx:465](D:/WebNhiLun/frontend/app/auth/page.tsx:465) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setOrganizationCategory(e.target.value) | setOrganizationCategory | [frontend/app/auth/page.tsx:483](D:/WebNhiLun/frontend/app/auth/page.tsx:483) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setOrganizationDescription(e.target.value) | setOrganizationDescription | [frontend/app/auth/page.tsx:503](D:/WebNhiLun/frontend/app/auth/page.tsx:503) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setOrganizationDocument(e.target.files?.[0] ?? null) | setOrganizationDocument | [frontend/app/auth/page.tsx:520](D:/WebNhiLun/frontend/app/auth/page.tsx:520) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setEmail(e.target.value) | setEmail | [frontend/app/auth/page.tsx:546](D:/WebNhiLun/frontend/app/auth/page.tsx:546) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/page.tsx:577](D:/WebNhiLun/frontend/app/auth/page.tsx:577) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setShowPassword((value) => !value) | setShowPassword | [frontend/app/auth/page.tsx:585](D:/WebNhiLun/frontend/app/auth/page.tsx:585) |
| callback setShowPassword | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | value | !value | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:585](D:/WebNhiLun/frontend/app/auth/page.tsx:585) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | event | setRememberSession(event.target.checked) | setRememberSession | [frontend/app/auth/page.tsx:603](D:/WebNhiLun/frontend/app/auth/page.tsx:603) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/page.tsx:636](D:/WebNhiLun/frontend/app/auth/page.tsx:636) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setShowPassword((value) => !value) | setShowPassword | [frontend/app/auth/page.tsx:644](D:/WebNhiLun/frontend/app/auth/page.tsx:644) |
| callback setShowPassword | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | value | !value | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:644](D:/WebNhiLun/frontend/app/auth/page.tsx:644) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | e | setConfirmPassword(e.target.value) | setConfirmPassword | [frontend/app/auth/page.tsx:672](D:/WebNhiLun/frontend/app/auth/page.tsx:672) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | setShowConfirmPassword((value) => !value) | setShowConfirmPassword | [frontend/app/auth/page.tsx:680](D:/WebNhiLun/frontend/app/auth/page.tsx:680) |
| callback setShowConfirmPassword | Callback xử lý dữ liệu hoặc lifecycle tại nơi gọi được nêu. | inline onClick | value | !value | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:681](D:/WebNhiLun/frontend/app/auth/page.tsx:681) |
| inline onChange | Handler trực tiếp tại thuộc tính onChange; xem các lời gọi và bảng sự kiện. | AuthForm | event | setTermsAccepted(event.target.checked) | setTermsAccepted | [frontend/app/auth/page.tsx:700](D:/WebNhiLun/frontend/app/auth/page.tsx:700) |
| inline onClick | Handler trực tiếp tại thuộc tính onClick; xem các lời gọi và bảng sự kiện. | AuthForm | Không có | Không return tường minh; xem hiệu ứng state/API | setMode, setMessage | [frontend/app/auth/page.tsx:736](D:/WebNhiLun/frontend/app/auth/page.tsx:736) |
| AuthPage | Dựng trang hoặc điều hướng; xem sơ đồ JSX và bảng API. | module | Không có | JSX giao diện | Không gọi hàm khác trực tiếp | [frontend/app/auth/page.tsx:753](D:/WebNhiLun/frontend/app/auth/page.tsx:753) |

### Sự kiện giao diện

| Thẻ/component | Sự kiện | Handler hoặc biểu thức | Nguồn |
|---|---|---|---|
| button | onClick | `{() => quickLogin(role)}` | [frontend/app/auth/page.tsx:342](D:/WebNhiLun/frontend/app/auth/page.tsx:342) |
| button | onClick | `{() => setMode("login")}` | [frontend/app/auth/page.tsx:360](D:/WebNhiLun/frontend/app/auth/page.tsx:360) |
| button | onClick | `{() => setMode("register")}` | [frontend/app/auth/page.tsx:367](D:/WebNhiLun/frontend/app/auth/page.tsx:367) |
| form | onSubmit | `{submit}` | [frontend/app/auth/page.tsx:373](D:/WebNhiLun/frontend/app/auth/page.tsx:373) |
| button | onClick | `{() => setAccountRole("volunteer")}` | [frontend/app/auth/page.tsx:383](D:/WebNhiLun/frontend/app/auth/page.tsx:383) |
| button | onClick | `{() => setAccountRole("organizer")}` | [frontend/app/auth/page.tsx:401](D:/WebNhiLun/frontend/app/auth/page.tsx:401) |
| input | onChange | `{(e) => setName(e.target.value)}` | [frontend/app/auth/page.tsx:428](D:/WebNhiLun/frontend/app/auth/page.tsx:428) |
| input | onChange | `{(e) => setOrganizationName(e.target.value)}` | [frontend/app/auth/page.tsx:447](D:/WebNhiLun/frontend/app/auth/page.tsx:447) |
| input | onChange | `{(e) => setRepresentative(e.target.value)}` | [frontend/app/auth/page.tsx:465](D:/WebNhiLun/frontend/app/auth/page.tsx:465) |
| input | onChange | `{(e) => setOrganizationCategory(e.target.value) }` | [frontend/app/auth/page.tsx:483](D:/WebNhiLun/frontend/app/auth/page.tsx:483) |
| textarea | onChange | `{(e) => setOrganizationDescription(e.target.value) }` | [frontend/app/auth/page.tsx:503](D:/WebNhiLun/frontend/app/auth/page.tsx:503) |
| input | onChange | `{(e) => setOrganizationDocument(e.target.files?.[0] ?? null) }` | [frontend/app/auth/page.tsx:520](D:/WebNhiLun/frontend/app/auth/page.tsx:520) |
| input | onChange | `{(e) => setEmail(e.target.value)}` | [frontend/app/auth/page.tsx:546](D:/WebNhiLun/frontend/app/auth/page.tsx:546) |
| button | onClick | `{resetPassword}` | [frontend/app/auth/page.tsx:561](D:/WebNhiLun/frontend/app/auth/page.tsx:561) |
| input | onChange | `{(e) => setPassword(e.target.value)}` | [frontend/app/auth/page.tsx:577](D:/WebNhiLun/frontend/app/auth/page.tsx:577) |
| button | onClick | `{() => setShowPassword((value) => !value)}` | [frontend/app/auth/page.tsx:585](D:/WebNhiLun/frontend/app/auth/page.tsx:585) |
| input | onChange | `{(event) => setRememberSession(event.target.checked) }` | [frontend/app/auth/page.tsx:603](D:/WebNhiLun/frontend/app/auth/page.tsx:603) |
| input | onChange | `{(e) => setPassword(e.target.value)}` | [frontend/app/auth/page.tsx:636](D:/WebNhiLun/frontend/app/auth/page.tsx:636) |
| button | onClick | `{() => setShowPassword((value) => !value)}` | [frontend/app/auth/page.tsx:644](D:/WebNhiLun/frontend/app/auth/page.tsx:644) |
| input | onChange | `{(e) => setConfirmPassword(e.target.value)}` | [frontend/app/auth/page.tsx:672](D:/WebNhiLun/frontend/app/auth/page.tsx:672) |
| button | onClick | `{() => setShowConfirmPassword((value) => !value) }` | [frontend/app/auth/page.tsx:680](D:/WebNhiLun/frontend/app/auth/page.tsx:680) |
| input | onChange | `{(event) => setTermsAccepted(event.target.checked)}` | [frontend/app/auth/page.tsx:700](D:/WebNhiLun/frontend/app/auth/page.tsx:700) |
| button | onClick | `{() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}` | [frontend/app/auth/page.tsx:736](D:/WebNhiLun/frontend/app/auth/page.tsx:736) |

## 3. Dữ liệu, API và điều hướng

| Nơi gọi | Hàm | Đối số trong code | Nguồn |
|---|---|---|---|
| finishSignIn | supabase.auth.setSession | `{ access_token: accessToken, refresh_token: refreshToken, }` | [frontend/app/auth/page.tsx:84](D:/WebNhiLun/frontend/app/auth/page.tsx:84) |
| finishSignIn | router.replace | `destination === "/dashboard" ? await destinationFromVerifiedProfile() : destination` | [frontend/app/auth/page.tsx:89](D:/WebNhiLun/frontend/app/auth/page.tsx:89) |
| destinationFromVerifiedProfile | apiRequest | `"/auth/me"` | [frontend/app/auth/page.tsx:98](D:/WebNhiLun/frontend/app/auth/page.tsx:98) |
| submit | supabase.auth.signInWithPassword | `{ email: email.trim(), password, }` | [frontend/app/auth/page.tsx:129](D:/WebNhiLun/frontend/app/auth/page.tsx:129) |
| submit | router.replace | `await destinationFromVerifiedProfile()` | [frontend/app/auth/page.tsx:134](D:/WebNhiLun/frontend/app/auth/page.tsx:134) |
| submit | supabase.auth.signUp | `{ email: email.trim(), password, options: { data: { name: name.trim(), role: accountRole, ...(organizationDraft ? { organization_registration_draft: organizationDraft } : {}), }, emailRedirectTo: ˋ${window.location.origin}/auth/callbackˋ, }, }` | [frontend/app/auth/page.tsx:171](D:/WebNhiLun/frontend/app/auth/page.tsx:171) |
| submit | apiRequest | `"/organizer/organization", { method: "POST", body: JSON.stringify({ name: organizationName.trim(), representative: representative.trim(), category: organizationCategory.trim(), description: organizationDescription.trim() \|\| null, }), }` | [frontend/app/auth/page.tsx:189](D:/WebNhiLun/frontend/app/auth/page.tsx:189) |
| submit | apiRequest | `"/organizer/organization/documents", { method: "POST", body: upload, }` | [frontend/app/auth/page.tsx:203](D:/WebNhiLun/frontend/app/auth/page.tsx:203) |
| submit | supabase.auth.updateUser | `{ data: { organization_registration_draft: null }, }` | [frontend/app/auth/page.tsx:208](D:/WebNhiLun/frontend/app/auth/page.tsx:208) |
| submit | router.replace | `"/organizer/manage"` | [frontend/app/auth/page.tsx:211](D:/WebNhiLun/frontend/app/auth/page.tsx:211) |
| quickLogin | fetch | `ˋ${apiBase}/api/v1/auth/demo-login/${role.key}ˋ, { method: "POST" }` | [frontend/app/auth/page.tsx:238](D:/WebNhiLun/frontend/app/auth/page.tsx:238) |
| resetPassword | supabase.auth.resetPasswordForEmail | `email.trim(), { redirectTo: ˋ${window.location.origin}/auth/callback?next=/auth/resetˋ, }` | [frontend/app/auth/page.tsx:270](D:/WebNhiLun/frontend/app/auth/page.tsx:270) |

Luồng chung: thao tác người dùng → handler trong bảng → `apiRequest`/Supabase Auth → FastAPI xác thực và kiểm tra quyền → PostgreSQL/Storage → phản hồi → state/`useLoad` cập nhật giao diện. Sự kiện chỉ đổi tab, bộ lọc hoặc mở hộp thoại không nhất thiết gọi API.

Phân quyền thực tế xem `frontend/middleware.ts` và dependency của endpoint trong [danh mục backend](../23-backend-api-reference.md). Việc ẩn nút trên giao diện không thay thế kiểm tra quyền ở server.

## 4. Giới hạn và điểm cần kiểm chứng

- Đây là kiểm kê tĩnh tại ngày lập báo cáo, không phải kết luận tất cả luồng đã qua kiểm thử trên trình duyệt.
- Các báo cáo 17–19 ghi kết quả kiểm thử của đợt trước; không dùng chúng để khẳng định trạng thái runtime hôm nay.
- Nội dung database và các nhánh theo tài khoản phải đăng nhập đúng vai trò để kiểm chứng hiển thị.

## 5. File liên quan

- [frontend/app/auth/page.tsx](D:/WebNhiLun/frontend/app/auth/page.tsx)
- [frontend/lib/supabase/client.ts](D:/WebNhiLun/frontend/lib/supabase/client.ts)
- [frontend/lib/api.ts](D:/WebNhiLun/frontend/lib/api.ts)
- [frontend/lib/data-events.ts](D:/WebNhiLun/frontend/lib/data-events.ts)
