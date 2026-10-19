# Danh mục API và hàm backend

Ngày đối chiếu: 19/10/2026. Trích từ Python AST trong `backend/app`. Không chạy endpoint hoặc truy vấn database trong đợt lập tài liệu này.

## Cách đọc

- Endpoint dùng prefix `/api/v1` khai báo trong router.
- Dependency liệt kê đúng chữ ký trong code; `get_current_user` xác thực JWT và tài khoản, `require_roles(...)` kiểm tra vai trò.
- Bảng dữ liệu được tìm trong câu SQL của từng hàm; SQL động hoặc service được gọi tiếp cần đọc qua liên kết nguồn.
- Kiểu trả về là annotation nếu được khai báo; không tự suy đoán response khi thiếu annotation.

## Endpoint

| Phương thức | Đường dẫn | Hàm | Dependency trong chữ ký | Bảng SQL được nhắc trực tiếp | Nguồn |
|---|---|---|---|---|---|
| GET | `/api/v1/health` | `health` | Không khai báo Depends trong chữ ký | — | [backend/app/api.py:104](D:/WebNhiLun/backend/app/api.py:104) |
| GET | `/api/v1/home/metrics` | `home_metrics` | Depends(get_db) | activities, profiles | [backend/app/api.py:109](D:/WebNhiLun/backend/app/api.py:109) |
| GET | `/api/v1/site-content/{content_key}` | `site_content` | Depends(get_db) | site_content | [backend/app/api.py:117](D:/WebNhiLun/backend/app/api.py:117) |
| GET | `/api/v1/activities/filters` | `activity_filters` | Depends(get_db) | activities | [backend/app/api.py:130](D:/WebNhiLun/backend/app/api.py:130) |
| GET | `/api/v1/themes` | `active_theme` | Depends(get_db) | system_themes | [backend/app/api.py:150](D:/WebNhiLun/backend/app/api.py:150) |
| GET | `/api/v1/auth/me` | `me` | Depends(get_current_user), Depends(get_db) | profiles | [backend/app/api.py:158](D:/WebNhiLun/backend/app/api.py:158) |
| GET | `/api/v1/me/profile` | `my_profile` | Depends(get_current_user), Depends(get_db) | profiles | [backend/app/api.py:167](D:/WebNhiLun/backend/app/api.py:167) |
| PATCH | `/api/v1/me/profile` | `update_profile` | Depends(get_current_user), Depends(get_db) | profiles | [backend/app/api.py:199](D:/WebNhiLun/backend/app/api.py:199) |
| POST | `/api/v1/me/avatar` | `upload_avatar` | Depends(get_current_user) | — | [backend/app/api.py:238](D:/WebNhiLun/backend/app/api.py:238) |
| GET | `/api/v1/me/favorites` | `my_favorites` | Depends(get_current_user), Depends(get_db) | activities, favorites | [backend/app/api.py:276](D:/WebNhiLun/backend/app/api.py:276) |
| POST | `/api/v1/me/favorites` | `add_favorite` | Depends(get_current_user), Depends(get_db) | activities, favorites | [backend/app/api.py:287](D:/WebNhiLun/backend/app/api.py:287) |
| DELETE | `/api/v1/me/favorites/{activity_id}` | `remove_favorite` | Depends(get_current_user), Depends(get_db) | favorites | [backend/app/api.py:306](D:/WebNhiLun/backend/app/api.py:306) |
| POST | `/api/v1/auth/demo-login/{role}` | `demo_login` | Không khai báo Depends trong chữ ký | — | [backend/app/api.py:318](D:/WebNhiLun/backend/app/api.py:318) |
| GET | `/api/v1/activities` | `activities` | Depends(get_db) | activities | [backend/app/api.py:377](D:/WebNhiLun/backend/app/api.py:377) |
| GET | `/api/v1/activities/{identifier}` | `activity_detail` | Depends(get_db) | activities, activity_schedules | [backend/app/api.py:431](D:/WebNhiLun/backend/app/api.py:431) |
| POST | `/api/v1/activities/{activity_id}/apply` | `apply` | Depends(require_roles('volunteer')), Depends(get_db), require_roles('volunteer') | activities, application_id_seq, applications, notifications, profiles | [backend/app/api.py:452](D:/WebNhiLun/backend/app/api.py:452) |
| GET | `/api/v1/me/applications` | `my_applications` | Depends(get_current_user), Depends(get_db) | activities, applications, certificates | [backend/app/api.py:526](D:/WebNhiLun/backend/app/api.py:526) |
| POST | `/api/v1/me/applications/{application_id}/cancel` | `cancel_application` | Depends(require_roles('volunteer')), Depends(get_db), require_roles('volunteer') | activities, applications, certificates, notifications | [backend/app/api.py:537](D:/WebNhiLun/backend/app/api.py:537) |
| GET | `/api/v1/organizer/activities` | `organizer_activities` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, organizations | [backend/app/api.py:583](D:/WebNhiLun/backend/app/api.py:583) |
| GET | `/api/v1/organizer/organization` | `organizer_organization` | Depends(get_current_user), Depends(get_db) | organizations | [backend/app/api.py:594](D:/WebNhiLun/backend/app/api.py:594) |
| POST | `/api/v1/organizer/organization` | `register_organization` | Depends(get_current_user), Depends(get_db) | organizations, profiles | [backend/app/api.py:608](D:/WebNhiLun/backend/app/api.py:608) |
| GET | `/api/v1/organizer/applicants` | `organizer_applicants` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, applications, organizations, profiles | [backend/app/api.py:662](D:/WebNhiLun/backend/app/api.py:662) |
| GET | `/api/v1/organizer/export-csv` | `export_applicants` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, applications, organizations | [backend/app/api.py:698](D:/WebNhiLun/backend/app/api.py:698) |
| POST | `/api/v1/organizer/applications/{application_id}/review` | `review_application` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, applications, notifications, organizations | [backend/app/api.py:754](D:/WebNhiLun/backend/app/api.py:754) |
| POST | `/api/v1/organizer/applications/{application_id}/checkin` | `checkin_application` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, applications, certificate_code_seq, certificates, notifications, organizations | [backend/app/api.py:821](D:/WebNhiLun/backend/app/api.py:821) |
| GET | `/api/v1/me/certificates` | `my_certificates` | Depends(require_roles('volunteer')), Depends(get_db), require_roles('volunteer') | certificates | [backend/app/api.py:906](D:/WebNhiLun/backend/app/api.py:906) |
| GET | `/api/v1/certificates/verify/{code}` | `verify_certificate` | Depends(get_db) | certificates | [backend/app/api.py:925](D:/WebNhiLun/backend/app/api.py:925) |
| GET | `/api/v1/notifications/summary` | `notification_summary` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:942](D:/WebNhiLun/backend/app/api.py:942) |
| GET | `/api/v1/notifications` | `notifications` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:961](D:/WebNhiLun/backend/app/api.py:961) |
| POST | `/api/v1/notifications/read-all` | `mark_notifications_read` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:992](D:/WebNhiLun/backend/app/api.py:992) |
| PATCH | `/api/v1/notifications/{notification_id}` | `update_notification` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:1003](D:/WebNhiLun/backend/app/api.py:1003) |
| POST | `/api/v1/organizer/activities` | `create_activity` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | — | [backend/app/api.py:1102](D:/WebNhiLun/backend/app/api.py:1102) |
| PUT | `/api/v1/organizer/activities/{activity_id}` | `save_activity_draft` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | — | [backend/app/api.py:1117](D:/WebNhiLun/backend/app/api.py:1117) |
| GET | `/api/v1/organizer/activities/{activity_id}` | `get_activity_draft` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, activity_schedules | [backend/app/api.py:1133](D:/WebNhiLun/backend/app/api.py:1133) |
| POST | `/api/v1/organizer/activities/{activity_id}/banner` | `upload_activity_banner` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | activities, organizations | [backend/app/api.py:1161](D:/WebNhiLun/backend/app/api.py:1161) |
| POST | `/api/v1/organizer/organization/documents` | `upload_organization_document` | Depends(require_roles('organizer')), Depends(get_db), require_roles('organizer') | organizations | [backend/app/api.py:1214](D:/WebNhiLun/backend/app/api.py:1214) |
| GET | `/api/v1/admin/organizations/{organization_id}/document-url` | `organization_document_url` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | organizations | [backend/app/api.py:1266](D:/WebNhiLun/backend/app/api.py:1266) |
| GET | `/api/v1/admin/organizations` | `admin_organizations` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | organizations | [backend/app/api.py:1313](D:/WebNhiLun/backend/app/api.py:1313) |
| POST | `/api/v1/admin/organizations/{organization_id}/review` | `review_organization` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | organizations, profiles | [backend/app/api.py:1336](D:/WebNhiLun/backend/app/api.py:1336) |
| POST | `/api/v1/admin/activities/{activity_id}/review` | `review_activity` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | activities | [backend/app/api.py:1374](D:/WebNhiLun/backend/app/api.py:1374) |
| GET | `/api/v1/admin/activities/pending` | `admin_pending_activities` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | activities | [backend/app/api.py:1404](D:/WebNhiLun/backend/app/api.py:1404) |
| GET | `/api/v1/admin/audit-logs` | `admin_audit_logs` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | audit_logs | [backend/app/api.py:1414](D:/WebNhiLun/backend/app/api.py:1414) |
| GET | `/api/v1/admin/stories/stats` | `admin_stories_stats` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | stories, story_likes | [backend/app/api.py:1431](D:/WebNhiLun/backend/app/api.py:1431) |
| GET | `/api/v1/admin/stories` | `admin_stories` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | profiles, stories, story_likes | [backend/app/api.py:1451](D:/WebNhiLun/backend/app/api.py:1451) |
| DELETE | `/api/v1/admin/stories/{story_id}` | `admin_delete_story` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | profiles, stories | [backend/app/api.py:1485](D:/WebNhiLun/backend/app/api.py:1485) |
| GET | `/api/v1/admin/themes` | `admin_themes` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | system_themes | [backend/app/api.py:1514](D:/WebNhiLun/backend/app/api.py:1514) |
| POST | `/api/v1/admin/themes` | `create_theme` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | system_themes | [backend/app/api.py:1522](D:/WebNhiLun/backend/app/api.py:1522) |
| PUT | `/api/v1/admin/themes/{theme_id}/activate` | `activate_theme` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | system_themes | [backend/app/api.py:1546](D:/WebNhiLun/backend/app/api.py:1546) |
| PUT | `/api/v1/admin/themes/{theme_id}` | `update_theme` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | system_themes | [backend/app/api.py:1568](D:/WebNhiLun/backend/app/api.py:1568) |
| GET | `/api/v1/admin/metrics` | `admin_metrics` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | activities, applications, organizations | [backend/app/api.py:1594](D:/WebNhiLun/backend/app/api.py:1594) |
| GET | `/api/v1/admin/audit-logs/export` | `export_audit_logs` | Depends(require_roles('admin')), Depends(get_db), require_roles('admin') | audit_logs | [backend/app/api.py:1611](D:/WebNhiLun/backend/app/api.py:1611) |
| GET | `/api/v1/me/notifications` | `my_notifications` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:1641](D:/WebNhiLun/backend/app/api.py:1641) |
| PATCH | `/api/v1/me/notifications/{notification_id}/read` | `mark_notification_read` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:1655](D:/WebNhiLun/backend/app/api.py:1655) |
| POST | `/api/v1/me/notifications/read-all` | `mark_all_notifications_read` | Depends(get_current_user), Depends(get_db) | notifications | [backend/app/api.py:1669](D:/WebNhiLun/backend/app/api.py:1669) |
| GET | `/api/v1/health/ready` | `ready` | Depends(get_db) | — | [backend/app/api.py:1679](D:/WebNhiLun/backend/app/api.py:1679) |
| GET | `/api/v1/certificates/{code}/pdf` | `download_certificate` | Depends(get_current_user), Depends(get_db) | — | [backend/app/api.py:1685](D:/WebNhiLun/backend/app/api.py:1685) |
| GET | `/api/v1/stories` | `stories` | Depends(get_db) | profiles, stories, story_likes | [backend/app/api.py:1701](D:/WebNhiLun/backend/app/api.py:1701) |
| POST | `/api/v1/stories` | `share_story` | Depends(get_current_user), Depends(get_db) | stories | [backend/app/api.py:1734](D:/WebNhiLun/backend/app/api.py:1734) |
| POST | `/api/v1/stories/upload-image` | `upload_story_image` | Depends(get_current_user) | — | [backend/app/api.py:1756](D:/WebNhiLun/backend/app/api.py:1756) |
| PUT | `/api/v1/stories/{story_id}/like` | `like_story` | Depends(get_current_user), Depends(get_db) | stories, story_likes | [backend/app/api.py:1801](D:/WebNhiLun/backend/app/api.py:1801) |
| GET | `/api/v1/me/story-likes` | `my_story_likes` | Depends(get_current_user), Depends(get_db) | story_likes | [backend/app/api.py:1825](D:/WebNhiLun/backend/app/api.py:1825) |
| GET | `/api/v1/me/documents` | `profile_documents` | Depends(get_current_user), Depends(get_db) | profile_documents | [backend/app/api.py:1839](D:/WebNhiLun/backend/app/api.py:1839) |
| POST | `/api/v1/me/documents` | `add_profile_document` | Depends(get_current_user), Depends(get_db) | profile_documents | [backend/app/api.py:1854](D:/WebNhiLun/backend/app/api.py:1854) |
| GET | `/api/v1/me/documents/{document_id}/url` | `profile_document_url` | Depends(get_current_user), Depends(get_db) | profile_documents | [backend/app/api.py:1870](D:/WebNhiLun/backend/app/api.py:1870) |
| GET, POST, HEAD, OPTIONS | `/mcp{rest:path}` | `mcp_probe` | Không khai báo Depends trong chữ ký | — | [backend/app/main.py:64](D:/WebNhiLun/backend/app/main.py:64) |
| GET, POST, HEAD, OPTIONS | `/.well-known/{rest:path}` | `well_known_probe` | Không khai báo Depends trong chữ ký | — | [backend/app/main.py:69](D:/WebNhiLun/backend/app/main.py:69) |

## backend/app/api.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `ok` | `data, message: str \| None=None` | `Không có annotation` | datetime.now, datetime.now(timezone.utc).isoformat | [backend/app/api.py:48](D:/WebNhiLun/backend/app/api.py:48) |
| `write_audit` | `conn, user: CurrentUser, action: str, target: str, details: str \| None=None, request: Request \| None=None` | `Không có annotation` | conn.execute, uuid4, uuid4().hex[:12].upper | [backend/app/api.py:57](D:/WebNhiLun/backend/app/api.py:57) |
| `business_today` | `` | `Không có annotation` | ZoneInfo, datetime.now, datetime.now(ZoneInfo('Asia/Ho_Chi_Minh')).date | [backend/app/api.py:78](D:/WebNhiLun/backend/app/api.py:78) |
| `ensure_open_for_registration` | `activity` | `Không có annotation` | HTTPException, activity.get, business_today | [backend/app/api.py:82](D:/WebNhiLun/backend/app/api.py:82) |
| `make_slug` | `value: str` | `str` | re.sub, re.sub('[-\\s]+', '-', value).strip, uuid4, value.casefold, value.casefold().strip | [backend/app/api.py:97](D:/WebNhiLun/backend/app/api.py:97) |
| `health` | `` | `Không có annotation` | ok, router.get | [backend/app/api.py:104](D:/WebNhiLun/backend/app/api.py:104) |
| `home_metrics` | `db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, dict, dict(row).items, int, ok, router.get | [backend/app/api.py:109](D:/WebNhiLun/backend/app/api.py:109) |
| `site_content` | `content_key: str, db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetchrow, ok, router.get | [backend/app/api.py:117](D:/WebNhiLun/backend/app/api.py:117) |
| `activity_filters` | `db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, ok, router.get | [backend/app/api.py:130](D:/WebNhiLun/backend/app/api.py:130) |
| `active_theme` | `db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, dict, int, ok, router.get | [backend/app/api.py:150](D:/WebNhiLun/backend/app/api.py:150) |
| `me` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, dict, ok, router.get | [backend/app/api.py:158](D:/WebNhiLun/backend/app/api.py:158) |
| `my_profile` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, dict, get_settings, int, max, next, ok, router.get, settings.volunteer_rank_thresholds.split, sorted, str | [backend/app/api.py:167](D:/WebNhiLun/backend/app/api.py:167) |
| `update_profile` | `payload: ProfileUpdate, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | ','.join, Depends, HTTPException, db.fetchrow, dict, dict.fromkeys, enumerate, fields['name'].strip, list, ok, payload.model_dump, router.patch, skill.strip, str | [backend/app/api.py:199](D:/WebNhiLun/backend/app/api.py:199) |
| `upload_avatar` | `file: UploadFile=File(...), user: CurrentUser=Depends(get_current_user)` | `Không có annotation` | (file.content_type or '').lower, Depends, File, HTTPException, asyncio.to_thread, file.read, get_settings, len, ok, quote, router.post, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(upload, timeout=20).read, uuid4 | [backend/app/api.py:238](D:/WebNhiLun/backend/app/api.py:238) |
| `my_favorites` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, router.get, str | [backend/app/api.py:276](D:/WebNhiLun/backend/app/api.py:276) |
| `add_favorite` | `payload: FavoriteInput, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.execute, db.fetchval, ok, router.post | [backend/app/api.py:287](D:/WebNhiLun/backend/app/api.py:287) |
| `remove_favorite` | `activity_id: str, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.execute, ok, router.delete | [backend/app/api.py:306](D:/WebNhiLun/backend/app/api.py:306) |
| `demo_login` | `role: str, request: Request` | `Không có annotation` | HTTPException, RuntimeError, asyncio.to_thread, attempts.append, attempts.popleft, get_settings, getattr, json.dumps, json.dumps({'email': email, 'password': password}).encode, json.loads, len, ok, response.read, response.read().decode, router.post, session.get, settings.app_env.lower, settings.supabase_url.rstrip, time.monotonic, urllib.request.Request, urllib.request.urlopen | [backend/app/api.py:318](D:/WebNhiLun/backend/app/api.py:318) |
| `activities` | `search: str \| None=None, city: str \| None=None, category: str \| None=None, featured: bool \| None=None, time_filter: str \| None=Query(None, alias='time', pattern='^(7d\|30d)$'), status: str \| None=None, page: int=Query(1, ge=1), limit: int=Query(12, ge=1, le=100), db=Depends(get_db)` | `Không có annotation` | ' and '.join, Depends, Query, args.append, args.extend, business_today, db.fetch, db.fetchval, dict, len, ok, router.get, str, where.append | [backend/app/api.py:377](D:/WebNhiLun/backend/app/api.py:377) |
| `activity_detail` | `identifier: str, db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetch, db.fetchrow, dict, ok, router.get, str | [backend/app/api.py:431](D:/WebNhiLun/backend/app/api.py:431) |
| `apply` | `activity_id: str, payload: ApplyInput, request: Request, user: CurrentUser=Depends(require_roles('volunteer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, activity['event_date'].isoformat, conn.execute, conn.fetchrow, conn.fetchval, conn.transaction, db.acquire, dict, ensure_open_for_registration, ok, require_roles, router.post, str, uuid4, uuid4().hex[:12].upper, write_audit | [backend/app/api.py:452](D:/WebNhiLun/backend/app/api.py:452) |
| `my_applications` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, router.get, str | [backend/app/api.py:526](D:/WebNhiLun/backend/app/api.py:526) |
| `cancel_application` | `application_id: str, request: Request, user: CurrentUser=Depends(require_roles('volunteer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, ok, require_roles, router.post, uuid4, uuid4().hex[:12].upper, write_audit | [backend/app/api.py:537](D:/WebNhiLun/backend/app/api.py:537) |
| `organizer_activities` | `user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, require_roles, router.get, str | [backend/app/api.py:583](D:/WebNhiLun/backend/app/api.py:583) |
| `organizer_organization` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, dict, ok, router.get, str | [backend/app/api.py:594](D:/WebNhiLun/backend/app/api.py:594) |
| `register_organization` | `payload: OrganizationCreate, request: Request, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, dict, ok, payload.category.strip, payload.name.strip, payload.representative.strip, router.post, str, uuid4, uuid4().hex[:10].upper, write_audit | [backend/app/api.py:608](D:/WebNhiLun/backend/app/api.py:608) |
| `organizer_applicants` | `activity_id: str \| None=None, search: str=Query('', max_length=200), status: str \| None=Query(None, pattern='^(pending\|approved\|rejected\|cancelled)$'), page: int=Query(1, ge=1), limit: int=Query(20, ge=1, le=100), user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, Query, conn.fetch, conn.fetchrow, conn.fetchval, conn.transaction, db.acquire, dict, ok, page_result, require_roles, router.get, search.strip | [backend/app/api.py:662](D:/WebNhiLun/backend/app/api.py:662) |
| `export_applicants` | `activity_id: str, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, StreamingResponse, csv.writer, db.fetch, db.fetchval, io.StringIO, iter, output.getvalue, require_roles, router.get, row['applied_at'].isoformat, writer.writerow | [backend/app/api.py:698](D:/WebNhiLun/backend/app/api.py:698) |
| `review_application` | `application_id: str, payload: ReviewInput, request: Request, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, dict, ensure_open_for_registration, ok, require_roles, router.post, str, uuid4, uuid4().hex[:12].upper, write_audit | [backend/app/api.py:754](D:/WebNhiLun/backend/app/api.py:754) |
| `checkin_application` | `application_id: str, request: Request, checked_in: bool=True, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, business_today, conn.execute, conn.fetchrow, conn.fetchval, conn.transaction, datetime.now, db.acquire, ok, require_roles, result.get, router.post, uuid4, uuid4().hex[:12].upper, write_audit | [backend/app/api.py:821](D:/WebNhiLun/backend/app/api.py:821) |
| `my_certificates` | `user: CurrentUser=Depends(require_roles('volunteer')), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, require_roles, router.get, str | [backend/app/api.py:906](D:/WebNhiLun/backend/app/api.py:906) |
| `verify_certificate` | `code: str, db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetchrow, dict, ok, router.get, str | [backend/app/api.py:925](D:/WebNhiLun/backend/app/api.py:925) |
| `notification_summary` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, conn.fetch, conn.fetchval, conn.transaction, db.acquire, dict, ok, router.get | [backend/app/api.py:942](D:/WebNhiLun/backend/app/api.py:942) |
| `notifications` | `page: int=Query(1, ge=1), limit: int=Query(12, ge=1, le=100), search: str=Query('', max_length=200), unread: bool \| None=None, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, Query, conn.fetch, conn.fetchval, conn.transaction, db.acquire, ok, page_result, router.get, search.strip | [backend/app/api.py:961](D:/WebNhiLun/backend/app/api.py:961) |
| `mark_notifications_read` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.execute, ok, router.post | [backend/app/api.py:992](D:/WebNhiLun/backend/app/api.py:992) |
| `update_notification` | `notification_id: str, payload: NotificationReadInput, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetchrow, dict, ok, router.patch | [backend/app/api.py:1003](D:/WebNhiLun/backend/app/api.py:1003) |
| `store_activity` | `payload, user, conn, activity_id=None` | `Không có annotation` | ','.join, HTTPException, activity_id.lower, conn.execute, conn.fetchrow, enumerate, fields.pop, fields.update, fields.values, json.dumps, len, list, make_slug, payload.model_dump, range, str, uuid4, uuid4().hex[:10].upper | [backend/app/api.py:1020](D:/WebNhiLun/backend/app/api.py:1020) |
| `create_activity` | `payload: ActivityCreate, request: Request, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, conn.transaction, db.acquire, dict, ok, require_roles, router.post, store_activity, write_audit | [backend/app/api.py:1102](D:/WebNhiLun/backend/app/api.py:1102) |
| `save_activity_draft` | `activity_id: str, payload: ActivityCreate, request: Request, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, conn.transaction, db.acquire, dict, ok, require_roles, router.put, store_activity, write_audit | [backend/app/api.py:1117](D:/WebNhiLun/backend/app/api.py:1117) |
| `get_activity_draft` | `activity_id: str, user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetch, db.fetchrow, dict, json.loads, ok, require_roles, router.get | [backend/app/api.py:1133](D:/WebNhiLun/backend/app/api.py:1133) |
| `upload_activity_banner` | `activity_id: str, file: UploadFile=File(...), user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | (file.content_type or '').lower, Depends, File, HTTPException, asyncio.to_thread, db.execute, db.fetchrow, file.read, get_settings, len, ok, quote, require_roles, router.post, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(upload, timeout=20).read, uuid4 | [backend/app/api.py:1161](D:/WebNhiLun/backend/app/api.py:1161) |
| `upload_organization_document` | `file: UploadFile=File(...), user: CurrentUser=Depends(require_roles('organizer')), db=Depends(get_db)` | `Không có annotation` | (file.content_type or '').lower, Depends, File, HTTPException, asyncio.to_thread, db.execute, db.fetchrow, file.read, get_settings, len, ok, quote, require_roles, router.post, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(request_obj, timeout=20).read, uuid4 | [backend/app/api.py:1214](D:/WebNhiLun/backend/app/api.py:1214) |
| `organization_document_url` | `organization_id: str, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, asyncio.to_thread, db.fetchrow, get_settings, json.dumps, json.dumps({'expiresIn': 300}).encode, json.loads, ok, quote, require_roles, response.decode, result.get, router.get, settings.supabase_url.rstrip, signed_path.startswith, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(sign_request, timeout=10).read | [backend/app/api.py:1266](D:/WebNhiLun/backend/app/api.py:1266) |
| `admin_organizations` | `status: str \| None=Query(default=None, pattern='^(pending\|approved\|rejected)$'), user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, Query, db.fetch, dict, ok, require_roles, router.get, str | [backend/app/api.py:1313](D:/WebNhiLun/backend/app/api.py:1313) |
| `review_organization` | `organization_id: str, payload: AdminDecision, request: Request, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, dict, ok, require_roles, router.post, str, write_audit | [backend/app/api.py:1336](D:/WebNhiLun/backend/app/api.py:1336) |
| `review_activity` | `activity_id: str, payload: AdminDecision, request: Request, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.fetchrow, conn.transaction, db.acquire, dict, ok, require_roles, router.post, str, write_audit | [backend/app/api.py:1374](D:/WebNhiLun/backend/app/api.py:1374) |
| `admin_pending_activities` | `user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, require_roles, router.get, str | [backend/app/api.py:1404](D:/WebNhiLun/backend/app/api.py:1404) |
| `admin_audit_logs` | `limit: int=Query(default=100, ge=1, le=500), user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, Query, db.fetch, dict, ok, require_roles, router.get, str | [backend/app/api.py:1414](D:/WebNhiLun/backend/app/api.py:1414) |
| `admin_stories_stats` | `user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, conn.fetch, conn.fetchval, db.acquire, dict, ok, require_roles, router.get | [backend/app/api.py:1431](D:/WebNhiLun/backend/app/api.py:1431) |
| `admin_stories` | `page: int=Query(default=1, ge=1), limit: int=Query(default=10, ge=1, le=100), search: str=Query(default='', max_length=200), category: str=Query(default='all', max_length=100), user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, Query, conn.fetch, conn.fetchval, conn.transaction, db.acquire, ok, page_result, require_roles, router.get, search.strip | [backend/app/api.py:1451](D:/WebNhiLun/backend/app/api.py:1451) |
| `admin_delete_story` | `story_id: str, request: Request, payload: AdminDeleteStoryInput \| None=None, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, ok, payload.reason.strip, require_roles, router.delete, write_audit | [backend/app/api.py:1485](D:/WebNhiLun/backend/app/api.py:1485) |
| `admin_themes` | `user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, int, ok, require_roles, router.get | [backend/app/api.py:1514](D:/WebNhiLun/backend/app/api.py:1514) |
| `create_theme` | `payload: ThemeUpdate, request: Request, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, conn.fetchrow, conn.transaction, db.acquire, dict, int, ok, payload.name.strip, require_roles, router.post, str, write_audit | [backend/app/api.py:1522](D:/WebNhiLun/backend/app/api.py:1522) |
| `activate_theme` | `theme_id: int, request: Request, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.execute, conn.fetchrow, conn.transaction, db.acquire, dict, int, ok, require_roles, router.put, str, write_audit | [backend/app/api.py:1546](D:/WebNhiLun/backend/app/api.py:1546) |
| `update_theme` | `theme_id: int, payload: ThemeUpdate, request: Request, user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, conn.fetchrow, conn.transaction, db.acquire, dict, int, ok, payload.name.strip, require_roles, router.put, str, write_audit | [backend/app/api.py:1568](D:/WebNhiLun/backend/app/api.py:1568) |
| `admin_metrics` | `user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchrow, ok, require_roles, router.get | [backend/app/api.py:1594](D:/WebNhiLun/backend/app/api.py:1594) |
| `export_audit_logs` | `user: CurrentUser=Depends(require_roles('admin')), db=Depends(get_db)` | `Không có annotation` | Depends, StreamingResponse, csv.writer, db.fetch, io.StringIO, iter, output.getvalue, require_roles, router.get, row['created_at'].isoformat, str, writer.writerow | [backend/app/api.py:1611](D:/WebNhiLun/backend/app/api.py:1611) |
| `my_notifications` | `limit: int=Query(default=20, ge=1, le=100), user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, Query, db.fetch, dict, ok, router.get, str | [backend/app/api.py:1641](D:/WebNhiLun/backend/app/api.py:1641) |
| `mark_notification_read` | `notification_id: str, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.execute, ok, router.patch | [backend/app/api.py:1655](D:/WebNhiLun/backend/app/api.py:1655) |
| `mark_all_notifications_read` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.execute, ok, router.post | [backend/app/api.py:1669](D:/WebNhiLun/backend/app/api.py:1669) |
| `ready` | `db=Depends(get_db)` | `Không có annotation` | Depends, db.fetchval, ok, router.get | [backend/app/api.py:1679](D:/WebNhiLun/backend/app/api.py:1679) |
| `download_certificate` | `code: str, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, StreamingResponse, certificate_file, iter, quote, router.get | [backend/app/api.py:1685](D:/WebNhiLun/backend/app/api.py:1685) |
| `stories` | `page: int=Query(1, ge=1), limit: int=Query(6, ge=1, le=100), search: str=Query('', max_length=200), category: str=Query('all', max_length=100), db=Depends(get_db)` | `Không có annotation` | Depends, Query, conn.fetch, conn.fetchval, conn.transaction, db.acquire, ok, page_result, router.get, search.strip | [backend/app/api.py:1701](D:/WebNhiLun/backend/app/api.py:1701) |
| `share_story` | `payload: StoryInput, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.fetchrow, dict, ok, payload.body.strip, payload.title.strip, router.post | [backend/app/api.py:1734](D:/WebNhiLun/backend/app/api.py:1734) |
| `upload_story_image` | `file: UploadFile=File(...), user: CurrentUser=Depends(get_current_user)` | `Không có annotation` | (file.content_type or '').lower, Depends, File, HTTPException, asyncio.to_thread, file.read, get_settings, len, ok, quote, router.post, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(upload, timeout=20).read, uuid4 | [backend/app/api.py:1756](D:/WebNhiLun/backend/app/api.py:1756) |
| `like_story` | `story_id: str, liked: bool=True, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, db.execute, db.fetchval, ok, router.put | [backend/app/api.py:1801](D:/WebNhiLun/backend/app/api.py:1801) |
| `my_story_likes` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, ok, router.get | [backend/app/api.py:1825](D:/WebNhiLun/backend/app/api.py:1825) |
| `profile_documents` | `user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, db.fetch, dict, ok, router.get | [backend/app/api.py:1839](D:/WebNhiLun/backend/app/api.py:1839) |
| `add_profile_document` | `file: UploadFile=File(...), user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, File, db.fetchrow, dict, ok, router.post, str, upload_document | [backend/app/api.py:1854](D:/WebNhiLun/backend/app/api.py:1854) |
| `profile_document_url` | `document_id: str, user: CurrentUser=Depends(get_current_user), db=Depends(get_db)` | `Không có annotation` | Depends, HTTPException, UUID, db.fetchval, ok, router.get, signed_url | [backend/app/api.py:1870](D:/WebNhiLun/backend/app/api.py:1870) |
| `request_session` | `` | `Không có annotation` | RuntimeError, json.dumps, json.dumps({'email': email, 'password': password}).encode, json.loads, response.read, response.read().decode, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen | [backend/app/api.py:343](D:/WebNhiLun/backend/app/api.py:343) |

## backend/app/core/config.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `get_settings` | `` | `Settings` | Settings | [backend/app/core/config.py:35](D:/WebNhiLun/backend/app/core/config.py:35) |
| `allowed_origins` | `self` | `list[str]` | origin.strip, self.frontend_origins.split | [backend/app/core/config.py:30](D:/WebNhiLun/backend/app/core/config.py:30) |

## backend/app/core/database.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `connect_db` | `app` | `None` | asyncpg.create_pool, get_settings, logger.error, logger.info, logger.warning, type, urlsplit | [backend/app/core/database.py:14](D:/WebNhiLun/backend/app/core/database.py:14) |
| `close_db` | `app` | `None` | getattr, pool.close | [backend/app/core/database.py:43](D:/WebNhiLun/backend/app/core/database.py:43) |
| `get_db` | `request: Request` | `asyncpg.Pool` | HTTPException, asyncio.Lock, connect_db, get_settings, getattr, hasattr, time.monotonic | [backend/app/core/database.py:49](D:/WebNhiLun/backend/app/core/database.py:49) |

## backend/app/core/security.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `_jwks_client` | `url: str` | `PyJWKClient` | PyJWKClient | [backend/app/core/security.py:28](D:/WebNhiLun/backend/app/core/security.py:28) |
| `_verified_subject` | `token: str` | `UUID` | HTTPException, UUID, _jwks_client, _jwks_client(jwks_url).get_signing_key_from_jwt, get_settings, header.get, jwt.InvalidTokenError, jwt.decode, jwt.get_unverified_header, settings.supabase_url.rstrip | [backend/app/core/security.py:32](D:/WebNhiLun/backend/app/core/security.py:32) |
| `get_current_user` | `credentials: Annotated[HTTPAuthorizationCredentials \| None, Depends(bearer)], db: Annotated[Pool, Depends(get_db)]` | `CurrentUser` | CurrentUser, Depends, HTTPException, asyncio.to_thread, db.fetchrow, dict | [backend/app/core/security.py:66](D:/WebNhiLun/backend/app/core/security.py:66) |
| `require_roles` | `*roles: str` | `Không có annotation` | Depends, HTTPException | [backend/app/core/security.py:82](D:/WebNhiLun/backend/app/core/security.py:82) |
| `dependency` | `user: Annotated[CurrentUser, Depends(get_current_user)]` | `CurrentUser` | Depends, HTTPException | [backend/app/core/security.py:83](D:/WebNhiLun/backend/app/core/security.py:83) |

## backend/app/main.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `lifespan` | `app: FastAPI` | `Không có annotation` | close_db, connect_db | [backend/app/main.py:23](D:/WebNhiLun/backend/app/main.py:23) |
| `request_context` | `request: Request, call_next` | `Không có annotation` | JSONResponse, app.middleware, call_next, logger.exception, request.headers.get, str, uuid4 | [backend/app/main.py:35](D:/WebNhiLun/backend/app/main.py:35) |
| `http_error` | `request: Request, exc: HTTPException` | `Không có annotation` | JSONResponse, app.exception_handler, getattr, isinstance | [backend/app/main.py:48](D:/WebNhiLun/backend/app/main.py:48) |
| `validation_error` | `request: Request, exc: RequestValidationError` | `Không có annotation` | JSONResponse, app.exception_handler, exc.errors, getattr, list | [backend/app/main.py:57](D:/WebNhiLun/backend/app/main.py:57) |
| `mcp_probe` | `rest: str=''` | `Không có annotation` | JSONResponse, app.api_route | [backend/app/main.py:64](D:/WebNhiLun/backend/app/main.py:64) |
| `well_known_probe` | `rest: str=''` | `Không có annotation` | JSONResponse, app.api_route | [backend/app/main.py:69](D:/WebNhiLun/backend/app/main.py:69) |

## backend/app/schemas.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `nonnull` | `cls, value` | `Không có annotation` | ValueError, field_validator, isinstance, value.strip | [backend/app/schemas.py:41](D:/WebNhiLun/backend/app/schemas.py:41) |
| `valid_dates` | `self` | `Không có annotation` | ValueError, ZoneInfo, datetime.now, datetime.now(ZoneInfo('Asia/Ho_Chi_Minh')).date, getattr, getattr(self, key).strip, model_validator | [backend/app/schemas.py:88](D:/WebNhiLun/backend/app/schemas.py:88) |

## backend/app/services/certificate_files.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `_object` | `settings, path, content=None` | `Không có annotation` | HTTPException, error.get, exc.read, json.loads, quote, response.read, settings.supabase_url.rstrip, str, urllib.request.Request, urllib.request.urlopen | [backend/app/services/certificate_files.py:16](D:/WebNhiLun/backend/app/services/certificate_files.py:16) |
| `artifact` | `row, settings` | `Không có annotation` | hashlib.sha256, hashlib.sha256(json.dumps({**fields, 'url': verify_url, 'template': 1}, sort_keys=True, default=str).encode()).hexdigest, json.dumps, json.dumps({**fields, 'url': verify_url, 'template': 1}, sort_keys=True, default=str).encode, quote | [backend/app/services/certificate_files.py:52](D:/WebNhiLun/backend/app/services/certificate_files.py:52) |
| `certificate_file` | `code, user, db` | `Không có annotation` | HTTPException, artifact, asyncio.to_thread, conn.execute, conn.fetchrow, conn.transaction, db.acquire, db.fetchrow, dict, get_settings | [backend/app/services/certificate_files.py:77](D:/WebNhiLun/backend/app/services/certificate_files.py:77) |

## backend/app/services/certificates.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `certificate_pdf` | `certificate, verification_url: str` | `bytes` | BytesIO, Drawing, Paragraph, ParagraphStyle, Path, Path(item).is_file, RuntimeError, TTFont, canvas.Canvas, content.drawOn, content.wrap, drawing.add, escape, landscape, next, os.getenv, output.getvalue, page.rect, page.save, page.setLineWidth, page.setStrokeColorRGB, page.showPage, paragraph, pdfmetrics.getRegisteredFontNames, pdfmetrics.registerFont, qr.QrCodeWidget, renderPDF.draw, str, widget.getBounds | [backend/app/services/certificates.py:18](D:/WebNhiLun/backend/app/services/certificates.py:18) |
| `paragraph` | `text, y, size=18` | `Không có annotation` | Paragraph, content.drawOn, content.wrap, escape, str | [backend/app/services/certificates.py:35](D:/WebNhiLun/backend/app/services/certificates.py:35) |

## backend/app/services/pagination.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `page_result` | `rows, total: int, page: int, limit: int, **extra` | `Không có annotation` | dict, max | [backend/app/services/pagination.py:4](D:/WebNhiLun/backend/app/services/pagination.py:4) |

## backend/app/services/storage.py

| Hàm | Chữ ký | Trả về khai báo | Gọi trực tiếp và helper | Nguồn |
|---|---|---|---|---|
| `upload_document` | `bucket: str, owner: str, file: UploadFile` | `Không có annotation` | (file.content_type or '').lower, HTTPException, asyncio.to_thread, content.startswith, file.read, get_settings, len, settings.supabase_url.rstrip, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(request, timeout=20).read, uuid4 | [backend/app/services/storage.py:10](D:/WebNhiLun/backend/app/services/storage.py:10) |
| `signed_url` | `bucket: str, path: str` | `Không có annotation` | HTTPException, ValueError, asyncio.to_thread, get_settings, json.dumps, json.dumps({'expiresIn': 300}).encode, json.loads, quote, result.get, settings.supabase_url.rstrip, url.startswith, urllib.request.Request, urllib.request.urlopen, urllib.request.urlopen(request, timeout=10).read | [backend/app/services/storage.py:32](D:/WebNhiLun/backend/app/services/storage.py:32) |

## Luồng nghiệp vụ quan trọng

| Thao tác | Luồng xử lý cần theo dõi |
|---|---|
| Đăng nhập | Trang Auth → Supabase Auth/demo endpoint → phiên cookie → middleware → `/auth/me` → route theo vai trò |
| Đăng ký hoạt động | ApplyPage → API application → kiểm tra hồ sơ, trùng đơn và sức chứa → transaction DB → phản hồi |
| Duyệt và điểm danh | OrganizerManagePage/CheckinDialog → API theo vai trò, tổ chức và đơn → cập nhật transaction → chứng nhận, giờ, audit |
| Tải PDF | CertificatesPage → API kiểm tra chủ sở hữu → certificate_file → tái sử dụng artifact hợp lệ hoặc tạo/upload → trả bytes riêng tư |
| Cập nhật hồ sơ | ProfilePage.save → upload ảnh nếu có → PATCH hồ sơ → state và query được làm mới |
| Stories và thông báo | Query có page/limit/filter → COUNT và trang dữ liệu → component Pagination → Realtime làm mới theo entity |

Bảng trên là mô tả luồng từ mã nguồn, không khẳng định kiểm thử runtime trong đợt dọn comment. Các luật chi tiết và thông báo lỗi nằm tại hàm được liên kết.
