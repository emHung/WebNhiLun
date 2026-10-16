"use client";

import Link from "next/link";
import { Pagination, type PageResult } from "./Pagination";

import { useDebouncedValue } from "@/hooks/use-api-query";
import { useEffect, useState } from "react";

import { VolunteerWorkspaceFrame } from "./VolunteerWorkspaceFrame";

import { apiRequest } from "@/lib/api";
import {
  Notification,
  PortalShell,
  Profile,
  StatusMessage,
  useLoad,
} from "./shared";

export function NotificationsPage() {
  const { data: profile } = useLoad<Profile>("/me/profile");
  const [tab, setTab] = useState("all"),
    [message, setMessage] = useState(""),
    [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(query);
  const params = new URLSearchParams({
    page: String(page),
    limit: "12",
    search,
  });
  if (tab !== "all") params.set("unread", String(tab === "unread"));
  const { data, error, loading, refresh } = useLoad<
    PageResult<Notification> & { unread_total: number }
  >(`/notifications?${params}`);
  const visible = data?.items || [];
  useEffect(() => {
    setPage(1);
  }, [search, tab]);
  async function markOne(item: Notification) {
    try {
      await apiRequest(`/notifications/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ unread: false }),
      });
      refresh();
    } catch (reason) {
      setMessage(
        reason instanceof Error
          ? reason.message
          : "Không cập nhật được thông báo.",
      );
    }
  }
  async function markAll() {
    try {
      await apiRequest("/notifications/read-all", { method: "POST" });
      refresh();
      setMessage("Đã đánh dấu tất cả thông báo đã đọc.");
    } catch (reason) {
      setMessage(
        reason instanceof Error
          ? reason.message
          : "Không cập nhật được thông báo.",
      );
    }
  }
  const unread = data?.unread_total || 0;
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame
        active="/notifications"
        profile={profile}
        unreadCount={unread}
        searchPlaceholder="Tìm kiếm thông báo..."
        searchValue={query}
        onSearchChange={setQuery}
      >
        <div className="notification-page">
          <div className="notification-toolbar">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={markAll}
            >
              <i className="ri-check-double-line" /> Đánh dấu tất cả đã đọc
            </button>
          </div>
          <section className="notify-container-card">
            <div className="notify-heading">
              <div>
                <h1>
                  <i className="ri-notification-3-line" /> Thông Báo Của Bạn
                </h1>
                <span>{unread} thông báo mới chưa đọc</span>
              </div>
              <div className="notify-filter-tabs">
                {[
                  ["all", "Tất cả"],
                  ["unread", "Chưa đọc"],
                  ["read", "Đã đọc"],
                ].map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    className={tab === key ? "active" : ""}
                    onClick={() => setTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <StatusMessage error={error || undefined} loading={loading} />
            {message && (
              <div className="portal-message" role="status">
                {message}
              </div>
            )}
            <div className="notify-list">
              {visible.map((item) => (
                <article
                  className={`notify-item-card${item.unread ? " unread" : ""}`}
                  key={item.id}
                  onClick={() => item.unread && markOne(item)}
                >
                  <div
                    className={`notify-icon-circle ${item.type === "success" ? "success" : item.type === "warning" ? "warning" : "info"}`}
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
                  </div>
                  <div className="notify-body-text">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span className="notify-time-stamp">
                      <i className="ri-time-line" />{" "}
                      {new Date(item.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="notify-item-action">
                    {item.unread && <span className="notify-unread-dot" />}
                    {item.link ? (
                      <Link
                        href={item.link}
                        className={`btn btn-sm ${item.unread ? "btn-primary" : "btn-outline"}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item.unread) void markOne(item);
                        }}
                      >
                        Chi tiết
                      </Link>
                    ) : (
                      item.unread && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            void markOne(item);
                          }}
                        >
                          Đã đọc
                        </button>
                      )
                    )}
                  </div>
                </article>
              ))}
            </div>
            <Pagination
              page={page}
              total={data?.total || 0}
              limit={12}
              onChange={setPage}
              loading={loading}
            />
            {!loading && visible.length === 0 && (
              <div className="notify-empty">
                <i className="ri-inbox-archive-line" />
                <p>Không có thông báo nào phù hợp.</p>
              </div>
            )}
          </section>
        </div>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
