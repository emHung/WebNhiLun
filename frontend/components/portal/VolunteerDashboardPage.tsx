"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";

import { useNotificationSummary } from "@/hooks/use-notifications";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { VolunteerWorkspaceFrame, imageUrl } from "./VolunteerWorkspaceFrame";

import { apiDownload, apiRequest } from "@/lib/api";
import {
  Activity,
  Application,
  Certificate,
  EmptyState,
  PortalShell,
  Profile,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function VolunteerDashboardPage() {
  const {
    data: applications,
    error,
    loading,
    refresh,
  } = useLoad<Application[]>("/me/applications");
  const { data: certificates } = useLoad<Certificate[]>("/me/certificates");
  const { data: profile } = useLoad<Profile>("/me/profile");
  const { data: activityPage } = useLoad<{ items: Activity[] }>(
    "/activities?limit=12",
  );
  const { data: notificationSummary } = useNotificationSummary();
  const notifications = notificationSummary?.items;
  const [tab, setTab] = useState("all");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [certificateIndex, setCertificateIndex] = useState(0);
  const dashboardParams = useSearchParams();
  const all = applications ?? [];
  const tabFor = (item: Application) =>
    item.checkin_status === "checked_in" || item.status === "completed"
      ? "completed"
      : item.status === "approved"
        ? "accepted"
        : item.status === "in_progress"
          ? "in_progress"
          : item.status;
  const filtered = all
    .filter(
      (item) =>
        (tab === "all" || tabFor(item) === tab) &&
        (!search.trim() ||
          `${item.activity_title} ${item.id}`
            .toLocaleLowerCase("vi")
            .includes(search.trim().toLocaleLowerCase("vi"))),
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? b.applied_at.localeCompare(a.applied_at)
        : a.applied_at.localeCompare(b.applied_at),
    );
  const hours = certificates?.reduce((sum, item) => sum + item.hours, 0) ?? 0;
  async function cancel(item: Application) {
    if (!window.confirm(`Bạn muốn hủy đơn ${item.id}?`)) return;
    try {
      await apiRequest(
        `/me/applications/${encodeURIComponent(item.id)}/cancel`,
        { method: "POST" },
      );
      setMessage("Đã hủy đơn đăng ký.");
      refresh();
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Không thể hủy đơn.",
      );
    }
  }
  const upcoming = all
    .filter(
      (item) =>
        item.status === "approved" && item.checkin_status !== "checked_in",
    )
    .map((item) => ({
      id: item.activity_id,
      slug: item.slug,
      title: item.activity_title,
      event_date: item.event_date || "",
      category: item.category,
      banner_url: item.banner_url,
      city: item.city,
      applied: item.applied,
      capacity: item.capacity,
    }))
    .filter((item) => new Date(`${item.event_date}T23:59:59`) >= new Date())
    .slice(0, 3);
  const recommended = (activityPage?.items ?? []).slice(3, 7);
  const calendarOffset = (calendarMonth.getDay() + 6) % 7;
  const calendarDays = Array.from(
    {
      length:
        Math.ceil(
          (calendarOffset +
            new Date(
              calendarMonth.getFullYear(),
              calendarMonth.getMonth() + 1,
              0,
            ).getDate()) /
            7,
        ) * 7,
    },
    (_, index) => index - calendarOffset + 1,
  );
  const monthEvents = all.filter(
    (item) =>
      item.checkin_status !== "checked_in" &&
      item.event_date &&
      new Date(`${item.event_date}T00:00:00`).getMonth() ===
        calendarMonth.getMonth() &&
      new Date(`${item.event_date}T00:00:00`).getFullYear() ===
        calendarMonth.getFullYear(),
  );
  const activeCertificate = certificates?.length
    ? certificates[certificateIndex % certificates.length]
    : null;
  const unreadNotifications = notificationSummary?.unread_total ?? 0;
  const score = profile?.verified_hours ?? hours;
  const upcomingCount = all.filter(
    (item) =>
      item.checkin_status !== "checked_in" &&
      item.status === "approved" &&
      new Date(`${item.event_date ?? ""}T23:59:59`) >= new Date(),
  ).length;
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame
        active={
          dashboardParams.get("section") === "applications"
            ? "/volunteer/dashboard?section=applications"
            : "/volunteer/dashboard"
        }
        profile={profile}
        unreadCount={unreadNotifications}
      >
        <div
          className="v-dashboard-page container"
          style={{
            maxWidth: 1280,
            padding: "16px 12px",
            boxSizing: "border-box",
          }}
        >
          <div className="v-dash-layout">
            <div className="v-dash-main-col">
              <section className="v-hero-banner">
                <div className="v-hero-content">
                  <h1 className="v-hero-title">
                    Xin chào, {profile?.name || "Tình nguyện viên"}!{" "}
                    <i
                      className="ri-hand-wave-line"
                      style={{ color: "#f59e0b" }}
                    />
                  </h1>
                  <p className="v-hero-subtitle">
                    Cùng nhau tạo nên những giá trị tốt đẹp cho cộng đồng.
                  </p>
                  <div className="v-hero-quote-row">
                    <p className="v-hero-quote">
                      <span>“Mỗi hành động nhỏ đều tạo nên thay đổi lớn.”</span>
                      <i className="ri-heart-3-line" />
                    </p>
                    <Link href="/activities" className="v-hero-cta">
                      <span>Khám phá thêm hoạt động</span>
                      <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
                <div className="v-hero-glass-card">
                  <div className="v-hero-glass-icon">
                    <i className="ri-hand-heart-line" />
                  </div>
                  <div className="v-hero-glass-text">
                    <span>Tiếp tục hành trình thiện nguyện</span>
                    <strong>Lan tỏa yêu thương</strong>
                    <span>Vì một cộng đồng tốt đẹp hơn!</span>
                  </div>
                </div>
              </section>
              <section className="v-stats-row">
                <div className="v-stat-card">
                  <div className="v-stat-icon-box v-stat-icon-blue">
                    <i className="ri-file-list-3-line" />
                  </div>
                  <div className="v-stat-info">
                    <div className="v-stat-label">Tổng đơn đăng ký</div>
                    <div className="v-stat-num">{all.length}</div>
                    <div className="v-stat-sub">Tất cả chiến dịch</div>
                  </div>
                </div>
                <div className="v-stat-card">
                  <div className="v-stat-icon-box v-stat-icon-mint">
                    <i className="ri-time-line" />
                  </div>
                  <div className="v-stat-info">
                    <div className="v-stat-label">Số giờ được xác nhận</div>
                    <div className="v-stat-num">{hours} giờ</div>
                    <div className="v-stat-sub">Tổng giờ tình nguyện</div>
                  </div>
                </div>
                <div className="v-stat-card">
                  <div className="v-stat-icon-box v-stat-icon-green">
                    <i className="ri-award-line" />
                  </div>
                  <div className="v-stat-info">
                    <div className="v-stat-label">Chứng nhận điện tử</div>
                    <div className="v-stat-num">
                      {certificates?.length ?? 0}
                    </div>
                    <div className="v-stat-sub">Được bảo chứng minh bạch</div>
                  </div>
                </div>
                <div className="v-stat-card">
                  <div className="v-stat-icon-box v-stat-icon-orange">
                    <i className="ri-calendar-event-line" />
                  </div>
                  <div className="v-stat-info">
                    <div className="v-stat-label">Hoạt động sắp tới</div>
                    <div className="v-stat-num">{upcomingCount}</div>
                    <div className="v-stat-sub">
                      <Link href="/schedule" className="v-link-all">
                        Xem lịch hoạt động →
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
              <section className="v-card-box">
                <div className="v-card-header">
                  <h2 className="v-card-title">
                    <i className="ri-calendar-event-line" /> Hoạt động sắp tới
                  </h2>
                  <Link href="/activities" className="v-link-all">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="v-suggest-grid">
                  {upcoming.map((item) => (
                    <article className="v-sug-card" key={item.id}>
                      <Link
                        href={`/activities/${item.slug || item.id}`}
                        className="v-sug-img-wrap"
                      >
                        <MediaImage
                          className="v-sug-img"
                          src={imageUrl(
                            item.banner_url || "/legacy/images/act-tree.jpg",
                          )}
                          alt={item.title}
                        />
                        <span className="v-sug-badge green">
                          {item.category}
                        </span>
                      </Link>
                      <div className="v-sug-body">
                        <h3 className="v-sug-title">{item.title}</h3>
                        <div className="v-sug-meta">
                          <span>
                            <i className="ri-calendar-line" />{" "}
                            {formatDate(item.event_date)}
                          </span>
                          <span>
                            <i className="ri-map-pin-line" /> {item.city}
                          </span>
                        </div>
                        <div className="v-sug-footer">
                          <span className="v-sug-slots">
                            {item.applied}/{item.capacity} người
                          </span>
                          <Link
                            href={`/activities/${item.slug || item.id}`}
                            className="btn btn-xs btn-outline"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!upcoming.length && <p>Chưa có hoạt động sắp diễn ra.</p>}
              </section>
              <section className="v-card-box">
                <div className="v-card-header">
                  <h2 className="v-card-title">
                    <i className="ri-file-text-line" /> Danh Sách Hoạt Động Đã
                    Đăng Ký
                  </h2>
                  <div className="v-filter-bar">
                    <input
                      className="v-input-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Tìm kiếm hoạt động..."
                      aria-label="Tìm kiếm hoạt động"
                    />
                    <select
                      className="v-select-sort"
                      value={sortOrder}
                      onChange={(event) => setSortOrder(event.target.value)}
                      aria-label="Sắp xếp"
                    >
                      <option value="newest">Sắp xếp: Mới nhất</option>
                      <option value="oldest">Sắp xếp: Cũ nhất</option>
                    </select>
                  </div>
                </div>
                <div className="v-tabs-nav">
                  {[
                    ["all", "Tất cả"],
                    ["pending", "Chờ duyệt"],
                    ["accepted", "Đã chấp nhận"],
                    ["in_progress", "Đang diễn ra"],
                    ["completed", "Đã hoàn thành"],
                    ["cancelled", "Đã hủy"],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      className={`v-tab-btn${tab === key ? " active" : ""}`}
                      onClick={() => setTab(key)}
                    >
                      {label} (
                      {key === "all"
                        ? all.length
                        : all.filter((item) => tabFor(item) === key).length}
                      )
                    </button>
                  ))}
                </div>
                <StatusMessage error={error || undefined} loading={loading} />
                {message && (
                  <div className="portal-message" role="status">
                    {message}
                  </div>
                )}
                <div className="v-reg-list">
                  {filtered.map((item) => (
                    <article className="v-reg-item" key={item.id}>
                      <div className="v-reg-left">
                        <div
                          className="v-reg-thumb"
                          style={{
                            display: "grid",
                            placeItems: "center",
                            background:
                              "linear-gradient(135deg,#d1fae5,#eff6ff)",
                            color: "#059669",
                            fontSize: 28,
                          }}
                        >
                          <i className="ri-hand-heart-line" />
                        </div>
                        <div className="v-reg-content">
                          <span className="v-reg-code">{item.id}</span>
                          <h3 className="v-reg-title">{item.activity_title}</h3>
                          <div className="v-reg-tags">
                            <span className="v-reg-tag">
                              <i className="ri-calendar-line" />{" "}
                              {formatDate(item.applied_at)}
                            </span>
                            {item.checkin_status === "checked_in" && (
                              <span className="v-reg-tag">
                                <i className="ri-time-line" />{" "}
                                {item.verified_hours} giờ
                              </span>
                            )}
                          </div>
                          {item.reject_reason && (
                            <p className="v-reg-msg-box">
                              {item.reject_reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="v-reg-right">
                        <div className="v-reg-status-block">
                          <span
                            className={`v-status-badge ${item.status === "approved" ? "completed" : "pending"}`}
                          >
                            {item.status_text || item.status}
                          </span>
                          {item.checkin_status === "checked_in" && (
                            <div className="v-reg-verified-text">
                              Đã điểm danh · {item.verified_hours} giờ
                            </div>
                          )}
                        </div>
                        <div className="v-reg-actions">
                          <Link
                            className="btn btn-outline btn-sm"
                            href={`/activities/${item.slug || item.activity_id}`}
                          >
                            Chi tiết
                          </Link>
                          {item.checkin_status !== "checked_in" &&
                            ["pending", "approved"].includes(item.status) && (
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => cancel(item)}
                              >
                                Hủy đơn
                              </button>
                            )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!filtered.length && !loading && (
                  <EmptyState>Chưa có đơn đăng ký trong mục này.</EmptyState>
                )}
              </section>
              <section className="v-card-box">
                <div className="v-card-header">
                  <div>
                    <h2 className="v-card-title">
                      <i className="ri-compass-3-line" /> Hoạt Động Gợi Ý Cho
                      Bạn
                    </h2>
                    <div className="v-card-subtitle">
                      Dựa trên sở thích và hoạt động đã tham gia
                    </div>
                  </div>
                  <Link href="/activities" className="v-link-all">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="v-suggest-grid">
                  {recommended.map((item) => (
                    <article className="v-sug-card" key={item.id}>
                      <Link
                        href={`/activities/${item.slug || item.id}`}
                        className="v-sug-img-wrap"
                      >
                        <MediaImage
                          className="v-sug-img"
                          src={imageUrl(
                            item.banner_url || "/legacy/images/act-tree.jpg",
                          )}
                          alt={item.title}
                        />
                        <span className="v-sug-badge green">
                          {item.category}
                        </span>
                      </Link>
                      <div className="v-sug-body">
                        <h3 className="v-sug-title">{item.title}</h3>
                        <div className="v-sug-meta">
                          <span>
                            <i className="ri-calendar-line" />{" "}
                            {formatDate(item.event_date)}
                          </span>
                          <span>
                            <i className="ri-map-pin-line" /> {item.city}
                          </span>
                        </div>
                        <div className="v-sug-footer">
                          <span className="v-sug-slots">
                            {item.applied}/{item.capacity} người
                          </span>
                          <Link
                            href={`/activities/${item.slug || item.id}`}
                            className="btn btn-xs btn-outline"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <aside className="v-dash-side-col">
              <section className="v-profile-card">
                <div className="v-prof-header">
                  <MediaImage
                    src={imageUrl(profile?.avatar_url)}
                    alt={profile?.name || "Ảnh đại diện"}
                    className="v-prof-avatar"
                  />
                  <div className="v-prof-info">
                    <h3 className="v-prof-name">
                      {profile?.name || "Tình nguyện viên"}
                    </h3>
                    <p className="v-prof-email">{profile?.email}</p>
                    <span className="v-prof-role-badge">
                      <i className="ri-star-fill" /> Tình nguyện viên tích cực
                    </span>
                  </div>
                  <Link href="/profile" className="v-prof-edit-btn">
                    <i className="ri-edit-line" /> Chỉnh sửa
                  </Link>
                </div>
                <div className="v-prof-level-block">
                  <div className="v-prof-level-row">
                    <span className="v-prof-level-name">
                      Cấp bậc tình nguyện
                    </span>
                    <span className="v-prof-level-score">{score} giờ</span>
                  </div>
                  <div className="v-prof-level-bar">
                    <div
                      className="v-prof-level-fill"
                      style={{ width: `${Math.min(100, score * 2)}%` }}
                    />
                  </div>
                  <small>{score} giờ đóng góp đã được xác nhận</small>
                </div>
                <div className="v-prof-actions-grid">
                  {[
                    ["ri-user-3-line", "Hồ sơ", "/profile"],
                    ["ri-sparkling-line", "Kỹ năng", "/profile?tab=skills"],
                    ["ri-award-line", "Chứng nhận", "/certificates"],
                    ["ri-settings-3-line", "Cài đặt", "/profile?tab=settings"],
                  ].map(([icon, label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="v-prof-action-item"
                    >
                      <span className="v-prof-action-icon">
                        <i className={icon} />
                      </span>
                      <span className="v-prof-action-label">{label}</span>
                    </Link>
                  ))}
                </div>
              </section>
              <section className="v-profile-card">
                <div className="v-card-header">
                  <h3 className="v-card-title">
                    <i className="ri-calendar-line" /> Lịch Hoạt Động Của Tôi
                  </h3>
                  <div className="v-cal-nav-btns">
                    <button
                      className="v-cal-nav-btn"
                      aria-label="Tháng trước"
                      onClick={() =>
                        setCalendarMonth(
                          (current) =>
                            new Date(
                              current.getFullYear(),
                              current.getMonth() - 1,
                              1,
                            ),
                        )
                      }
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    <button
                      className="v-cal-nav-btn"
                      aria-label="Tháng sau"
                      onClick={() =>
                        setCalendarMonth(
                          (current) =>
                            new Date(
                              current.getFullYear(),
                              current.getMonth() + 1,
                              1,
                            ),
                        )
                      }
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>
                <div className="v-cal-header-row">
                  <span className="v-cal-month-title">
                    {calendarMonth.toLocaleDateString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <Link href="/schedule" className="v-link-all">
                    Xem lịch →
                  </Link>
                </div>
                <div className="v-cal-week-row">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="v-cal-days-grid">
                  {calendarDays.map((day, index) => {
                    const date = new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth(),
                      day,
                    );
                    const inMonth =
                      date.getMonth() === calendarMonth.getMonth();
                    const event =
                      inMonth &&
                      monthEvents.some(
                        (item) =>
                          new Date(`${item.event_date}T00:00:00`).getDate() ===
                          day,
                      );
                    return (
                      <span
                        key={index}
                        className={`v-cal-day${event ? " active-upcoming" : ""}${!inMonth ? " muted" : ""}`}
                      >
                        {inMonth ? day : ""}
                      </span>
                    );
                  })}
                </div>
                <div className="v-cal-legend">
                  <span className="v-cal-legend-item">
                    <i className="v-cal-dot teal" /> Sắp diễn ra
                  </span>
                  <span className="v-cal-legend-item">
                    <i className="v-cal-dot yellow" /> Chờ duyệt
                  </span>
                </div>
              </section>
              <section className="v-profile-card">
                <div className="v-card-header">
                  <h3 className="v-card-title">
                    <i className="ri-medal-line" /> Chứng Nhận Của Tôi
                  </h3>
                  <Link href="/certificates" className="v-link-all">
                    Xem tất cả →
                  </Link>
                </div>
                {activeCertificate ? (
                  <>
                    <div className="v-cert-frame">
                      <div className="v-cert-badge-type">
                        {activeCertificate.badge_type}
                      </div>
                      <h4 className="v-cert-name">{activeCertificate.title}</h4>
                      <div className="v-cert-meta">
                        {formatDate(activeCertificate.issue_date)} ·{" "}
                        <strong>
                          {activeCertificate.hours} giờ tình nguyện
                        </strong>
                      </div>
                      <div className="v-cert-actions">
                        <button
                          type="button"
                          className="btn btn-xs btn-primary"
                          onClick={() => {
                            void apiDownload(
                              `/certificates/${encodeURIComponent(activeCertificate.certificate_code)}/pdf`,
                              `${activeCertificate.certificate_code}.pdf`,
                            ).catch((error) => setMessage(error.message));
                          }}
                        >
                          <i className="ri-download-2-line" /> Tải PDF
                        </button>
                        <Link
                          href={`/certificates?code=${encodeURIComponent(activeCertificate.certificate_code)}`}
                          className="btn btn-xs btn-outline"
                          aria-label="Xem chứng nhận"
                        >
                          <i className="ri-eye-line" />
                        </Link>
                      </div>
                    </div>
                    <div className="v-cert-carousel-ctrl">
                      <button
                        type="button"
                        className="v-cal-nav-btn"
                        aria-label="Chứng nhận trước"
                        onClick={() =>
                          setCertificateIndex(
                            (index) =>
                              (index - 1 + certificates!.length) %
                              certificates!.length,
                          )
                        }
                      >
                        <i className="ri-arrow-left-s-line" />
                      </button>
                      <div className="v-cert-dots">
                        {certificates?.map((cert, index) => (
                          <button
                            type="button"
                            key={cert.id}
                            className={`v-cert-dot${certificateIndex === index ? " active" : ""}`}
                            aria-label={`Chứng nhận ${index + 1}`}
                            onClick={() => setCertificateIndex(index)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="v-cal-nav-btn"
                        aria-label="Chứng nhận kế tiếp"
                        onClick={() =>
                          setCertificateIndex(
                            (index) => (index + 1) % certificates!.length,
                          )
                        }
                      >
                        <i className="ri-arrow-right-s-line" />
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Chưa có chứng nhận.</p>
                )}
              </section>
              <section className="v-profile-card">
                <div className="v-card-header">
                  <h3 className="v-card-title">
                    <i className="ri-notification-3-line" /> Thông Báo Mới
                  </h3>
                  <Link href="/notifications" className="v-link-all">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="v-side-notif-list">
                  {notifications?.slice(0, 4).map((item) => (
                    <Link
                      href={item.link || "/notifications"}
                      key={item.id}
                      className="v-side-notif-item"
                    >
                      <span
                        className={`v-side-notif-icon ${item.type === "success" ? "green" : item.type === "warning" ? "red" : "blue"}`}
                      >
                        <i
                          className={
                            item.type === "success"
                              ? "ri-checkbox-circle-line"
                              : item.type === "warning"
                                ? "ri-time-line"
                                : "ri-notification-3-line"
                          }
                        />
                      </span>
                      <span className="v-side-notif-body">
                        <strong className="v-side-notif-title">
                          {item.title}
                        </strong>
                        <span className="v-side-notif-sub">
                          {item.description}
                        </span>
                        <small className="v-side-notif-time">
                          {formatDate(item.created_at)}
                        </small>
                      </span>
                    </Link>
                  ))}
                </div>
                {!notifications?.length && <p>Chưa có thông báo mới.</p>}
              </section>
            </aside>
          </div>
        </div>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
