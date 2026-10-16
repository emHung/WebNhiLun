"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";
import { imageUrl } from "@/lib/media";

import { descriptionText } from "@/lib/rich-text";

import { FormEvent, useState } from "react";

import {
  EmptyState,
  PortalShell,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

import type { ActivityList, HomeMetrics } from "@/lib/api-types";

export function HomePage() {
  const { data: metrics } = useLoad<HomeMetrics>("/home/metrics");
  const { data, error, loading } = useLoad<ActivityList>(
    "/activities?page=1&limit=6&featured=true",
  );
  const { data: filters } = useLoad<{
    cities: string[];
    categories: string[];
    statuses?: string[];
  }>("/activities/filters");
  const featuredActivities = data?.items.slice(0, 4) ?? [];
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);

  function submitQuickSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (time) params.set("time", time);
    window.location.assign(
      `/activities${params.size ? `?${params.toString()}` : ""}`,
    );
  }

  return (
    <PortalShell>
      <div className="container">
        <section className="home-hero-wrap">
          <div className="home-hero-content">
            <div>
              <div className="hero-pill-badge">
                <i className="ri-leaf-line" />
                <span>Kết nối cộng đồng · Lan tỏa giá trị tốt đẹp</span>
              </div>
              <h1 className="home-hero-title">
                Cùng nhau
                <br />
                làm nên những điều
                <br />
                tốt đẹp hơn ♡
              </h1>
              <p className="home-hero-desc">
                Khám phá các hoạt động thiện nguyện, kết nối cộng đồng và tạo
                nên thay đổi tích cực cho xã hội.
              </p>
              <div className="home-hero-actions">
                <Link href="/activities" className="btn-hero-primary">
                  <span>Khám phá hoạt động</span>
                  <span>→</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="btn-hero-video"
                >
                  <span>▶</span>
                  <span>Xem video giới thiệu</span>
                </button>
              </div>
              <div className="hero-quote-art">
                “Một hành động nhỏ cũng có thể tạo nên thay đổi lớn.” ♡
              </div>
            </div>
            <div className="home-hero-visual">
              <MediaImage
                src="/legacy/images/home-hero-volunteer.jpg"
                alt="Tình nguyện viên trồng cây"
                className="hero-main-img"
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1200px) 550px, 100vw"
              />
              <div className="hero-social-proof-float">
                <div className="social-proof-title">
                  Đã có <span>{metrics?.volunteers ?? 0}</span> tình nguyện viên
                </div>
                <div className="social-avatars-row">
                  <div className="social-avatar-plus">+</div>
                </div>
                <div className="social-proof-sub">
                  Cùng tạo ra những thay đổi tích cực trong cộng đồng.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="home-stats-filter-bar">
          <div className="stats-three-counters">
            {[
              [
                "ri-calendar-check-line",
                "#2563eb",
                metrics?.activities ?? 0,
                "Hoạt động thiện nguyện",
              ],
              [
                "ri-team-line",
                "#059669",
                metrics?.volunteers ?? 0,
                "Tình nguyện viên",
              ],
              [
                "ri-map-pin-2-line",
                "#ea580c",
                metrics?.locations ?? 0,
                "Địa điểm",
              ],
            ].map(([icon, color, value, label]) => (
              <div className="stat-single-box" key={label}>
                <div className="stat-single-icon">
                  <i
                    className={String(icon)}
                    style={{ color: String(color), fontSize: "1.35rem" }}
                  />
                </div>
                <div>
                  <span className="stat-single-num">{value}</span>
                  <span className="stat-single-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <form className="quick-filter-form" onSubmit={submitQuickSearch}>
            <span className="quick-filter-title">
              <i className="ri-search-line" /> Bạn muốn tham gia hoạt động gì?
            </span>
            <select
              className="quick-select-control"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Lĩnh vực"
            >
              <option value="">Chọn lĩnh vực</option>
              {filters?.categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              className="quick-select-control"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              aria-label="Địa điểm"
            >
              <option value="">Chọn địa điểm</option>
              {filters?.cities.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              className="quick-select-control"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              aria-label="Thời gian"
            >
              <option value="">Chọn thời gian</option>
              <option value="7d">Trong 7 ngày tới</option>
              <option value="30d">Trong 30 ngày tới</option>
            </select>
            <button type="submit" className="btn-quick-search">
              <i className="ri-search-line" />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </section>
        <section style={{ marginBottom: 30 }}>
          <div className="section-header-row">
            <h2 className="section-main-title">
              <i className="ri-fire-fill" /> Hoạt động nổi bật
            </h2>
            <Link href="/activities" className="section-view-all-link">
              Xem tất cả hoạt động →
            </Link>
          </div>
          <StatusMessage error={error} loading={loading} />
          {!loading && !error && featuredActivities.length === 0 && (
            <EmptyState>
              Chưa có hoạt động nổi bật. Các hoạt động sẽ hiển thị tại đây khi
              có dữ liệu trên hệ thống.
            </EmptyState>
          )}
          <div className="featured-activities-grid">
            {featuredActivities.map((activity, index) => (
              <article className="featured-act-card" key={activity.id}>
                <div className="act-card-thumb-wrap">
                  <Link href={`/activities/${activity.slug}`}>
                    {activity.banner_url ? (
                      <MediaImage
                        src={imageUrl(activity.banner_url)}
                        alt={activity.title}
                        className="act-card-thumb-img"
                      />
                    ) : (
                      <div className="act-card-thumb-img" />
                    )}
                  </Link>
                  <span className="act-thumb-tag">
                    <i className="ri-leaf-line" /> {activity.category}
                  </span>
                  <span className="act-thumb-status">{activity.status}</span>
                </div>
                <div className="act-card-body">
                  <h3 className="act-card-name">
                    <Link href={`/activities/${activity.slug}`}>
                      {activity.title}
                    </Link>
                  </h3>
                  <p className="act-card-excerpt">
                    {descriptionText(activity.description)}
                  </p>
                  <div className="act-card-meta-line">
                    <span>
                      <i className="ri-calendar-line" />{" "}
                      {formatDate(activity.event_date)} ·{" "}
                      <i className="ri-map-pin-line" /> {activity.city}
                    </span>
                    <span>
                      <i className="ri-group-line" /> {activity.applied} /{" "}
                      {activity.capacity} người đã đăng ký
                    </span>
                  </div>
                  <Link
                    href={`/activities/${activity.slug}`}
                    className={`act-card-btn-action ${index % 2 === 0 ? "primary" : "outline"}`}
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </article>
            ))}
            <aside className="featured-join-promo-card">
              <div>
                <h3 className="join-promo-title">
                  Trở thành tình nguyện viên ngay hôm nay
                </h3>
                <ul className="join-promo-list">
                  <li>
                    <i className="ri-gift-line" /> Đóng góp cho cộng đồng
                  </li>
                  <li>
                    <i className="ri-time-line" /> Tích lũy giờ tình nguyện
                  </li>
                  <li>
                    <i className="ri-award-line" /> Nhận chứng nhận tham gia
                  </li>
                </ul>
              </div>
              <div className="join-promo-avatar-wrap">
                <MediaImage
                  src="/legacy/images/sapling-soil.jpg"
                  alt="Mầm non hy vọng"
                />
              </div>
              <Link href="/auth?mode=register" className="btn-join-promo">
                Tạo tài khoản miễn phí →
              </Link>
            </aside>
          </div>
        </section>
        <section style={{ marginBottom: 30 }}>
          <h2 className="section-main-title">
            <i className="ri-apps-2-line" /> Lĩnh vực hoạt động
          </h2>
          <div className="categories-card-grid">
            {(filters?.categories ?? []).map((name, index) => {
              const icons = [
                "ri-plant-line",
                "ri-book-open-line",
                "ri-hand-heart-line",
                "ri-heart-pulse-line",
                "ri-bear-smile-line",
                "ri-more-fill",
              ];
              return (
                <Link
                  key={name}
                  href={`/activities?category=${encodeURIComponent(name)}`}
                  className="category-item-card"
                >
                  <div className="category-icon-circle">
                    <i className={icons[index % icons.length]} />
                  </div>
                  <div className="category-text-box">
                    <strong>{name}</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="home-bottom-grid" id="stories">
          <div className="story-video-card">
            <div className="story-card-content">
              <h3>Những câu chuyện lan tỏa yêu thương</h3>
              <p>Cùng xem lại những khoảnh khắc ý nghĩa từ cộng đồng NhiLun</p>
              <Link href="/stories" className="btn btn-sm">
                Khám phá câu chuyện →
              </Link>
            </div>
          </div>
          <Link href="/stories" className="section-view-all-link">
            Xem câu chuyện cộng đồng →
          </Link>
        </section>
        {videoOpen && (
          <div
            role="presentation"
            onClick={() => setVideoOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.75)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Video giới thiệu NhiLun"
              onClick={(event) => event.stopPropagation()}
              style={{
                background: "#0f172a",
                borderRadius: 16,
                padding: 20,
                maxWidth: 650,
                width: "92%",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <h3 style={{ color: "#10b981", margin: 0 }}>
                  Video giới thiệu NhiLun
                </h3>
                <button
                  type="button"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Đóng video"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 10,
                }}
              >
                <iframe
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Video NhiLun"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
