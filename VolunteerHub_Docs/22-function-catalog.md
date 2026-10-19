# Danh mục hàm frontend

Ngày đối chiếu: 19/10/2026. Trích từ TypeScript AST; bao gồm hàm lồng, callback hook và handler inline. Số dòng giữ nguyên khi xóa comment. Tên callback mô tả nơi gắn, không phải tên hàm được export. Lời gọi trực tiếp không mở rộng các callback con.

## frontend/app/[...legacy]/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyRoute | module | { params: paramsPromise, searchParams: searchPromise, }: { params: Promise<{ legacy: string[] }>; searchParams: Promise<Record<string, string \| string[] \| undefined>>; } | Không return tường minh; xem hiệu ứng state/API | params.legacy.join, notFound, Object.entries, Array.isArray, query.append, query.has, query.get, query.delete, redirect, encodeURIComponent, target.split, query.forEach | [frontend/app/[...legacy]/page.tsx:32](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:32) |
| callback query.forEach | LegacyRoute | value, key | merged.set(key, value) | merged.set | [frontend/app/[...legacy]/page.tsx:68](D:/WebNhiLun/frontend/app/[...legacy]/page.tsx:68) |

## frontend/app/about/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/about/page.tsx:3](D:/WebNhiLun/frontend/app/about/page.tsx:3) |

## frontend/app/activities/[identifier]/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | { params: paramsPromise, }: { params: Promise<{ identifier: string }>; } | JSX giao diện | — | [frontend/app/activities/[identifier]/page.tsx:3](D:/WebNhiLun/frontend/app/activities/[identifier]/page.tsx:3) |

## frontend/app/activities/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/activities/page.tsx:4](D:/WebNhiLun/frontend/app/activities/page.tsx:4) |

## frontend/app/admin/moderation/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/admin/moderation/page.tsx:3](D:/WebNhiLun/frontend/app/admin/moderation/page.tsx:3) |

## frontend/app/admin/stories/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/admin/stories/page.tsx:3](D:/WebNhiLun/frontend/app/admin/stories/page.tsx:3) |

## frontend/app/admin/theme-settings/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/admin/theme-settings/page.tsx:3](D:/WebNhiLun/frontend/app/admin/theme-settings/page.tsx:3) |

## frontend/app/auth/callback/route.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| GET | module | request: NextRequest | NextResponse.redirect(new URL("/auth?error=callback", request.url)); NextResponse.redirect(new URL("/auth/reset", request.url)); NextResponse.redirect( new URL( onboarding ? "/organizer/manage?onboard=1" : "/dashboard", request.url, ), ) | request.nextUrl.searchParams.get, createClient, NextResponse.redirect, supabase.auth.exchangeCodeForSession | [frontend/app/auth/callback/route.ts:3](D:/WebNhiLun/frontend/app/auth/callback/route.ts:3) |

## frontend/app/auth/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| AuthForm | module | — | JSX giao diện | useRouter, useSearchParams, useState, useEffect, demoRoles.map | [frontend/app/auth/page.tsx:37](D:/WebNhiLun/frontend/app/auth/page.tsx:37) |
| callback useEffect | AuthForm | — | Không return tường minh; xem hiệu ứng state/API | searchParams.get, setMode, setAccountRole | [frontend/app/auth/page.tsx:61](D:/WebNhiLun/frontend/app/auth/page.tsx:61) |
| callback useEffect | AuthForm | — | Không return tường minh; xem hiệu ứng state/API | searchParams.get, window.location.replace, encodeURIComponent, setMessage | [frontend/app/auth/page.tsx:66](D:/WebNhiLun/frontend/app/auth/page.tsx:66) |
| finishSignIn | AuthForm | accessToken: string, refreshToken: string, destination = "/dashboard" | Không return tường minh; xem hiệu ứng state/API | createClient, supabase.auth.setSession, router.replace, destinationFromVerifiedProfile, router.refresh | [frontend/app/auth/page.tsx:78](D:/WebNhiLun/frontend/app/auth/page.tsx:78) |
| destinationFromVerifiedProfile | AuthForm | — | "/organizer/manage?onboard=1"; returnTo; profile.role === "admin" ? "/admin/moderation" : profile.role === "organizer" ? "/organizer/manage" : "/volunteer/dashboard" | apiRequest, createClient().auth.getUser, createClient, searchParams.get, returnTo?.startsWith, returnTo.startsWith | [frontend/app/auth/page.tsx:97](D:/WebNhiLun/frontend/app/auth/page.tsx:97) |
| submit | AuthForm | event: FormEvent<HTMLFormElement> | undefined / dừng xử lý | event.preventDefault, setBusy, setMessage, createClient, supabase.auth.signInWithPassword, email.trim, router.replace, destinationFromVerifiedProfile, router.refresh, organizationName.trim, representative.trim, organizationCategory.trim, window.localStorage.setItem, JSON.stringify, organizationDescription.trim, supabase.auth.signUp, name.trim, apiRequest, upload.append, window.localStorage.removeItem, supabase.auth.updateUser | [frontend/app/auth/page.tsx:121](D:/WebNhiLun/frontend/app/auth/page.tsx:121) |
| quickLogin | AuthForm | role: (typeof demoRoles)[number] | Không return tường minh; xem hiệu ứng state/API | setBusy, setMessage, fetch, response.json().catch, response.json, finishSignIn | [frontend/app/auth/page.tsx:233](D:/WebNhiLun/frontend/app/auth/page.tsx:233) |
| callback response.json().catch | quickLogin | — | null | — | [frontend/app/auth/page.tsx:242](D:/WebNhiLun/frontend/app/auth/page.tsx:242) |
| resetPassword | AuthForm | — | Không return tường minh; xem hiệu ứng state/API | setBusy, createClient, supabase.auth.resetPasswordForEmail, email.trim, setMessage | [frontend/app/auth/page.tsx:266](D:/WebNhiLun/frontend/app/auth/page.tsx:266) |
| callback demoRoles.map | AuthForm | role | ( <button key={role.key} type="button" className="demo-quick-card-btn" onClick={() => quickLogin(role)} disabled={busy} > <div className={`demo-avatar-circle ${ | — | [frontend/app/auth/page.tsx:337](D:/WebNhiLun/frontend/app/auth/page.tsx:337) |
| inline onClick | callback demoRoles.map | — | quickLogin(role) | quickLogin | [frontend/app/auth/page.tsx:342](D:/WebNhiLun/frontend/app/auth/page.tsx:342) |
| inline onClick | AuthForm | — | setMode("login") | setMode | [frontend/app/auth/page.tsx:360](D:/WebNhiLun/frontend/app/auth/page.tsx:360) |
| inline onClick | AuthForm | — | setMode("register") | setMode | [frontend/app/auth/page.tsx:367](D:/WebNhiLun/frontend/app/auth/page.tsx:367) |
| inline onClick | AuthForm | — | setAccountRole("volunteer") | setAccountRole | [frontend/app/auth/page.tsx:383](D:/WebNhiLun/frontend/app/auth/page.tsx:383) |
| inline onClick | AuthForm | — | setAccountRole("organizer") | setAccountRole | [frontend/app/auth/page.tsx:401](D:/WebNhiLun/frontend/app/auth/page.tsx:401) |
| inline onChange | AuthForm | e | setName(e.target.value) | setName | [frontend/app/auth/page.tsx:428](D:/WebNhiLun/frontend/app/auth/page.tsx:428) |
| inline onChange | AuthForm | e | setOrganizationName(e.target.value) | setOrganizationName | [frontend/app/auth/page.tsx:447](D:/WebNhiLun/frontend/app/auth/page.tsx:447) |
| inline onChange | AuthForm | e | setRepresentative(e.target.value) | setRepresentative | [frontend/app/auth/page.tsx:465](D:/WebNhiLun/frontend/app/auth/page.tsx:465) |
| inline onChange | AuthForm | e | setOrganizationCategory(e.target.value) | setOrganizationCategory | [frontend/app/auth/page.tsx:483](D:/WebNhiLun/frontend/app/auth/page.tsx:483) |
| inline onChange | AuthForm | e | setOrganizationDescription(e.target.value) | setOrganizationDescription | [frontend/app/auth/page.tsx:503](D:/WebNhiLun/frontend/app/auth/page.tsx:503) |
| inline onChange | AuthForm | e | setOrganizationDocument(e.target.files?.[0] ?? null) | setOrganizationDocument | [frontend/app/auth/page.tsx:520](D:/WebNhiLun/frontend/app/auth/page.tsx:520) |
| inline onChange | AuthForm | e | setEmail(e.target.value) | setEmail | [frontend/app/auth/page.tsx:546](D:/WebNhiLun/frontend/app/auth/page.tsx:546) |
| inline onChange | AuthForm | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/page.tsx:577](D:/WebNhiLun/frontend/app/auth/page.tsx:577) |
| inline onClick | AuthForm | — | setShowPassword((value) => !value) | setShowPassword | [frontend/app/auth/page.tsx:585](D:/WebNhiLun/frontend/app/auth/page.tsx:585) |
| callback setShowPassword | inline onClick | value | !value | — | [frontend/app/auth/page.tsx:585](D:/WebNhiLun/frontend/app/auth/page.tsx:585) |
| inline onChange | AuthForm | event | setRememberSession(event.target.checked) | setRememberSession | [frontend/app/auth/page.tsx:603](D:/WebNhiLun/frontend/app/auth/page.tsx:603) |
| inline onChange | AuthForm | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/page.tsx:636](D:/WebNhiLun/frontend/app/auth/page.tsx:636) |
| inline onClick | AuthForm | — | setShowPassword((value) => !value) | setShowPassword | [frontend/app/auth/page.tsx:644](D:/WebNhiLun/frontend/app/auth/page.tsx:644) |
| callback setShowPassword | inline onClick | value | !value | — | [frontend/app/auth/page.tsx:644](D:/WebNhiLun/frontend/app/auth/page.tsx:644) |
| inline onChange | AuthForm | e | setConfirmPassword(e.target.value) | setConfirmPassword | [frontend/app/auth/page.tsx:672](D:/WebNhiLun/frontend/app/auth/page.tsx:672) |
| inline onClick | AuthForm | — | setShowConfirmPassword((value) => !value) | setShowConfirmPassword | [frontend/app/auth/page.tsx:680](D:/WebNhiLun/frontend/app/auth/page.tsx:680) |
| callback setShowConfirmPassword | inline onClick | value | !value | — | [frontend/app/auth/page.tsx:681](D:/WebNhiLun/frontend/app/auth/page.tsx:681) |
| inline onChange | AuthForm | event | setTermsAccepted(event.target.checked) | setTermsAccepted | [frontend/app/auth/page.tsx:700](D:/WebNhiLun/frontend/app/auth/page.tsx:700) |
| inline onClick | AuthForm | — | Không return tường minh; xem hiệu ứng state/API | setMode, setMessage | [frontend/app/auth/page.tsx:736](D:/WebNhiLun/frontend/app/auth/page.tsx:736) |
| AuthPage | module | — | JSX giao diện | — | [frontend/app/auth/page.tsx:753](D:/WebNhiLun/frontend/app/auth/page.tsx:753) |

## frontend/app/auth/reset/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ResetPage | module | — | JSX giao diện | useState, useEffect | [frontend/app/auth/reset/page.tsx:4](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:4) |
| callback useEffect | ResetPage | — | () => { active = false; } | createClient() .auth.getUser() .then, createClient() .auth.getUser, createClient | [frontend/app/auth/reset/page.tsx:10](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:10) |
| callback createClient() .auth.getUser() .then | callback useEffect | { data } | Không return tường minh; xem hiệu ứng state/API | setReady, Boolean, setMessage | [frontend/app/auth/reset/page.tsx:14](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:14) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | — | [frontend/app/auth/reset/page.tsx:23](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:23) |
| submit | ResetPage | event: FormEvent | undefined / dừng xử lý | event.preventDefault, setMessage, setBusy, createClient().auth.updateUser, createClient, createClient().auth.signOut, setReady | [frontend/app/auth/reset/page.tsx:27](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:27) |
| inline onChange | ResetPage | e | setPassword(e.target.value) | setPassword | [frontend/app/auth/reset/page.tsx:62](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:62) |
| inline onChange | ResetPage | e | setConfirm(e.target.value) | setConfirm | [frontend/app/auth/reset/page.tsx:75](D:/WebNhiLun/frontend/app/auth/reset/page.tsx:75) |

## frontend/app/certificates/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/certificates/page.tsx:4](D:/WebNhiLun/frontend/app/certificates/page.tsx:4) |

## frontend/app/certificates/verify/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| VerifyForm | module | — | JSX giao diện | useSearchParams, useState, params.get, useLoad, encodeURIComponent, formatDate | [frontend/app/certificates/verify/page.tsx:10](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:10) |
| inline onSubmit | VerifyForm | e: FormEvent | Không return tường minh; xem hiệu ứng state/API | e.preventDefault, setCode, input.trim | [frontend/app/certificates/verify/page.tsx:28](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:28) |
| inline onChange | VerifyForm | e | setInput(e.target.value) | setInput | [frontend/app/certificates/verify/page.tsx:37](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:37) |
| Page | module | — | JSX giao diện | — | [frontend/app/certificates/verify/page.tsx:58](D:/WebNhiLun/frontend/app/certificates/verify/page.tsx:58) |

## frontend/app/dashboard/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | Không return tường minh; xem hiệu ứng state/API | redirect | [frontend/app/dashboard/page.tsx:3](D:/WebNhiLun/frontend/app/dashboard/page.tsx:3) |

## frontend/app/favorites/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | useLoad, useState, data?.map | [frontend/app/favorites/page.tsx:14](D:/WebNhiLun/frontend/app/favorites/page.tsx:14) |
| callback data?.map | Page | item | ( <article key={item.id}> <ActivityCard activity={item} /> <button className="btn btn-outline" onClick={async () => { try { await apiRequest( `/me/favorites/${e | — | [frontend/app/favorites/page.tsx:27](D:/WebNhiLun/frontend/app/favorites/page.tsx:27) |
| inline onClick | callback data?.map | — | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, refresh, setMessage | [frontend/app/favorites/page.tsx:32](D:/WebNhiLun/frontend/app/favorites/page.tsx:32) |

## frontend/app/forbidden/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ForbiddenPage | module | — | JSX giao diện | — | [frontend/app/forbidden/page.tsx:2](D:/WebNhiLun/frontend/app/forbidden/page.tsx:2) |

## frontend/app/layout.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| RootLayout | module | { children, }: Readonly<{ children: React.ReactNode }> | JSX giao diện | — | [frontend/app/layout.tsx:12](D:/WebNhiLun/frontend/app/layout.tsx:12) |

## frontend/app/notifications/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/notifications/page.tsx:3](D:/WebNhiLun/frontend/app/notifications/page.tsx:3) |

## frontend/app/organizer/create-event/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/organizer/create-event/page.tsx:4](D:/WebNhiLun/frontend/app/organizer/create-event/page.tsx:4) |

## frontend/app/organizer/manage/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/organizer/manage/page.tsx:3](D:/WebNhiLun/frontend/app/organizer/manage/page.tsx:3) |

## frontend/app/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/page.tsx:3](D:/WebNhiLun/frontend/app/page.tsx:3) |

## frontend/app/privacy/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/privacy/page.tsx:3](D:/WebNhiLun/frontend/app/privacy/page.tsx:3) |

## frontend/app/profile/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/profile/page.tsx:4](D:/WebNhiLun/frontend/app/profile/page.tsx:4) |

## frontend/app/schedule/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/schedule/page.tsx:3](D:/WebNhiLun/frontend/app/schedule/page.tsx:3) |

## frontend/app/stories/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/stories/page.tsx:3](D:/WebNhiLun/frontend/app/stories/page.tsx:3) |

## frontend/app/terms/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/terms/page.tsx:3](D:/WebNhiLun/frontend/app/terms/page.tsx:3) |

## frontend/app/volunteer/apply/[activityId]/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | { params: paramsPromise, }: { params: Promise<{ activityId: string }>; } | JSX giao diện | — | [frontend/app/volunteer/apply/[activityId]/page.tsx:3](D:/WebNhiLun/frontend/app/volunteer/apply/[activityId]/page.tsx:3) |

## frontend/app/volunteer/dashboard/page.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Page | module | — | JSX giao diện | — | [frontend/app/volunteer/dashboard/page.tsx:4](D:/WebNhiLun/frontend/app/volunteer/dashboard/page.tsx:4) |

## frontend/components/LegacyFrame.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyFrame | module | { source }: { source: string } | JSX giao diện | — | [frontend/components/LegacyFrame.tsx:3](D:/WebNhiLun/frontend/components/LegacyFrame.tsx:3) |

## frontend/components/portal/ActivitiesPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ActivitiesPage | module | — | JSX giao diện | useSearchParams, useState, params.get, Math.max, Number.isSafeInteger, Number, String, queryString.set, queryString.toString, useEffect, useRef, JSON.stringify, useLoad, categories.map, (filters?.cities ?? []).map, filters?.statuses?.map, data?.items.map | [frontend/components/portal/ActivitiesPage.tsx:21](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:21) |
| callback useEffect | ActivitiesPage | — | Không return tường minh; xem hiệu ứng state/API | window.history.replaceState | [frontend/components/portal/ActivitiesPage.tsx:46](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:46) |
| callback useEffect | ActivitiesPage | — | Không return tường minh; xem hiệu ứng state/API | JSON.stringify, setPage | [frontend/components/portal/ActivitiesPage.tsx:52](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:52) |
| favorite | ActivitiesPage | activity: Activity | Không return tường minh; xem hiệu ứng state/API | apiRequest, JSON.stringify, setMessage | [frontend/components/portal/ActivitiesPage.tsx:68](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:68) |
| search | ActivitiesPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setQuery, term.trim | [frontend/components/portal/ActivitiesPage.tsx:83](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:83) |
| resetFilters | ActivitiesPage | — | Không return tường minh; xem hiệu ứng state/API | setCategory, setCity, setTerm, setQuery, setTime, setStatus, setPage | [frontend/components/portal/ActivitiesPage.tsx:90](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:90) |
| categoryClass | ActivitiesPage | value: string | value.includes("Giáo dục") ? "edu" : value.includes("Y tế") ? "med" : value.includes("thiên tai") ? "relief" : value.includes("Cộng đồng") ? "comm" : "env" | value.includes | [frontend/components/portal/ActivitiesPage.tsx:99](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:99) |
| statusClass | ActivitiesPage | value: string | value.includes("hoàn thành") \|\| value.includes("kết thúc") ? "closed" : value.includes("Sắp") ? "upcoming" : value.includes("diễn ra") ? "ongoing" : "open" | value.includes | [frontend/components/portal/ActivitiesPage.tsx:110](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:110) |
| inline onChange | ActivitiesPage | event | setTerm(event.target.value) | setTerm | [frontend/components/portal/ActivitiesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:154) |
| inline onClick | ActivitiesPage | — | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:171) |
| inline onClick | ActivitiesPage | — | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:190](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:190) |
| inline onChange | ActivitiesPage | — | setCategory("") | setCategory | [frontend/components/portal/ActivitiesPage.tsx:205](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:205) |
| callback categories.map | ActivitiesPage | item | ( <label className="act-filter-label" key={item}> <input type="radio" name="activity-category" checked={category === item} onChange={() => setCategory(item)} /> | — | [frontend/components/portal/ActivitiesPage.tsx:209](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:209) |
| inline onChange | callback categories.map | — | setCategory(item) | setCategory | [frontend/components/portal/ActivitiesPage.tsx:215](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:215) |
| inline onChange | ActivitiesPage | event | setCity(event.target.value) | setCity | [frontend/components/portal/ActivitiesPage.tsx:227](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:227) |
| callback (filters?.cities ?? []).map | ActivitiesPage | item | ( <option key={item}>{item}</option> ) | — | [frontend/components/portal/ActivitiesPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:230) |
| inline onChange | ActivitiesPage | e | setTime(e.target.value) | setTime | [frontend/components/portal/ActivitiesPage.tsx:241](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:241) |
| inline onChange | ActivitiesPage | e | setStatus(e.target.value) | setStatus | [frontend/components/portal/ActivitiesPage.tsx:255](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:255) |
| callback filters?.statuses?.map | ActivitiesPage | value | ( <option key={value} value={value}> {value} </option> ) | — | [frontend/components/portal/ActivitiesPage.tsx:258](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:258) |
| inline onClick | ActivitiesPage | — | setMobileFilterOpen(false) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:277](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:277) |
| inline onClick | ActivitiesPage | — | setMobileFilterOpen(true) | setMobileFilterOpen | [frontend/components/portal/ActivitiesPage.tsx:289](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:289) |
| inline onClick | ActivitiesPage | — | setView("grid") | setView | [frontend/components/portal/ActivitiesPage.tsx:303](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:303) |
| inline onClick | ActivitiesPage | — | setView("list") | setView | [frontend/components/portal/ActivitiesPage.tsx:311](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:311) |
| inline onChange | ActivitiesPage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/ActivitiesPage.tsx:330](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:330) |
| callback categories.map | ActivitiesPage | item | ( <option key={item}>{item}</option> ) | — | [frontend/components/portal/ActivitiesPage.tsx:333](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:333) |
| callback data?.items.map | ActivitiesPage | activity | ( <article className="act-card-horizontal" key={activity.id}> <Link href={`/activities/${activity.slug}`} className="act-card-thumb-area" > <MediaImage src={ im | imageUrl, categoryClass, statusClass, descriptionText, formatDate, Math.min, Math.max, Math.round | [frontend/components/portal/ActivitiesPage.tsx:350](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:350) |
| inline onClick | callback data?.items.map | — | favorite(activity) | favorite | [frontend/components/portal/ActivitiesPage.tsx:450](D:/WebNhiLun/frontend/components/portal/ActivitiesPage.tsx:450) |

## frontend/components/portal/ActivityCard.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ActivityCard | module | { activity, onFavorite, }: { activity: Activity; onFavorite?: (activity: Activity) => void; } | JSX giao diện | Math.min, Math.round, Math.max, imageUrl, formatDate, descriptionText | [frontend/components/portal/ActivityCard.tsx:11](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx:11) |
| inline onClick | ActivityCard | — | onFavorite(activity) | onFavorite | [frontend/components/portal/ActivityCard.tsx:75](D:/WebNhiLun/frontend/components/portal/ActivityCard.tsx:75) |

## frontend/components/portal/ActivityDetailPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ActivityDetailPage | module | { identifier }: { identifier: string } | JSX giao diện | useLoad, encodeURIComponent, useState, Math.min, Math.round, Math.max, descriptionText, formatDate, gallery.slice(1, 4).map, gallery.slice, ….map, data.schedule.map, ….filter, ….split, gallery.map | [frontend/components/portal/ActivityDetailPage.tsx:19](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:19) |
| saveFavorite | ActivityDetailPage | — | undefined / dừng xử lý | apiRequest, JSON.stringify, setMessage | [frontend/components/portal/ActivityDetailPage.tsx:33](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:33) |
| shareActivity | ActivityDetailPage | — | Không return tường minh; xem hiệu ứng state/API | navigator.clipboard.writeText, setMessage | [frontend/components/portal/ActivityDetailPage.tsx:47](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:47) |
| goToSection | ActivityDetailPage | section: string | Không return tường minh; xem hiệu ứng state/API | setActiveTab, document .getElementById(`tab-pane-${section}`) ?.scrollIntoView, document .getElementById | [frontend/components/portal/ActivityDetailPage.tsx:55](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:55) |
| callback gallery.slice(1, 4).map | ActivityDetailPage | image, index | ( <button type="button" key={image} onClick={() => setLightboxIndex(index + 1)} aria-label={`Xem ảnh ${index + 1}`} > <MediaImage src={image} alt="" className=" | — | [frontend/components/portal/ActivityDetailPage.tsx:154](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:154) |
| inline onClick | callback gallery.slice(1, 4).map | — | setLightboxIndex(index + 1) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:158](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:158) |
| inline onClick | ActivityDetailPage | — | setLightboxIndex(0) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:171](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:171) |
| callback ….map | ActivityDetailPage | [key, label] | ( <button key={key} type="button" className={`detail-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => goToSection(key)} > {label} </button> ) | — | [frontend/components/portal/ActivityDetailPage.tsx:189](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:189) |
| inline onClick | callback ….map | — | goToSection(key) | goToSection | [frontend/components/portal/ActivityDetailPage.tsx:194](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:194) |
| callback data.schedule.map | ActivityDetailPage | item | ( <div className="detail-timeline-step" key={item.step_order} > <span className="timeline-time-badge"> {item.time_frame} </span> <div className="timeline-step-t | — | [frontend/components/portal/ActivityDetailPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:230) |
| callback ….map | ActivityDetailPage | item | ( <li key={item}> <i className="ri-checkbox-circle-fill" style={{ color: "#10b981" }} /> {item} </li> ) | — | [frontend/components/portal/ActivityDetailPage.tsx:299](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:299) |
| callback ….map | ActivityDetailPage | item | ( <li key={item}> <i className="ri-checkbox-circle-fill" style={{ color: "#10b981" }} /> {item} </li> ) | — | [frontend/components/portal/ActivityDetailPage.tsx:325](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:325) |
| callback gallery.map | ActivityDetailPage | image, index | ( <button type="button" key={image} onClick={() => setLightboxIndex(index)} > <MediaImage src={image} alt={`${data.title} ${index + 1}`} style={{ width: "100%", | — | [frontend/components/portal/ActivityDetailPage.tsx:372](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:372) |
| inline onClick | callback gallery.map | — | setLightboxIndex(index) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:376](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:376) |
| inline onClick | ActivityDetailPage | — | setLightboxIndex(null) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:487](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:487) |
| inline onClick | ActivityDetailPage | event | event.stopPropagation() | event.stopPropagation | [frontend/components/portal/ActivityDetailPage.tsx:491](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:491) |
| inline onClick | ActivityDetailPage | — | setLightboxIndex(null) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:496](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:496) |
| inline onClick | ActivityDetailPage | — | setLightboxIndex( (lightboxIndex + gallery.length - 1) % gallery.length, ) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:503](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:503) |
| inline onClick | ActivityDetailPage | — | setLightboxIndex((lightboxIndex + 1) % gallery.length) | setLightboxIndex | [frontend/components/portal/ActivityDetailPage.tsx:519](D:/WebNhiLun/frontend/components/portal/ActivityDetailPage.tsx:519) |

## frontend/components/portal/ActivityEditor.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| clean | module | value: string | DOMPurify.sanitize(value, rules) | DOMPurify.sanitize | [frontend/components/portal/ActivityEditor.tsx:20](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:20) |
| ActivityDescription | module | { value }: { value: string } | html === null ? ( <div className="activity-description" style={{ whiteSpace: "pre-line" }}> {value} </div> ) : ( <div className="activity-description" dangerous | useState, useEffect | [frontend/components/portal/ActivityEditor.tsx:24](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:24) |
| callback useEffect | ActivityDescription | — | Không return tường minh; xem hiệu ứng state/API | setHtml, /<[^>]+>/.test, clean | [frontend/components/portal/ActivityEditor.tsx:26](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:26) |
| ActivityEditor | module | { value, onChange, }: { value: string; onChange: (value: string) => void; } | JSX giao diện | useRef, useEffect, ….map, value.length.toLocaleString | [frontend/components/portal/ActivityEditor.tsx:40](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:40) |
| callback useEffect | ActivityEditor | — | undefined / dừng xử lý | /<[^>]+>/.test, clean | [frontend/components/portal/ActivityEditor.tsx:48](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:48) |
| format | ActivityEditor | tag: string | undefined / dừng xử lý | window.getSelection, selection.getRangeAt, el.contains, document.createRange, range.selectNodeContents, range.collapse, document.createElement, window.prompt, ["http:", "https:"].includes, wrapper.setAttribute, range.extractContents, item.append, contents.hasChildNodes, document.createTextNode, wrapper.append, range.insertNode, selection?.removeAllRanges, selection?.addRange, onChange, clean, el.focus | [frontend/components/portal/ActivityEditor.tsx:54](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:54) |
| callback ….map | ActivityEditor | [tag, label, symbol] | ( <button key={tag} type="button" aria-label={label} title={label} onMouseDown={(event) => event.preventDefault()} onClick={() => format(tag)} > {symbol} </butt | — | [frontend/components/portal/ActivityEditor.tsx:118](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:118) |
| inline onMouseDown | callback ….map | event | event.preventDefault() | event.preventDefault | [frontend/components/portal/ActivityEditor.tsx:124](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:124) |
| inline onClick | callback ….map | — | format(tag) | format | [frontend/components/portal/ActivityEditor.tsx:125](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:125) |
| inline onInput | ActivityEditor | event | onChange(clean(event.currentTarget.innerHTML)) | onChange, clean | [frontend/components/portal/ActivityEditor.tsx:139](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:139) |
| inline onPaste | ActivityEditor | event | undefined / dừng xử lý | event.preventDefault, event.clipboardData.getData, window.getSelection, selection.getRangeAt, editor.current?.contains, range.deleteContents, document.createTextNode, range.insertNode, range.setStartAfter, range.collapse, onChange, clean | [frontend/components/portal/ActivityEditor.tsx:140](D:/WebNhiLun/frontend/components/portal/ActivityEditor.tsx:140) |

## frontend/components/portal/AdminPages.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| AdminNavTabs | module | { current }: { current: "moderation" \| "stories" \| "themes" } | JSX giao diện | — | [frontend/components/portal/AdminPages.tsx:17](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:17) |
| AdminModerationPage | module | — | JSX giao diện | useLoad, useState, orgs.data.map, activities.data.map, logs.data.map | [frontend/components/portal/AdminPages.tsx:99](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:99) |
| decide | AdminModerationPage | path: string, decision: "approve" \| "reject", target: string | undefined / dừng xử lý | window.prompt, reason?.trim, apiRequest, JSON.stringify, setMessage, orgs.refresh, activities.refresh, logs.refresh, metrics.refresh | [frontend/components/portal/AdminPages.tsx:105](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:105) |
| callback orgs.data.map | AdminModerationPage | org | ( <tr key={org.id}> <td> <strong>{org.name}</strong> <small style={{ display: "block" }}>{org.id}</small> </td> <td>{org.representative}</td> <td>{org.category} | formatDate | [frontend/components/portal/AdminPages.tsx:181](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:181) |
| inline onClick | callback orgs.data.map | — | decide( `/admin/organizations/${org.id}/review`, "approve", org.name, ) | decide | [frontend/components/portal/AdminPages.tsx:194](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:194) |
| inline onClick | callback orgs.data.map | — | decide( `/admin/organizations/${org.id}/review`, "reject", org.name, ) | decide | [frontend/components/portal/AdminPages.tsx:206](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:206) |
| inline onClick | callback orgs.data.map | — | Không return tường minh; xem hiệu ứng state/API | apiRequest, window.open, setMessage | [frontend/components/portal/AdminPages.tsx:219](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:219) |
| callback activities.data.map | AdminModerationPage | activity | ( <tr key={activity.id}> <td> <strong>{activity.title}</strong> <small style={{ display: "block" }}> {activity.id} </small> </td> <td>{activity.organizer_name}< | formatDate | [frontend/components/portal/AdminPages.tsx:271](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:271) |
| inline onClick | callback activities.data.map | — | decide( `/admin/activities/${activity.id}/review`, "approve", activity.title, ) | decide | [frontend/components/portal/AdminPages.tsx:288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:288) |
| inline onClick | callback activities.data.map | — | decide( `/admin/activities/${activity.id}/review`, "reject", activity.title, ) | decide | [frontend/components/portal/AdminPages.tsx:300](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:300) |
| callback logs.data.map | AdminModerationPage | log | ( <tr key={log.id}> <td> {new Date(log.created_at).toLocaleString("vi-VN")} </td> <td>{log.actor}</td> <td>{log.action}</td> <td>{log.target}</td> <td>{log.deta | new Date(log.created_at).toLocaleString | [frontend/components/portal/AdminPages.tsx:336](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:336) |
| ThemeSettingsPage | module | — | JSX giao diện | useLoad, useState, themes?.map, ….map | [frontend/components/portal/AdminPages.tsx:369](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:369) |
| save | ThemeSettingsPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, apiRequest, JSON.stringify, setMessage, setEditId, setForm, refresh | [frontend/components/portal/AdminPages.tsx:379](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:379) |
| activate | ThemeSettingsPage | id: number | Không return tường minh; xem hiệu ứng state/API | apiRequest, setMessage, window.dispatchEvent, refresh | [frontend/components/portal/AdminPages.tsx:397](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:397) |
| edit | ThemeSettingsPage | theme: Theme | Không return tường minh; xem hiệu ứng state/API | setEditId, setForm | [frontend/components/portal/AdminPages.tsx:409](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:409) |
| callback themes?.map | ThemeSettingsPage | theme | ( <article className="portal-card" key={theme.id}> <div className="portal-theme-swatch" style={{ background: theme.surface_color }} > <span style={{ background: | — | [frontend/components/portal/AdminPages.tsx:437](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:437) |
| inline onClick | callback themes?.map | — | edit(theme) | edit | [frontend/components/portal/AdminPages.tsx:461](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:461) |
| inline onClick | callback themes?.map | — | activate(theme.id) | activate | [frontend/components/portal/AdminPages.tsx:468](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:468) |
| inline onChange | ThemeSettingsPage | event | setForm((value) => ({ ...value, name: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:488](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:488) |
| callback setForm | inline onChange | value | ({ ...value, name: event.target.value }) | — | [frontend/components/portal/AdminPages.tsx:489](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:489) |
| inline onChange | ThemeSettingsPage | event | setForm((value) => ({ ...value, mode: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:499](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:499) |
| callback setForm | inline onChange | value | ({ ...value, mode: event.target.value }) | — | [frontend/components/portal/AdminPages.tsx:500](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:500) |
| callback ….map | ThemeSettingsPage | key | ( <label key={key}> {key} <input type="color" value={form[key] \|\| "#066963"} onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value, })) | — | [frontend/components/portal/AdminPages.tsx:514](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:514) |
| inline onChange | callback ….map | event | setForm((value) => ({ ...value, [key]: event.target.value, })) | setForm | [frontend/components/portal/AdminPages.tsx:520](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:520) |
| callback setForm | inline onChange | value | ({ ...value, [key]: event.target.value, }) | — | [frontend/components/portal/AdminPages.tsx:521](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:521) |
| inline onChange | ThemeSettingsPage | event | setForm((value) => ({ ...value, meaning: event.target.value })) | setForm | [frontend/components/portal/AdminPages.tsx:534](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:534) |
| callback setForm | inline onChange | value | ({ ...value, meaning: event.target.value }) | — | [frontend/components/portal/AdminPages.tsx:535](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:535) |
| inline onClick | ThemeSettingsPage | — | Không return tường minh; xem hiệu ứng state/API | setEditId, setForm | [frontend/components/portal/AdminPages.tsx:546](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:546) |
| AdminStoriesPage | module | — | JSX giao diện | useState, String, useLoad, params.toString, data.items.map, formatDate | [frontend/components/portal/AdminPages.tsx:582](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:582) |
| handleSearchSubmit | AdminStoriesPage | e: FormEvent | Không return tường minh; xem hiệu ứng state/API | e.preventDefault, setSearch, query.trim, setPage | [frontend/components/portal/AdminPages.tsx:609](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:609) |
| handleResetFilter | AdminStoriesPage | — | Không return tường minh; xem hiệu ứng state/API | setQuery, setSearch, setCategory, setPage | [frontend/components/portal/AdminPages.tsx:615](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:615) |
| handleDeleteStory | AdminStoriesPage | e: FormEvent | undefined / dừng xử lý | e.preventDefault, setBusy, setMessage, apiRequest, JSON.stringify, deleteReason.trim, setDeleteTarget, setDeleteReason, refresh, refreshStats | [frontend/components/portal/AdminPages.tsx:622](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:622) |
| inline onChange | AdminStoriesPage | e | setQuery(e.target.value) | setQuery | [frontend/components/portal/AdminPages.tsx:806](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:806) |
| inline onChange | AdminStoriesPage | e | Không return tường minh; xem hiệu ứng state/API | setCategory, setPage | [frontend/components/portal/AdminPages.tsx:826](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:826) |
| callback data.items.map | AdminStoriesPage | story | ( <tr key={story.id} style={{ borderBottom: "1px solid var(--border-default, #f1f5f9)", fontSize: "0.86rem", }} > <td style={{ padding: "12px 10px" }}> <div sty | formatDate | [frontend/components/portal/AdminPages.tsx:908](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:908) |
| inline onClick | callback data.items.map | — | setViewStory(story) | setViewStory | [frontend/components/portal/AdminPages.tsx:1029](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1029) |
| inline onClick | callback data.items.map | — | Không return tường minh; xem hiệu ứng state/API | setDeleteTarget, setDeleteReason | [frontend/components/portal/AdminPages.tsx:1038](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1038) |
| inline onClose | AdminStoriesPage | — | setViewStory(null) | setViewStory | [frontend/components/portal/AdminPages.tsx:1072](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1072) |
| inline onClick | AdminStoriesPage | — | setViewStory(null) | setViewStory | [frontend/components/portal/AdminPages.tsx:1220](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1220) |
| inline onClick | AdminStoriesPage | — | Không return tường minh; xem hiệu ứng state/API | setDeleteTarget, setViewStory | [frontend/components/portal/AdminPages.tsx:1227](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1227) |
| inline onClose | AdminStoriesPage | — | setDeleteTarget(null) | setDeleteTarget | [frontend/components/portal/AdminPages.tsx:1241](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1241) |
| inline onChange | AdminStoriesPage | e | setDeleteReason(e.target.value) | setDeleteReason | [frontend/components/portal/AdminPages.tsx:1288](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1288) |
| inline onClick | AdminStoriesPage | — | setDeleteTarget(null) | setDeleteTarget | [frontend/components/portal/AdminPages.tsx:1305](D:/WebNhiLun/frontend/components/portal/AdminPages.tsx:1305) |

## frontend/components/portal/ApplyPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ApplyPage | module | { activityId }: { activityId: string } | JSX giao diện | useLoad, encodeURIComponent, useState, useRouter, formatDate, (["Liên hệ", "Khảo sát", "Cam kết", "Xác nhận"] as const).map | [frontend/components/portal/ApplyPage.tsx:18](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:18) |
| submit | ApplyPage | — | undefined / dừng xử lý | setMessage, setBusy, apiRequest, JSON.stringify, setStep | [frontend/components/portal/ApplyPage.tsx:42](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:42) |
| callback (["Liên hệ", "Khảo sát", "Cam kết", "Xác nhận"] as const).map | ApplyPage | label, index | JSX giao diện | — | [frontend/components/portal/ApplyPage.tsx:100](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:100) |
| inline onClick | ApplyPage | — | setStep(2) | setStep | [frontend/components/portal/ApplyPage.tsx:164](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:164) |
| inline onChange | ApplyPage | event | setExperience(event.target.value) | setExperience | [frontend/components/portal/ApplyPage.tsx:184](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:184) |
| inline onChange | ApplyPage | event | setSkills(event.target.value) | setSkills | [frontend/components/portal/ApplyPage.tsx:196](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:196) |
| inline onChange | ApplyPage | event | setShift(event.target.value) | setShift | [frontend/components/portal/ApplyPage.tsx:206](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:206) |
| inline onClick | ApplyPage | — | setStep(1) | setStep | [frontend/components/portal/ApplyPage.tsx:223](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:223) |
| inline onClick | ApplyPage | — | setStep(3) | setStep | [frontend/components/portal/ApplyPage.tsx:230](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:230) |
| inline onChange | ApplyPage | event | setAgreed(event.target.checked) | setAgreed | [frontend/components/portal/ApplyPage.tsx:260](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:260) |
| inline onClick | ApplyPage | — | setStep(2) | setStep | [frontend/components/portal/ApplyPage.tsx:271](D:/WebNhiLun/frontend/components/portal/ApplyPage.tsx:271) |

## frontend/components/portal/CertificateQr.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| CertificateQr | module | { code }: { code: string } | src ? ( <MediaImage src={src} width={60} height={60} alt={`QR xác thực ${code}`} /> ) : ( <span>Đang tạo QR…</span> ) | useState, useEffect | [frontend/components/portal/CertificateQr.tsx:5](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx:5) |
| callback useEffect | CertificateQr | — | () => { active = false; } | ….catch, ….then, QRCode.toDataURL, encodeURIComponent | [frontend/components/portal/CertificateQr.tsx:7](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx:7) |
| callback ….then | callback useEffect | value | Không return tường minh; xem hiệu ứng state/API | setSrc | [frontend/components/portal/CertificateQr.tsx:13](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx:13) |
| callback ….catch | callback useEffect | error | console.error("Không tạo được QR", error) | console.error | [frontend/components/portal/CertificateQr.tsx:16](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx:16) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | — | [frontend/components/portal/CertificateQr.tsx:17](D:/WebNhiLun/frontend/components/portal/CertificateQr.tsx:17) |

## frontend/components/portal/CertificatesPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| CertificatesPage | module | — | JSX giao diện | useLoad, useSearchParams, useState, searchParams.get, (data ?? []).filter, visibleCertificates.map | [frontend/components/portal/CertificatesPage.tsx:21](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:21) |
| callback (data ?? []).filter | CertificatesPage | cert | !search.trim() \|\| `${cert.certificate_code} ${cert.issuer} ${cert.title}` .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLowerCase("vi")) | search.trim, ….includes, `${cert.certificate_code} ${cert.issuer} ${cert.title}` .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/CertificatesPage.tsx:38](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:38) |
| copyCertificateLink | CertificatesPage | cert: Certificate | Không return tường minh; xem hiệu ứng state/API | navigator.clipboard.writeText, encodeURIComponent, setCopyMessage | [frontend/components/portal/CertificatesPage.tsx:44](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:44) |
| verify | CertificatesPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setMessage, setVerified, apiRequest, encodeURIComponent, code.trim | [frontend/components/portal/CertificatesPage.tsx:54](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:54) |
| callback visibleCertificates.map | CertificatesPage | cert, index | ( <article className="cert-card-item" key={cert.id}> <div className="cert-gold-header" style={{ background: index % 3 === 0 ? "linear-gradient(135deg,#0d9d74,#1 | formatDate, encodeURIComponent | [frontend/components/portal/CertificatesPage.tsx:102](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:102) |
| inline onClick | callback visibleCertificates.map | — | Không return tường minh; xem hiệu ứng state/API | ….catch, apiDownload, encodeURIComponent | [frontend/components/portal/CertificatesPage.tsx:154](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:154) |
| callback ….catch | inline onClick | error | setCopyMessage(error.message) | setCopyMessage | [frontend/components/portal/CertificatesPage.tsx:158](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:158) |
| inline onClick | callback visibleCertificates.map | — | void copyCertificateLink(cert) | copyCertificateLink | [frontend/components/portal/CertificatesPage.tsx:166](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:166) |
| inline onChange | CertificatesPage | event | setCode(event.target.value) | setCode | [frontend/components/portal/CertificatesPage.tsx:196](D:/WebNhiLun/frontend/components/portal/CertificatesPage.tsx:196) |

## frontend/components/portal/CheckinDialog.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| CheckinDialog | module | { application, confirm, close, }: { application: Application; confirm: (id: string) => Promise<void>; close: () => void; } | JSX giao diện | useState, useRef, useEffect | [frontend/components/portal/CheckinDialog.tsx:11](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:11) |
| stop | CheckinDialog | — | Không return tường minh; xem hiệu ứng state/API | clearInterval, stream.current?.getTracks().forEach, stream.current?.getTracks, setScanning | [frontend/components/portal/CheckinDialog.tsx:28](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:28) |
| callback stream.current?.getTracks().forEach | stop | track | track.stop() | track.stop | [frontend/components/portal/CheckinDialog.tsx:31](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:31) |
| callback useEffect | CheckinDialog | — | () => { if (timer.current) clearInterval(timer.current); stream.current?.getTracks().forEach((track) => track.stop()); } | ….catch, ….then, QRCode.toDataURL, JSON.stringify | [frontend/components/portal/CheckinDialog.tsx:35](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:35) |
| callback ….catch | callback useEffect | error | setMessage(error.message) | setMessage | [frontend/components/portal/CheckinDialog.tsx:43](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:43) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | clearInterval, stream.current?.getTracks().forEach, stream.current?.getTracks | [frontend/components/portal/CheckinDialog.tsx:44](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:44) |
| callback stream.current?.getTracks().forEach | callback ẩn danh | track | track.stop() | track.stop | [frontend/components/portal/CheckinDialog.tsx:46](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:46) |
| camera | CheckinDialog | — | undefined / dừng xử lý | setMessage, navigator.mediaDevices.getUserMedia, setScanning, video.current.play, setInterval, stop | [frontend/components/portal/CheckinDialog.tsx:49](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:49) |
| callback setInterval | camera | — | undefined / dừng xử lý | ….finally, ….catch, detector .detect(video.current) .then, detector .detect | [frontend/components/portal/CheckinDialog.tsx:69](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:69) |
| callback detector .detect(video.current) .then | callback setInterval | results | Không return tường minh; xem hiệu ứng state/API | setValue, stop | [frontend/components/portal/CheckinDialog.tsx:74](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:74) |
| callback ….catch | callback setInterval | error | Không return tường minh; xem hiệu ứng state/API | setMessage, stop | [frontend/components/portal/CheckinDialog.tsx:80](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:80) |
| callback ….finally | callback setInterval | — | Không return tường minh; xem hiệu ứng state/API | — | [frontend/components/portal/CheckinDialog.tsx:84](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:84) |
| submit | CheckinDialog | — | Không return tường minh; xem hiệu ứng state/API | value.trim, id.startsWith, JSON.parse, setBusy, confirm, close, setMessage | [frontend/components/portal/CheckinDialog.tsx:96](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:96) |
| inline onChange | CheckinDialog | event | setValue(event.target.value) | setValue | [frontend/components/portal/CheckinDialog.tsx:146](D:/WebNhiLun/frontend/components/portal/CheckinDialog.tsx:146) |

## frontend/components/portal/CreateActivityPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| CreateActivityPage | module | — | JSX giao diện | useState, useSearchParams, useLoad, params.get, useRef, encodeURIComponent, useEffect, useRouter, steps.map, [ "Môi trường", "Giáo dục", "Cộng đồng", "Y tế", "Động vật", "Khác", ].map, schedule.map, formatDate | [frontend/components/portal/CreateActivityPage.tsx:18](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:18) |
| callback useEffect | CreateActivityPage | — | Không return tường minh; xem hiệu ứng state/API | setRequestKey, crypto.randomUUID | [frontend/components/portal/CreateActivityPage.tsx:57](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:57) |
| callback useEffect | CreateActivityPage | — | Không return tường minh; xem hiệu ứng state/API | window.localStorage.getItem, setDraftId | [frontend/components/portal/CreateActivityPage.tsx:60](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:60) |
| callback useEffect | CreateActivityPage | — | Không return tường minh; xem hiệu ứng state/API | setForm, setSchedule, record.schedule?.map, setRequestKey, setSavedBanner | [frontend/components/portal/CreateActivityPage.tsx:66](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:66) |
| callback setForm | callback useEffect | current | Object.fromEntries( Object.keys(current).map((key) => [ key, record.draft_payload?.[key as keyof typeof form] ?? record[key as keyof Activity], ]), ) as typeof  | Object.fromEntries, Object.keys(current).map, Object.keys | [frontend/components/portal/CreateActivityPage.tsx:74](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:74) |
| callback Object.keys(current).map | callback setForm | key | [ key, record.draft_payload?.[key as keyof typeof form] ?? record[key as keyof Activity], ] | — | [frontend/components/portal/CreateActivityPage.tsx:76](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:76) |
| callback record.schedule?.map | callback useEffect | item | ({ time_frame: item.time_frame, content: item.content, }) | — | [frontend/components/portal/CreateActivityPage.tsx:84](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:84) |
| callback useEffect | CreateActivityPage | — | undefined / dừng xử lý; () => URL.revokeObjectURL(objectUrl) | setBannerPreview, URL.createObjectURL | [frontend/components/portal/CreateActivityPage.tsx:95](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:95) |
| callback ẩn danh | callback useEffect | — | URL.revokeObjectURL(objectUrl) | URL.revokeObjectURL | [frontend/components/portal/CreateActivityPage.tsx:102](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:102) |
| set | CreateActivityPage | key: K, value: (typeof form)[K] | Không return tường minh; xem hiệu ứng state/API | setForm | [frontend/components/portal/CreateActivityPage.tsx:104](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:104) |
| callback setForm | set | current | ({ ...current, [key]: value }) | — | [frontend/components/portal/CreateActivityPage.tsx:105](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:105) |
| nextStep | CreateActivityPage | — | undefined / dừng xử lý | (required[step] ?? []).some, setMessage, setStep | [frontend/components/portal/CreateActivityPage.tsx:107](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:107) |
| callback (required[step] ?? []).some | nextStep | value | !value.trim() | value.trim | [frontend/components/portal/CreateActivityPage.tsx:113](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:113) |
| callback setStep | nextStep | current | current + 1 | — | [frontend/components/portal/CreateActivityPage.tsx:118](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:118) |
| persist | CreateActivityPage | publish: boolean | record | new Date().toLocaleDateString, Number, schedule.filter, apiRequest, JSON.stringify, setDraftId, window.localStorage.setItem | [frontend/components/portal/CreateActivityPage.tsx:120](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:120) |
| callback schedule.filter | persist | item | item.time_frame.trim() && item.content.trim() | item.time_frame.trim, item.content.trim | [frontend/components/portal/CreateActivityPage.tsx:135](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:135) |
| saveDraft | CreateActivityPage | — | Không return tường minh; xem hiệu ứng state/API | setBusy, setMessage, persist | [frontend/components/portal/CreateActivityPage.tsx:147](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:147) |
| submit | CreateActivityPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setBusy, setMessage, form.title.trim, form.event_time.trim, form.city.trim, form.location.trim, descriptionText, persist, upload.append, apiRequest, setBanner, JSON.stringify, schedule.filter, window.localStorage.removeItem, router.push | [frontend/components/portal/CreateActivityPage.tsx:161](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:161) |
| callback schedule.filter | submit | item | item.time_frame.trim() && item.content.trim() | item.time_frame.trim, item.content.trim | [frontend/components/portal/CreateActivityPage.tsx:195](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:195) |
| callback steps.map | CreateActivityPage | [title, subtitle], index | ( <Fragment key={title}> <button type="button" className={`org-step-node${step === index + 1 ? " active" : ""}${step > index + 1 ? " completed" : ""}`} onClick= | — | [frontend/components/portal/CreateActivityPage.tsx:296](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:296) |
| inline onClick | callback steps.map | — | Không return tường minh; xem hiệu ứng state/API | setStep | [frontend/components/portal/CreateActivityPage.tsx:301](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:301) |
| inline onChange | CreateActivityPage | event | set("title", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:348](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:348) |
| inline onChange | CreateActivityPage | event | set("category", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:358](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:358) |
| callback [ "Môi trường", "Giáo dục", "Cộng đồng", "Y tế", "Động vật", "Khác", ].map | CreateActivityPage | value | ( <option key={value}>{value}</option> ) | — | [frontend/components/portal/CreateActivityPage.tsx:369](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:369) |
| inline onChange | CreateActivityPage | event | setBanner(event.target.files?.[0] ?? null) | setBanner | [frontend/components/portal/CreateActivityPage.tsx:389](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:389) |
| inline onChange | CreateActivityPage | event | set("capacity", Number(event.target.value)) | set, Number | [frontend/components/portal/CreateActivityPage.tsx:408](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:408) |
| inline onChange | CreateActivityPage | event | set("verified_hours", Number(event.target.value)) | set, Number | [frontend/components/portal/CreateActivityPage.tsx:422](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:422) |
| inline onChange | CreateActivityPage | event | set("event_date", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:439](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:439) |
| inline onChange | CreateActivityPage | event | set("event_time", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:451](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:451) |
| inline onChange | CreateActivityPage | event | set("city", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:462](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:462) |
| inline onChange | CreateActivityPage | event | set("location", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:471](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:471) |
| inline onChange | CreateActivityPage | event | set("deadline_date", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:484](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:484) |
| inline onChange | CreateActivityPage | e | set("short_description", e.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:495](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:495) |
| inline onChange | CreateActivityPage | value | set("description", value) | set | [frontend/components/portal/CreateActivityPage.tsx:502](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:502) |
| inline onChange | CreateActivityPage | event | set("requirements", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:512](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:512) |
| inline onChange | CreateActivityPage | event | set("items_to_bring", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:528](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:528) |
| inline onChange | CreateActivityPage | event | set("contact", event.target.value) | set | [frontend/components/portal/CreateActivityPage.tsx:539](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:539) |
| callback schedule.map | CreateActivityPage | item, index | ( <div className="org-form-group org-two-col" key={index}> <label className="org-form-label"> Thời gian <input className="org-input" value={item.time_frame} onC | — | [frontend/components/portal/CreateActivityPage.tsx:543](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:543) |
| inline onChange | callback schedule.map | event | setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, time_frame: event.target.value } : row, ), ) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:550](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:550) |
| callback setSchedule | inline onChange | rows | rows.map((row, i) => i === index ? { ...row, time_frame: event.target.value } : row, ) | rows.map | [frontend/components/portal/CreateActivityPage.tsx:551](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:551) |
| callback rows.map | callback setSchedule | row, i | i === index ? { ...row, time_frame: event.target.value } : row | — | [frontend/components/portal/CreateActivityPage.tsx:552](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:552) |
| inline onChange | callback schedule.map | event | setSchedule((rows) => rows.map((row, i) => i === index ? { ...row, content: event.target.value } : row, ), ) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:566](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:566) |
| callback setSchedule | inline onChange | rows | rows.map((row, i) => i === index ? { ...row, content: event.target.value } : row, ) | rows.map | [frontend/components/portal/CreateActivityPage.tsx:567](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:567) |
| callback rows.map | callback setSchedule | row, i | i === index ? { ...row, content: event.target.value } : row | — | [frontend/components/portal/CreateActivityPage.tsx:568](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:568) |
| inline onClick | CreateActivityPage | — | setSchedule((rows) => [ ...rows, { time_frame: "", content: "" }, ]) | setSchedule | [frontend/components/portal/CreateActivityPage.tsx:583](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:583) |
| callback setSchedule | inline onClick | rows | [ ...rows, { time_frame: "", content: "" }, ] | — | [frontend/components/portal/CreateActivityPage.tsx:584](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:584) |
| inline onClick | CreateActivityPage | — | setStep((current) => current - 1) | setStep | [frontend/components/portal/CreateActivityPage.tsx:625](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:625) |
| callback setStep | inline onClick | current | current - 1 | — | [frontend/components/portal/CreateActivityPage.tsx:625](D:/WebNhiLun/frontend/components/portal/CreateActivityPage.tsx:625) |

## frontend/components/portal/HomePage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| HomePage | module | — | JSX giao diện | useLoad, data?.items.slice, useState, ….map, filters?.categories.map, filters?.cities.map, featuredActivities.map, (filters?.categories ?? []).map | [frontend/components/portal/HomePage.tsx:21](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:21) |
| submitQuickSearch | HomePage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, params.set, window.location.assign, params.toString | [frontend/components/portal/HomePage.tsx:37](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:37) |
| inline onClick | HomePage | — | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:76](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:76) |
| callback ….map | HomePage | [icon, color, value, label] | ( <div className="stat-single-box" key={label}> <div className="stat-single-icon"> <i className={String(icon)} style={{ color: String(color), fontSize: "1.35rem | String | [frontend/components/portal/HomePage.tsx:131](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:131) |
| inline onChange | HomePage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/HomePage.tsx:153](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:153) |
| callback filters?.categories.map | HomePage | value | ( <option key={value}>{value}</option> ) | — | [frontend/components/portal/HomePage.tsx:157](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:157) |
| inline onChange | HomePage | event | setCity(event.target.value) | setCity | [frontend/components/portal/HomePage.tsx:164](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:164) |
| callback filters?.cities.map | HomePage | value | ( <option key={value}>{value}</option> ) | — | [frontend/components/portal/HomePage.tsx:168](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:168) |
| inline onChange | HomePage | event | setTime(event.target.value) | setTime | [frontend/components/portal/HomePage.tsx:175](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:175) |
| callback featuredActivities.map | HomePage | activity, index | ( <article className="featured-act-card" key={activity.id}> <div className="act-card-thumb-wrap"> <Link href={`/activities/${activity.slug}`}> {activity.banner_ | imageUrl, descriptionText, formatDate | [frontend/components/portal/HomePage.tsx:205](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:205) |
| callback (filters?.categories ?? []).map | HomePage | name, index | JSX giao diện | encodeURIComponent | [frontend/components/portal/HomePage.tsx:287](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:287) |
| inline onClick | HomePage | — | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:321](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:321) |
| inline onClick | HomePage | — | setVideoOpen(true) | setVideoOpen | [frontend/components/portal/HomePage.tsx:341](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:341) |
| inline onKeyDown | HomePage | e | Không return tường minh; xem hiệu ứng state/API | setVideoOpen | [frontend/components/portal/HomePage.tsx:344](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:344) |
| inline onClick | HomePage | — | setVideoOpen(false) | setVideoOpen | [frontend/components/portal/HomePage.tsx:473](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:473) |
| inline onClick | HomePage | event | event.stopPropagation() | event.stopPropagation | [frontend/components/portal/HomePage.tsx:488](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:488) |
| inline onClick | HomePage | — | setVideoOpen(false) | setVideoOpen | [frontend/components/portal/HomePage.tsx:511](D:/WebNhiLun/frontend/components/portal/HomePage.tsx:511) |

## frontend/components/portal/LegacyDocumentPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyDocumentPage | module | { page }: { page: "privacy" \| "terms" } | JSX giao diện | — | [frontend/components/portal/LegacyDocumentPage.tsx:4](D:/WebNhiLun/frontend/components/portal/LegacyDocumentPage.tsx:4) |

## frontend/components/portal/LegacyMarketingPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyMarketingPage | module | { page }: { page: MarketingPage } | JSX giao diện | useRef, useLoad, useState, useDebouncedValue, String, useCallback, useEffect, createPortal, storyPage?.items.map, formatDate, Boolean, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:30](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:30) |
| callback useCallback | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | setModal, setPreviewUrl, setUploadingImage | [frontend/components/portal/LegacyMarketingPage.tsx:73](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:73) |
| callback useEffect | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | setCurrentPage | [frontend/components/portal/LegacyMarketingPage.tsx:78](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:78) |
| callback useEffect | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | optimizeHtmlImages, DOMPurify.sanitize, new DOMParser().parseFromString, doc .querySelectorAll<HTMLElement>(".story-card-item") .forEach, doc .querySelectorAll, setTemplates, setContent | [frontend/components/portal/LegacyMarketingPage.tsx:81](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:81) |
| callback doc .querySelectorAll<HTMLElement>(".story-card-item") .forEach | callback useEffect | card, index | Không return tường minh; xem hiệu ứng state/API | card.remove | [frontend/components/portal/LegacyMarketingPage.tsx:92](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:92) |
| callback useEffect | LegacyMarketingPage | — | undefined / dừng xử lý; () => { root.removeEventListener("click", click); root.removeEventListener("input", input); } | setTarget, root.querySelector, root.addEventListener | [frontend/components/portal/LegacyMarketingPage.tsx:100](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:100) |
| click | callback useEffect | event: Event | undefined / dừng xử lý | element?.closest, root .querySelectorAll(".story-pill-btn") .forEach, root .querySelectorAll, setFilter, event.preventDefault, setMessage, setModal, root.querySelector, url?.startsWith, setVideo | [frontend/components/portal/LegacyMarketingPage.tsx:104](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:104) |
| callback root .querySelectorAll(".story-pill-btn") .forEach | click | item | item.classList.toggle("active", item === pill) | item.classList.toggle | [frontend/components/portal/LegacyMarketingPage.tsx:110](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:110) |
| input | callback useEffect | event: Event | Không return tường minh; xem hiệu ứng state/API | event.target.closest, setQuery | [frontend/components/portal/LegacyMarketingPage.tsx:134](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:134) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | root.removeEventListener | [frontend/components/portal/LegacyMarketingPage.tsx:143](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:143) |
| like | LegacyMarketingPage | story: Story | undefined / dừng xử lý | setMessage, apiRequest, encodeURIComponent, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:148](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:148) |
| handleImageSelect | LegacyMarketingPage | event: ChangeEvent<HTMLInputElement> | undefined / dừng xử lý | setMessage, URL.createObjectURL, setPreviewUrl, setUploadingImage, formData.append, apiRequest, setThumbnailUrl, reader.readAsDataURL | [frontend/components/portal/LegacyMarketingPage.tsx:164](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:164) |
| callback ẩn danh | handleImageSelect | — | Không return tường minh; xem hiệu ứng state/API | setThumbnailUrl | [frontend/components/portal/LegacyMarketingPage.tsx:190](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:190) |
| handleRemoveImage | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | setPreviewUrl, setThumbnailUrl | [frontend/components/portal/LegacyMarketingPage.tsx:201](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:201) |
| share | LegacyMarketingPage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setBusy, apiRequest, JSON.stringify, thumbnailUrl.trim, close, setTitle, setBody, setThumbnailUrl, setPreviewUrl, setCurrentPage, setMessage, refresh | [frontend/components/portal/LegacyMarketingPage.tsx:209](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:209) |
| callback storyPage?.items.map | LegacyMarketingPage | story | ( <StoryCard key={story.id} story={story} template={templates[story.id]} liked={Boolean(likes?.includes(story.id))} onLike={() => { void like(story); }} onOpen= | Boolean, likes?.includes | [frontend/components/portal/LegacyMarketingPage.tsx:264](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:264) |
| inline onLike | callback storyPage?.items.map | — | Không return tường minh; xem hiệu ứng state/API | like | [frontend/components/portal/LegacyMarketingPage.tsx:270](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:270) |
| inline onOpen | callback storyPage?.items.map | — | Không return tường minh; xem hiệu ứng state/API | setSelected, setModal | [frontend/components/portal/LegacyMarketingPage.tsx:273](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:273) |
| inline onChange | LegacyMarketingPage | event | setTitle(event.target.value) | setTitle | [frontend/components/portal/LegacyMarketingPage.tsx:333](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:333) |
| inline onChange | LegacyMarketingPage | event | setCategory(event.target.value) | setCategory | [frontend/components/portal/LegacyMarketingPage.tsx:348](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:348) |
| inline onClick | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | setUseUrlInput, setPreviewUrl | [frontend/components/portal/LegacyMarketingPage.tsx:372](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:372) |
| inline onChange | LegacyMarketingPage | event | Không return tường minh; xem hiệu ứng state/API | setThumbnailUrl, setPreviewUrl | [frontend/components/portal/LegacyMarketingPage.tsx:398](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:398) |
| inline onClick | LegacyMarketingPage | — | fileInputRef.current?.click() | fileInputRef.current?.click | [frontend/components/portal/LegacyMarketingPage.tsx:488](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:488) |
| inline onMouseEnter | LegacyMarketingPage | e | Không return tường minh; xem hiệu ứng state/API | — | [frontend/components/portal/LegacyMarketingPage.tsx:502](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:502) |
| inline onMouseLeave | LegacyMarketingPage | e | Không return tường minh; xem hiệu ứng state/API | — | [frontend/components/portal/LegacyMarketingPage.tsx:506](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:506) |
| inline onChange | LegacyMarketingPage | event | setBody(event.target.value) | setBody | [frontend/components/portal/LegacyMarketingPage.tsx:553](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:553) |
| inline onClick | LegacyMarketingPage | — | Không return tường minh; xem hiệu ứng state/API | like, Boolean, likes?.includes, setSelected, Math.max | [frontend/components/portal/LegacyMarketingPage.tsx:717](D:/WebNhiLun/frontend/components/portal/LegacyMarketingPage.tsx:717) |

## frontend/components/portal/LegacyMarkup.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyMarkup | module | { html, className }, ref | JSX giao diện | — | [frontend/components/portal/LegacyMarkup.tsx:6](D:/WebNhiLun/frontend/components/portal/LegacyMarkup.tsx:6) |

## frontend/components/portal/LegacyStyles.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LegacyStyles | module | — | JSX giao diện | usePathname, pathname.split, (groups[key] \|\| []).map | [frontend/components/portal/LegacyStyles.tsx:18](D:/WebNhiLun/frontend/components/portal/LegacyStyles.tsx:18) |
| callback (groups[key] \|\| []).map | LegacyStyles | name | ( <link key={name} rel="stylesheet" href={`/legacy/css/${name}.css`} /> ) | — | [frontend/components/portal/LegacyStyles.tsx:23](D:/WebNhiLun/frontend/components/portal/LegacyStyles.tsx:23) |

## frontend/components/portal/LiveDataSync.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| LiveDataSync | module | — | JSX giao diện | useState, useEffect | [frontend/components/portal/LiveDataSync.tsx:6](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:6) |
| callback useEffect | LiveDataSync | — | undefined / dừng xử lý; () => { active = false; clearTimeout(timer); clearInterval(fallback); subscription.unsubscribe(); if (channel) void client.removeChannel(channel); window.remove | new URLSearchParams(window.location.search).get, window.location.pathname.startsWith, window.location.replace, encodeURIComponent, createClient, client.auth.onAuthStateChange, ….catch, client.auth .getSession() .then, client.auth .getSession, window.addEventListener, setInterval | [frontend/components/portal/LiveDataSync.tsx:8](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:8) |
| invalidate | callback useEffect | entity?: string | Không return tường minh; xem hiệu ứng state/API | entities.add, clearTimeout, setTimeout | [frontend/components/portal/LiveDataSync.tsx:21](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:21) |
| callback setTimeout | invalidate | — | Không return tường minh; xem hiệu ứng state/API | emitDataChange, entities.clear | [frontend/components/portal/LiveDataSync.tsx:24](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:24) |
| invalidateAll | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | entities.clear, invalidate | [frontend/components/portal/LiveDataSync.tsx:34](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:34) |
| connect | callback useEffect | token?: string | undefined / dừng xử lý | setOnline, client.removeChannel, client.realtime.setAuth, ….subscribe, client .channel("site-data-changes") .on, client .channel | [frontend/components/portal/LiveDataSync.tsx:42](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:42) |
| callback client .channel("site-data-changes") .on | connect | payload | invalidate( typeof payload.new.entity === "string" ? payload.new.entity : undefined, ) | invalidate | [frontend/components/portal/LiveDataSync.tsx:59](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:59) |
| callback ….subscribe | connect | status | Không return tường minh; xem hiệu ứng state/API | setOnline, invalidateAll | [frontend/components/portal/LiveDataSync.tsx:66](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:66) |
| callback client.auth.onAuthStateChange | callback useEffect | _event, session | Không return tường minh; xem hiệu ứng state/API | setTimeout | [frontend/components/portal/LiveDataSync.tsx:75](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:75) |
| callback setTimeout | callback client.auth.onAuthStateChange | — | undefined / dừng xử lý | connect(session?.access_token).catch, connect, emitDataChange | [frontend/components/portal/LiveDataSync.tsx:76](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:76) |
| callback connect(session?.access_token).catch | callback setTimeout | error | Không return tường minh; xem hiệu ứng state/API | console.error, setOnline | [frontend/components/portal/LiveDataSync.tsx:78](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:78) |
| callback client.auth .getSession() .then | callback useEffect | { data: { session } } | connect(session?.access_token) | connect | [frontend/components/portal/LiveDataSync.tsx:87](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:87) |
| callback ….catch | callback useEffect | error | Không return tường minh; xem hiệu ứng state/API | console.error | [frontend/components/portal/LiveDataSync.tsx:88](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:88) |
| callback setInterval | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | invalidateAll | [frontend/components/portal/LiveDataSync.tsx:94](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:94) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | clearTimeout, clearInterval, subscription.unsubscribe, client.removeChannel, window.removeEventListener | [frontend/components/portal/LiveDataSync.tsx:98](D:/WebNhiLun/frontend/components/portal/LiveDataSync.tsx:98) |

## frontend/components/portal/MediaImage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| MediaImage | module | { src, alt = "", loading = "lazy", decoding = "async", sizes, ...props }: ImgHTMLAttributes<HTMLImageElement> | JSX giao diện | imageRecord, props.className?.includes, imageUrl, record?.variants.map((item) => `${item.src} ${item.width}w`).join, record?.variants.map | [frontend/components/portal/MediaImage.tsx:4](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx:4) |
| callback record?.variants.map | MediaImage | item | `${item.src} ${item.width}w` | — | [frontend/components/portal/MediaImage.tsx:26](D:/WebNhiLun/frontend/components/portal/MediaImage.tsx:26) |

## frontend/components/portal/Modal.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Modal | module | { label, onClose, children, }: { label: string; onClose: () => void; children: ReactNode; } | JSX giao diện | useRef, useEffect | [frontend/components/portal/Modal.tsx:3](D:/WebNhiLun/frontend/components/portal/Modal.tsx:3) |
| callback useEffect | Modal | — | () => { window.removeEventListener("keydown", keys); previous?.focus(); } | ref.current?.focus, window.addEventListener | [frontend/components/portal/Modal.tsx:13](D:/WebNhiLun/frontend/components/portal/Modal.tsx:13) |
| keys | callback useEffect | event: KeyboardEvent | undefined / dừng xử lý | onClose, Array.from, ref.current?.querySelectorAll, event.preventDefault, last?.focus, first?.focus | [frontend/components/portal/Modal.tsx:16](D:/WebNhiLun/frontend/components/portal/Modal.tsx:16) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | window.removeEventListener, previous?.focus | [frontend/components/portal/Modal.tsx:35](D:/WebNhiLun/frontend/components/portal/Modal.tsx:35) |
| inline onClick | Modal | event | event.stopPropagation() | event.stopPropagation | [frontend/components/portal/Modal.tsx:49](D:/WebNhiLun/frontend/components/portal/Modal.tsx:49) |

## frontend/components/portal/NotificationBell.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| NotificationBell | module | { enabled = true, buttonClass = "vh-notif-bell-btn", }: { enabled?: boolean; buttonClass?: string; } | JSX giao diện | useNotificationSummary, useState, Boolean, data?.items.map | [frontend/components/portal/NotificationBell.tsx:6](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:6) |
| markAll | NotificationBell | — | Không return tường minh; xem hiệu ứng state/API | apiRequest, setError | [frontend/components/portal/NotificationBell.tsx:16](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:16) |
| inline onClick | NotificationBell | — | setOpen((value) => !value) | setOpen | [frontend/components/portal/NotificationBell.tsx:33](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:33) |
| callback setOpen | inline onClick | value | !value | — | [frontend/components/portal/NotificationBell.tsx:33](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:33) |
| callback data?.items.map | NotificationBell | item | ( <Link className={`vh-notif-item${item.unread ? " unread" : ""}`} href={item.link \|\| "/notifications"} key={item.id} onClick={() => { setOpen(false); if (item. | new Date(item.created_at).toLocaleString | [frontend/components/portal/NotificationBell.tsx:55](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:55) |
| inline onClick | callback data?.items.map | — | Không return tường minh; xem hiệu ứng state/API | setOpen, ….catch, apiRequest, encodeURIComponent, JSON.stringify | [frontend/components/portal/NotificationBell.tsx:60](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:60) |
| callback ….catch | inline onClick | e | setError(e.message) | setError | [frontend/components/portal/NotificationBell.tsx:69](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:69) |
| inline onClick | NotificationBell | — | setOpen(false) | setOpen | [frontend/components/portal/NotificationBell.tsx:104](D:/WebNhiLun/frontend/components/portal/NotificationBell.tsx:104) |

## frontend/components/portal/NotificationsPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| NotificationsPage | module | — | JSX giao diện | useLoad, useState, useDebouncedValue, String, params.set, useEffect, [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map, visible.map | [frontend/components/portal/NotificationsPage.tsx:20](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:20) |
| callback useEffect | NotificationsPage | — | Không return tường minh; xem hiệu ứng state/API | setPage | [frontend/components/portal/NotificationsPage.tsx:37](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:37) |
| markOne | NotificationsPage | item: Notification | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, JSON.stringify, refresh, setMessage | [frontend/components/portal/NotificationsPage.tsx:40](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:40) |
| markAll | NotificationsPage | — | Không return tường minh; xem hiệu ứng state/API | apiRequest, refresh, setMessage | [frontend/components/portal/NotificationsPage.tsx:55](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:55) |
| callback [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map | NotificationsPage | [key, label] | ( <button type="button" key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)} > {label} </button> ) | — | [frontend/components/portal/NotificationsPage.tsx:102](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:102) |
| inline onClick | callback [ ["all", "Tất cả"], ["unread", "Chưa đọc"], ["read", "Đã đọc"], ].map | — | setTab(key) | setTab | [frontend/components/portal/NotificationsPage.tsx:107](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:107) |
| callback visible.map | NotificationsPage | item | ( <article className={`notify-item-card${item.unread ? " unread" : ""}`} key={item.id} onClick={() => item.unread && markOne(item)} > <div className={`notify-ic | new Date(item.created_at).toLocaleString | [frontend/components/portal/NotificationsPage.tsx:121](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:121) |
| inline onClick | callback visible.map | — | item.unread && markOne(item) | markOne | [frontend/components/portal/NotificationsPage.tsx:125](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:125) |
| inline onClick | callback visible.map | event | Không return tường minh; xem hiệu ứng state/API | event.stopPropagation, markOne | [frontend/components/portal/NotificationsPage.tsx:154](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:154) |
| inline onClick | callback visible.map | event | Không return tường minh; xem hiệu ứng state/API | event.stopPropagation, markOne | [frontend/components/portal/NotificationsPage.tsx:165](D:/WebNhiLun/frontend/components/portal/NotificationsPage.tsx:165) |

## frontend/components/portal/OrganizerManagePage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| callback dynamic | module | — | import("./CheckinDialog").then((module) => module.CheckinDialog) | import("./CheckinDialog").then, import | [frontend/components/portal/OrganizerManagePage.tsx:10](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:10) |
| callback import("./CheckinDialog").then | callback dynamic | module | module.CheckinDialog | — | [frontend/components/portal/OrganizerManagePage.tsx:11](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:11) |
| OrganizerManagePage | module | — | JSX giao diện | useLoad, useState, useEffect, useDebouncedValue, String, listParams.set, activities?.filter, activities?.find, drafts.map, activities?.map, rows.map | [frontend/components/portal/OrganizerManagePage.tsx:25](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:25) |
| callback useEffect | OrganizerManagePage | — | () => document.body.classList.remove("organizer-manage-layout") | document.body.classList.add | [frontend/components/portal/OrganizerManagePage.tsx:53](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:53) |
| callback ẩn danh | callback useEffect | — | document.body.classList.remove("organizer-manage-layout") | document.body.classList.remove | [frontend/components/portal/OrganizerManagePage.tsx:55](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:55) |
| callback useEffect | OrganizerManagePage | — | Không return tường minh; xem hiệu ứng state/API | window.localStorage.getItem, setOrganizationForm, window.localStorage.removeItem, createClient() .auth.getUser() .then, createClient() .auth.getUser, createClient | [frontend/components/portal/OrganizerManagePage.tsx:57](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:57) |
| callback setOrganizationForm | callback useEffect | current | ({ ...current, ...JSON.parse(stored), }) | JSON.parse | [frontend/components/portal/OrganizerManagePage.tsx:63](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:63) |
| callback createClient() .auth.getUser() .then | callback useEffect | { data } | Không return tường minh; xem hiệu ứng state/API | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:75](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:75) |
| callback setOrganizationForm | callback createClient() .auth.getUser() .then | current | ({ ...current, ...draft }) | — | [frontend/components/portal/OrganizerManagePage.tsx:79](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:79) |
| callback useEffect | OrganizerManagePage | — | Không return tường minh; xem hiệu ứng state/API | setPage | [frontend/components/portal/OrganizerManagePage.tsx:106](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:106) |
| registerOrganization | OrganizerManagePage | event: FormEvent<HTMLFormElement> | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, setRegistering, setMessage, apiRequest, JSON.stringify, form.append, window.localStorage.removeItem, createClient().auth.updateUser, createClient, window.location.assign | [frontend/components/portal/OrganizerManagePage.tsx:109](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:109) |
| retryOrganizationDocument | OrganizerManagePage | — | undefined / dừng xử lý | setMessage, setRegistering, form.append, apiRequest, window.localStorage.removeItem, setDocumentFile, refreshOrganization | [frontend/components/portal/OrganizerManagePage.tsx:144](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:144) |
| review | OrganizerManagePage | application: Application, decision: "approve" \| "reject" | undefined / dừng xử lý | window.prompt, reason?.trim, apiRequest, encodeURIComponent, JSON.stringify, setMessage, refresh, refreshApplicants | [frontend/components/portal/OrganizerManagePage.tsx:171](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:171) |
| checkin | OrganizerManagePage | application: Application | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, setMessage, refreshApplicants | [frontend/components/portal/OrganizerManagePage.tsx:192](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:192) |
| exportCsv | OrganizerManagePage | — | undefined / dừng xử lý | apiDownload, encodeURIComponent, setMessage | [frontend/components/portal/OrganizerManagePage.tsx:211](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:211) |
| callback activities?.filter | OrganizerManagePage | item | item.status === "draft" | — | [frontend/components/portal/OrganizerManagePage.tsx:224](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:224) |
| callback activities?.find | OrganizerManagePage | item | item.id === activityId | — | [frontend/components/portal/OrganizerManagePage.tsx:225](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:225) |
| inline close | OrganizerManagePage | — | setQrTarget(null) | setQrTarget | [frontend/components/portal/OrganizerManagePage.tsx:232](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:232) |
| inline confirm | OrganizerManagePage | id | Không return tường minh; xem hiệu ứng state/API | apiRequest, encodeURIComponent, refreshApplicants, setMessage | [frontend/components/portal/OrganizerManagePage.tsx:233](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:233) |
| inline onChange | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, name: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:281](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:281) |
| inline onChange | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, representative: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:295](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:295) |
| inline onChange | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, category: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:309](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:309) |
| inline onChange | OrganizerManagePage | event | setDocumentFile(event.target.files?.[0] ?? null) | setDocumentFile | [frontend/components/portal/OrganizerManagePage.tsx:322](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:322) |
| inline onChange | OrganizerManagePage | event | setOrganizationForm({ ...organizationForm, description: event.target.value, }) | setOrganizationForm | [frontend/components/portal/OrganizerManagePage.tsx:332](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:332) |
| inline onChange | OrganizerManagePage | event | setDocumentFile(event.target.files?.[0] ?? null) | setDocumentFile | [frontend/components/portal/OrganizerManagePage.tsx:356](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:356) |
| callback drafts.map | OrganizerManagePage | item | ( <Link className="profile-recent-row" key={item.id} href={`/organizer/create-event?draft=${encodeURIComponent(item.id)}`} > {item.title} <span>Tiếp tục chỉnh s | encodeURIComponent | [frontend/components/portal/OrganizerManagePage.tsx:379](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:379) |
| inline onChange | OrganizerManagePage | event | setSearchTerm(event.target.value) | setSearchTerm | [frontend/components/portal/OrganizerManagePage.tsx:417](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:417) |
| inline onChange | OrganizerManagePage | event | setActivityId(event.target.value) | setActivityId | [frontend/components/portal/OrganizerManagePage.tsx:423](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:423) |
| callback activities?.map | OrganizerManagePage | item | ( <option key={item.id} value={item.id}> {item.title} </option> ) | — | [frontend/components/portal/OrganizerManagePage.tsx:427](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:427) |
| inline onChange | OrganizerManagePage | event | setStatusFilter(event.target.value) | setStatusFilter | [frontend/components/portal/OrganizerManagePage.tsx:435](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:435) |
| callback rows.map | OrganizerManagePage | item | ( <tr key={item.id}> <td> <strong>{item.id}</strong> </td> <td> <strong>{item.user_name}</strong> <small style={{ display: "block" }}> {item.user_email} </small | — | [frontend/components/portal/OrganizerManagePage.tsx:476](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:476) |
| inline onClick | callback rows.map | — | review(item, "approve") | review | [frontend/components/portal/OrganizerManagePage.tsx:502](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:502) |
| inline onClick | callback rows.map | — | review(item, "reject") | review | [frontend/components/portal/OrganizerManagePage.tsx:508](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:508) |
| inline onClick | callback rows.map | — | setQrTarget(item) | setQrTarget | [frontend/components/portal/OrganizerManagePage.tsx:518](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:518) |
| inline onClick | callback rows.map | — | checkin(item) | checkin | [frontend/components/portal/OrganizerManagePage.tsx:526](D:/WebNhiLun/frontend/components/portal/OrganizerManagePage.tsx:526) |

## frontend/components/portal/Pagination.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| Pagination | module | { page, total, limit, onChange, loading = false, }: { page: number; total: number; limit: number; onChange: (page: number) => void; loading?: boolean; } | JSX giao diện | Math.max, Math.ceil, useEffect | [frontend/components/portal/Pagination.tsx:10](D:/WebNhiLun/frontend/components/portal/Pagination.tsx:10) |
| callback useEffect | Pagination | — | Không return tường minh; xem hiệu ứng state/API | onChange | [frontend/components/portal/Pagination.tsx:24](D:/WebNhiLun/frontend/components/portal/Pagination.tsx:24) |
| inline onClick | Pagination | — | onChange(page - 1) | onChange | [frontend/components/portal/Pagination.tsx:33](D:/WebNhiLun/frontend/components/portal/Pagination.tsx:33) |
| inline onClick | Pagination | — | onChange(page + 1) | onChange | [frontend/components/portal/Pagination.tsx:44](D:/WebNhiLun/frontend/components/portal/Pagination.tsx:44) |

## frontend/components/portal/ProfileDocuments.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ProfileDocuments | module | — | JSX giao diện | useLoad, useState, data.map | [frontend/components/portal/ProfileDocuments.tsx:6](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:6) |
| inline onChange | ProfileDocuments | e | undefined / dừng xử lý | setBusy, upload.append, apiRequest, refresh, setMessage | [frontend/components/portal/ProfileDocuments.tsx:24](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:24) |
| callback data.map | ProfileDocuments | doc | ( <div className="profile-recent-row" key={doc.id}> <span>{doc.name}</span> <button className="btn-box-action" onClick={async () => { try { const result = await | — | [frontend/components/portal/ProfileDocuments.tsx:54](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:54) |
| inline onClick | callback data.map | — | Không return tường minh; xem hiệu ứng state/API | apiRequest, window.open, setMessage | [frontend/components/portal/ProfileDocuments.tsx:59](D:/WebNhiLun/frontend/components/portal/ProfileDocuments.tsx:59) |

## frontend/components/portal/ProfileOverview.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ProfileOverview | module | { profile, applications, certificates, edit, skills, }: Props | JSX giao diện | applications.filter, ….slice, applications .filter, ….map, completed.length.toString().padStart, completed.length.toString, certificates.length.toString().padStart, certificates.length.toString, profile.interests?.map, profile.skills?.map, upcoming.map, completed.slice(0, 3).map, completed.slice, Math.min, Math.max, certificates.slice(0, 4).map, certificates.slice | [frontend/components/portal/ProfileOverview.tsx:14](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:14) |
| callback applications.filter | ProfileOverview | item | item.checkin_status === "checked_in" | — | [frontend/components/portal/ProfileOverview.tsx:22](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:22) |
| callback applications .filter | ProfileOverview | item | item.status === "approved" && item.checkin_status !== "checked_in" && item.event_date && item.event_date >= new Date().toLocaleDateString("en-CA") | new Date().toLocaleDateString | [frontend/components/portal/ProfileOverview.tsx:26](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:26) |
| callback ….map | ProfileOverview | [icon, color, value, label] | ( <div className="profile-kpi-card" key={label}> <div className={`kpi-icon-bubble ${color}`}> <i className={String(icon)} /> </div> <div className="kpi-text-box | String | [frontend/components/portal/ProfileOverview.tsx:59](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:59) |
| callback profile.interests?.map | ProfileOverview | item, index | ( <span className={`interest-tag-pill ${["green", "blue", "orange", "pink", "purple"][index % 5]}`} key={item} > {item} </span> ) | — | [frontend/components/portal/ProfileOverview.tsx:84](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:84) |
| callback profile.skills?.map | ProfileOverview | skill | ( <span className="skill-item-tag" key={skill}> {skill} </span> ) | — | [frontend/components/portal/ProfileOverview.tsx:104](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:104) |
| callback upcoming.map | ProfileOverview | item | ( <Link className="profile-upcoming-card" key={item.id} href={`/activities/${item.slug \|\| item.activity_id}`} > <MediaImage src={imageUrl( item.banner_url \|\| "/ | imageUrl, formatDate | [frontend/components/portal/ProfileOverview.tsx:124](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:124) |
| callback completed.slice(0, 3).map | ProfileOverview | item | ( <div className="profile-recent-row" key={item.id}> <span>{item.activity_title}</span> <span>{item.verified_hours} giờ</span> </div> ) | — | [frontend/components/portal/ProfileOverview.tsx:159](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:159) |
| callback certificates.slice(0, 4).map | ProfileOverview | item | ( <div className="profile-recent-row" key={item.id}> <span> <strong>{item.title}</strong> <small>{formatDate(item.issue_date)}</small> </span> <span>{item.hours | formatDate | [frontend/components/portal/ProfileOverview.tsx:203](D:/WebNhiLun/frontend/components/portal/ProfileOverview.tsx:203) |

## frontend/components/portal/ProfilePage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ProfilePage | module | — | JSX giao diện | useLoad, useState, useSearchParams, useEffect, JSON.stringify, imageUrl, data.name.slice, formatDate, ….map, data.skills.map, applications.map, certificates.map | [frontend/components/portal/ProfilePage.tsx:21](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:21) |
| callback useEffect | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | params.get, ["overview", "info", "skills", "history", "certs", "settings"].includes, setActiveTab | [frontend/components/portal/ProfilePage.tsx:35](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:35) |
| callback useEffect | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setName, setPhone, setDob, data.dob?.slice, setCity, setBio, setInterests, (data.interests ?? []).join, setSkills, (data.skills ?? []).join | [frontend/components/portal/ProfilePage.tsx:47](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:47) |
| save | ProfilePage | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, upload.append, apiRequest, JSON.stringify, interests .split(",") .map((value) => value.trim()) .filter, interests .split(",") .map, interests .split, skills .split(",") .map((value) => value.trim()) .filter, skills .split(",") .map, skills .split, setEditing, setAvatar, setMessage, refresh | [frontend/components/portal/ProfilePage.tsx:58](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:58) |
| callback interests .split(",") .map | save | value | value.trim() | value.trim | [frontend/components/portal/ProfilePage.tsx:81](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:81) |
| callback skills .split(",") .map | save | value | value.trim() | value.trim | [frontend/components/portal/ProfilePage.tsx:85](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:85) |
| inline onClick | ProfilePage | — | undefined / dừng xử lý | window.prompt, apiRequest, JSON.stringify, refresh, setMessage | [frontend/components/portal/ProfilePage.tsx:132](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:132) |
| inline onClick | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:173](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:173) |
| inline onClick | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:215](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:215) |
| callback ….map | ProfilePage | [key, label] | ( <button type="button" key={key} className={`profile-tab-button${activeTab === key ? " active" : ""}`} onClick={() => { setActiveTab(key); if (key === "info" \| | — | [frontend/components/portal/ProfilePage.tsx:232](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:232) |
| inline onClick | callback ….map | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:237](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:237) |
| inline edit | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:254](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:254) |
| inline skills | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:258](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:258) |
| inline onChange | ProfilePage | event | setName(event.target.value) | setName | [frontend/components/portal/ProfilePage.tsx:276](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:276) |
| inline onChange | ProfilePage | event | setPhone(event.target.value) | setPhone | [frontend/components/portal/ProfilePage.tsx:289](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:289) |
| inline onChange | ProfilePage | event | setDob(event.target.value) | setDob | [frontend/components/portal/ProfilePage.tsx:298](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:298) |
| inline onChange | ProfilePage | event | setCity(event.target.value) | setCity | [frontend/components/portal/ProfilePage.tsx:305](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:305) |
| inline onChange | ProfilePage | event | setSkills(event.target.value) | setSkills | [frontend/components/portal/ProfilePage.tsx:313](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:313) |
| inline onChange | ProfilePage | event | setInterests(event.target.value) | setInterests | [frontend/components/portal/ProfilePage.tsx:320](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:320) |
| inline onChange | ProfilePage | event | setAvatar(event.target.files?.[0] ?? null) | setAvatar | [frontend/components/portal/ProfilePage.tsx:331](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:331) |
| inline onChange | ProfilePage | event | setBio(event.target.value) | setBio | [frontend/components/portal/ProfilePage.tsx:341](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:341) |
| inline onClick | ProfilePage | — | setEditing(false) | setEditing | [frontend/components/portal/ProfilePage.tsx:352](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:352) |
| inline onClick | ProfilePage | — | setEditing(true) | setEditing | [frontend/components/portal/ProfilePage.tsx:387](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:387) |
| callback data.skills.map | ProfilePage | skill | ( <span key={skill} className="interest-tag-pill green" > {skill} </span> ) | — | [frontend/components/portal/ProfilePage.tsx:398](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:398) |
| inline onClick | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:410](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:410) |
| callback applications.map | ProfilePage | item | ( <tr key={item.id}> <td>{item.activity_title}</td> <td>{formatDate(item.applied_at)}</td> <td>{item.status_text \|\| item.status}</td> </tr> ) | formatDate | [frontend/components/portal/ProfilePage.tsx:433](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:433) |
| callback certificates.map | ProfilePage | item | ( <article className="profile-recent-row" key={item.id}> <div> <strong>{item.title}</strong> <small> {item.issuer} · {formatDate(item.issue_date)} </small> </di | formatDate | [frontend/components/portal/ProfilePage.tsx:454](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:454) |
| inline onClick | ProfilePage | — | Không return tường minh; xem hiệu ứng state/API | setActiveTab, setEditing | [frontend/components/portal/ProfilePage.tsx:476](D:/WebNhiLun/frontend/components/portal/ProfilePage.tsx:476) |

## frontend/components/portal/SchedulePage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| SchedulePage | module | — | JSX giao diện | useLoad, useState, ….sort, ….filter, (data ?? []) .filter, month.getDay, new Date( month.getFullYear(), month.getMonth() + 1, 0, ).getDate, month.getFullYear, month.getMonth, Array.from, Math.ceil, scheduled.filter, monthEvents.filter, month.toLocaleDateString, ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map, dates.map, selectedEvents.map | [frontend/components/portal/SchedulePage.tsx:18](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:18) |
| callback useState | SchedulePage | — | new Date(new Date().getFullYear(), new Date().getMonth(), 1) | new Date().getFullYear, new Date().getMonth | [frontend/components/portal/SchedulePage.tsx:23](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:23) |
| callback (data ?? []) .filter | SchedulePage | item | ["approved", "completed"].includes(item.status) && item.event_date | ["approved", "completed"].includes | [frontend/components/portal/SchedulePage.tsx:28](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:28) |
| callback ….filter | SchedulePage | item | !search.trim() \|\| item.activity_title .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLowerCase("vi")) | search.trim, item.activity_title .toLocaleLowerCase("vi") .includes, item.activity_title .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/SchedulePage.tsx:32](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:32) |
| callback ….sort | SchedulePage | a, b | (a.event_date ?? "").localeCompare(b.event_date ?? "") | (a.event_date ?? "").localeCompare | [frontend/components/portal/SchedulePage.tsx:38](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:38) |
| callback Array.from | SchedulePage | _, index | index - offset + 1 | — | [frontend/components/portal/SchedulePage.tsx:47](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:47) |
| callback scheduled.filter | SchedulePage | item | ( date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear() ) | date.getMonth, month.getMonth, date.getFullYear, month.getFullYear | [frontend/components/portal/SchedulePage.tsx:49](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:49) |
| callback monthEvents.filter | SchedulePage | item | selectedDate === null \|\| new Date(`${item.event_date}T00:00:00`).getDate() === selectedDate | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/SchedulePage.tsx:58](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:58) |
| inline onClick | SchedulePage | — | Không return tường minh; xem hiệu ứng state/API | setMonth, setSelectedDate | [frontend/components/portal/SchedulePage.tsx:87](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:87) |
| callback setMonth | inline onClick | current | new Date( current.getFullYear(), current.getMonth() - 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/SchedulePage.tsx:89](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:89) |
| inline onClick | SchedulePage | — | Không return tường minh; xem hiệu ứng state/API | setMonth, setSelectedDate | [frontend/components/portal/SchedulePage.tsx:110](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:110) |
| callback setMonth | inline onClick | current | new Date( current.getFullYear(), current.getMonth() + 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/SchedulePage.tsx:112](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:112) |
| callback ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map | SchedulePage | day, index | ( <div className="cal-header-day" key={day} style={ index === 5 ? { color: "#059669" } : index === 6 ? { color: "#ef4444" } : {} } > {day} </div> ) | — | [frontend/components/portal/SchedulePage.tsx:128](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:128) |
| callback dates.map | SchedulePage | day, index | JSX giao diện | month.getFullYear, month.getMonth, date.getMonth, monthEvents.some, date.toDateString, new Date().toDateString, monthEvents.filter | [frontend/components/portal/SchedulePage.tsx:143](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:143) |
| callback monthEvents.some | callback dates.map | item | new Date(`${item.event_date}T00:00:00`).getDate() === day | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/SchedulePage.tsx:149](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:149) |
| inline onClick | callback dates.map | — | inMonth && setSelectedDate((current) => (current === day ? null : day)) | setSelectedDate | [frontend/components/portal/SchedulePage.tsx:159](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:159) |
| callback setSelectedDate | inline onClick | current | (current === day ? null : day) | — | [frontend/components/portal/SchedulePage.tsx:161](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:161) |
| callback monthEvents.filter | callback dates.map | item | new Date( `${item.event_date}T00:00:00`, ).getDate() === day | new Date( `${item.event_date}T00:00:00`, ).getDate | [frontend/components/portal/SchedulePage.tsx:173](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:173) |
| callback selectedEvents.map | SchedulePage | item | ( <article className="shift-item-row" key={item.id}> <span className="shift-date-badge"> {formatDate(item.event_date)} </span> <div className="shift-event-info" | formatDate | [frontend/components/portal/SchedulePage.tsx:192](D:/WebNhiLun/frontend/components/portal/SchedulePage.tsx:192) |

## frontend/components/portal/StaticContentPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| StaticContentPage | module | { page }: { page: keyof typeof articles } | JSX giao diện | content.sections.map | [frontend/components/portal/StaticContentPage.tsx:96](D:/WebNhiLun/frontend/components/portal/StaticContentPage.tsx:96) |
| callback content.sections.map | StaticContentPage | [title, body] | ( <article key={title} className="portal-card"> <h2>{title}</h2> <p>{body}</p> </article> ) | — | [frontend/components/portal/StaticContentPage.tsx:107](D:/WebNhiLun/frontend/components/portal/StaticContentPage.tsx:107) |

## frontend/components/portal/StoryCard.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| StoryCard | module | { story, template, liked, onLike, onOpen, }: { story: Story; template?: string; liked: boolean; onLike: () => void; onOpen: () => void; } | template ? ( <article ref={ref} className="story-card-item" onClick={click} onKeyDown={(event) => { if ( event.key === "Enter" && (event.target as Element).clos | useRef, useEffect | [frontend/components/portal/StoryCard.tsx:15](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx:15) |
| callback useEffect | StoryCard | — | undefined / dừng xử lý | card.querySelector, String, button?.classList.toggle, button?.setAttribute | [frontend/components/portal/StoryCard.tsx:29](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx:29) |
| click | StoryCard | event: React.MouseEvent | Không return tường minh; xem hiệu ứng state/API | (event.target as Element).closest, event.preventDefault, onLike, onOpen | [frontend/components/portal/StoryCard.tsx:45](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx:45) |
| inline onKeyDown | StoryCard | event | Không return tường minh; xem hiệu ứng state/API | (event.target as Element).closest, onLike | [frontend/components/portal/StoryCard.tsx:57](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx:57) |
| inline onClick | StoryCard | event | Không return tường minh; xem hiệu ứng state/API | event.stopPropagation, onLike | [frontend/components/portal/StoryCard.tsx:78](D:/WebNhiLun/frontend/components/portal/StoryCard.tsx:78) |

## frontend/components/portal/ThemeSync.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| ThemeSync | module | — | null | useLoad, useEffect | [frontend/components/portal/ThemeSync.tsx:11](D:/WebNhiLun/frontend/components/portal/ThemeSync.tsx:11) |
| callback useEffect | ThemeSync | — | undefined / dừng xử lý | root.style.setProperty | [frontend/components/portal/ThemeSync.tsx:13](D:/WebNhiLun/frontend/components/portal/ThemeSync.tsx:13) |

## frontend/components/portal/VolunteerDashboardPage.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| VolunteerDashboardPage | module | — | JSX giao diện | useLoad, useNotificationSummary, useState, useSearchParams, ….sort, all .filter, certificates?.reduce, ….slice, ….filter, ….map, (activityPage?.items ?? []).slice, calendarMonth.getDay, Array.from, Math.ceil, new Date( calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0, ).getDate, calendarMonth.getFullYear, calendarMonth.getMonth, all.filter, dashboardParams.get, upcoming.map, filtered.map, recommended.map, imageUrl, Math.min, calendarMonth.toLocaleDateString, ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map, calendarDays.map, formatDate, encodeURIComponent, certificates?.map, notifications?.slice(0, 4).map, notifications?.slice | [frontend/components/portal/VolunteerDashboardPage.tsx:25](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:25) |
| callback useState | VolunteerDashboardPage | — | new Date(new Date().getFullYear(), new Date().getMonth(), 1) | new Date().getFullYear, new Date().getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:44](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:44) |
| tabFor | VolunteerDashboardPage | item: Application | item.checkin_status === "checked_in" \|\| item.status === "completed" ? "completed" : item.status === "approved" ? "accepted" : item.status === "in_progress" ? "i | — | [frontend/components/portal/VolunteerDashboardPage.tsx:49](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:49) |
| callback all .filter | VolunteerDashboardPage | item | (tab === "all" \|\| tabFor(item) === tab) && (!search.trim() \|\| `${item.activity_title} ${item.id}` .toLocaleLowerCase("vi") .includes(search.trim().toLocaleLower | tabFor, search.trim, `${item.activity_title} ${item.id}` .toLocaleLowerCase("vi") .includes, `${item.activity_title} ${item.id}` .toLocaleLowerCase, search.trim().toLocaleLowerCase | [frontend/components/portal/VolunteerDashboardPage.tsx:59](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:59) |
| callback ….sort | VolunteerDashboardPage | a, b | sortOrder === "newest" ? b.applied_at.localeCompare(a.applied_at) : a.applied_at.localeCompare(b.applied_at) | b.applied_at.localeCompare, a.applied_at.localeCompare | [frontend/components/portal/VolunteerDashboardPage.tsx:66](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:66) |
| callback certificates?.reduce | VolunteerDashboardPage | sum, item | sum + item.hours | — | [frontend/components/portal/VolunteerDashboardPage.tsx:71](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:71) |
| cancel | VolunteerDashboardPage | item: Application | undefined / dừng xử lý | window.confirm, apiRequest, encodeURIComponent, setMessage, refresh | [frontend/components/portal/VolunteerDashboardPage.tsx:72](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:72) |
| callback all .filter | VolunteerDashboardPage | item | item.status === "approved" && item.checkin_status !== "checked_in" | — | [frontend/components/portal/VolunteerDashboardPage.tsx:89](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:89) |
| callback ….map | VolunteerDashboardPage | item | ({ id: item.activity_id, slug: item.slug, title: item.activity_title, event_date: item.event_date \|\| "", category: item.category, banner_url: item.banner_url, c | — | [frontend/components/portal/VolunteerDashboardPage.tsx:92](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:92) |
| callback ….filter | VolunteerDashboardPage | item | new Date(`${item.event_date}T23:59:59`) >= new Date() | — | [frontend/components/portal/VolunteerDashboardPage.tsx:103](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:103) |
| callback Array.from | VolunteerDashboardPage | _, index | index - calendarOffset + 1 | — | [frontend/components/portal/VolunteerDashboardPage.tsx:120](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:120) |
| callback all.filter | VolunteerDashboardPage | item | item.checkin_status !== "checked_in" && item.event_date && new Date(`${item.event_date}T00:00:00`).getMonth() === calendarMonth.getMonth() && new Date(`${item.e | new Date(`${item.event_date}T00:00:00`).getMonth, calendarMonth.getMonth, new Date(`${item.event_date}T00:00:00`).getFullYear, calendarMonth.getFullYear | [frontend/components/portal/VolunteerDashboardPage.tsx:123](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:123) |
| callback all.filter | VolunteerDashboardPage | item | item.checkin_status !== "checked_in" && item.status === "approved" && new Date(`${item.event_date ?? ""}T23:59:59`) >= new Date() | — | [frontend/components/portal/VolunteerDashboardPage.tsx:137](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:137) |
| callback upcoming.map | VolunteerDashboardPage | item | ( <article className="v-sug-card" key={item.id}> <Link href={`/activities/${item.slug \|\| item.id}`} className="v-sug-img-wrap" > <MediaImage className="v-sug-im | imageUrl, formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:255](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:255) |
| inline onChange | VolunteerDashboardPage | event | setSearch(event.target.value) | setSearch | [frontend/components/portal/VolunteerDashboardPage.tsx:310](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:310) |
| inline onChange | VolunteerDashboardPage | event | setSortOrder(event.target.value) | setSortOrder | [frontend/components/portal/VolunteerDashboardPage.tsx:317](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:317) |
| callback ….map | VolunteerDashboardPage | [key, label] | ( <button type="button" key={key} className={`v-tab-btn${tab === key ? " active" : ""}`} onClick={() => setTab(key)} > {label} ( {key === "all" ? all.length : a | all.filter | [frontend/components/portal/VolunteerDashboardPage.tsx:333](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:333) |
| inline onClick | callback ….map | — | setTab(key) | setTab | [frontend/components/portal/VolunteerDashboardPage.tsx:338](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:338) |
| callback all.filter | callback ….map | item | tabFor(item) === key | tabFor | [frontend/components/portal/VolunteerDashboardPage.tsx:343](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:343) |
| callback filtered.map | VolunteerDashboardPage | item | ( <article className="v-reg-item" key={item.id}> <div className="v-reg-left"> <div className="v-reg-thumb" style={{ display: "grid", placeItems: "center", backg | formatDate, ["pending", "approved"].includes | [frontend/components/portal/VolunteerDashboardPage.tsx:355](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:355) |
| inline onClick | callback filtered.map | — | cancel(item) | cancel | [frontend/components/portal/VolunteerDashboardPage.tsx:417](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:417) |
| callback recommended.map | VolunteerDashboardPage | item | ( <article className="v-sug-card" key={item.id}> <Link href={`/activities/${item.slug \|\| item.id}`} className="v-sug-img-wrap" > <MediaImage className="v-sug-im | imageUrl, formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:447](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:447) |
| callback ….map | VolunteerDashboardPage | [icon, label, href] | ( <Link key={label} href={href} className="v-prof-action-item" > <span className="v-prof-action-icon"> <i className={icon} /> </span> <span className="v-prof-ac | — | [frontend/components/portal/VolunteerDashboardPage.tsx:534](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:534) |
| inline onClick | VolunteerDashboardPage | — | setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() - 1, 1, ), ) | setCalendarMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:557](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:557) |
| callback setCalendarMonth | inline onClick | current | new Date( current.getFullYear(), current.getMonth() - 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:559](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:559) |
| inline onClick | VolunteerDashboardPage | — | setCalendarMonth( (current) => new Date( current.getFullYear(), current.getMonth() + 1, 1, ), ) | setCalendarMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:573](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:573) |
| callback setCalendarMonth | inline onClick | current | new Date( current.getFullYear(), current.getMonth() + 1, 1, ) | current.getFullYear, current.getMonth | [frontend/components/portal/VolunteerDashboardPage.tsx:575](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:575) |
| callback ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map | VolunteerDashboardPage | day | ( <span key={day}>{day}</span> ) | — | [frontend/components/portal/VolunteerDashboardPage.tsx:600](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:600) |
| callback calendarDays.map | VolunteerDashboardPage | day, index | JSX giao diện | calendarMonth.getFullYear, calendarMonth.getMonth, date.getMonth, monthEvents.some | [frontend/components/portal/VolunteerDashboardPage.tsx:605](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:605) |
| callback monthEvents.some | callback calendarDays.map | item | new Date(`${item.event_date}T00:00:00`).getDate() === day | new Date(`${item.event_date}T00:00:00`).getDate | [frontend/components/portal/VolunteerDashboardPage.tsx:616](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:616) |
| inline onClick | VolunteerDashboardPage | — | Không return tường minh; xem hiệu ứng state/API | ….catch, apiDownload, encodeURIComponent | [frontend/components/portal/VolunteerDashboardPage.tsx:665](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:665) |
| callback ….catch | inline onClick | error | setMessage(error.message) | setMessage | [frontend/components/portal/VolunteerDashboardPage.tsx:669](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:669) |
| inline onClick | VolunteerDashboardPage | — | setCertificateIndex( (index) => (index - 1 + certificates!.length) % certificates!.length, ) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:688](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:688) |
| callback setCertificateIndex | inline onClick | index | (index - 1 + certificates!.length) % certificates!.length | — | [frontend/components/portal/VolunteerDashboardPage.tsx:690](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:690) |
| callback certificates?.map | VolunteerDashboardPage | cert, index | ( <button type="button" key={cert.id} className={`v-cert-dot${certificateIndex === index ? " active" : ""}`} aria-label={`Chứng nhận ${index + 1}`} onClick={()  | — | [frontend/components/portal/VolunteerDashboardPage.tsx:699](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:699) |
| inline onClick | callback certificates?.map | — | setCertificateIndex(index) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:705](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:705) |
| inline onClick | VolunteerDashboardPage | — | setCertificateIndex( (index) => (index + 1) % certificates!.length, ) | setCertificateIndex | [frontend/components/portal/VolunteerDashboardPage.tsx:713](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:713) |
| callback setCertificateIndex | inline onClick | index | (index + 1) % certificates!.length | — | [frontend/components/portal/VolunteerDashboardPage.tsx:715](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:715) |
| callback notifications?.slice(0, 4).map | VolunteerDashboardPage | item | ( <Link href={item.link \|\| "/notifications"} key={item.id} className="v-side-notif-item" > <span className={`v-side-notif-icon ${item.type === "success" ? "gree | formatDate | [frontend/components/portal/VolunteerDashboardPage.tsx:737](D:/WebNhiLun/frontend/components/portal/VolunteerDashboardPage.tsx:737) |

## frontend/components/portal/VolunteerWorkspaceFrame.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| VolunteerWorkspaceFrame | module | { active, profile, searchPlaceholder = "Tìm kiếm hoạt động, địa điểm...", searchValue, onSearchChange, children, }: { active: string; profile?: Profile \| null; unreadCount?: number; searchPlaceholder?: string; searchValue?: string; onSearchChange?: (value: string) => void; children: ReactNode; } | JSX giao diện | useNotificationSummary, useState, useRouter, useEffect, ….concat, menu .filter, links.map, imageUrl | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:31](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:31) |
| callback useEffect | VolunteerWorkspaceFrame | — | () => document.body.classList.remove("profile-layout") | document.body.classList.add | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:52](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:52) |
| callback ẩn danh | callback useEffect | — | document.body.classList.remove("profile-layout") | document.body.classList.remove | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:54](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:54) |
| callback menu .filter | VolunteerWorkspaceFrame | row | !["Dashboard", "Hoạt động của tôi", "Chứng nhận"].includes( row[1], ) | ["Dashboard", "Hoạt động của tôi", "Chứng nhận"].includes | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:60](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:60) |
| callback links.map | VolunteerWorkspaceFrame | [icon, label, href] | ( <li key={label} className={`sidebar-menu-item${active === href ? " active" : ""}`} > <Link href={href} aria-current={active === href ? "page" : undefined} > < | — | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:85](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:85) |
| inline onSubmit | VolunteerWorkspaceFrame | event | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, router.push, encodeURIComponent | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:123](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:123) |
| inline onChange | VolunteerWorkspaceFrame | e | onSearchChange ? onSearchChange(e.target.value) : setSearch(e.target.value) | onSearchChange, setSearch | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:133](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:133) |
| inline onClick | VolunteerWorkspaceFrame | — | setUserOpen((value) => !value) | setUserOpen | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:148](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:148) |
| callback setUserOpen | inline onClick | value | !value | — | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:148](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:148) |
| inline onClick | VolunteerWorkspaceFrame | — | Không return tường minh; xem hiệu ứng state/API | createClient().auth.signOut, createClient, router.replace, router.refresh | [frontend/components/portal/VolunteerWorkspaceFrame.tsx:164](D:/WebNhiLun/frontend/components/portal/VolunteerWorkspaceFrame.tsx:164) |

## frontend/components/portal/shared.tsx

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| PortalShell | module | { children }: { children: ReactNode } | JSX giao diện | usePathname, useRouter, ….includes, useLoad, useState, user?.role?.toLowerCase, role.includes, useEffect, pathname.startsWith, Boolean, imageUrl | [frontend/components/portal/shared.tsx:23](D:/WebNhiLun/frontend/components/portal/shared.tsx:23) |
| signOut | PortalShell | — | Không return tường minh; xem hiệu ứng state/API | createClient().auth.signOut, createClient, router.replace, router.refresh | [frontend/components/portal/shared.tsx:38](D:/WebNhiLun/frontend/components/portal/shared.tsx:38) |
| submitNavSearch | PortalShell | event: FormEvent | Không return tường minh; xem hiệu ứng state/API | event.preventDefault, navSearch.trim, router.push, encodeURIComponent | [frontend/components/portal/shared.tsx:43](D:/WebNhiLun/frontend/components/portal/shared.tsx:43) |
| callback useEffect | PortalShell | — | () => document.body.classList.remove("act-page-wrapper") | pathname.startsWith, document.body.classList.remove, document.body.classList.add | [frontend/components/portal/shared.tsx:61](D:/WebNhiLun/frontend/components/portal/shared.tsx:61) |
| callback ẩn danh | callback useEffect | — | document.body.classList.remove("act-page-wrapper") | document.body.classList.remove | [frontend/components/portal/shared.tsx:67](D:/WebNhiLun/frontend/components/portal/shared.tsx:67) |
| inline onChange | PortalShell | event | setNavSearch(event.target.value) | setNavSearch | [frontend/components/portal/shared.tsx:164](D:/WebNhiLun/frontend/components/portal/shared.tsx:164) |
| inline onClick | PortalShell | — | setUserMenuOpen((open) => !open) | setUserMenuOpen | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| callback setUserMenuOpen | inline onClick | open | !open | — | [frontend/components/portal/shared.tsx:179](D:/WebNhiLun/frontend/components/portal/shared.tsx:179) |
| inline onClick | PortalShell | — | setMobileOpen((open) => !open) | setMobileOpen | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |
| callback setMobileOpen | inline onClick | open | !open | — | [frontend/components/portal/shared.tsx:259](D:/WebNhiLun/frontend/components/portal/shared.tsx:259) |
| PageIntro | module | { eyebrow, title, description, action, }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; } | JSX giao diện | — | [frontend/components/portal/shared.tsx:306](D:/WebNhiLun/frontend/components/portal/shared.tsx:306) |
| StatusMessage | module | { error, loading, }: { error?: string; loading?: boolean; } | JSX giao diện; null | — | [frontend/components/portal/shared.tsx:329](D:/WebNhiLun/frontend/components/portal/shared.tsx:329) |
| EmptyState | module | { children }: { children: ReactNode } | JSX giao diện | — | [frontend/components/portal/shared.tsx:351](D:/WebNhiLun/frontend/components/portal/shared.tsx:351) |
| formatDate | module | value?: string | "Chưa cập nhật"; Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date) | value.slice, Number.isNaN, date.valueOf, new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format | [frontend/components/portal/shared.tsx:360](D:/WebNhiLun/frontend/components/portal/shared.tsx:360) |

## frontend/hooks/use-api-query.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| useLoad | module | path: string \| null | { data, error, loading, isValidating, refresh, setData } | useState, Boolean, useRef, useCallback, useEffect | [frontend/hooks/use-api-query.ts:5](D:/WebNhiLun/frontend/hooks/use-api-query.ts:5) |
| callback useCallback | useLoad | — | setReload((value) => value + 1) | setReload | [frontend/hooks/use-api-query.ts:16](D:/WebNhiLun/frontend/hooks/use-api-query.ts:16) |
| callback setReload | callback useCallback | value | value + 1 | — | [frontend/hooks/use-api-query.ts:16](D:/WebNhiLun/frontend/hooks/use-api-query.ts:16) |
| callback useEffect | useLoad | — | undefined / dừng xử lý; () => { active = false; } | setData, setError, setLoading, setIsValidating, ….finally, ….catch, apiRequest<T>(path) .then, apiRequest | [frontend/hooks/use-api-query.ts:18](D:/WebNhiLun/frontend/hooks/use-api-query.ts:18) |
| callback apiRequest<T>(path) .then | callback useEffect | value | Không return tường minh; xem hiệu ứng state/API | setData, setError | [frontend/hooks/use-api-query.ts:46](D:/WebNhiLun/frontend/hooks/use-api-query.ts:46) |
| callback ….catch | callback useEffect | reason | Không return tường minh; xem hiệu ứng state/API | setData, setError | [frontend/hooks/use-api-query.ts:53](D:/WebNhiLun/frontend/hooks/use-api-query.ts:53) |
| callback ….finally | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | setLoading, setIsValidating | [frontend/hooks/use-api-query.ts:65](D:/WebNhiLun/frontend/hooks/use-api-query.ts:65) |
| callback ẩn danh | callback useEffect | — | Không return tường minh; xem hiệu ứng state/API | — | [frontend/hooks/use-api-query.ts:71](D:/WebNhiLun/frontend/hooks/use-api-query.ts:71) |
| callback useEffect | useLoad | — | () => window.removeEventListener(DATA_CHANGED, invalidate) | window.addEventListener | [frontend/hooks/use-api-query.ts:76](D:/WebNhiLun/frontend/hooks/use-api-query.ts:76) |
| invalidate | callback useEffect | event: Event | Không return tường minh; xem hiệu ứng state/API | setData, affectsQuery, refresh | [frontend/hooks/use-api-query.ts:77](D:/WebNhiLun/frontend/hooks/use-api-query.ts:77) |
| callback ẩn danh | callback useEffect | — | window.removeEventListener(DATA_CHANGED, invalidate) | window.removeEventListener | [frontend/hooks/use-api-query.ts:89](D:/WebNhiLun/frontend/hooks/use-api-query.ts:89) |
| useDebouncedValue | module | value: T, delay = 250 | settled | useState, useEffect | [frontend/hooks/use-api-query.ts:94](D:/WebNhiLun/frontend/hooks/use-api-query.ts:94) |
| callback useEffect | useDebouncedValue | — | () => clearTimeout(timer) | setTimeout | [frontend/hooks/use-api-query.ts:96](D:/WebNhiLun/frontend/hooks/use-api-query.ts:96) |
| callback setTimeout | callback useEffect | — | setSettled(value) | setSettled | [frontend/hooks/use-api-query.ts:97](D:/WebNhiLun/frontend/hooks/use-api-query.ts:97) |
| callback ẩn danh | callback useEffect | — | clearTimeout(timer) | clearTimeout | [frontend/hooks/use-api-query.ts:98](D:/WebNhiLun/frontend/hooks/use-api-query.ts:98) |

## frontend/hooks/use-notifications.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| useNotificationSummary | module | enabled = true | useLoad<NotificationSummary>( enabled ? "/notifications/summary" : null, ) | useLoad | [frontend/hooks/use-notifications.ts:8](D:/WebNhiLun/frontend/hooks/use-notifications.ts:8) |

## frontend/lib/api.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| apiRequest | module | path: string, init: RequestInit = {} | Promise<T> | createClient().auth.getSession, createClient, queryRevision, pending.has, pending.get, (async () => { const response = await fetch(`${baseUrl}/api/v1${path}`, { ...init, headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}), ...init.headers, }, cache: "no-store", }); const body = (await response .json() .catch(() => null)) as ApiEnvelope<T> \| null; if (!response.ok) throw new Error( body?.error?.message ?? (typeof body?.detail === "string" ? body.detail : `Yêu cầu thất bại (${response.status}).`), ); if (init.method && init.method !== "GET") emitDataChange(mutationEntities(path)); return body?.data as T; }), pending.set, pending.delete | [frontend/lib/api.ts:20](D:/WebNhiLun/frontend/lib/api.ts:20) |
| callback ẩn danh | apiRequest | — | body?.data as T | fetch, response .json() .catch, response .json, emitDataChange, mutationEntities | [frontend/lib/api.ts:31](D:/WebNhiLun/frontend/lib/api.ts:31) |
| callback response .json() .catch | callback ẩn danh | — | null | — | [frontend/lib/api.ts:47](D:/WebNhiLun/frontend/lib/api.ts:47) |
| apiDownload | module | path: string, filename: string | Promise<void> | createClient, supabase.auth.getSession, fetch, response.json().catch, response.json, response.blob, URL.createObjectURL, document.createElement, link.click, URL.revokeObjectURL | [frontend/lib/api.ts:67](D:/WebNhiLun/frontend/lib/api.ts:67) |
| callback response.json().catch | apiDownload | — | null | — | [frontend/lib/api.ts:82](D:/WebNhiLun/frontend/lib/api.ts:82) |

## frontend/lib/data-events.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| queryRevision | module | path: string | `${allRevision}:${queryEntities(path) .map((entity) => revisions.get(entity) \|\| 0) .join(":")}` | queryEntities(path) .map((entity) => revisions.get(entity) \|\| 0) .join, queryEntities(path) .map, queryEntities | [frontend/lib/data-events.ts:6](D:/WebNhiLun/frontend/lib/data-events.ts:6) |
| callback queryEntities(path) .map | queryRevision | entity | revisions.get(entity) \|\| 0 | revisions.get | [frontend/lib/data-events.ts:8](D:/WebNhiLun/frontend/lib/data-events.ts:8) |
| emitDataChange | module | entities?: Iterable<string>, authChanged = false | Không return tường minh; xem hiệu ứng state/API | Array.from, list.forEach, window.dispatchEvent | [frontend/lib/data-events.ts:11](D:/WebNhiLun/frontend/lib/data-events.ts:11) |
| callback list.forEach | emitDataChange | entity | revisions.set(entity, (revisions.get(entity) \|\| 0) + 1) | revisions.set, revisions.get | [frontend/lib/data-events.ts:17](D:/WebNhiLun/frontend/lib/data-events.ts:17) |
| queryEntities | module | path: string | string[] | path.split, route.includes, route.startsWith | [frontend/lib/data-events.ts:27](D:/WebNhiLun/frontend/lib/data-events.ts:27) |
| mutationEntities | module | path: string | string[] | path.split, route.startsWith, route.includes, queryEntities(path).concat, queryEntities, path.startsWith | [frontend/lib/data-events.ts:62](D:/WebNhiLun/frontend/lib/data-events.ts:62) |
| affectsQuery | module | path: string, change?: DataChange | ( !change?.entities \|\| queryEntities(path).some((entity) => change.entities!.includes(entity)) ) | queryEntities(path).some, queryEntities | [frontend/lib/data-events.ts:101](D:/WebNhiLun/frontend/lib/data-events.ts:101) |
| callback queryEntities(path).some | affectsQuery | entity | change.entities!.includes(entity) | change.entities!.includes | [frontend/lib/data-events.ts:104](D:/WebNhiLun/frontend/lib/data-events.ts:104) |

## frontend/lib/media.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| callback records.forEach | module | record | Không return tường minh; xem hiệu ứng state/API | lookup.set, record.variants.forEach | [frontend/lib/media.ts:8](D:/WebNhiLun/frontend/lib/media.ts:8) |
| callback record.variants.forEach | callback records.forEach | variant | lookup.set(variant.src, record) | lookup.set | [frontend/lib/media.ts:10](D:/WebNhiLun/frontend/lib/media.ts:10) |
| normalize | module | value: string | /^(https?:)?\/\//i.test(value) \|\| value.startsWith("/") \|\| /^data:image\/(?:png\|jpeg\|webp);base64,/i.test(value) \|\| value.startsWith("blob:") ? value : `/legacy | /^(https?:)?\/\//i.test, value.startsWith, /^data:image\/(?:png\|jpeg\|webp);base64,/i.test, value.replace | [frontend/lib/media.ts:12](D:/WebNhiLun/frontend/lib/media.ts:12) |
| imageRecord | module | value?: string \| null | undefined / dừng xử lý; lookup.get(url) | normalize, lookup.get | [frontend/lib/media.ts:20](D:/WebNhiLun/frontend/lib/media.ts:20) |
| imageUrl | module | value?: string \| null | ( record?.variants[record.variants.length - 1]?.src \|\| normalize(value \|\| "/legacy/images/profile-avatar.jpg") ) | imageRecord, normalize | [frontend/lib/media.ts:25](D:/WebNhiLun/frontend/lib/media.ts:25) |
| optimizeHtmlImages | module | html: string | document.body.innerHTML | new DOMParser().parseFromString, document.querySelectorAll("img").forEach, document.querySelectorAll | [frontend/lib/media.ts:33](D:/WebNhiLun/frontend/lib/media.ts:33) |
| callback document.querySelectorAll("img").forEach | optimizeHtmlImages | image | undefined / dừng xử lý | imageRecord, image.getAttribute, record.variants .map((item) => `${item.src} ${item.width}w`) .join, record.variants .map, image.className.includes | [frontend/lib/media.ts:35](D:/WebNhiLun/frontend/lib/media.ts:35) |
| callback record.variants .map | callback document.querySelectorAll("img").forEach | item | `${item.src} ${item.width}w` | — | [frontend/lib/media.ts:41](D:/WebNhiLun/frontend/lib/media.ts:41) |

## frontend/lib/rich-text.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| descriptionText | module | value: string | value .replace(/<[^>]*>/g, " ") .replace(/&nbsp;/g, " ") .replace(/\s+/g, " ") .trim() | value .replace(/<[^>]*>/g, " ") .replace(/&nbsp;/g, " ") .replace(/\s+/g, " ") .trim, value .replace(/<[^>]*>/g, " ") .replace(/&nbsp;/g, " ") .replace, value .replace(/<[^>]*>/g, " ") .replace, value .replace | [frontend/lib/rich-text.ts:1](D:/WebNhiLun/frontend/lib/rich-text.ts:1) |

## frontend/lib/supabase/client.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| createClient | module | — | createBrowserClient(url, key, { cookies: { getAll: () => typeof document === "undefined" ? [] : parseCookieHeader(document.cookie).map((cookie) => ({ name: cook | createBrowserClient | [frontend/lib/supabase/client.ts:7](D:/WebNhiLun/frontend/lib/supabase/client.ts:7) |
| getAll | createClient | — | typeof document === "undefined" ? [] : parseCookieHeader(document.cookie).map((cookie) => ({ name: cookie.name, value: cookie.value \|\| "", })) | parseCookieHeader(document.cookie).map, parseCookieHeader | [frontend/lib/supabase/client.ts:16](D:/WebNhiLun/frontend/lib/supabase/client.ts:16) |
| callback parseCookieHeader(document.cookie).map | getAll | cookie | ({ name: cookie.name, value: cookie.value \|\| "", }) | — | [frontend/lib/supabase/client.ts:19](D:/WebNhiLun/frontend/lib/supabase/client.ts:19) |
| setAll | createClient | cookies | Không return tường minh; xem hiệu ứng state/API | cookies.forEach | [frontend/lib/supabase/client.ts:23](D:/WebNhiLun/frontend/lib/supabase/client.ts:23) |
| callback cookies.forEach | setAll | { name, value, options } | Không return tường minh; xem hiệu ứng state/API | parseCookieHeader(document.cookie).find, parseCookieHeader, serializeCookieHeader | [frontend/lib/supabase/client.ts:24](D:/WebNhiLun/frontend/lib/supabase/client.ts:24) |
| callback parseCookieHeader(document.cookie).find | callback cookies.forEach | cookie | cookie.name === "vh-remember" | — | [frontend/lib/supabase/client.ts:28](D:/WebNhiLun/frontend/lib/supabase/client.ts:28) |

## frontend/lib/supabase/server.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| createClient | module | — | createServerClient(url, key, { cookies: { getAll() { return cookieStore.getAll(); }, setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options } | cookies, createServerClient | [frontend/lib/supabase/server.ts:4](D:/WebNhiLun/frontend/lib/supabase/server.ts:4) |
| getAll | createClient | — | cookieStore.getAll() | cookieStore.getAll | [frontend/lib/supabase/server.ts:15](D:/WebNhiLun/frontend/lib/supabase/server.ts:15) |
| setAll | createClient | cookiesToSet | Không return tường minh; xem hiệu ứng state/API | cookiesToSet.forEach | [frontend/lib/supabase/server.ts:18](D:/WebNhiLun/frontend/lib/supabase/server.ts:18) |
| callback cookiesToSet.forEach | setAll | { name, value, options } | cookieStore.set(name, value, options) | cookieStore.set | [frontend/lib/supabase/server.ts:20](D:/WebNhiLun/frontend/lib/supabase/server.ts:20) |

## frontend/middleware.ts

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| middleware | module | request: NextRequest | privatePage ? NextResponse.redirect(new URL("/auth?error=config", request.url)) : NextResponse.next({ request }); response; redirect( `/auth?returnTo=${encodeURIComponent(path + request.nextUrl.search)}`, ); redirect("/auth?error=profile"); redirect(home); redirect("/forbidden"); redirect("/auth?error=service") | ….test, NextResponse.redirect, NextResponse.next, createServerClient, supabase.auth.getUser, redirect, encodeURIComponent, supabase.auth.getSession, fetch, result.json, path.startsWith, request.nextUrl.searchParams.get, response.headers.set | [frontend/middleware.ts:4](D:/WebNhiLun/frontend/middleware.ts:4) |
| getAll | middleware | — | request.cookies.getAll() | request.cookies.getAll | [frontend/middleware.ts:20](D:/WebNhiLun/frontend/middleware.ts:20) |
| setAll | middleware | cookiesToSet | Không return tường minh; xem hiệu ứng state/API | cookiesToSet.forEach, NextResponse.next | [frontend/middleware.ts:21](D:/WebNhiLun/frontend/middleware.ts:21) |
| callback cookiesToSet.forEach | setAll | { name, value } | request.cookies.set(name, value) | request.cookies.set | [frontend/middleware.ts:22](D:/WebNhiLun/frontend/middleware.ts:22) |
| callback cookiesToSet.forEach | setAll | { name, value, options } | Không return tường minh; xem hiệu ứng state/API | request.cookies.get, response.cookies.set | [frontend/middleware.ts:26](D:/WebNhiLun/frontend/middleware.ts:26) |
| redirect | middleware | target: string | next | NextResponse.redirect, response.cookies.getAll().forEach, response.cookies.getAll, next.headers.set | [frontend/middleware.ts:40](D:/WebNhiLun/frontend/middleware.ts:40) |
| callback response.cookies.getAll().forEach | redirect | cookie | next.cookies.set(cookie) | next.cookies.set | [frontend/middleware.ts:42](D:/WebNhiLun/frontend/middleware.ts:42) |

## frontend/next.config.mjs

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| rewrites | module | — | [{source:"/api/v1/:path*",destination:`${process.env.API_INTERNAL_URL \|\| process.env.NEXT_PUBLIC_API_BASE_URL \|\| "http://localhost:8000"}/api/v1/:path*`}] | — | [frontend/next.config.mjs:4](D:/WebNhiLun/frontend/next.config.mjs:4) |

## frontend/scripts/verify-realtime.mjs

| Hàm | Phạm vi | Đối số | Đầu ra khai báo/return | Gọi trực tiếp | Nguồn |
|---|---|---|---|---|---|
| callback readFileSync(new URL("../.env.local",import.meta.url),"utf8").split(/\r?\n/).filter | module | line | line.includes("=") | line.includes | [frontend/scripts/verify-realtime.mjs:5](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:5) |
| callback ….map | module | line | [line.slice(0,i),line.slice(i+1).trim()] | line.indexOf, line.slice, line.slice(i+1).trim | [frontend/scripts/verify-realtime.mjs:5](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:5) |
| db | module | action, owner="" | Không return tường minh; xem hiệu ứng state/API | spawnSync, Error | [frontend/scripts/verify-realtime.mjs:8](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:8) |
| callback ẩn danh | module | resolve, reject | Không return tường minh; xem hiệu ứng state/API | setTimeout, ….subscribe, client.channel(run+i).on, client.channel | [frontend/scripts/verify-realtime.mjs:22](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:22) |
| callback setTimeout | callback ẩn danh | — | reject(Error("Subscription timeout client "+i)) | reject, Error | [frontend/scripts/verify-realtime.mjs:23](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:23) |
| callback client.channel(run+i).on | callback ẩn danh | payload | Không return tường minh; xem hiệu ứng state/API | payload.new.entity.startsWith, received[i].add | [frontend/scripts/verify-realtime.mjs:24](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:24) |
| callback ….subscribe | callback ẩn danh | status | Không return tường minh; xem hiệu ứng state/API | clearTimeout, resolve, reject, Error | [frontend/scripts/verify-realtime.mjs:24](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:24) |
| callback ẩn danh | module | resolve | setTimeout(resolve,100) | setTimeout | [frontend/scripts/verify-realtime.mjs:29](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:29) |
| callback received.map | module | set | set.size | — | [frontend/scripts/verify-realtime.mjs:30](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:30) |
| callback clients.map | module | client | client.removeAllChannels() | client.removeAllChannels | [frontend/scripts/verify-realtime.mjs:34](D:/WebNhiLun/frontend/scripts/verify-realtime.mjs:34) |
