"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  EmptyState,
  PageIntro,
  PortalShell,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";
import { Pagination, type PageResult } from "./Pagination";
import { Modal } from "./Modal";

export function AdminNavTabs({ current }: { current: "moderation" | "stories" | "themes" }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "1px solid var(--border-color, #e2e8f0)",
        paddingBottom: "14px",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/admin/moderation"
        className={`btn ${current === "moderation" ? "btn-primary" : "btn-outline"} btn-sm`}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
      >
        <i className="ri-shield-check-line" /> Kiểm duyệt & Nhật ký
      </Link>
      <Link
        href="/admin/stories"
        className={`btn ${current === "stories" ? "btn-primary" : "btn-outline"} btn-sm`}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
      >
        <i className="ri-book-read-line" /> Quản lý Câu chuyện
      </Link>
      <Link
        href="/admin/theme-settings"
        className={`btn ${current === "themes" ? "btn-primary" : "btn-outline"} btn-sm`}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
      >
        <i className="ri-palette-line" /> Bảng màu & Giao diện
      </Link>
    </div>
  );
}

type Organization = {
  id: string;
  name: string;
  representative: string;
  category: string;
  status: string;
  verified: boolean;
  registered_at: string;
  doc_url?: string;
};
type PendingActivity = {
  id: string;
  title: string;
  organizer_name: string;
  category: string;
  city: string;
  event_date: string;
  status: string;
};
type AuditLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  details?: string;
  created_at: string;
};
type Theme = {
  id: number;
  name: string;
  primary_color: string;
  cta_color: string;
  cta_hover_color?: string;
  surface_color: string;
  mode: string;
  meaning?: string;
  is_active: boolean;
};
type Metrics = {
  activities: number;
  applications: number;
  organizations: number;
  pending_activities: number;
};

export function AdminModerationPage() {
  const metrics = useLoad<Metrics>("/admin/metrics");
  const orgs = useLoad<Organization[]>("/admin/organizations?status=pending");
  const activities = useLoad<PendingActivity[]>("/admin/activities/pending");
  const logs = useLoad<AuditLog[]>("/admin/audit-logs?limit=100");
  const [message, setMessage] = useState("");
  async function decide(
    path: string,
    decision: "approve" | "reject",
    target: string,
  ) {
    const reason =
      decision === "reject"
        ? window.prompt(`Nhập lý do từ chối ${target}:`)
        : null;
    if (decision === "reject" && !reason?.trim()) return;
    try {
      await apiRequest(path, {
        method: "POST",
        body: JSON.stringify({ decision, reason }),
      });
      setMessage("Đã cập nhật trạng thái kiểm duyệt.");
      orgs.refresh();
      activities.refresh();
      logs.refresh();
      metrics.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không cập nhật được trạng thái.",
      );
    }
  }
  const error = metrics.error || orgs.error || activities.error || logs.error;
  const loading =
    metrics.loading || orgs.loading || activities.loading || logs.loading;
  return (
    <PortalShell>
      <div className="container">
        <PageIntro
          eyebrow="Quản trị hệ thống"
          title="Kiểm duyệt & nhật ký"
          description="Duyệt hồ sơ tổ chức, hoạt động công khai và theo dõi thao tác quản trị."
        />
        <AdminNavTabs current="moderation" />
        <StatusMessage error={error || undefined} loading={loading} />
        {message && (
          <div className="portal-message" role="status">
            {message}
          </div>
        )}
        <div className="portal-kpis">
          <div className="portal-kpi">
            <strong>{metrics.data?.activities ?? 0}</strong>Hoạt động
          </div>
          <div className="portal-kpi">
            <strong>{metrics.data?.applications ?? 0}</strong>Đơn đăng ký
          </div>
          <div className="portal-kpi">
            <strong>{metrics.data?.organizations ?? 0}</strong>Tổ chức
          </div>
          <div className="portal-kpi">
            <strong>{metrics.data?.pending_activities ?? 0}</strong>Hoạt động
            chờ duyệt
          </div>
        </div>
        <section className="portal-card">
          <h2>Hồ sơ tổ chức chờ duyệt</h2>
          {orgs.data?.length ? (
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Tổ chức</th>
                    <th>Đại diện</th>
                    <th>Lĩnh vực</th>
                    <th>Ngày đăng ký</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.data.map((org) => (
                    <tr key={org.id}>
                      <td>
                        <strong>{org.name}</strong>
                        <small style={{ display: "block" }}>{org.id}</small>
                      </td>
                      <td>{org.representative}</td>
                      <td>{org.category}</td>
                      <td>{formatDate(org.registered_at)}</td>
                      <td>
                        <div className="portal-form-actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              decide(
                                `/admin/organizations/${org.id}/review`,
                                "approve",
                                org.name,
                              )
                            }
                          >
                            Duyệt & cấp tích xanh
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              decide(
                                `/admin/organizations/${org.id}/review`,
                                "reject",
                                org.name,
                              )
                            }
                          >
                            Từ chối
                          </button>
                          {org.doc_url && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={async () => {
                                try {
                                  const signed = await apiRequest<{
                                    url: string;
                                  }>(
                                    `/admin/organizations/${org.id}/document-url`,
                                  );
                                  window.open(
                                    signed.url,
                                    "_blank",
                                    "noopener,noreferrer",
                                  );
                                } catch (error) {
                                  setMessage(
                                    error instanceof Error
                                      ? error.message
                                      : "Không mở được tài liệu.",
                                  );
                                }
                              }}
                            >
                              Xem hồ sơ
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <EmptyState>Không có hồ sơ tổ chức chờ duyệt.</EmptyState>
            )
          )}
        </section>
        <section className="portal-card" style={{ marginTop: 18 }}>
          <h2>Hoạt động chờ duyệt</h2>
          {activities.data?.length ? (
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Hoạt động</th>
                    <th>Đơn vị</th>
                    <th>Lĩnh vực</th>
                    <th>Ngày / địa điểm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.data.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <strong>{activity.title}</strong>
                        <small style={{ display: "block" }}>
                          {activity.id}
                        </small>
                      </td>
                      <td>{activity.organizer_name}</td>
                      <td>{activity.category}</td>
                      <td>
                        {formatDate(activity.event_date)} · {activity.city}
                      </td>
                      <td>
                        <div className="portal-form-actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              decide(
                                `/admin/activities/${activity.id}/review`,
                                "approve",
                                activity.title,
                              )
                            }
                          >
                            Duyệt công khai
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              decide(
                                `/admin/activities/${activity.id}/review`,
                                "reject",
                                activity.title,
                              )
                            }
                          >
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <EmptyState>Không có hoạt động chờ duyệt.</EmptyState>
          )}
        </section>
        <section className="portal-card" style={{ marginTop: 18 }}>
          <h2>Nhật ký kiểm toán</h2>
          {logs.data?.length ? (
            <div className="portal-table-wrap">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người thực hiện</th>
                    <th>Hành động</th>
                    <th>Đối tượng</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log) => (
                    <tr key={log.id}>
                      <td>
                        {new Date(log.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td>{log.actor}</td>
                      <td>{log.action}</td>
                      <td>{log.target}</td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <EmptyState>Chưa có nhật ký kiểm toán.</EmptyState>
          )}
        </section>
      </div>
    </PortalShell>
  );
}

const blankTheme = {
  name: "Bảng màu mới",
  primary_color: "#12304A",
  cta_color: "#087F78",
  cta_hover_color: "#066963",
  surface_color: "#E9F7F3",
  mode: "light",
  meaning: "",
};

export function ThemeSettingsPage() {
  const {
    data: themes,
    error,
    loading,
    refresh,
  } = useLoad<Theme[]>("/admin/themes");
  const [form, setForm] = useState(blankTheme);
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  async function save(event: FormEvent) {
    event.preventDefault();
    const path = editId ? `/admin/themes/${editId}` : "/admin/themes";
    try {
      await apiRequest(path, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setMessage("Đã lưu bảng màu.");
      setEditId(null);
      setForm(blankTheme);
      refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không lưu được bảng màu.",
      );
    }
  }
  async function activate(id: number) {
    try {
      await apiRequest(`/admin/themes/${id}/activate`, { method: "PUT" });
      setMessage("Đã áp dụng bảng màu toàn hệ thống.");
      window.dispatchEvent(new Event("volunteerhub-theme-change"));
      refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể áp dụng bảng màu.",
      );
    }
  }
  function edit(theme: Theme) {
    setEditId(theme.id);
    setForm({
      name: theme.name,
      primary_color: theme.primary_color,
      cta_color: theme.cta_color,
      cta_hover_color: theme.cta_hover_color || "#066963",
      surface_color: theme.surface_color,
      mode: theme.mode,
      meaning: theme.meaning || "",
    });
  }
  return (
    <PortalShell>
      <div className="container">
        <PageIntro
          eyebrow="Quản trị hệ thống"
          title="Bảng màu toàn trang"
          description="Tạo và áp dụng theme động cho toàn bộ giao diện."
        />
        <AdminNavTabs current="themes" />
        <StatusMessage error={error || undefined} loading={loading} />
        {message && (
          <div className="portal-message" role="status">
            {message}
          </div>
        )}
        <div className="portal-grid">
          {themes?.map((theme) => (
            <article className="portal-card" key={theme.id}>
              <div
                className="portal-theme-swatch"
                style={{ background: theme.surface_color }}
              >
                <span style={{ background: theme.primary_color }} />
                <span style={{ background: theme.cta_color }} />
                <span
                  style={{
                    background: theme.cta_hover_color || theme.cta_color,
                  }}
                />
              </div>
              <h3>
                {theme.name}{" "}
                {theme.is_active && (
                  <span className="badge badge-success">Đang dùng</span>
                )}
              </h3>
              <p>{theme.meaning}</p>
              <div className="portal-form-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => edit(theme)}
                >
                  Sửa
                </button>
                {!theme.is_active && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => activate(theme.id)}
                  >
                    Áp dụng
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <form
          className="portal-card portal-form"
          style={{ marginTop: 22 }}
          onSubmit={save}
        >
          <h2>{editId ? "Chỉnh sửa bảng màu" : "Tạo bảng màu"}</h2>
          <div className="portal-form-grid">
            <label>
              Tên
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((value) => ({ ...value, name: event.target.value }))
                }
                required
                maxLength={100}
              />
            </label>
            <label>
              Chế độ
              <select
                value={form.mode}
                onChange={(event) =>
                  setForm((value) => ({ ...value, mode: event.target.value }))
                }
              >
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </select>
            </label>
            {(
              [
                "primary_color",
                "cta_color",
                "cta_hover_color",
                "surface_color",
              ] as const
            ).map((key) => (
              <label key={key}>
                {key}
                <input
                  type="color"
                  value={form[key] || "#066963"}
                  onChange={(event) =>
                    setForm((value) => ({
                      ...value,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <label>
            Ý nghĩa
            <textarea
              value={form.meaning}
              onChange={(event) =>
                setForm((value) => ({ ...value, meaning: event.target.value }))
              }
              maxLength={1000}
            />
          </label>
          <div className="portal-form-actions">
            <button className="btn btn-primary">Lưu</button>
            {editId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditId(null);
                  setForm(blankTheme);
                }}
              >
                Hủy sửa
              </button>
            )}
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

type AdminStory = {
  id: string;
  user_id?: string;
  title: string;
  body: string;
  category: string;
  legacy_likes: number;
  likes: number;
  author_name?: string;
  author_email?: string;
  author_avatar?: string;
  created_at: string;
};

type StoryStats = {
  total_stories: number;
  total_likes: number;
  categories: { category: string; count: number }[];
};

export function AdminStoriesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Modals state
  const [viewStory, setViewStory] = useState<AdminStory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminStory | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    category,
    search,
  });

  const { data, loading, error, refresh } = useLoad<PageResult<AdminStory>>(
    `/admin/stories?${params.toString()}`
  );
  const { data: stats, refresh: refreshStats } = useLoad<StoryStats>(
    "/admin/stories/stats"
  );

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setSearch(query.trim());
    setPage(1);
  }

  function handleResetFilter() {
    setQuery("");
    setSearch("");
    setCategory("all");
    setPage(1);
  }

  async function handleDeleteStory(e: FormEvent) {
    e.preventDefault();
    if (!deleteTarget) return;
    setBusy(true);
    setMessage("");
    try {
      await apiRequest(`/admin/stories/${deleteTarget.id}`, {
        method: "DELETE",
        body: JSON.stringify({ reason: deleteReason.trim() }),
      });
      setMessage(`Đã xóa bài viết "${deleteTarget.title}" và lưu nhật ký thành công.`);
      setDeleteTarget(null);
      setDeleteReason("");
      refresh();
      refreshStats();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Không thể xóa bài viết.");
    } finally {
      setBusy(false);
    }
  }

  const categoryLabels: Record<string, string> = {
    all: "Tất cả",
    article: "Bài viết",
    image: "Hình ảnh",
    video: "Video",
    inspire: "Truyền cảm hứng",
  };

  return (
    <PortalShell>
      <div className="container">
        <PageIntro
          eyebrow="Quản trị hệ thống"
          title="Quản lý câu chuyện cộng đồng"
          description="Giám sát, kiểm duyệt và quản lý các bài viết, câu chuyện do cộng đồng và tình nguyện viên chia sẻ."
        />
        <AdminNavTabs current="stories" />
        {message && (
          <div className="portal-message" role="status" style={{ marginBottom: "16px" }}>
            {message}
          </div>
        )}
        <StatusMessage error={error || undefined} loading={loading} />

        {/* THỐNG KÊ NHANH */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "var(--surface-white, #fff)",
              border: "1px solid var(--border-default, #e2e8f0)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              <i className="ri-book-read-line" />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>
                Tổng câu chuyện
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                {stats?.total_stories ?? 0}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface-white, #fff)",
              border: "1px solid var(--border-default, #e2e8f0)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              <i className="ri-heart-3-line" />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>
                Tổng lượt yêu thích
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                {stats?.total_likes ?? 0}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface-white, #fff)",
              border: "1px solid var(--border-default, #e2e8f0)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              <i className="ri-pie-chart-line" />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>
                Thể loại hoạt động
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                {stats?.categories?.length ?? 0} nhóm
              </div>
            </div>
          </div>
        </div>

        {/* THANH TÌM KIẾM VÀ BỘ LỌC */}
        <section
          className="portal-card"
          style={{ padding: "16px 20px", marginBottom: "20px" }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flex: "1", minWidth: "260px", gap: "10px" }}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, tác giả, email, nội dung..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-default, #cbd5e1)",
                  fontSize: "0.85rem",
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="ri-search-line" /> Tìm
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)" }}>
                Thể loại:
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "7px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-default, #cbd5e1)",
                  fontSize: "0.85rem",
                  background: "var(--surface-white, #fff)",
                }}
              >
                <option value="all">Tất cả thể loại</option>
                <option value="article">Bài viết</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
                <option value="inspire">Truyền cảm hứng</option>
              </select>

              {(search || category !== "all") && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </form>
        </section>

        {/* DANH SÁCH BÀI VIẾT */}
        <section className="portal-card" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
              Danh sách bài viết ({data?.total ?? 0})
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)" }}>
              Trang {page} / {data?.pages || 1}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <i className="ri-loader-4-line ri-spin" style={{ fontSize: "1.8rem" }} />
              <p style={{ marginTop: "8px" }}>Đang tải danh sách câu chuyện...</p>
            </div>
          ) : !data?.items?.length ? (
            <EmptyState>
              Hiện chưa có bài viết nào phù hợp với bộ lọc tìm kiếm.
            </EmptyState>
          ) : (
            <div className="portal-table-wrap" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--border-default, #e2e8f0)",
                      textAlign: "left",
                      fontSize: "0.78rem",
                      color: "var(--text-secondary, #64748b)",
                      textTransform: "uppercase",
                    }}
                  >
                    <th style={{ padding: "12px 10px", width: "40%" }}>Câu chuyện</th>
                    <th style={{ padding: "12px 10px" }}>Thể loại</th>
                    <th style={{ padding: "12px 10px" }}>Tác giả</th>
                    <th style={{ padding: "12px 10px", textAlign: "center" }}>Lượt thích</th>
                    <th style={{ padding: "12px 10px" }}>Ngày đăng</th>
                    <th style={{ padding: "12px 10px", textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((story) => (
                    <tr
                      key={story.id}
                      style={{
                        borderBottom: "1px solid var(--border-default, #f1f5f9)",
                        fontSize: "0.86rem",
                      }}
                    >
                      <td style={{ padding: "12px 10px" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary, #0f172a)", marginBottom: "3px" }}>
                          {story.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.76rem",
                            color: "var(--text-secondary, #64748b)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.35,
                          }}
                        >
                          {story.body}
                        </div>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "999px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            background:
                              story.category === "video"
                                ? "#eff6ff"
                                : story.category === "inspire"
                                ? "#fdf2f8"
                                : "#f0fdf4",
                            color:
                              story.category === "video"
                                ? "#1d4ed8"
                                : story.category === "inspire"
                                ? "#be185d"
                                : "#15803d",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          {categoryLabels[story.category] || story.category}
                        </span>
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        <div style={{ fontWeight: 600 }}>
                          {story.author_name || "Ẩn danh"}
                        </div>
                        {story.author_email && (
                          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary, #64748b)" }}>
                            {story.author_email}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "12px 10px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#ef4444",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                          }}
                        >
                          <i className="ri-heart-fill" /> {story.likes || 0}
                        </span>
                      </td>

                      <td style={{ padding: "12px 10px", fontSize: "0.78rem", color: "#64748b" }}>
                        {formatDate(story.created_at)}
                      </td>

                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => setViewStory(story)}
                            className="btn btn-outline btn-sm"
                            title="Xem chi tiết"
                            style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                          >
                            <i className="ri-eye-line" /> Xem
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(story);
                              setDeleteReason("");
                            }}
                            className="btn btn-danger btn-sm"
                            title="Gỡ bỏ bài viết"
                            style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                          >
                            <i className="ri-delete-bin-line" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.pages > 1 && (
            <div style={{ marginTop: "20px" }}>
              <Pagination
                page={page}
                limit={10}
                total={data.total}
                onChange={setPage}
                loading={loading}
              />
            </div>
          )}
        </section>

        {/* MODAL XEM CHI TIẾT CÂU CHUYỆN */}
        {viewStory && (
          <Modal label="Chi tiết câu chuyện" onClose={() => setViewStory(null)}>
            <div style={{ padding: "10px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                  {viewStory.title}
                </h3>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "#ecfdf5",
                    color: "#059669",
                    flexShrink: 0,
                  }}
                >
                  {categoryLabels[viewStory.category] || viewStory.category}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary, #64748b)",
                  borderBottom: "1px solid var(--border-default, #e2e8f0)",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  <strong>Tác giả:</strong> {viewStory.author_name || "Ẩn danh"} {viewStory.author_email && `(${viewStory.author_email})`}
                </span>
                <span>
                  <strong>Ngày đăng:</strong> {formatDate(viewStory.created_at)}
                </span>
                <span>
                  <i className="ri-heart-fill" style={{ color: "#ef4444" }} /> {viewStory.likes || 0} lượt thích
                </span>
              </div>

              <div
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "var(--text-primary, #1e293b)",
                  whiteSpace: "pre-line",
                  maxHeight: "360px",
                  overflowY: "auto",
                  padding: "10px",
                  background: "var(--canvas, #f8fafc)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-default, #e2e8f0)",
                }}
              >
                {viewStory.body}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setViewStory(null)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setDeleteTarget(viewStory);
                    setViewStory(null);
                  }}
                >
                  <i className="ri-delete-bin-line" /> Gỡ bài này
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL XÁC NHẬN XÓA BÀI VIẾT */}
        {deleteTarget && (
          <Modal label="Xác nhận xóa câu chuyện" onClose={() => setDeleteTarget(null)}>
            <form onSubmit={handleDeleteStory} style={{ padding: "8px 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                  color: "#dc2626",
                }}
              >
                <i className="ri-error-warning-fill" style={{ fontSize: "1.8rem" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem" }}>
                    Xác nhận gỡ bỏ bài viết?
                  </h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                    Hành động này sẽ được ghi nhận vào Nhật ký hệ thống (Audit Logs).
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "16px",
                  fontSize: "0.85rem",
                }}
              >
                <strong>Tiêu đề bài viết:</strong> {deleteTarget.title}
                <br />
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Tác giả: {deleteTarget.author_name || "Ẩn danh"}
                </span>
              </div>

              <label style={{ display: "block", marginBottom: "16px" }}>
                <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                  Lý do gỡ bỏ (ghi vào Audit Log):
                </span>
                <textarea
                  required
                  placeholder="Nhập lý do xóa (ví dụ: Vi phạm tiêu chuẩn cộng đồng, nội dung phản cảm, quảng cáo spam...)"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={busy}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={busy}
                >
                  {busy ? "Đang xử lý..." : "Xác nhận gỡ bài"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </PortalShell>
  );
}

