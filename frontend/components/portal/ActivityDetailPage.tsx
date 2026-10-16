"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";

import { ActivityDescription } from "./ActivityEditor";
import { descriptionText } from "@/lib/rich-text";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  Activity,
  PortalShell,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function ActivityDetailPage({ identifier }: { identifier: string }) {
  const { data, error, loading } = useLoad<Activity>(
    `/activities/${encodeURIComponent(identifier)}`,
  );
  const [message, setMessage] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const gallery = [
    data?.banner_url || "/legacy/images/act-medical.jpg",
    "/legacy/images/act-tree.jpg",
    "/legacy/images/act-books.jpg",
    "/legacy/images/act-food.jpg",
    "/legacy/images/act-animal.jpg",
  ];
  async function saveFavorite() {
    if (!data) return;
    try {
      await apiRequest("/me/favorites", {
        method: "POST",
        body: JSON.stringify({ activity_id: data.id }),
      });
      setMessage("Đã lưu hoạt động yêu thích.");
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Vui lòng đăng nhập trước.",
      );
    }
  }
  async function shareActivity() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Đã sao chép liên kết hoạt động.");
    } catch {
      setMessage(window.location.href);
    }
  }
  function goToSection(section: string) {
    setActiveTab(section);
    document
      .getElementById(`tab-pane-${section}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const progress = data
    ? Math.min(
        100,
        Math.round((data.applied / Math.max(1, data.capacity)) * 100),
      )
    : 0;
  return (
    <PortalShell>
      <main className="container">
        <StatusMessage error={error ?? undefined} loading={loading} />
        {data && (
          <>
            <section className="detail-hero-banner">
              <div>
                <div className="detail-breadcrumb-row">
                  <Link href="/">Trang chủ</Link> &gt;{" "}
                  <Link href="/activities">Hoạt động</Link> &gt; {data.title}
                </div>
                <div className="detail-badges-row">
                  <span
                    className="badge"
                    style={{
                      background: "#e0f2fe",
                      color: "#0284c7",
                      fontWeight: 700,
                    }}
                  >
                    {data.category}
                  </span>
                  <span className="badge badge-success">{data.status}</span>
                  {data.organizer_verified && (
                    <span className="badge badge-mint">
                      <i className="ri-checkbox-circle-line" /> Đã xác minh
                    </span>
                  )}
                </div>
                <h1 className="detail-title-h1">{data.title}</h1>
                <p className="detail-sub-desc">
                  {descriptionText(data.description)}
                </p>
                <div className="detail-meta-icons-grid">
                  <div className="detail-meta-item">
                    <i
                      className="ri-calendar-line"
                      style={{ color: "#2563eb", fontSize: "1.2rem" }}
                    />
                    <div>
                      <strong>{formatDate(data.event_date)}</strong> (
                      {data.event_time})
                    </div>
                  </div>
                  <div className="detail-meta-item">
                    <i
                      className="ri-map-pin-line"
                      style={{ color: "#ea580c", fontSize: "1.2rem" }}
                    />
                    <div>
                      {data.location}, {data.city}
                    </div>
                  </div>
                  <div className="detail-meta-item">
                    <i
                      className="ri-group-line"
                      style={{ color: "#059669", fontSize: "1.2rem" }}
                    />
                    <div>
                      <strong>
                        {data.applied}/{data.capacity}
                      </strong>{" "}
                      Đã đăng ký
                    </div>
                  </div>
                  <div className="detail-meta-item">
                    <i
                      className="ri-time-line"
                      style={{ color: "#f59e0b", fontSize: "1.2rem" }}
                    />
                    <div>
                      <strong>{data.verified_hours}</strong> giờ tình nguyện
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-hero-visual-right">
                <div className="detail-quote-overlay">
                  “Lan tỏa yêu thương vì một cộng đồng tốt đẹp hơn ♡”
                </div>
                <MediaImage
                  src={gallery[0]}
                  alt={`Ảnh ${data.title}`}
                  className="detail-hero-main-img"
                />
                <div className="detail-gallery-strip">
                  {gallery.slice(1, 4).map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      onClick={() => setLightboxIndex(index + 1)}
                      aria-label={`Xem ảnh ${index + 1}`}
                    >
                      <MediaImage
                        src={image}
                        alt=""
                        className="gallery-strip-thumb"
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    className="gallery-more-badge"
                    onClick={() => setLightboxIndex(0)}
                  >
                    + Xem ảnh
                  </button>
                </div>
              </div>
            </section>
            <nav
              className="detail-nav-tabs-bar"
              aria-label="Nội dung hoạt động"
            >
              {[
                ["overview", "Thông tin"],
                ["schedule", "Lịch trình"],
                ["location", "Địa điểm"],
                ["requirements", "Yêu cầu & chuẩn bị"],
                ["organizer", "Đơn vị tổ chức"],
                ["images", "Hình ảnh"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`detail-tab-btn${activeTab === key ? " active" : ""}`}
                  onClick={() => goToSection(key)}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="detail-content-layout">
              <div className="detail-left-col">
                <section
                  id="tab-pane-overview"
                  className="card"
                  style={{ padding: 16 }}
                >
                  <h3>
                    <i
                      className="ri-file-text-line"
                      style={{ color: "#059669" }}
                    />{" "}
                    Giới thiệu hoạt động
                  </h3>
                  <ActivityDescription value={data.description} />
                </section>
                <section
                  id="tab-pane-schedule"
                  className="card"
                  style={{ padding: 20, borderRadius: 16 }}
                >
                  <h3>
                    <i
                      className="ri-calendar-todo-line"
                      style={{ color: "#059669" }}
                    />{" "}
                    Lịch trình chi tiết
                  </h3>
                  {data.schedule?.length ? (
                    <div className="detail-timeline-wrap">
                      {data.schedule.map((item) => (
                        <div
                          className="detail-timeline-step"
                          key={item.step_order}
                        >
                          <span className="timeline-time-badge">
                            {item.time_frame}
                          </span>
                          <div className="timeline-step-text">
                            {item.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="timeline-step-text">
                      Ban tổ chức sẽ cập nhật lịch trình.
                    </p>
                  )}
                </section>
                <section
                  id="tab-pane-location"
                  className="card"
                  style={{ padding: 16 }}
                >
                  <h3>
                    <i
                      className="ri-map-pin-user-line"
                      style={{ color: "#ea580c" }}
                    />{" "}
                    Địa điểm hoạt động
                  </h3>
                  <p>
                    {data.location}, {data.city}
                  </p>
                  <div className="map-preview-box">
                    <span>
                      <i className="ri-map-2-line" />{" "}
                      {data.location || data.city}
                    </span>
                    <a
                      className="btn btn-sm btn-outline"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${data.location} ${data.city}`)}`}
                    >
                      Xem trên Google Maps →
                    </a>
                  </div>
                </section>
                <section
                  id="tab-pane-requirements"
                  className="detail-two-cards-row"
                >
                  <article className="card" style={{ padding: 16 }}>
                    <h3>
                      <i
                        className="ri-shield-check-line"
                        style={{ color: "#059669" }}
                      />{" "}
                      Yêu cầu tham gia
                    </h3>
                    <ul className="checklist-items-list">
                      {(
                        data.requirements ||
                        "Có tinh thần trách nhiệm, đúng giờ và tuân thủ hướng dẫn của ban tổ chức."
                      )
                        .split("\n")
                        .filter(Boolean)
                        .map((item) => (
                          <li key={item}>
                            <i
                              className="ri-checkbox-circle-fill"
                              style={{ color: "#10b981" }}
                            />
                            {item}
                          </li>
                        ))}
                    </ul>
                  </article>
                  <article className="card" style={{ padding: 16 }}>
                    <h3>
                      <i
                        className="ri-shopping-bag-line"
                        style={{ color: "#2563eb" }}
                      />{" "}
                      Vật dụng cần chuẩn bị
                    </h3>
                    <ul className="checklist-items-list">
                      {(
                        data.items_to_bring ||
                        "Trang phục thoải mái, nước uống cá nhân và giấy tờ tùy thân."
                      )
                        .split("\n")
                        .filter(Boolean)
                        .map((item) => (
                          <li key={item}>
                            <i
                              className="ri-checkbox-circle-fill"
                              style={{ color: "#10b981" }}
                            />
                            {item}
                          </li>
                        ))}
                    </ul>
                  </article>
                </section>
                <section
                  id="tab-pane-organizer"
                  className="card"
                  style={{ padding: 16 }}
                >
                  <h3>
                    <i
                      className="ri-building-line"
                      style={{ color: "#0284c7" }}
                    />{" "}
                    Đơn vị tổ chức
                  </h3>
                  <strong>
                    {data.organizer_name}
                    {data.organizer_verified ? " · Đã xác thực" : ""}
                  </strong>
                  {data.contact && <p>Liên hệ: {data.contact}</p>}
                </section>
                <section
                  id="tab-pane-images"
                  className="card"
                  style={{ padding: 16 }}
                >
                  <h3>
                    <i className="ri-image-line" style={{ color: "#10b981" }} />{" "}
                    Thư viện hình ảnh thực tế
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(130px,1fr))",
                      gap: 10,
                    }}
                  >
                    {gallery.map((image, index) => (
                      <button
                        type="button"
                        key={image}
                        onClick={() => setLightboxIndex(index)}
                      >
                        <MediaImage
                          src={image}
                          alt={`${data.title} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="detail-action-card">
                <div className="action-card-header-badge">
                  <i className="ri-timer-line" />{" "}
                  {data.capacity > data.applied
                    ? `Còn ${data.capacity - data.applied} vị trí`
                    : "Đã đủ số lượng"}
                </div>
                <div className="action-progress-box">
                  <div className="action-progress-labels">
                    <span>Tiến độ nhận đơn</span>
                    <span style={{ color: "#10b981" }}>
                      {data.applied} / {data.capacity} người ({progress}%)
                    </span>
                  </div>
                  <div className="action-progress-bar">
                    <div
                      className="action-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <Link
                  href={`/volunteer/apply/${data.id}`}
                  className="btn-detail-main-apply"
                >
                  <span>Đăng Ký Tham Gia Ngay</span>
                  <span>→</span>
                </Link>
                <div className="action-sub-guarantee">
                  Miễn phí • Xác nhận tham gia qua điểm danh thực tế
                </div>
                <div className="action-info-rows-list">
                  <div className="action-info-single-row">
                    <i
                      className="ri-calendar-line"
                      style={{ color: "#2563eb" }}
                    />
                    <div>
                      <strong>Thời gian:</strong> {formatDate(data.event_date)}{" "}
                      ({data.event_time})
                    </div>
                  </div>
                  <div className="action-info-single-row">
                    <i
                      className="ri-map-pin-line"
                      style={{ color: "#ea580c" }}
                    />
                    <div>
                      <strong>Địa điểm:</strong> {data.city}
                    </div>
                  </div>
                  <div className="action-info-single-row">
                    <i
                      className="ri-price-tag-3-line"
                      style={{ color: "#10b981" }}
                    />
                    <div>
                      <strong>Lĩnh vực:</strong> {data.category}
                    </div>
                  </div>
                  <div className="action-info-single-row">
                    <i className="ri-time-line" style={{ color: "#059669" }} />
                    <div>
                      <strong>Giờ tình nguyện:</strong> +{data.verified_hours}{" "}
                      giờ
                    </div>
                  </div>
                </div>
                <div className="action-bottom-buttons-row">
                  <button
                    type="button"
                    className="btn-action-outline-half"
                    onClick={saveFavorite}
                  >
                    <i className="ri-heart-line" /> Lưu hoạt động
                  </button>
                  <button
                    type="button"
                    className="btn-action-outline-half"
                    onClick={shareActivity}
                  >
                    <i className="ri-share-line" /> Chia sẻ
                  </button>
                </div>
                {message && (
                  <p role="status" className="portal-message">
                    {message}
                  </p>
                )}
              </aside>
            </div>
            {lightboxIndex !== null && (
              <div
                className="vh-lightbox-overlay active"
                onClick={() => setLightboxIndex(null)}
              >
                <div
                  className="vh-lightbox-content"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="vh-lightbox-close"
                    onClick={() => setLightboxIndex(null)}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="vh-lightbox-nav vh-lightbox-prev"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex + gallery.length - 1) % gallery.length,
                      )
                    }
                  >
                    ‹
                  </button>
                  <MediaImage
                    className="vh-lightbox-img"
                    src={gallery[lightboxIndex]}
                    alt="Ảnh hoạt động"
                  />
                  <button
                    type="button"
                    className="vh-lightbox-nav vh-lightbox-next"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % gallery.length)
                    }
                  >
                    ›
                  </button>
                  <div className="vh-lightbox-counter">
                    Ảnh {lightboxIndex + 1} / {gallery.length}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </PortalShell>
  );
}
