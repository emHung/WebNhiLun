# VolunteerHub — Nền Tảng Kết Nối & Quản Lý Hoạt Động Thiện Nguyện (NhiLun)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org/)

---

## 🌟 Giới Thiệu Tổng Quan

**VolunteerHub (NhiLun)** là nền tảng số kết nối tình nguyện viên với các tổ chức thiện nguyện trên toàn quốc. Hệ thống minh bạch hóa toàn bộ chu trình tình nguyện: từ khám phá cơ hội, nộp đơn ứng tuyển, xét duyệt hồ sơ, điểm danh tại hiện trường qua QR Code cho đến tự động tính lũy giờ cống hiến và phát hành chứng nhận điện tử có mã định danh xác thực.

---

## 🗺️ Sơ Đồ Cấu Trúc Trang & Điều Hướng (Site Map)

Hệ thống được tổ chức phân quyền chặt chẽ theo mô hình **RBAC (Role-Based Access Control)** với 4 cấp độ: **Khách vãng lai (Public)**, **Tình nguyện viên (Volunteer)**, **Ban tổ chức (Organizer)** và **Quản trị viên (Admin)**.

### 1. Bảng Danh Mục Route & Phân Quyền

| STT | Tuyến đường (Route) | Tên trang / Chức năng | Phân quyền truy cập | Mô tả nghiệp vụ |
|:---:|:---|:---|:---:|:---|
| **I** | **CỔNG CÔNG KHAI** | | | |
| 1 | `/` | Trang chủ (Home) | Public | Banner chiến dịch, tìm kiếm nhanh, số liệu tác động, hoạt động tiêu biểu. |
| 2 | `/activities` | Danh mục hoạt động | Public | Bộ lọc đa chiều (địa bàn, lĩnh vực, hạn nộp), xem Grid/List, yêu thích. |
| 3 | `/activities/[identifier]` | Chi tiết hoạt động | Public | Timeline lịch trình, chỉ tiêu, yêu cầu, đơn vị tổ chức có tích xanh. |
| 4 | `/stories` | Câu chuyện cộng đồng | Public | Bài viết truyền cảm hứng, phóng sự, cảm nhận thực tế của TNV. |
| 5 | `/about` | Giới thiệu dự án | Public | Tầm nhìn, sứ mệnh, giá trị cốt lõi và ban cố vấn nền tảng. |
| 6 | `/auth` | Xác thực tài khoản | Public | Đăng nhập, đăng ký theo vai trò, nút đăng nhập nhanh 1 chạm Demo. |
| 7 | `/auth/reset` | Đặt lại mật khẩu | Public | Nhận liên kết và xác lập mật khẩu mới qua email. |
| 8 | `/certificates/verify` | Tra cứu chứng nhận | Public | Quét QR hoặc nhập mã tra cứu chứng nhận thật giả công khai. |
| 9 | `/privacy` | Chính sách bảo mật | Public | Quy định thu thập, sử dụng và bảo vệ dữ liệu cá nhân. |
| 10 | `/terms` | Quy tắc cộng đồng | Public | Điều khoản sử dụng, tiêu chuẩn an toàn cho TNV và BTC. |
| **II** | **CỔNG TÌNH NGUYỆN VIÊN** | | | *(Yêu cầu đăng nhập tài khoản TNV)* |
| 11 | `/volunteer/dashboard` | Bảng điều khiển TNV | Volunteer | Thống kê giờ cống hiến, tiến độ, theo dõi trạng thái các đơn đã nộp. |
| 12 | `/volunteer/apply/[activityId]` | Đơn ứng tuyển | Volunteer | Form nộp đơn 4 bước, chọn ca trực, kiểm tra sức chứa & chống nộp trùng. |
| 13 | `/schedule` | Lịch hoạt động cá nhân | Volunteer | Lịch trực theo tháng/tuần các hoạt động đã được BTC duyệt tham gia. |
| 14 | `/certificates` | Thư viện chứng nhận | Volunteer | Xem, in ấn và tải chứng nhận điện tử chính thức (`CERT-2026-XXX`). |
| 15 | `/favorites` | Hoạt động đã lưu | Volunteer | Quản lý danh sách các hoạt động thiện nguyện đã đánh dấu yêu thích. |
| 16 | `/notifications` | Trung tâm thông báo | Authenticated | Thông báo xét duyệt đơn, điểm danh thành công, phát hành chứng nhận. |
| 17 | `/profile` | Hồ sơ cá nhân | Authenticated | Cập nhật thông tin, ảnh đại diện, tiểu sử, bộ kỹ năng chuyên môn. |
| **III**| **CỔNG BAN TỔ CHỨC** | | | *(Yêu cầu vai trò Organizer)* |
| 18 | `/organizer/manage` | Quản lý chiến dịch | Organizer | Quản lý hồ sơ ứng viên: duyệt đơn, từ chối, quét QR điểm danh, xuất CSV. |
| 19 | `/organizer/create-event` | Tạo hoạt động mới | Organizer | Wizard 5 bước thiết lập chiến dịch, lịch trình, tải banner và nộp duyệt. |
| **IV** | **CỔNG QUẢN TRỊ VIÊN** | | | *(Yêu cầu vai trò Admin)* |
| 20 | `/admin/moderation` | Kiểm duyệt hệ thống | Admin | Duyệt pháp nhân tổ chức (tích xanh), duyệt hoạt động, tra cứu Audit Logs. |
| 21 | `/admin/theme-settings` | Cấu hình bảng màu | Admin | Quản lý bảng màu động CSS Variables, đổi theme toàn trang 1 chạm. |
| **V** | **HỆ THỐNG ĐIỀU HƯỚNG PHỤ** | | | |
| 22 | `/dashboard` | Phễu điều hướng thông minh | Authenticated | Tự động chuyển tiếp đến trang tương ứng với Role của tài khoản. |
| 23 | `/forbidden` | Báo lỗi 403 Forbidden | Authenticated | Chặn truy cập khi tài khoản không đủ quyền hạn nghiệp vụ. |
| 24 | `/[...legacy]` | Chuyển tiếp URL cũ | Public | Tự động bắt link `.html` cũ (VD: `detail.html?id=...`) ➔ React route mới. |

---

### 2. Sơ Đồ Luồng Nghiệp Vụ (Navigation Flowchart)

```mermaid
graph TD
    classDef public fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef volunteer fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d;
    classDef organizer fill:#fefce8,stroke:#ca8a04,stroke-width:2px,color:#a16207;
    classDef admin fill:#fef2f2,stroke:#dc2626,stroke-width:2px,color:#b91c1c;

    subgraph PUBLIC["🌐 CỔNG CÔNG KHAI"]
        HOME["Trang chủ (/)"]:::public
        ACT["Danh sách hoạt động (/activities)"]:::public
        DETAIL["Chi tiết hoạt động (/activities/:id)"]:::public
        STORIES["Câu chuyện (/stories)"]:::public
        ABOUT["Giới thiệu (/about)"]:::public
        VERIFY["Xác minh QR (/certificates/verify)"]:::public
        AUTH["Xác thực (/auth)"]:::public
    end

    subgraph VOLUNTEER["💚 CỔNG TÌNH NGUYỆN VIÊN (TNV)"]
        VDASH["Dashboard (/volunteer/dashboard)"]:::volunteer
        APPLY["Nộp đơn (/volunteer/apply/:id)"]:::volunteer
        SCHED["Lịch hoạt động (/schedule)"]:::volunteer
        CERT["Chứng nhận (/certificates)"]:::volunteer
        PROF["Hồ sơ cá nhân (/profile)"]:::volunteer
        NOTIF["Thông báo (/notifications)"]:::volunteer
    end

    subgraph ORGANIZER["🏢 CỔNG BAN TỔ CHỨC (BTC)"]
        OMANAGE["Quản lý & Điểm danh (/organizer/manage)"]:::organizer
        OCREATE["Khởi tạo sự kiện (/organizer/create-event)"]:::organizer
    end

    subgraph ADMIN["🛡️ CỔNG QUẢN TRỊ VIÊN (ADMIN)"]
        AMOD["Kiểm duyệt & Audit Logs (/admin/moderation)"]:::admin
        ATHEME["Bảng màu & Theme (/admin/theme-settings)"]:::admin
    end

    HOME --> ACT --> DETAIL --> APPLY
    HOME --> STORIES
    HOME --> ABOUT
    DETAIL --> VERIFY
    AUTH -->|Đăng nhập TNV| VDASH
    AUTH -->|Đăng nhập BTC| OMANAGE
    AUTH -->|Đăng nhập Admin| AMOD

    VDASH --> SCHED
    VDASH --> CERT
    VDASH --> PROF
    VDASH --> NOTIF

    OCREATE -->|Gửi duyệt| AMOD
    AMOD -->|Phê duyệt| ACT
    APPLY -->|Nộp hồ sơ| OMANAGE
    OMANAGE -->|Duyệt & Quét QR Điểm danh| CERT
```

---

## 🏗️ Kiến Trúc Kỹ Thuật (Architecture)

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 15)                │
│    App Router • Server/Client Components • Realtime     │
│    Vanilla CSS Design System • Dynamic Theme Palettes   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API / Bearer JWT Session
┌───────────────────────────▼────────────────────────────┐
│                    BACKEND (FastAPI)                   │
│    Async Python • RBAC Middleware • ACID Transactions   │
│    Audit Trail • Server Storage & PDF Generation       │
└───────────────────────────┬────────────────────────────┘
                            │ AsyncPG Connection Pool
┌───────────────────────────▼────────────────────────────┐
│                  DATABASE & AUTH (Supabase)            │
│    PostgreSQL • Row Level Security • Supabase Auth     │
│    Realtime Publications • Object Storage (Buckets)    │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Hướng Dẫn Cài Đặt Môi Trường & Khởi Chạy (Step-by-Step)

### 1. Yêu Cầu Tiên Quyết (Prerequisites)
- **Node.js**: v18.18+ hoặc v20+ (Khuyên dùng v20 LTS) & **npm**
- **Python**: v3.11+ (Khuyên dùng 3.11 hoặc 3.12)
- **Git**
- Một tài khoản hoặc dự án **Supabase** (Cloud hoặc Local Docker)

---

### 2. Thiết Lập & Khởi Chạy Backend (FastAPI)

#### Bước 2.1: Tạo môi trường ảo Python & cài đặt thư viện
```bash
# Di chuyển vào thư mục backend
cd backend

# Khởi tạo virtual environment
python -m venv .venv

# Kích hoạt virtual environment:
# Trên Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Trên Windows (Command Prompt):
.venv\Scripts\activate.bat
# Trên macOS / Linux:
source .venv/bin/activate

# Nâng cấp pip và cài đặt dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### Bước 2.2: Cấu hình biến môi trường Backend (`backend/.env`)
Sao chép file mẫu:
```bash
cp .env.example .env
```
Mở file `backend/.env` và thiết lập các biến sau:
```env
# 1. Supabase Project Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_anon_key_here
SUPABASE_SECRET_KEY=sb_secret_your_service_role_key_here
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json

# 2. Kết nối PostgreSQL trực tiếp qua asyncpg
SUPABASE_DB_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres

# 3. Cấu hình CORS & Môi trường
FRONTEND_ORIGINS=http://localhost:3000
APP_ENV=development

# 4. Bật chế độ Đăng nhập nhanh Demo (Chỉ dùng khi DEV)
DEMO_LOGIN_ENABLED=true
DEMO_PASSWORD_USR_001=123456
DEMO_PASSWORD_USR_002=123456
DEMO_PASSWORD_USR_003=123456
```

> ⚠️ **LƯU Ý BẢO MẬT:** `SUPABASE_SECRET_KEY` (service role) chỉ được đặt tại `backend/.env` cho các nghiệp vụ nội bộ (Storage, cấp PDF, seed). **Tuyệt đối không đưa key này vào Frontend**.

#### Bước 2.3: Áp dụng CSDL & Nạp dữ liệu mẫu (Database Migration & Seed)
```bash
# 1. Áp dụng schema migration lên Supabase (chạy từ thư mục gốc của dự án)
python backend/scripts/apply_migration.py

# 2. Nạp dữ liệu mẫu chuẩn hóa từ data/seedData.js lên Supabase
python backend/scripts/seed_supabase.py --apply
```

#### Bước 2.4: Khởi chạy máy chủ FastAPI
```bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API URL:** `http://127.0.0.1:8000`
- **Tài liệu Swagger OpenAPI:** `http://127.0.0.1:8000/docs`
- **Kiểm tra Health:** `http://127.0.0.1:8000/api/v1/health`

---

### 3. Thiết Lập & Khởi Chạy Frontend (Next.js 15)

Mở một cửa sổ Terminal mới:

#### Bước 3.1: Cài đặt gói npm
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt các thư viện React, Next.js, Supabase SSR
npm install
```

#### Bước 3.2: Cấu hình biến môi trường Frontend (`frontend/.env.local`)
Sao chép file mẫu:
```bash
cp .env.example .env.local
```
Chỉnh sửa `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_anon_key_here
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
API_INTERNAL_URL=http://127.0.0.1:8000
```

#### Bước 3.3: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập giao diện tại: **`http://localhost:3000`**

#### Bước 3.4: Biên dịch Production (Optional)
```bash
# Kiểm tra Type, Lint và build production bundle:
npm run build

# Khởi chạy server production:
npm run start
```

---

### 4. Các Lệnh Tiện Ích & Script Tự Động Hóa

| Tác vụ | Câu lệnh thực thi | Mô tả |
| :--- | :--- | :--- |
| **Chụp ảnh tự động 15 màn hình** | `python scripts/take_screenshots.py` | Dùng Playwright tự động đăng nhập 3 vai trò và chụp toàn bộ trang vào `docs/screenshots/`. |
| **Tối ưu hóa ảnh WebP** | `cd frontend && python scripts/optimize-images.py` | Đọc ảnh JPG gốc, tạo variants WebP đa kích thước (120, 240, 480, 960, 1600px). |
| **Kiểm thử hệ thống Backend** | `cd backend && python scripts/verify_system.py` | Kiểm thử tự động 42 assertion về luồng tạo đơn, khóa sức chứa, duyệt đơn và điểm danh. |
| **Kiểm tra kết nối Realtime** | `cd frontend && node scripts/verify-realtime.mjs` | Kiểm tra channel phát tín hiệu Realtime qua Supabase WebSocket. |

---

## 👥 Tài Khoản Kiểm Thử (Demo Accounts)

Tại màn hình đăng nhập (`http://localhost:3000/auth`), bạn có thể bấm trực tiếp các nút trong thanh **"Đăng nhập nhanh 1 chạm (Demo)"**, hoặc nhập thông tin sau:

| Vai trò | Tên tài khoản | Email đăng nhập | Mật khẩu | Trang hạ cánh (Landing) |
| :--- | :--- | :--- | :---: | :--- |
| **Tình nguyện viên (TNV)** | Nguyễn Văn An | `an.nguyen@email.com` | `123456` | `/volunteer/dashboard` |
| **Ban tổ chức (BTC)** | Quỹ Xanh Việt Nam | `coordinator@quyxanh.vn` | `123456` | `/organizer/manage` |
| **Quản trị viên (Admin)** | Quản Trị Viên Hệ Thống | `admin@volunteerhub.vn` | `123456` | `/admin/moderation` |

---

## 📸 Bộ Ảnh Chụp Màn Hình Minh Họa 15 Trang

### I. Cổng Công Khai (Public Portal)
#### 1. Trang Chủ (Home Page)
![Trang Chủ - Home Page](docs/screenshots/01_home.png)

#### 2. Danh Sách Hoạt Động (Activities Catalog)
![Danh Sách Hoạt Động](docs/screenshots/02_activities.png)

#### 3. Chi Tiết Hoạt Động (Activity Detail)
![Chi Tiết Hoạt Động](docs/screenshots/03_activity_detail.png)

#### 4. Câu Chuyện Tình Nguyện (Community Stories)
![Câu Chuyện Tình Nguyện](docs/screenshots/04_stories.png)

#### 5. Giới Thiệu Dự Án (About Us)
![Giới Thiệu](docs/screenshots/05_about.png)

#### 6. Xác Thực Tài Khoản (Authentication & Demo Buttons)
![Xác Thực Tài Khoản](docs/screenshots/06_auth.png)

---

### II. Cổng Tình Nguyện Viên (Volunteer Portal)
#### 7. Bảng Điều Khiển Tình Nguyện Viên (Volunteer Dashboard)
![Bảng Điều Khiển TNV](docs/screenshots/07_volunteer_dashboard.png)

#### 8. Lịch Hoạt Động Cá Nhân (Schedule & Calendar)
![Lịch Hoạt Động TNV](docs/screenshots/08_volunteer_schedule.png)

#### 9. Thư Viện Chứng Nhận Điện Tử (Certificates Library)
![Chứng Nhận Điện Tử](docs/screenshots/09_certificates.png)

#### 10. Trung Tâm Thông Báo (Notifications Center)
![Trung Tâm Thông Báo](docs/screenshots/10_notifications.png)

#### 11. Hồ Sơ Cá Nhân & Kỹ Năng (Profile & Skills)
![Hồ Sơ Cá Nhân](docs/screenshots/11_profile.png)

---

### III. Cổng Ban Tổ Chức (Organizer Workspace)
#### 12. Quản Lý Hoạt Động & Điểm Danh (Organizer Management)
![Quản Lý Hoạt Động & Điểm Danh](docs/screenshots/12_organizer_manage.png)

#### 13. Khởi Tạo Chiến Dịch Mới (Create Activity Wizard)
![Tạo Hoạt Động Mới](docs/screenshots/13_organizer_create_event.png)

---

### IV. Cổng Quản Trị Hệ Thống (Admin Portal)
#### 14. Kiểm Duyệt Hệ Thống (Moderation & Audit Logs)
![Kiểm Duyệt Hệ Thống Admin](docs/screenshots/14_admin_moderation.png)

#### 15. Quản Lý Bảng Màu Giao Diện (Dynamic Theme Settings)
![Cài Đặt Theme Toàn Trang](docs/screenshots/15_admin_theme_settings.png)

---

## 📁 Cấu Trúc Thư Mục Dự Án (Directory Structure)

```
WebNhiLun/
├── frontend/                     # Ứng dụng Next.js 15 (App Router)
│   ├── app/                      # Các route trang (page.tsx, layout.tsx, middleware.ts)
│   ├── components/portal/        # UI Components & Frames dùng chung cho từng trang
│   ├── hooks/                    # Custom React hooks (useApiQuery, useNotifications)
│   ├── lib/                      # Supabase client/server, API fetcher, media helper
│   ├── public/legacy/            # CSS Design System (base.css, components.css,...) & WebP images
│   └── scripts/                  # Scripts tối ưu ảnh (optimize-images.py) & test Realtime
├── backend/                      # Dịch vụ API nghiệp vụ FastAPI (Python)
│   ├── app/                      # API router, models, schemas, RBAC middleware
│   ├── scripts/                  # Migration runner, seed dữ liệu Supabase, verify QA
│   └── requirements.txt          # Danh sách thư viện Python
├── supabase/                     # Quản lý Database & Migrations
│   └── migrations/               # Các file schema migration PostgreSQL, RLS, Indexes
├── VolunteerHub_Docs/            # Bộ tài liệu phân tích kỹ thuật, ERD & đánh giá hiệu năng
├── docs/screenshots/             # Bộ ảnh chụp màn hình chất lượng cao 15 trang
├── data/                         # Dữ liệu hạt giống chuẩn hóa (seedData.js, themes.json)
├── scripts/                      # Tool tự động chụp ảnh màn hình (take_screenshots.py)
├── .gitattributes                # Quy tắc thống kê ngôn ngữ GitHub Linguist
├── .gitignore                    # Cấu hình bỏ qua cache, build artifacts và file nhạy cảm
└── README.md                     # Tài liệu giới thiệu & hướng dẫn chi tiết
```

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng và phát triển vì mục đích phi lợi nhuận phục vụ phong trào tình nguyện cộng đồng. Mọi đóng góp xin vui lòng tạo Pull Request hoặc liên hệ ban phát triển NhiLun.
