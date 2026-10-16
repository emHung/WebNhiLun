-- ============================================================
-- NHILUN (VOLUNTEERHUB) - SEED DATA FILE
-- Dữ liệu mẫu chuẩn hóa cho người khác import vào Supabase / PostgreSQL.
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- 1. DEMO TÀI KHOẢN ĐĂNG NHẬP (auth.users)
-- Mật khẩu mặc định cho tất cả tài khoản mẫu: Demo@123456
-- ------------------------------------------------------------
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'an.nguyen@email.com',
  crypt('Demo@123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Nguyễn Văn An","role":"volunteer","legacy_id":"USR-001"}'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  raw_user_meta_data = excluded.raw_user_meta_data;

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'coordinator@quyxanh.vn',
  crypt('Demo@123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Ban Điều Phối Quỹ Xanh","role":"organizer","legacy_id":"USR-002"}'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  raw_user_meta_data = excluded.raw_user_meta_data;

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'admin@volunteerhub.vn',
  crypt('Demo@123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Quản Trị Viên Hệ Thống","role":"admin","legacy_id":"USR-003"}'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  raw_user_meta_data = excluded.raw_user_meta_data;


-- ------------------------------------------------------------
-- 2. HỒ SƠ TÌNH NGUYỆN VIÊN / TỔ CHỨC / ADMIN (public.profiles)
-- ------------------------------------------------------------
INSERT INTO public.profiles (
  id, legacy_id, name, email, phone, dob, city, role, role_title, avatar_url, bio, skills, verified_hours
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 'USR-001', 'Nguyễn Văn An', 'an.nguyen@email.com', '0901 234 567', '2003-05-12'::date, 'TP. Hồ Chí Minh', 'volunteer', 'Tình nguyện viên',
  '/legacy/images/profile-avatar.jpg', 'Sinh viên yêu thích hoạt động môi trường và cộng đồng. Mong muốn cống hiến cho xã hội.', ARRAY['Làm việc nhóm', 'Giao tiếp', 'Sơ cấp cứu', 'Tổ chức sự kiện', 'Chụp ảnh']::text[], 24
) ON CONFLICT (id) DO UPDATE SET
  legacy_id = excluded.legacy_id,
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  dob = excluded.dob,
  city = excluded.city,
  role = excluded.role,
  role_title = excluded.role_title,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  skills = excluded.skills,
  verified_hours = excluded.verified_hours;

INSERT INTO public.profiles (
  id, legacy_id, name, email, phone, dob, city, role, role_title, avatar_url, bio, skills, verified_hours
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, 'USR-002', 'Ban Điều Phối Quỹ Xanh', 'coordinator@quyxanh.vn', '0908 123 456', NULL, 'TP. Hồ Chí Minh', 'organizer', 'Ban tổ chức',
  '/legacy/images/act-tree.jpg', 'Điều phối các dự án bảo tồn thiên nhiên và phục hồi rừng ngập mặn Cần Giờ.', ARRAY['Quản lý dự án', 'Điều phối tình nguyện viên', 'Quan hệ đối tác']::text[], 120
) ON CONFLICT (id) DO UPDATE SET
  legacy_id = excluded.legacy_id,
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  dob = excluded.dob,
  city = excluded.city,
  role = excluded.role,
  role_title = excluded.role_title,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  skills = excluded.skills,
  verified_hours = excluded.verified_hours;

INSERT INTO public.profiles (
  id, legacy_id, name, email, phone, dob, city, role, role_title, avatar_url, bio, skills, verified_hours
) VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, 'USR-003', 'Quản Trị Viên Hệ Thống', 'admin@volunteerhub.vn', '0988 777 666', NULL, 'Hà Nội', 'admin', 'Quản trị viên',
  '/legacy/images/sapling-soil.jpg', 'Quản trị viên hệ thống nền tảng kết nối hoạt động thiện nguyện NhiLun.', ARRAY['Quản trị hệ thống', 'Duyệt tổ chức', 'Kiểm duyệt hoạt động']::text[], 0
) ON CONFLICT (id) DO UPDATE SET
  legacy_id = excluded.legacy_id,
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  dob = excluded.dob,
  city = excluded.city,
  role = excluded.role,
  role_title = excluded.role_title,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  skills = excluded.skills,
  verified_hours = excluded.verified_hours;


-- ------------------------------------------------------------
-- 3. CÁC TỔ CHỨC THIỆN NGUYỆN (public.organizations)
-- ------------------------------------------------------------
INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  'LEGACY-ACT-004', '00000000-0000-0000-0000-000000000002'::uuid, 'Mái Ấm Yêu Thương Vũng Tàu', 'Mái Ấm Yêu Thương Vũng Tàu',
  'Cộng đồng', 'rejected', FALSE, '', '2026-10-14'::date, 'Tổ chức tham chiếu từ dữ liệu legacy; cần xác minh trước khi sử dụng.'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;

INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  'ORG-001', '79283abf-53c6-4157-b409-f138583f749f'::uuid, 'Quỹ Xanh Việt Nam', 'Anh Minh Trí',
  'Môi trường', 'approved', TRUE, 'Giấy phép hoạt động số 12/GP-BNV.pdf', '2026-10-10'::date, 'Tổ chức bảo tồn thiên nhiên và phục hồi rừng ngập mặn hàng đầu.'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;

INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  'ORG-002', '00000000-0000-0000-0000-000000000002'::uuid, 'CLB Ánh Sáng Tương Lai', 'Chị Thu Thảo',
  'Giáo dục', 'approved', TRUE, 'Quyết định thành lập CLB.pdf', '2026-10-12'::date, 'Dự án trao gửi sách vở và hỗ trợ học sinh vùng cao khó khăn.'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;

INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  'ORG-003', '00000000-0000-0000-0000-000000000002'::uuid, 'Nhóm Thiện Nguyện Hoa Sen', 'Nguyễn Thị Lan',
  'Cộng đồng', 'pending', FALSE, 'Điều lệ tổ chức Hoa Sen.pdf', '2026-10-08'::date, 'Nấu cơm thiện nguyện và hỗ trợ mái ấm người già neo đơn.'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;

INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  'ORG-004', '00000000-0000-0000-0000-000000000002'::uuid, 'Hội Thầy Thuốc Vì Cộng Đồng', 'Bác sĩ Hoàng Nam',
  'Y tế', 'pending', FALSE, 'Giấy phép hành nghề y tế.pdf', '2026-10-05'::date, 'Khám chữa bệnh và cấp phát thuốc miễn phí cho đồng bào biên giới.'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;


-- ------------------------------------------------------------
-- 4. HOẠT ĐỘNG THIỆN NGUYỆN (public.activities)
-- ------------------------------------------------------------
INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-001', 'trong-cay-can-gio-2026', 'Ngày hội trồng 1.000 cây xanh vì môi trường', 'Môi trường', 'ORG-001', 'Quỹ Xanh Việt Nam',
  TRUE, '2026-10-24'::date, '07:00 - 13:00', NULL,
  'TP. Hồ Chí Minh', 'Rừng ngập mặn Cần Giờ, Huyện Cần Giờ, TP. Hồ Chí Minh', 50, 38, 6, 'Đang tuyển',
  TRUE, '/legacy/images/act-tree.jpg', 'Chung tay trồng cây xanh phục hồi rừng ngập mặn Cần Giờ, góp phần bảo vệ lá phổi xanh của thành phố và ứng phó với biến đổi khí hậu.', 'Tuổi từ 18 trở lên, có sức khỏe tốt, không ngại lội bùn, có tinh thần làm việc nhóm và bảo vệ thiên nhiên.', 'Ủng hoặc giày cũ đi bùn, 1 bộ quần áo dự phòng để thay, nón rộng vành, bình nước cá nhân.', 'Anh Minh Trí - 0908 123 456 (Điều phối viên)'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;

INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-002', 'tu-sach-trao-em-dong-nai', 'Tủ sách trao em — Đem tri thức đến trường vùng sâu', 'Giáo dục', 'ORG-002', 'CLB Ánh Sáng Tương Lai',
  TRUE, '2026-11-02'::date, '08:00 - 16:00', NULL,
  'Đồng Nai', 'Trường Tiểu Học La Ngà, Huyện Định Quán, Tỉnh Đồng Nai', 30, 22, 8, 'Sắp diễn ra',
  TRUE, '/legacy/images/act-books.jpg', 'Trao tặng 500 đầu sách thiếu nhi, sơn sửa góc đọc sách thân thiện và tổ chức các trò chơi giao lưu bổ ích cho học sinh tiểu học.', 'Yêu thích trẻ em, khéo tay hoặc có kỹ năng sinh hoạt tập thể, nhiệt tình và kiên nhẫn.', 'Trang phục lịch sự, cọ sơn cá nhân (nếu có), tinh thần hào hứng và nụ cười rạng rỡ.', 'Chị Thu Thảo - 0912 345 678 (Chủ nhiệm CLB)'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;

INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-003', 'bua-com-0-dong-binh-thanh', 'Bữa cơm yêu thương 0 đồng cuối tuần', 'Cộng đồng', 'ORG-003', 'Nhóm Thiện Nguyện Hoa Sen',
  FALSE, '2026-10-28'::date, '07:30 - 13:30', NULL,
  'TP. Hồ Chí Minh', 'Bếp Ăn Nghĩa Tình, Quận 10, TP. Hồ Chí Minh', 40, 20, 5, 'Sắp diễn ra',
  TRUE, '/legacy/images/act-food.jpg', 'Chung tay chế biến và trao tận tay 400 suất ăn nóng sốt, đầy đủ dinh dưỡng cho bệnh nhân nghèo và người lao động có hoàn cảnh khó khăn.', 'Sạch sẽ, cẩn thận, có trách nhiệm, đảm bảo vệ sinh an toàn thực phẩm.', 'Tạp dề, khẩu trang, găng tay thực phẩm cá nhân.', 'Chị Lan - 0933 456 789 (Trưởng nhóm)'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;

INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-004', 'chung-tay-vi-thu-cung-vung-tau', 'Chung tay vì thú cưng và động vật cứu hộ', 'Động vật', 'LEGACY-ACT-004', 'Mái Ấm Yêu Thương Vũng Tàu',
  TRUE, '2026-11-05'::date, '08:00 - 14:00', NULL,
  'Vũng Tàu', 'Trạm Cứu Hộ Động Vật, TP. Vũng Tàu', 25, 15, 6, 'Đang tuyển',
  TRUE, '/legacy/images/act-animal.jpg', 'Chăm sóc, dọn dẹp chuồng trại, tắm rửa và hỗ trợ tiêm phòng cho các chú chó, mèo bị bỏ rơi hoặc gặp tai nạn.', 'Yêu thương động vật, không dị ứng lông chó mèo, trang phục năng động.', 'Găng tay bảo hộ, trang phục dài tay, khăn lau cá nhân.', 'Anh Tuấn - 0977 112 233'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;

INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-005', 'kham-benh-cap-thuoc-binh-phuoc', 'Khám bệnh & cấp phát túi thuốc gia đình miễn phí', 'Y tế', 'ORG-004', 'Hội Thầy Thuốc Vì Cộng Đồng',
  TRUE, '2026-11-15'::date, '07:30 - 15:00', NULL,
  'Bình Phước', 'Trạm Y Tế Xã Đắk Ơ, Huyện Bù Gia Mập, Bình Phước', 20, 14, 7, 'Đang tuyển',
  FALSE, '/legacy/images/act-medical.jpg', 'Hỗ trợ các bác sĩ hướng dẫn người dân làm thủ tục khám bệnh, đo huyết áp và phát 300 phần thuốc thiết yếu cho đồng bào vùng biên giới.', 'Ưu tiên sinh viên ngành Y/Dược hoặc tình nguyện viên có kinh nghiệm sơ cấp cứu.', 'Áo blouse (nếu có), trang phục lịch sự, thẻ sinh viên/CCCD.', 'BS. Hoàng Nam - 0989 334 455'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;

INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  'ACT-006', 'lam-sach-bo-bien-binh-thuan', 'Làm sạch bờ biển — Trả lại màu xanh cho đại dương', 'Cộng đồng', 'ORG-001', 'Quỹ Xanh Việt Nam',
  TRUE, '2026-10-18'::date, '07:00 - 12:00', NULL,
  'Bình Thuận', 'Bãi biển Đồi Dương, TP. Phan Thiết, Bình Thuận', 40, 25, 5, 'Đang diễn ra',
  FALSE, '/legacy/images/act-beach.jpg', 'Thu gom rác thải nhựa, dọn sạch bờ biển và tuyên truyền nâng cao ý thức bảo vệ môi trường biển cho du khách.', 'Sức khỏe tốt, chịu được thời tiết nắng gió biển, tinh thần trách nhiệm cao.', 'Nón rộng vành, kem chống nắng, chai nước cá nhân.', 'Anh Trí - 0908 123 456'
) ON CONFLICT (id) DO UPDATE SET
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  organization_id = excluded.organization_id,
  organizer_name = excluded.organizer_name,
  organizer_verified = excluded.organizer_verified,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  deadline_date = excluded.deadline_date,
  city = excluded.city,
  location = excluded.location,
  capacity = excluded.capacity,
  applied = excluded.applied,
  verified_hours = excluded.verified_hours,
  status = excluded.status,
  featured = excluded.featured,
  banner_url = excluded.banner_url,
  description = excluded.description,
  requirements = excluded.requirements,
  items_to_bring = excluded.items_to_bring,
  contact = excluded.contact;


-- ------------------------------------------------------------
-- 5. ĐƠN ĐĂNG KÝ THAM GIA (public.applications)
-- ------------------------------------------------------------
INSERT INTO public.applications (
  id, activity_id, user_id, legacy_user_id, user_name, user_email, status, status_text, verified_hours, applied_at
) VALUES (
  'APP-2026-001', 'ACT-001', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'USR-001', 'Nguyễn Văn An',
  'an.nguyen@email.com', 'approved', 'Hoàn thành (dữ liệu lịch sử)',
  6, COALESCE('2026-10-14T18:01:03.155128+00:00'::timestamptz, NOW())
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (
  id, activity_id, user_id, legacy_user_id, user_name, user_email, status, status_text, verified_hours, applied_at
) VALUES (
  'APP-2026-002', 'ACT-002', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'USR-001', 'Nguyễn Văn An',
  'an.nguyen@email.com', 'approved', 'Hoàn thành (dữ liệu lịch sử)',
  4, COALESCE('2026-10-14T18:01:03.332301+00:00'::timestamptz, NOW())
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (
  id, activity_id, user_id, legacy_user_id, user_name, user_email, status, status_text, verified_hours, applied_at
) VALUES (
  'APP-2026-003', 'ACT-003', '00000000-0000-0000-0000-000000000001'::uuid, 'USR-004', 'Trần Thị Mai',
  'mai.tran@email.com', 'pending', 'Chờ duyệt',
  0, COALESCE('2026-10-14T18:01:03.420426+00:00'::timestamptz, NOW())
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.applications (
  id, activity_id, user_id, legacy_user_id, user_name, user_email, status, status_text, verified_hours, applied_at
) VALUES (
  'LEGACY-CERT-002', 'ACT-006', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'USR-001', 'Nguyễn Văn An',
  'an.nguyen@email.com', 'approved', 'Hoàn thành (dữ liệu lịch sử)',
  20, COALESCE('2026-10-14T18:00:57.341499+00:00'::timestamptz, NOW())
) ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- 6. CHỨNG NHẬN THAM GIA (public.certificates)
-- ------------------------------------------------------------
INSERT INTO public.certificates (
  id, certificate_code, activity_id, user_id, application_id, recipient_name,
  title, issuer, hours, issue_date, badge_type, qr_verified
) VALUES (
  'CERT-001', 'CERT-2026-001', 'ACT-001', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'APP-2026-001',
  'Nguyễn Văn An', 'Chiến Sĩ Môi Trường Xanh 2026', 'Quỹ Xanh Việt Nam', 6, '2026-09-15'::date,
  'Chứng nhận hoàn thành', TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.certificates (
  id, certificate_code, activity_id, user_id, application_id, recipient_name,
  title, issuer, hours, issue_date, badge_type, qr_verified
) VALUES (
  'CERT-002', 'CERT-2026-002', 'ACT-006', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'LEGACY-CERT-002',
  'Nguyễn Văn An', '20 Giờ Cống Hiến Vì Cộng Đồng', 'Thành Đoàn TP. Hồ Chí Minh', 20, '2026-07-15'::date,
  'Huy hiệu cống hiến', TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.certificates (
  id, certificate_code, activity_id, user_id, application_id, recipient_name,
  title, issuer, hours, issue_date, badge_type, qr_verified
) VALUES (
  'CERT-003', 'CERT-2026-003', 'ACT-002', 'dad55bec-d3b3-48be-8ca4-750f831c747e'::uuid, 'APP-2026-002',
  'Nguyễn Văn An', 'Tiếp Sức Mùa Thi Đại Học 2026', 'Hội Sinh Viên ĐHQG TP.HCM', 4, '2026-07-01'::date,
  'Giấy khen thành tích', TRUE
) ON CONFLICT (id) DO NOTHING;


-- ------------------------------------------------------------
-- 7. BẢNG MÀU & CHỦ ĐỀ GIAO DIỆN (public.system_themes)
-- ------------------------------------------------------------
INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '1', 'Đại dương & Hy vọng (Mặc định)', '#12304A', '#087F78', NULL,
  '#E9F7F3', 'light', 'Nền tảng tổng quát, kết nối minh bạch, đáng tin cậy',
  TRUE, TRUE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;

INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '2', 'Mầm Xanh Tươi', '#1B4332', '#2D6A4F', NULL,
  '#E8F5E9', 'light', 'Môi trường, phủ xanh đồi trọc, nhặt rác bờ biển',
  FALSE, FALSE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;

INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '3', 'Trái Tim Ấm Áp', '#4A1521', '#E05D5D', NULL,
  '#FDF2F0', 'light', 'Bếp ăn 0 đồng, mái ấm tình thương, chăm sóc người già & trẻ em',
  FALSE, FALSE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;

INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '4', 'Nắng Mai Hy Vọng', '#1E293B', '#D97706', NULL,
  '#FEF3C7', 'light', 'Giáo dục vùng cao, quyên góp sách vở, khuyến học',
  FALSE, FALSE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;

INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '5', 'Bình Yên & Chữa Lành', '#1E3A8A', '#0284C7', NULL,
  '#F0F9FF', 'light', 'Cứu trợ thiên tai, túi thuốc nghĩa tình, khám chữa bệnh miễn phí',
  FALSE, FALSE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;

INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '6', 'Dạ Yến Huyền Bí (Dark Mode)', '#818CF8', '#10B981', NULL,
  '#1E293B', 'dark', 'Chế độ nền tối bảo vệ mắt, phong cách hiện đại và huyền bí',
  FALSE, FALSE
) ON CONFLICT (legacy_id) DO UPDATE SET
  name = excluded.name,
  primary_color = excluded.primary_color,
  cta_color = excluded.cta_color,
  cta_hover_color = excluded.cta_hover_color,
  surface_color = excluded.surface_color,
  mode = excluded.mode,
  meaning = excluded.meaning,
  is_active = excluded.is_active,
  is_default = excluded.is_default;


-- ------------------------------------------------------------
-- 8. NỘI DUNG TRANG GIỚI THIỆU & CÂU CHUYỆN (public.site_content)
-- ------------------------------------------------------------
INSERT INTO public.site_content (
  content_key, content_html, updated_at
) VALUES (
  'aboutContent', '

    <!-- 1. HERO BANNER VỀ VOLUNTEERHUB -->
    <section class="about-hero-banner">
      <div class="about-hero-top-row">
        <div class="about-hero-left">
          <div class="about-badge-pill">VỀ VOLUNTEERHUB</div>
          <h1 class="about-hero-title">
            Kết nối những trái tim<br>Lan tỏa những hành động đẹp
          </h1>
          <p class="about-hero-desc">
            NhiLun là nền tảng kết nối tình nguyện viên với các tổ chức, dự án thiện nguyện trên khắp Việt Nam. Chúng
            tôi tin rằng mỗi hành động nhỏ đều có thể tạo nên thay đổi lớn cho cộng đồng.
          </p>
          <div class="about-hero-actions">
            <a href="activities.html" class="btn-about-join">
              <i class="ri-plant-line"></i>
              <span>Tham gia ngay</span>
            </a>
            <a href="#" class="btn-about-video">
              <i class="ri-play-circle-line"></i>
              <span>Xem video giới thiệu</span>
            </a>
          </div>
        </div>

        <div class="about-hero-right">
          <div class="about-hero-quote">
            "Vì một cộng đồng<br>khỏe mạnh hơn ♡"
          </div>
          <img src="/legacy/images/profile-cover.jpg" alt="Đội ngũ tình nguyện" class="about-hero-img">
        </div>
      </div>

      <!-- 4 THẺ SỐ LIỆU ĐÈ DƯỚI BANNER -->
      <div class="about-hero-stats-row">
        <div class="about-stat-box">
          <div class="about-stat-icon green"><i class="ri-team-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">12.5K</div>
            <div class="about-stat-label">Tình nguyện viên</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon blue"><i class="ri-building-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">320</div>
            <div class="about-stat-label">Tổ chức đối tác</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon pink"><i class="ri-heart-3-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">1.2K</div>
            <div class="about-stat-label">Hoạt động đã tổ chức</div>
          </div>
        </div>

        <div class="about-stat-box">
          <div class="about-stat-icon teal"><i class="ri-time-line" style="font-size: 1.35rem;"></i></div>
          <div>
            <div class="about-stat-num">350K+</div>
            <div class="about-stat-label">Giờ tình nguyện</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SỨ MỆNH & TẦM NHÌN -->
    <section class="about-mission-section">
      <div class="about-mission-left-card">
        <img src="/legacy/images/sapling-soil.jpg" alt="Mầm non hy vọng" class="about-mission-img">
        <div class="about-mission-overlay">
          <div class="about-mission-quote-overlay">
            "Hành động hôm nay<br>vì ngày mai tươi sáng ♡"
          </div>
        </div>
      </div>

      <div class="about-mission-right">
        <div>
          <div class="about-section-subtitle">SỨ MỆNH & TẦM NHÌN</div>
          <h2 class="about-section-heading">Vì một xã hội tốt đẹp hơn</h2>
        </div>

        <div class="about-mission-cards-grid">
          <!-- SỨ MỆNH -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-focus-3-line" style="color: #059669; font-size: 1.25rem;"></i>
              <span>Sứ mệnh</span>
            </div>
            <p class="mission-feature-desc">
              Tạo cầu nối giữa những người có mong muốn làm thiện nguyện với các tổ chức uy tín, giúp việc tham gia hoạt
              động cộng đồng trở nên dễ dàng, minh bạch và hiệu quả hơn.
            </p>
          </div>

          <!-- TẦM NHÌN -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-eye-line" style="color: #0284c7; font-size: 1.25rem;"></i>
              <span>Tầm nhìn</span>
            </div>
            <p class="mission-feature-desc">
              Trở thành nền tảng thiện nguyện hàng đầu Việt Nam, xây dựng một cộng đồng năng động, nhân văn, nơi mọi
              người đều có cơ hội đóng góp và tạo ra giá trị tích cực cho xã hội.
            </p>
          </div>

          <!-- GIÁ TRỊ CỐT LÕI -->
          <div class="mission-feature-card">
            <div class="mission-feature-header">
              <i class="ri-gem-line" style="color: #7c3aed; font-size: 1.25rem;"></i>
              <span>Giá trị cốt lõi</span>
            </div>
            <ul class="mission-values-list">
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Minh bạch và tin cậy</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Kết nối và sẻ chia</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Tôn trọng con người</li>
              <li class="mission-value-item"><i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> Hành động vì cộng đồng</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. CÁCH THỨC HOẠT ĐỘNG (4 BƯỚC) -->
    <section class="about-how-it-works-section">
      <div class="how-header-wrap">
        <div class="about-section-subtitle">CÁCH THỨC HOẠT ĐỘNG</div>
        <h2 class="about-section-heading">Tham gia thiện nguyện dễ dàng chỉ với 4 bước</h2>
        <p class="how-header-desc">
          Chúng tôi đơn giản hóa quy trình tham gia, giúp bạn nhanh chóng tìm được hoạt động phù hợp và bắt đầu hành
          trình lan tỏa những giá trị tốt đẹp.
        </p>
      </div>

      <div class="how-steps-row">
        <!-- BƯỚC 1 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-search-line"></i></div>
          <span class="how-step-num">01</span>
          <h4 class="how-step-title">Khám phá</h4>
          <p class="how-step-desc">Tìm kiếm hoạt động theo địa điểm, lĩnh vực và thời gian</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 2 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-edit-line"></i></div>
          <span class="how-step-num">02</span>
          <h4 class="how-step-title">Đăng ký</h4>
          <p class="how-step-desc">Đăng ký tham gia với vài thao tác đơn giản</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 3 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-team-line"></i></div>
          <span class="how-step-num">03</span>
          <h4 class="how-step-title">Tham gia</h4>
          <p class="how-step-desc">Tham gia hoạt động cùng cộng đồng</p>
        </div>

        <div class="how-arrow-sep">&rarr;</div>

        <!-- BƯỚC 4 -->
        <div class="how-step-item">
          <div class="how-step-icon-circle"><i class="ri-award-line"></i></div>
          <span class="how-step-num">04</span>
          <h4 class="how-step-title">Ghi nhận</h4>
          <p class="how-step-desc">Nhận chứng nhận giờ tình nguyện và lưu trữ hành trình</p>
        </div>
      </div>
    </section>

    <!-- 4. HÀNH TRÌNH & TÁC ĐỘNG -->
    <section class="about-impact-section">
      <div>
        <div class="about-section-subtitle">HÀNH TRÌNH & TÁC ĐỘNG</div>
        <h2 class="about-section-heading">Những con số biết nói</h2>
      </div>

      <div class="impact-content-grid">
        <div>
          <p class="impact-desc-text">
            Mỗi con số là một câu chuyện, một nụ cười và một tác động đến cộng đồng. Cùng nhau, chúng ta đã và đang tạo
            nên những thay đổi ý nghĩa.
          </p>
        </div>

        <!-- 4 METRIC TĂNG TRƯỞNG -->
        <div class="impact-metrics-row">
          <div class="impact-metric-card">
            <div class="impact-metric-icon blue"><i class="ri-team-line"></i></div>
            <div>
              <div class="impact-metric-num">12.5K+</div>
              <div class="impact-metric-label">Tình nguyện viên</div>
              <div class="impact-metric-growth">↗ +25% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon green"><i class="ri-building-line"></i></div>
            <div>
              <div class="impact-metric-num">320+</div>
              <div class="impact-metric-label">Tổ chức đối tác</div>
              <div class="impact-metric-growth">↗ +40% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon red"><i class="ri-heart-3-line"></i></div>
            <div>
              <div class="impact-metric-num">1.200+</div>
              <div class="impact-metric-label">Hoạt động đã tổ chức</div>
              <div class="impact-metric-growth">↗ +35% so với năm trước</div>
            </div>
          </div>

          <div class="impact-metric-card">
            <div class="impact-metric-icon teal"><i class="ri-time-line"></i></div>
            <div>
              <div class="impact-metric-num">350K+</div>
              <div class="impact-metric-label">Giờ tình nguyện</div>
              <div class="impact-metric-growth">↗ +60% so với năm trước</div>
            </div>
          </div>
        </div>

        <!-- VIDEO BANNER THỰC TẾ -->
        <div class="impact-video-box">
          <img src="/legacy/images/home-hero-volunteer.jpg" alt="Video Hành Trình" class="impact-video-img">
          <div class="impact-video-overlay">
            <a href="#" class="impact-video-btn">
              <span><i class="ri-play-fill"></i></span>
              <span>Xem video hành trình 2026 (2:30)</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. ĐỐI TÁC & ĐỒNG HÀNH -->
    <section class="about-partners-section">
      <div>
        <div class="about-section-subtitle">ĐỐI TÁC & ĐỒNG HÀNH</div>
        <h2 class="about-section-heading">Cùng nhau tạo nên thay đổi</h2>
        <p style="font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0;">
          Chúng tôi hợp tác với nhiều tổ chức, doanh nghiệp và cộng đồng để mở rộng cơ hội thiện nguyện và tạo ra tác
          động bền vững.
        </p>
      </div>

      <div class="partners-logos-row">
        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #dc2626;"><i class="ri-hospital-line"></i></div>
          <div>
            <div class="partner-name">Hội Chữ Thập Đỏ Việt Nam</div>
            <div class="partner-sub">Đối tác chiến lược</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #16a34a;"><i class="ri-plant-line"></i></div>
          <div>
            <div class="partner-name">GreenViet</div>
            <div class="partner-sub">Vì môi trường xanh</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #2563eb;"><i class="ri-graduation-cap-line"></i></div>
          <div>
            <div class="partner-name">Teach For Vietnam</div>
            <div class="partner-sub">Giáo dục trẻ em</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #eab308;"><i class="ri-award-line"></i></div>
          <div>
            <div class="partner-name">Trung tâm Hỗ trợ Trẻ em</div>
            <div class="partner-sub">Bảo trợ trẻ em</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #ec4899;"><i class="ri-wallet-3-line"></i></div>
          <div>
            <div class="partner-name">MoMo</div>
            <div class="partner-sub">Ví cộng đồng</div>
          </div>
        </div>

        <div class="partner-badge-item">
          <div class="partner-logo-circle" style="color: #059669;"><i class="ri-bank-line"></i></div>
          <div>
            <div class="partner-name">Vietcombank</div>
            <div class="partner-sub">Chung niềm tin vững tương lai</div>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: #64748b; font-weight: 600; padding: 8px 12px;">
          Và nhiều đối tác khác...
        </div>
      </div>
    </section>

  ', NOW()
) ON CONFLICT (content_key) DO UPDATE SET
  content_html = excluded.content_html,
  updated_at = NOW();

INSERT INTO public.site_content (
  content_key, content_html, updated_at
) VALUES (
  'storiesContent', '

    <!-- 1. HERO BANNER CÂU CHUYỆN CỘNG ĐỒNG -->
    <div class="stories-hero-banner" data-video-url="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1">
      <div class="stories-hero-left">
        <div class="stories-hero-pill">Stories • Câu chuyện cộng đồng</div>
        <h1 class="stories-hero-title">
          Mỗi hành động nhỏ<br>đều tạo nên thay đổi lớn
        </h1>
        <p class="stories-hero-desc">
          Cùng chia sẻ những khoảnh khắc, câu chuyện và cảm xúc trong hành trình tình nguyện của bạn.
        </p>
        <div class="stories-hero-actions">
          <button type="button" class="btn-share-story" data-story-action="share">
            <i class="ri-edit-box-line"></i>
            <span>Chia sẻ câu chuyện</span>
          </button>
          <a href="#" class="btn-watch-video" data-story-action="video">
            <i class="ri-play-circle-line"></i>
            <span>Xem video nổi bật</span>
          </a>
        </div>
      </div>

      <div class="stories-hero-right">
        <div class="stories-hero-quote">
          "Lan tỏa yêu thương<br>Kết nối cộng đồng ♡"
        </div>
        <img src="/legacy/images/profile-cover.jpg" alt="Volunteers Looking at Nature" class="stories-hero-img">
      </div>
    </div>

    <!-- 2. BỘ LỌC DẠNG PILL & THANH TÌM KIẾM CÂU CHUYỆN -->
    <div class="stories-filter-strip">
      <div class="stories-pill-list">
        <button type="button" class="story-pill-btn active" data-story-filter="all"><i class="ri-apps-2-line"></i> Tất cả</button>
        <button type="button" class="story-pill-btn" data-story-filter="article"><i class="ri-article-line"></i> Bài viết</button>
        <button type="button" class="story-pill-btn" data-story-filter="image"><i class="ri-image-line"></i> Hình ảnh</button>
        <button type="button" class="story-pill-btn" data-story-filter="video"><i class="ri-video-line"></i> Video</button>
        <button type="button" class="story-pill-btn" data-story-filter="inspire"><i class="ri-sparkling-line"></i> Câu chuyện truyền cảm hứng</button>
      </div>

      <div class="stories-search-input-box">
        <i class="ri-search-line stories-search-icon"></i>
        <input type="text" placeholder="Tìm kiếm câu chuyện...">
      </div>
    </div>

    <!-- 3. LƯỚI CÂU CHUYỆN & SIDEBAR PHẢI -->
    <div class="stories-main-grid">

      <!-- LƯỚI 6 CÂU CHUYỆN CHÍNH (2 CỘT x 3 HÀNG) -->
      <section class="stories-cards-grid" id="storiesCardsContainer">

        <!-- THẺ 1: MÔI TRƯỜNG -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-tree.jpg" alt="Ngày hội trồng cây" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-leaf-line"></i> Môi trường</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Ngày hội trồng 1.000 cây xanh — Những nụ cười xanh</h3>
            <p class="story-card-desc">Tuy mệt nhưng rất vui khi được cùng các bạn trẻ góp phần làm cho thành phố xanh hơn. Mỗi cây được trồng là một hy vọng...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Nguyễn Thị Lan</div>
                  <div class="story-card-time">2 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>128</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 12</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 5</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 2: GIÁO DỤC -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-books.jpg" alt="Tủ sách trao em" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-book-read-line"></i> Giáo dục</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Tủ sách trao em — Hành trình của những cuốn sách biết đi</h3>
            <p class="story-card-desc">Nhìn các em nhỏ háo hức chọn sách, mình thấy mọi nỗ lực đều xứng đáng. Hy vọng những cuốn sách này sẽ mở ra nhiều...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/home-hero-volunteer.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Trần Minh Khoa</div>
                  <div class="story-card-time">3 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>256</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 18</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 11</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 3: CỘNG ĐỒNG -->
        <article class="story-card-item" data-category="inspire">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-beach.jpg" alt="Làm sạch bờ biển" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-heart-3-line"></i> Cộng đồng</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Làm sạch bờ biển — Trả lại màu xanh cho đại dương</h3>
            <p class="story-card-desc">Biển hôm nay sạch hơn nhờ sự chung tay của 50 tình nguyện viên. Chúng mình đã thu gom hơn 200kg rác thải nhựa...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Lê Thu Thảo</div>
                  <div class="story-card-time">5 ngày trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>189</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 24</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 16</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 4: Y TẾ -->
        <article class="story-card-item" data-category="article">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-medical.jpg" alt="Khám bệnh miễn phí" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-heart-pulse-line"></i> Y tế</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Khám bệnh miễn phí — Nụ cười là liều thuốc quý nhất</h3>
            <p class="story-card-desc">Được gặp và lắng nghe những câu chuyện của bà con, mình thấy trân trọng hơn những gì mình đang có. Sức khỏe là tài sản...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Phạm Ngọc Anh</div>
                  <div class="story-card-time">1 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>302</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 20</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 14</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 5: CỨU TRỢ -->
        <article class="story-card-item" data-category="inspire">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/act-food.jpg" alt="Chung tay sau bão lũ" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-lifebuoy-line"></i> Cứu trợ</span>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Chung tay sau bão lũ — Không ai bị bỏ lại phía sau</h3>
            <p class="story-card-desc">Chúng mình đã trao hơn 500 phần quà thiết yếu đến các hộ dân vùng lũ. Những cái bắt tay, ánh mắt biết ơn là động lực để...</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/home-hero-volunteer.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Vũ Đức Thành</div>
                  <div class="story-card-time">1 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>214</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 15</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 8</span>
              </div>
            </div>
          </div>
        </article>

        <!-- THẺ 6: VIDEO -->
        <article class="story-card-item" data-category="video">
          <div class="story-card-thumb-wrap">
            <img src="/legacy/images/home-hero-volunteer.jpg" alt="Một ngày làm tình nguyện viên" class="story-card-thumb-img">
            <span class="story-card-tag"><i class="ri-play-circle-line"></i> Video</span>
            <div class="story-video-play-badge">
              <div class="story-play-icon"><i class="ri-play-fill"></i></div>
            </div>
          </div>
          <div class="story-card-body">
            <h3 class="story-card-title">Một ngày làm tình nguyện viên cùng chúng mình <i class="ri-heart-fill" style="color: #10b981;"></i></h3>
            <p class="story-card-desc">Video ghi lại hành trình 1 ngày tham gia hoạt động tại trạm y tế xã. Nhiều cảm xúc, nhiều kỷ niệm đáng nhớ!</p>
            <div class="story-card-author-row">
              <div class="story-author-info">
                <img src="/legacy/images/profile-avatar.jpg" alt="Author" class="story-author-avatar">
                <div>
                  <div class="story-author-name">Nguyễn Hoài Nam</div>
                  <div class="story-card-time">2 tuần trước</div>
                </div>
              </div>
              <div class="story-card-metrics">
                <span class="story-metric-item story-like-btn" title="Thích câu chuyện"><i class="ri-heart-line"></i> <span>176</span></span>
                <span class="story-metric-item"><i class="ri-chat-3-line"></i> 10</span>
                <span class="story-metric-item"><i class="ri-share-forward-line"></i> 22</span>
              </div>
            </div>
          </div>
        </article>

      </section>

      <!-- SIDEBAR THỐNG KÊ & NỔI BẬT BÊN PHẢI -->
      <aside class="stories-sidebar">

        <!-- HỘP THỐNG KÊ CỘNG ĐỒNG -->
        <div class="story-side-box">
          <div class="story-side-header">
            <h4 class="story-side-title">Câu chuyện cộng đồng</h4>
            <a href="#" class="story-side-link">Xem tất cả &rarr;</a>
          </div>
          <div class="story-stats-grid">
            <div class="story-stat-cell">
              <div class="story-stat-icon green"><i class="ri-file-text-line"></i></div>
              <div>
                <div class="story-stat-num">428</div>
                <div class="story-stat-label">Bài viết</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon blue"><i class="ri-image-line"></i></div>
              <div>
                <div class="story-stat-num">1.2K</div>
                <div class="story-stat-label">Hình ảnh</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon pink"><i class="ri-play-fill"></i></div>
              <div>
                <div class="story-stat-num">86</div>
                <div class="story-stat-label">Video</div>
              </div>
            </div>
            <div class="story-stat-cell">
              <div class="story-stat-icon orange"><i class="ri-heart-fill"></i></div>
              <div>
                <div class="story-stat-num">3.4K</div>
                <div class="story-stat-label">Lượt thích</div>
              </div>
            </div>
          </div>
        </div>

        <!-- HỘP CÂU CHUYỆN NỔI BẬT -->
        <div class="story-side-box">
          <div class="story-side-header">
            <h4 class="story-side-title"><i class="ri-trophy-line" style="color: #f59e0b;"></i> Câu chuyện nổi bật</h4>
          </div>
          <div class="story-top-list">
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-tree.jpg" alt="Cùng nhau phủ xanh" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Cùng nhau phủ xanh quê hương</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Nguyễn Thị Lan</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 1.2K</div>
            </a>
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-books.jpg" alt="Những nụ cười vùng cao" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Những nụ cười vùng cao</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Trần Minh Khoa</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 953</div>
            </a>
            <a href="#" class="story-top-item">
              <img src="/legacy/images/act-beach.jpg" alt="Biển sạch hơn mỗi ngày" class="story-top-img">
              <div class="story-top-info">
                <div class="story-top-title">Biển sạch hơn mỗi ngày</div>
                <div class="story-top-author"><i class="ri-user-line"></i> Lê Thu Thảo</div>
              </div>
              <div class="story-top-likes"><i class="ri-heart-fill" style="color: #ef4444;"></i> 876</div>
            </a>
          </div>
        </div>

        <!-- HỘP KÊU GỌI TRUYỀN CẢM HỨNG -->
        <div class="story-inspire-box">
          <div class="story-inspire-icon"><i class="ri-plant-line"></i></div>
          <p class="story-inspire-text">"Câu chuyện của bạn có thể truyền cảm hứng cho hàng ngàn người khác"</p>
          <button type="button" class="btn-inspire-share" data-story-action="share">Chia sẻ ngay &rarr;</button>
        </div>

      </aside>

    </div>

  ', NOW()
) ON CONFLICT (content_key) DO UPDATE SET
  content_html = excluded.content_html,
  updated_at = NOW();


-- ------------------------------------------------------------
-- 9. BÀI VIẾT CÂU CHUYỆN CỘNG ĐỒNG (public.stories)
-- ------------------------------------------------------------
INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-1', NULL, 'Ngày hội trồng 1.000 cây xanh — Những nụ cười xanh', 'Tuy mệt nhưng rất vui khi được cùng các bạn trẻ góp phần làm cho thành phố xanh hơn. Mỗi cây được trồng là một hy vọng...', 'article',
  128, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-2', NULL, 'Tủ sách trao em — Hành trình của những cuốn sách biết đi', 'Nhìn các em nhỏ háo hức chọn sách, mình thấy mọi nỗ lực đều xứng đáng. Hy vọng những cuốn sách này sẽ mở ra nhiều...', 'article',
  256, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-3', NULL, 'Làm sạch bờ biển — Trả lại màu xanh cho đại dương', 'Biển hôm nay sạch hơn nhờ sự chung tay của 50 tình nguyện viên. Chúng mình đã thu gom hơn 200kg rác thải nhựa...', 'inspire',
  189, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-4', NULL, 'Khám bệnh miễn phí — Nụ cười là liều thuốc quý nhất', 'Được gặp và lắng nghe những câu chuyện của bà con, mình thấy trân trọng hơn những gì mình đang có. Sức khỏe là tài sản...', 'article',
  302, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-5', NULL, 'Chung tay sau bão lũ — Không ai bị bỏ lại phía sau', 'Chúng mình đã trao hơn 500 phần quà thiết yếu đến các hộ dân vùng lũ. Những cái bắt tay, ánh mắt biết ơn là động lực để...', 'inspire',
  214, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  'legacy-story-6', NULL, 'Một ngày làm tình nguyện viên cùng chúng mình', 'Video ghi lại hành trình 1 ngày tham gia hoạt động tại trạm y tế xã. Nhiều cảm xúc, nhiều kỷ niệm đáng nhớ!', 'video',
  176, NOW()
) ON CONFLICT (id) DO NOTHING;


COMMIT;
