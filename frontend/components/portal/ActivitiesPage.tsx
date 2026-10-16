"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";
import { imageUrl } from "@/lib/media";
import { Pagination } from "./Pagination";
import { descriptionText } from "@/lib/rich-text";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  Activity,
  PortalShell,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

import type { ActivityList } from "@/lib/api-types";

export function ActivitiesPage() {
  const params = useSearchParams();
  const [term, setTerm] = useState(params.get("search") || "");
  const [query, setQuery] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [time, setTime] = useState(params.get("time") || "");
  const [status, setStatus] = useState(params.get("status") || "");
  const [page, setPage] = useState(
    Math.max(
      1,
      Number.isSafeInteger(Number(params.get("page")))
        ? Number(params.get("page"))
        : 1,
    ),
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const queryString = new URLSearchParams({ page: String(page), limit: "12" });
  if (query) queryString.set("search", query);
  if (category) queryString.set("category", category);
  if (city) queryString.set("city", city);
  if (time) queryString.set("time", time);
  if (status) queryString.set("status", status);
  const encodedQuery = queryString.toString();
  useEffect(() => {
    window.history.replaceState(null, "", `/activities?${encodedQuery}`);
  }, [encodedQuery]);
  const previousFilters = useRef(
    JSON.stringify([query, category, city, time, status]),
  );
  useEffect(() => {
    const next = JSON.stringify([query, category, city, time, status]);
    if (previousFilters.current !== next) {
      previousFilters.current = next;
      setPage(1);
    }
  }, [query, category, city, time, status]);
  const { data, error, loading } = useLoad<ActivityList>(
    `/activities?${queryString.toString()}`,
  );
  const { data: filters } = useLoad<{
    cities: string[];
    categories: string[];
    statuses?: string[];
  }>("/activities/filters");
  const [message, setMessage] = useState("");
  async function favorite(activity: Activity) {
    try {
      await apiRequest(`/me/favorites`, {
        method: "POST",
        body: JSON.stringify({ activity_id: activity.id }),
      });
      setMessage("Đã lưu hoạt động vào danh sách yêu thích.");
    } catch (reason) {
      setMessage(
        reason instanceof Error
          ? reason.message
          : "Hãy đăng nhập để lưu hoạt động.",
      );
    }
  }
  function search(event: FormEvent) {
    event.preventDefault();
    setQuery(term.trim());
  }
  const categories = filters?.categories?.length
    ? filters.categories
    : ["Môi trường", "Giáo dục", "Y tế", "Cộng đồng", "Hỗ trợ thiên tai"];
  function resetFilters() {
    setCategory("");
    setCity("");
    setTerm("");
    setQuery("");
    setTime("");
    setStatus("");
    setPage(1);
  }
  function categoryClass(value: string) {
    return value.includes("Giáo dục")
      ? "edu"
      : value.includes("Y tế")
        ? "med"
        : value.includes("thiên tai")
          ? "relief"
          : value.includes("Cộng đồng")
            ? "comm"
            : "env";
  }
  function statusClass(value: string) {
    return value.includes("hoàn thành") || value.includes("kết thúc")
      ? "closed"
      : value.includes("Sắp")
        ? "upcoming"
        : value.includes("diễn ra")
          ? "ongoing"
          : "open";
  }
  return (
    <PortalShell>
      <main className="act-container">
        <section className="act-hero-banner-new">
          <div className="act-breadcrumb-new">
            <Link href="/">Trang chủ</Link>
            <span>›</span>
            <span style={{ color: "#059669", fontWeight: 700 }}>Hoạt động</span>
          </div>
          <div className="act-hero-top-flex">
            <div>
              <h1 className="act-hero-heading-main">Danh sách hoạt động</h1>
              <p className="act-hero-subtitle-main">
                Khám phá và tham gia các hoạt động thiện nguyện ý nghĩa trên
                khắp Việt Nam.
              </p>
            </div>
            <div className="act-hero-quote-side">
              <div className="act-cursive-quote">
                "Mỗi hành động nhỏ
                <br />
                đều tạo nên thay đổi lớn ♡"
              </div>
              <MediaImage
                src="/legacy/images/home-hero-volunteer.jpg"
                alt="Tình nguyện viên"
                className="act-hero-banner-photo"
              />
            </div>
          </div>
          <form className="act-embedded-search-wrap" onSubmit={search}>
            <div className="act-embedded-search-inner">
              <i className="ri-search-line" style={{ color: "#94a3b8" }} />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Nhập tìm kiếm hoạt động (tên, địa điểm, tổ chức...)"
                aria-label="Tìm hoạt động"
              />
            </div>
            <button type="submit" className="btn-embedded-search-submit">
              Tìm kiếm
            </button>
          </form>
        </section>
        <div
          className={`act-main-layout${mobileFilterOpen ? " act-filter-open" : ""}`}
        >
          <button
            type="button"
            className="act-filter-backdrop"
            aria-label="Đóng bộ lọc"
            onClick={() => setMobileFilterOpen(false)}
          />
          <aside className="act-filter-panel" aria-hidden={!mobileFilterOpen}>
            <div className="act-filter-panel-header">
              <h3 className="act-filter-panel-title">
                <i className="ri-filter-3-line" style={{ color: "#059669" }} />{" "}
                Bộ lọc nâng cao
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  className="act-filter-clear-link"
                  onClick={resetFilters}
                >
                  Xóa lọc
                </button>
                <button
                  type="button"
                  className="act-filter-close-btn"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Đóng"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>
            <div className="act-filter-group">
              <div className="act-filter-group-title">Lĩnh vực</div>
              <div className="act-filter-items-list">
                <label className="act-filter-label">
                  <input
                    type="radio"
                    name="activity-category"
                    checked={!category}
                    onChange={() => setCategory("")}
                  />
                  <span>Tất cả</span>
                </label>
                {categories.map((item) => (
                  <label className="act-filter-label" key={item}>
                    <input
                      type="radio"
                      name="activity-category"
                      checked={category === item}
                      onChange={() => setCategory(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="act-filter-group">
              <div className="act-filter-group-title">Địa điểm</div>
              <select
                className="act-filter-select-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">Tất cả tỉnh/thành</option>
                {(filters?.cities ?? []).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="act-filter-group">
              <div className="act-filter-group-title">Thời gian</div>
              <select
                className="act-filter-select-city"
                aria-label="Lọc thời gian"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Tất cả thời gian</option>
                <option value="7d">Trong 7 ngày tới</option>
                <option value="30d">Trong 30 ngày tới</option>
              </select>
            </div>
            <div className="act-filter-group">
              <div className="act-filter-group-title">Trạng thái</div>
              <div className="act-filter-items-list">
                <select
                  className="act-filter-select-city"
                  aria-label="Lọc trạng thái"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  {filters?.statuses?.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="act-filter-actions-bottom">
              <button
                type="button"
                className="btn-reset-filters-full"
                onClick={resetFilters}
              >
                <i className="ri-refresh-line" /> Đặt lại
              </button>
              <button
                type="button"
                className="btn-apply-filters-mobile"
                onClick={() => setMobileFilterOpen(false)}
              >
                Áp dụng lọc
              </button>
            </div>
          </aside>
          <section className="act-list-container">
            <div className="act-list-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  className="btn-mobile-filter-trigger"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <i className="ri-filter-3-line" />
                  <span>Bộ lọc</span>
                </button>
                <div className="act-total-count">
                  {data?.total ?? 0} hoạt động phù hợp
                </div>
              </div>
              <div className="act-list-controls-right">
                <div className="act-view-mode-toggle">
                  <button
                    type="button"
                    className={`act-view-btn${view === "grid" ? " active" : ""}`}
                    onClick={() => setView("grid")}
                    aria-label="Dạng lưới"
                  >
                    <i className="ri-grid-fill" />
                  </button>
                  <button
                    type="button"
                    className={`act-view-btn${view === "list" ? " active" : ""}`}
                    onClick={() => setView("list")}
                    aria-label="Dạng danh sách"
                  >
                    <i className="ri-list-check" />
                  </button>
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: ".76rem",
                    color: "#64748b",
                  }}
                >
                  Lĩnh vực:
                  <select
                    className="act-sort-select"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <StatusMessage error={error ?? undefined} loading={loading} />
            {message && (
              <div className="portal-message" role="status">
                {message}
              </div>
            )}
            <div
              id="actCardsListContainer"
              className={view === "grid" ? "grid-mode" : ""}
            >
              {data?.items.map((activity) => (
                <article className="act-card-horizontal" key={activity.id}>
                  <Link
                    href={`/activities/${activity.slug}`}
                    className="act-card-thumb-area"
                  >
                    <MediaImage
                      src={
                        imageUrl(activity.banner_url) ||
                        "/legacy/images/act-tree.jpg"
                      }
                      alt={activity.title}
                    />
                    <span
                      className={`badge-tag ${categoryClass(activity.category)}`}
                    >
                      {activity.category}
                    </span>
                  </Link>
                  <div className="act-card-content-area">
                    <div>
                      <div className="act-card-top-badges">
                        <span
                          className={`badge-tag ${categoryClass(activity.category)}`}
                        >
                          {activity.category}
                        </span>
                        <span
                          className={`badge-status ${statusClass(activity.status)}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                      <h3 className="act-card-title-main">
                        <Link href={`/activities/${activity.slug}`}>
                          {activity.title}
                        </Link>
                      </h3>
                      <p className="act-card-desc-snippet">
                        {descriptionText(activity.description)}
                      </p>
                      <div className="act-card-org-line">
                        <i className="ri-building-line" />{" "}
                        {activity.organizer_name}
                        {activity.organizer_verified && (
                          <i
                            className="ri-verified-badge-fill"
                            style={{ color: "#059669" }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="act-card-meta-flex">
                      <span className="act-card-meta-item">
                        <i className="ri-calendar-line" />{" "}
                        {formatDate(activity.event_date)} ·{" "}
                        {activity.event_time}
                      </span>
                      <span className="act-card-meta-item">
                        <i className="ri-map-pin-line" /> {activity.city}
                      </span>
                      <span className="act-card-meta-item">
                        <i className="ri-group-line" /> {activity.applied}/
                        {activity.capacity} người
                      </span>
                    </div>
                    <div className="act-progress-row">
                      <div className="act-progress-track">
                        <div
                          className="act-progress-fill"
                          style={{
                            width: `${Math.min(100, (activity.applied / Math.max(1, activity.capacity)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="act-progress-num">
                        {Math.round(
                          (activity.applied / Math.max(1, activity.capacity)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="act-card-actions-col">
                    <Link
                      className="btn-card-detail"
                      href={`/activities/${activity.slug}`}
                    >
                      Xem chi tiết
                    </Link>
                    <Link
                      className="btn-card-apply"
                      href={`/volunteer/apply/${activity.id}`}
                    >
                      Đăng ký ngay
                    </Link>
                    <button
                      type="button"
                      className="btn-card-detail"
                      onClick={() => favorite(activity)}
                    >
                      <i className="ri-heart-line" /> Lưu
                    </button>
                  </div>
                </article>
              ))}
              {!loading && !data?.items.length && (
                <div className="portal-empty">
                  Không tìm thấy hoạt động phù hợp. Thử thay đổi bộ lọc nhé.
                </div>
              )}
            </div>
          </section>
        </div>
        <Pagination
          page={page}
          total={data?.total || 0}
          limit={12}
          onChange={setPage}
          loading={loading}
        />
      </main>
    </PortalShell>
  );
}
