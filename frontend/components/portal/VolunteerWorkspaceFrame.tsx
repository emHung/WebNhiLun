"use client";
import { MediaImage } from "@/components/portal/MediaImage";
import Link from "next/link";
import { NotificationBell } from "./NotificationBell";
import { useNotificationSummary } from "@/hooks/use-notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api";
import { Profile, Notification, useLoad } from "./shared";
import { imageUrl } from "@/lib/media";
export { imageUrl } from "@/lib/media";
const menu = [
  ["ri-home-4-line", "Trang chủ", "/"],
  ["ri-compass-3-line", "Hoạt động", "/activities"],
  ["ri-book-open-line", "Stories", "/stories"],
  ["ri-group-line", "Giới thiệu", "/about"],
  ["ri-bar-chart-2-line", "Dashboard", "/volunteer/dashboard"],
  ["ri-user-3-line", "Hồ sơ cá nhân", "/profile"],
  [
    "ri-file-list-3-line",
    "Hoạt động của tôi",
    "/volunteer/dashboard?section=applications",
  ],
  ["ri-calendar-line", "Lịch hoạt động", "/schedule"],
  ["ri-award-line", "Chứng nhận", "/certificates"],
  ["ri-notification-3-line", "Thông báo", "/notifications"],
  ["ri-heart-line", "Yêu thích", "/favorites"],
  ["ri-settings-3-line", "Cài đặt", "/profile?tab=settings"],
];
export function VolunteerWorkspaceFrame({
  active,
  profile,
  searchPlaceholder = "Tìm kiếm hoạt động, địa điểm...",
  searchValue,
  onSearchChange,
  children,
}: {
  active: string;
  profile?: Profile | null;
  unreadCount?: number;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}) {
  const { data: notificationSummary } = useNotificationSummary();
  const unread = notificationSummary?.unread_total || 0;
  const [userOpen, setUserOpen] = useState(false),
    [search, setSearch] = useState("");
  const router = useRouter();
  useEffect(() => {
    document.body.classList.add("profile-layout");
    return () => document.body.classList.remove("profile-layout");
  }, []);
  const links =
    profile?.role && profile.role !== "volunteer"
      ? menu
          .filter(
            (row) =>
              !["Dashboard", "Hoạt động của tôi", "Chứng nhận"].includes(
                row[1],
              ),
          )
          .concat([
            [
              "ri-dashboard-line",
              "Bảng điều khiển",
              profile.role === "admin"
                ? "/admin/moderation"
                : "/organizer/manage",
            ],
          ])
      : menu;
  return (
    <div className="profile-app-container volunteer-workspace">
      <aside className="profile-sidebar">
        <Link href="/" className="sidebar-brand-box">
          <span className="sidebar-brand-logo">
            <i className="ri-heart-pulse-fill" />
          </span>
          <span className="sidebar-brand-title">NhiLun</span>
        </Link>
        <ul className="sidebar-menu-list">
          {links.map(([icon, label, href]) => (
            <li
              key={label}
              className={`sidebar-menu-item${active === href ? " active" : ""}`}
            >
              <Link
                href={href}
                aria-current={active === href ? "page" : undefined}
              >
                <span className="sidebar-menu-label">
                  <i className={`sidebar-menu-icon ${icon}`} />
                  <span>{label}</span>
                </span>
                {label === "Thông báo" && unread > 0 && (
                  <span className="sidebar-badge">{unread}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-mini-promo">
          <div className="mini-promo-graphic">
            <i className="ri-plant-line" />
          </div>
          <p className="mini-promo-title">
            Cùng nhau
            <br />
            lan tỏa giá trị tốt đẹp
          </p>
          <Link className="mini-promo-btn" href="/activities">
            Tham gia ngay →
          </Link>
        </div>
      </aside>
      <main className="profile-main-area">
        <div className="profile-topbar">
          <form
            className="topbar-search-box"
            onSubmit={(event) => {
              event.preventDefault();
              if (!onSearchChange)
                router.push(`/activities?search=${encodeURIComponent(search)}`);
            }}
          >
            <i className="ri-search-line topbar-search-icon" />
            <input
              className="topbar-search-input"
              value={searchValue ?? search}
              onChange={(e) =>
                onSearchChange
                  ? onSearchChange(e.target.value)
                  : setSearch(e.target.value)
              }
              placeholder={searchPlaceholder}
              aria-label="Tìm kiếm"
            />
          </form>
          <div className="topbar-right-actions">
            <NotificationBell buttonClass="workspace-bell" />
            <div className="workspace-account">
              <button
                className="workspace-user"
                type="button"
                onClick={() => setUserOpen((value) => !value)}
                aria-expanded={userOpen}
              >
                <MediaImage src={imageUrl(profile?.avatar_url)} alt="" />
                <span>
                  <strong>{profile?.name || "Tài khoản của tôi"}</strong>
                  <small>{profile?.role_title || "Tình nguyện viên"}</small>
                </span>
                <i className="ri-arrow-down-s-line" />
              </button>
              {userOpen && (
                <div className="workspace-account-menu">
                  <Link href="/profile">Hồ sơ cá nhân</Link>
                  <Link href="/profile?tab=settings">Cài đặt</Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await createClient().auth.signOut();
                      router.replace("/auth");
                      router.refresh();
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
