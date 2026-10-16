"""
Export complete sample seed data to supabase/seed.sql
Reads current live database records and outputs idempotent SQL INSERT statements.
"""
import asyncio
import os
import json
from pathlib import Path
import asyncpg
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / "backend/.env")
DB_URL = os.environ.get("SUPABASE_DB_URL")

async def export_seed():
    if not DB_URL:
        print("ERROR: SUPABASE_DB_URL is missing in backend/.env")
        return
    conn = await asyncpg.connect(DB_URL, ssl="require", timeout=20)
    
    out = []
    out.append("-- ============================================================")
    out.append("-- NHILUN (VOLUNTEERHUB) - SEED DATA FILE")
    out.append("-- Dữ liệu mẫu chuẩn hóa cho người khác import vào Supabase / PostgreSQL.")
    out.append("-- ============================================================\n")
    out.append("BEGIN;\n")
    out.append("CREATE EXTENSION IF NOT EXISTS pgcrypto;\n")

    # 1. DEMO AUTH USERS
    out.append("-- ------------------------------------------------------------")
    out.append("-- 1. DEMO TÀI KHOẢN ĐĂNG NHẬP (auth.users)")
    out.append("-- Mật khẩu mặc định cho tất cả tài khoản mẫu: Demo@123456")
    out.append("-- ------------------------------------------------------------")
    demo_users = [
        ("00000000-0000-0000-0000-000000000001", "an.nguyen@email.com", "Nguyễn Văn An", "volunteer", "USR-001"),
        ("00000000-0000-0000-0000-000000000002", "coordinator@quyxanh.vn", "Ban Điều Phối Quỹ Xanh", "organizer", "USR-002"),
        ("00000000-0000-0000-0000-000000000003", "admin@volunteerhub.vn", "Quản Trị Viên Hệ Thống", "admin", "USR-003"),
    ]
    for uid, email, name, role, legacy_id in demo_users:
        out.append(f"""INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  '{uid}'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  '{email}',
  crypt('Demo@123456', gen_salt('bf')),
  NOW(),
  '{{"provider":"email","providers":["email"]}}'::jsonb,
  '{{"name":"{name}","role":"{role}","legacy_id":"{legacy_id}"}}'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
  raw_user_meta_data = excluded.raw_user_meta_data;
""")

    # 2. PROFILES
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 2. HỒ SƠ TÌNH NGUYỆN VIÊN / TỔ CHỨC / ADMIN (public.profiles)")
    out.append("-- ------------------------------------------------------------")
    profiles = [
        (
            "00000000-0000-0000-0000-000000000001", "USR-001", "Nguyễn Văn An", "an.nguyen@email.com",
            "0901 234 567", "2003-05-12", "TP. Hồ Chí Minh", "volunteer", "Tình nguyện viên",
            "/legacy/images/profile-avatar.jpg",
            "Sinh viên yêu thích hoạt động môi trường và cộng đồng. Mong muốn cống hiến cho xã hội.",
            ["Làm việc nhóm", "Giao tiếp", "Sơ cấp cứu", "Tổ chức sự kiện", "Chụp ảnh"], 24
        ),
        (
            "00000000-0000-0000-0000-000000000002", "USR-002", "Ban Điều Phối Quỹ Xanh", "coordinator@quyxanh.vn",
            "0908 123 456", None, "TP. Hồ Chí Minh", "organizer", "Ban tổ chức",
            "/legacy/images/act-tree.jpg",
            "Điều phối các dự án bảo tồn thiên nhiên và phục hồi rừng ngập mặn Cần Giờ.",
            ["Quản lý dự án", "Điều phối tình nguyện viên", "Quan hệ đối tác"], 120
        ),
        (
            "00000000-0000-0000-0000-000000000003", "USR-003", "Quản Trị Viên Hệ Thống", "admin@volunteerhub.vn",
            "0988 777 666", None, "Hà Nội", "admin", "Quản trị viên",
            "/legacy/images/sapling-soil.jpg",
            "Quản trị viên hệ thống nền tảng kết nối hoạt động thiện nguyện NhiLun.",
            ["Quản trị hệ thống", "Duyệt tổ chức", "Kiểm duyệt hoạt động"], 0
        ),
    ]
    for uid, leg_id, name, email, phone, dob, city, role, role_title, avatar, bio, skills, hours in profiles:
        skills_sql = "ARRAY[" + ", ".join(f"'{s}'" for s in skills) + "]::text[]"
        dob_sql = f"'{dob}'::date" if dob else "NULL"
        bio_esc = bio.replace("'", "''")
        out.append(f"""INSERT INTO public.profiles (
  id, legacy_id, name, email, phone, dob, city, role, role_title, avatar_url, bio, skills, verified_hours
) VALUES (
  '{uid}'::uuid, '{leg_id}', '{name}', '{email}', '{phone}', {dob_sql}, '{city}', '{role}', '{role_title}',
  '{avatar}', '{bio_esc}', {skills_sql}, {hours}
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
""")

    # 3. ORGANIZATIONS
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 3. CÁC TỔ CHỨC THIỆN NGUYỆN (public.organizations)")
    out.append("-- ------------------------------------------------------------")
    org_rows = await conn.fetch("SELECT * FROM public.organizations ORDER BY id")
    for r in org_rows:
        owner_id_sql = f"'{r['owner_id']}'::uuid" if r['owner_id'] else "'00000000-0000-0000-0000-000000000002'::uuid"
        desc_esc = (r['description'] or "").replace("'", "''")
        doc_esc = (r['doc_name'] or "").replace("'", "''")
        reg_date = r['registered_at'].isoformat() if r['registered_at'] else 'CURRENT_DATE'
        out.append(f"""INSERT INTO public.organizations (
  id, owner_id, name, representative, category, status, verified, doc_name, registered_at, description
) VALUES (
  '{r['id']}', {owner_id_sql}, '{r['name'].replace("'", "''")}', '{r['representative'].replace("'", "''")}',
  '{r['category']}', '{r['status']}', {'TRUE' if r['verified'] else 'FALSE'}, '{doc_esc}', '{reg_date}'::date, '{desc_esc}'
) ON CONFLICT (id) DO UPDATE SET
  name = excluded.name,
  representative = excluded.representative,
  category = excluded.category,
  status = excluded.status,
  verified = excluded.verified,
  doc_name = excluded.doc_name,
  description = excluded.description;
""")

    # 4. ACTIVITIES
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 4. HOẠT ĐỘNG THIỆN NGUYỆN (public.activities)")
    out.append("-- ------------------------------------------------------------")
    act_rows = await conn.fetch("SELECT * FROM public.activities ORDER BY id")
    for r in act_rows:
        title_esc = r['title'].replace("'", "''")
        org_name_esc = (r['organizer_name'] or "").replace("'", "''")
        loc_esc = (r['location'] or "").replace("'", "''")
        desc_esc = (r['description'] or "").replace("'", "''")
        req_esc = (r['requirements'] or "").replace("'", "''")
        items_esc = (r['items_to_bring'] or "").replace("'", "''")
        contact_esc = (r['contact'] or "").replace("'", "''")
        ev_date = r['event_date'].isoformat() if r['event_date'] else 'CURRENT_DATE'
        dl_date = f"'{r['deadline_date'].isoformat()}'::date" if r['deadline_date'] else "NULL"
        
        out.append(f"""INSERT INTO public.activities (
  id, slug, title, category, organization_id, organizer_name, organizer_verified,
  event_date, event_time, deadline_date, city, location, capacity, applied,
  verified_hours, status, featured, banner_url, description, requirements, items_to_bring, contact
) VALUES (
  '{r['id']}', '{r['slug']}', '{title_esc}', '{r['category']}', '{r['organization_id']}', '{org_name_esc}',
  {'TRUE' if r['organizer_verified'] else 'FALSE'}, '{ev_date}'::date, '{r['event_time'] or ''}', {dl_date},
  '{r['city']}', '{loc_esc}', {r['capacity']}, {r['applied']}, {r['verified_hours']}, '{r['status']}',
  {'TRUE' if r['featured'] else 'FALSE'}, '{r['banner_url'] or ''}', '{desc_esc}', '{req_esc}', '{items_esc}', '{contact_esc}'
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
""")

    # 5. APPLICATIONS
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 5. ĐƠN ĐĂNG KÝ THAM GIA (public.applications)")
    out.append("-- ------------------------------------------------------------")
    app_rows = await conn.fetch("SELECT * FROM public.applications ORDER BY id")
    for r in app_rows:
        user_id_sql = f"'{r['user_id']}'::uuid" if r['user_id'] else "'00000000-0000-0000-0000-000000000001'::uuid"
        user_name_esc = (r['user_name'] or 'Nguyễn Văn An').replace("'", "''")
        out.append(f"""INSERT INTO public.applications (
  id, activity_id, user_id, legacy_user_id, user_name, user_email, status, status_text, verified_hours, applied_at
) VALUES (
  '{r['id']}', '{r['activity_id']}', {user_id_sql}, '{r['legacy_user_id'] or ''}', '{user_name_esc}',
  '{r['user_email'] or 'an.nguyen@email.com'}', '{r['status']}', '{r['status_text'] or ''}',
  {r['verified_hours'] or 0}, COALESCE('{r['applied_at'].isoformat()}'::timestamptz, NOW())
) ON CONFLICT (id) DO NOTHING;
""")

    # 6. CERTIFICATES
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 6. CHỨNG NHẬN THAM GIA (public.certificates)")
    out.append("-- ------------------------------------------------------------")
    cert_rows = await conn.fetch("SELECT * FROM public.certificates ORDER BY id")
    for r in cert_rows:
        user_id_sql = f"'{r['user_id']}'::uuid" if r['user_id'] else "'00000000-0000-0000-0000-000000000001'::uuid"
        issue_date = r['issue_date'].isoformat() if r['issue_date'] else 'CURRENT_DATE'
        recip_esc = (r['recipient_name'] or '').replace("'", "''")
        title_esc = (r['title'] or '').replace("'", "''")
        issuer_esc = (r['issuer'] or '').replace("'", "''")
        out.append(f"""INSERT INTO public.certificates (
  id, certificate_code, activity_id, user_id, application_id, recipient_name,
  title, issuer, hours, issue_date, badge_type, qr_verified
) VALUES (
  '{r['id']}', '{r['certificate_code']}', '{r['activity_id']}', {user_id_sql}, '{r['application_id'] or ''}',
  '{recip_esc}', '{title_esc}', '{issuer_esc}', {r['hours'] or 0}, '{issue_date}'::date,
  '{r['badge_type'] or 'Gold'}', {'TRUE' if r['qr_verified'] else 'FALSE'}
) ON CONFLICT (id) DO NOTHING;
""")

    # 7. SYSTEM THEMES
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 7. BẢNG MÀU & CHỦ ĐỀ GIAO DIỆN (public.system_themes)")
    out.append("-- ------------------------------------------------------------")
    theme_rows = await conn.fetch("SELECT * FROM public.system_themes ORDER BY legacy_id")
    for r in theme_rows:
        name_esc = r['name'].replace("'", "''")
        meaning_esc = (r['meaning'] or '').replace("'", "''")
        cta_hover = f"'{r['cta_hover_color']}'" if r['cta_hover_color'] else 'NULL'
        out.append(f"""INSERT INTO public.system_themes (
  legacy_id, name, primary_color, cta_color, cta_hover_color, surface_color, mode, meaning, is_active, is_default
) VALUES (
  '{r['legacy_id']}', '{name_esc}', '{r['primary_color']}', '{r['cta_color']}', {cta_hover},
  '{r['surface_color']}', '{r['mode']}', '{meaning_esc}',
  {'TRUE' if r['is_active'] else 'FALSE'}, {'TRUE' if r['is_default'] else 'FALSE'}
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
""")

    # 8. SITE CONTENT
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 8. NỘI DUNG TRANG GIỚI THIỆU & CÂU CHUYỆN (public.site_content)")
    out.append("-- ------------------------------------------------------------")
    content_rows = await conn.fetch("SELECT * FROM public.site_content ORDER BY content_key")
    for r in content_rows:
        content_esc = r['content_html'].replace("'", "''")
        out.append(f"""INSERT INTO public.site_content (
  content_key, content_html, updated_at
) VALUES (
  '{r['content_key']}', '{content_esc}', NOW()
) ON CONFLICT (content_key) DO UPDATE SET
  content_html = excluded.content_html,
  updated_at = NOW();
""")

    # 9. STORIES
    out.append("\n-- ------------------------------------------------------------")
    out.append("-- 9. BÀI VIẾT CÂU CHUYỆN CỘNG ĐỒNG (public.stories)")
    out.append("-- ------------------------------------------------------------")
    story_rows = await conn.fetch("SELECT * FROM public.stories ORDER BY id")
    for r in story_rows:
        user_id_sql = f"'{r['user_id']}'::uuid" if r['user_id'] else "NULL"
        title_esc = (r['title'] or '').replace("'", "''")
        body_esc = (r['body'] or '').replace("'", "''")
        category_esc = (r['category'] or 'article').replace("'", "''")
        out.append(f"""INSERT INTO public.stories (
  id, user_id, title, body, category, legacy_likes, created_at
) VALUES (
  '{r['id']}', {user_id_sql}, '{title_esc}', '{body_esc}', '{category_esc}',
  {r['legacy_likes'] or 0}, NOW()
) ON CONFLICT (id) DO NOTHING;
""")

    out.append("\nCOMMIT;\n")

    seed_file = ROOT / "supabase/seed.sql"
    seed_file.write_text("\n".join(out), encoding="utf-8")
    print(f"SUCCESS: Generated {seed_file} ({len(out)} lines)")

    await conn.close()

if __name__ == "__main__":
    asyncio.run(export_seed())
