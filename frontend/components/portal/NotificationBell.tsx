"use client";
import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useNotificationSummary } from "@/hooks/use-notifications";
export function NotificationBell({
  enabled = true,
  buttonClass = "vh-notif-bell-btn",
}: {
  enabled?: boolean;
  buttonClass?: string;
}) {
  const { data } = useNotificationSummary(enabled);
  const [open, setOpen] = useState(false),
    [error, setError] = useState("");
  async function markAll() {
    try {
      await apiRequest("/notifications/read-all", { method: "POST" });
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Không cập nhật được thông báo.",
      );
    }
  }
  return (
    <div className="vh-notif-wrapper">
      <button
        type="button"
        className={buttonClass}
        aria-label="Thông báo"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <i className="ri-notification-3-line" />
        {Boolean(data?.unread_total) && (
          <span className="vh-notif-badge-dot">{data?.unread_total}</span>
        )}
      </button>
      {open && (
        <div className="vh-notif-dropdown show">
          <div className="vh-notif-header">
            <strong>Thông báo mới</strong>
            <button
              type="button"
              className="vh-notif-header-mark-all"
              onClick={markAll}
              disabled={!data?.unread_total}
            >
              ✓ Đánh dấu đã đọc
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="vh-notif-list">
            {data?.items.map((item) => (
              <Link
                className={`vh-notif-item${item.unread ? " unread" : ""}`}
                href={item.link || "/notifications"}
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  if (item.unread)
                    void apiRequest(
                      `/notifications/${encodeURIComponent(item.id)}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({ unread: false }),
                      },
                    ).catch((e) => setError(e.message));
                }}
              >
                <span className={`vh-notif-item-icon ${item.type}`}>
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
                <span className="vh-notif-item-content">
                  <strong>{item.title}</strong>
                  <span className="vh-notif-item-desc">{item.description}</span>
                  <small>
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </small>
                </span>
              </Link>
            ))}
          </div>
          {!data?.items.length && (
            <p className="vh-notif-empty">
              {enabled
                ? "Bạn chưa có thông báo."
                : "Đăng nhập để xem thông báo."}
            </p>
          )}
          <div className="vh-notif-footer">
            <Link
              className="vh-notif-view-all-btn"
              href="/notifications"
              onClick={() => setOpen(false)}
            >
              Xem tất cả thông báo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
