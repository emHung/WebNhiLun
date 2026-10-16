"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  EmptyState,
  PageIntro,
  PortalShell,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

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
