"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";
import { NotificationBell } from "./NotificationBell";
import { imageUrl } from "@/lib/media";
import { usePathname, useRouter } from "next/navigation";
import { useLoad } from "@/hooks/use-api-query";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

export type {
  Profile,
  Activity,
  Application,
  Certificate,
  Notification,
} from "@/lib/models";
import type { Profile } from "@/lib/models";

export { useLoad } from "@/hooks/use-api-query";

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const workspace = [
    "/profile",
    "/schedule",
    "/notifications",
    "/certificates",
    "/favorites",
    "/volunteer/dashboard",
  ].includes(pathname);
  const { data: user } = useLoad<Profile>(workspace ? null : "/auth/me");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/auth");
    router.refresh();
  }
  function submitNavSearch(event: FormEvent) {
    event.preventDefault();
    const query = navSearch.trim();
    if (query) router.push(`/activities?search=${encodeURIComponent(query)}`);
  }
  const role = user?.role?.toLowerCase() ?? "volunteer";
  const dashboardHref = role.includes("admin")
    ? "/admin/moderation"
    : role.includes("organizer")
      ? "/organizer/manage"
      : "/volunteer/dashboard";
  const roleLabel =
    user?.role_title ??
    (role.includes("admin")
      ? "Quản trị viên"
      : role.includes("organizer")
        ? "Ban tổ chức"
        : "Tình nguyện viên");
  useEffect(() => {
    const pageClass = pathname.startsWith("/activities")
      ? "act-page-wrapper"
      : "";
    document.body.classList.remove("act-page-wrapper");
    if (pageClass) document.body.classList.add(pageClass);
    return () => document.body.classList.remove("act-page-wrapper");
  }, [pathname]);
  return (
    <>
      <header
        className={`vh-navbar-wrapper${mobileOpen ? " mobile-open" : ""}`}
      >
        <div className="vh-navbar-container">
          <Link className="vh-brand-group" href="/">
            <span className="vh-brand-logo-icon" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#059669"
                />
              </svg>
            </span>
            <span className="vh-brand-title-wrap">
              <span className="vh-brand-name">NhiLun</span>
              <span className="vh-brand-slogan">
                Cùng nhau lan tỏa giá trị tốt đẹp
              </span>
            </span>
          </Link>
          <ul className="vh-nav-menu-list" aria-label="Điều hướng chính">
            <li className="vh-nav-item">
              <Link className={pathname === "/" ? "active" : ""} href="/">
                Trang chủ
              </Link>
            </li>
            <li className="vh-nav-item">
              <Link
                className={pathname.startsWith("/activities") ? "active" : ""}
                href="/activities"
              >
                Hoạt động
              </Link>
            </li>
            <li className="vh-nav-item">
              <Link
                className={pathname.startsWith("/stories") ? "active" : ""}
                href="/stories"
              >
                Stories
              </Link>
            </li>
            <li className="vh-nav-item">
              <Link
                className={pathname.startsWith("/about") ? "active" : ""}
                href="/about"
              >
                Giới thiệu
              </Link>
            </li>
            <li className="vh-nav-item">
              <Link
                className={pathname === dashboardHref ? "active" : ""}
                href={dashboardHref}
              >
                {role === "organizer"
                  ? "Ban tổ chức"
                  : role === "admin"
                    ? "Quản trị"
                    : "Hoạt động của tôi"}
              </Link>
            </li>
            {role === "organizer" && (
              <li className="vh-nav-item">
                <Link
                  className={
                    pathname === "/organizer/create-event" ? "active" : ""
                  }
                  href="/organizer/create-event"
                >
                  Tạo sự kiện
                </Link>
              </li>
            )}
            {role === "admin" && (
              <li className="vh-nav-item">
                <Link href="/admin/theme-settings">Giao diện</Link>
              </li>
            )}
          </ul>
          <form className="vh-nav-search-bar" onSubmit={submitNavSearch}>
            <i className="ri-search-line vh-nav-search-icon" />
            <input
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Tìm kiếm hoạt động, câu chuyện, địa điểm..."
              aria-label="Tìm kiếm"
            />
          </form>
          <div className="vh-nav-actions">
            <NotificationBell enabled={Boolean(user)} />
            {user ? (
              <div
                className={`vh-user-menu-wrapper${userMenuOpen ? " active" : ""}`}
              >
                <button
                  className="vh-user-pill-btn"
                  type="button"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((open) => !open)}
                >
                  <MediaImage
                    className="vh-user-pill-avatar"
                    src={imageUrl(user.avatar_url)}
                    alt=""
                  />
                  <span className="vh-user-pill-info">
                    <span className="vh-user-pill-name">{user.name}</span>
                    <span className="vh-user-pill-role">{roleLabel}</span>
                  </span>
                  <i className="ri-arrow-down-s-line vh-user-pill-arrow" />
                </button>
                <div
                  className={`vh-user-dropdown${userMenuOpen ? " show" : ""}`}
                >
                  <div className="vh-user-dropdown-header">
                    <MediaImage
                      className="vh-user-dropdown-avatar"
                      src={imageUrl(user.avatar_url)}
                      alt=""
                    />
                    <div className="vh-user-dropdown-meta">
                      <div className="vh-user-dropdown-name">{user.name}</div>
                      <div className="vh-user-dropdown-email">{user.email}</div>
                      <span
                        className={`vh-role-badge ${role.includes("admin") ? "admin" : role.includes("organizer") ? "organizer" : "volunteer"}`}
                      >
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                  <div className="vh-user-dropdown-section">
                    <Link
                      className={`vh-user-item-dashboard ${role.includes("admin") ? "admin" : role.includes("organizer") ? "organizer" : ""}`}
                      href={dashboardHref}
                    >
                      <i className="ri-dashboard-line vh-user-dashboard-icon" />
                      <span className="vh-user-dashboard-text">
                        <span className="vh-user-dashboard-title">
                          Bảng điều khiển
                        </span>
                        <span className="vh-user-dashboard-desc">
                          Quản lý hoạt động của bạn
                        </span>
                      </span>
                      <span className="vh-user-dashboard-arrow">→</span>
                    </Link>
                  </div>
                  <div className="vh-user-dropdown-section">
                    <Link className="vh-user-item" href="/profile">
                      <i className="ri-user-line vh-user-item-icon" />
                      <span className="vh-user-item-title">Hồ sơ cá nhân</span>
                    </Link>
                    <Link className="vh-user-item" href="/certificates">
                      <i className="ri-award-line vh-user-item-icon" />
                      <span className="vh-user-item-title">Chứng nhận</span>
                    </Link>
                    <Link className="vh-user-item" href="/schedule">
                      <i className="ri-calendar-line vh-user-item-icon" />
                      <span className="vh-user-item-title">Lịch hoạt động</span>
                    </Link>
                  </div>
                  <div className="vh-user-dropdown-footer">
                    <button className="vh-logout-btn" onClick={signOut}>
                      <i className="ri-logout-box-r-line" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link className="btn btn-primary btn-sm" href="/auth">
                Đăng nhập
              </Link>
            )}
            <button
              type="button"
              className="vh-mobile-toggle-btn"
              aria-label="Menu điều hướng"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <i className={mobileOpen ? "ri-close-line" : "ri-menu-line"} />
            </button>
          </div>
        </div>
      </header>
      <div className="portal-main">{children}</div>
      <footer className="app-footer">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ margin: 0 }}>
            © 2026 NhiLun • Nền tảng kết nối hoạt động từ thiện &amp; minh bạch
            giờ công nhận
          </p>
          <div>
            <Link
              href="/privacy"
              style={{
                color: "var(--text-secondary)",
                marginRight: 12,
                fontSize: ".76rem",
              }}
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/terms"
              style={{ color: "var(--text-secondary)", fontSize: ".76rem" }}
            >
              Quy tắc cộng đồng
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="portal-page-intro">
      <div>
        {eyebrow && <span className="portal-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusMessage({
  error,
  loading,
}: {
  error?: string;
  loading?: boolean;
}) {
  if (loading)
    return (
      <div className="portal-message" role="status">
        Đang tải dữ liệu…
      </div>
    );
  if (error)
    return (
      <div className="portal-message portal-error" role="alert">
        {error}
      </div>
    );
  return null;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="portal-empty">
      <i className="ri-folder-open-line" />
      <p>{children}</p>
    </div>
  );
}

export function formatDate(value?: string) {
  if (!value) return "Chưa cập nhật";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
}
