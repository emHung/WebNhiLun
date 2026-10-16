"use client";

import Link from "next/link";

import { useState } from "react";

import { VolunteerWorkspaceFrame } from "./VolunteerWorkspaceFrame";

import {
  Application,
  PortalShell,
  Profile,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function SchedulePage() {
  const { data, error, loading } =
    useLoad<(Application & { event_date?: string })[]>("/me/applications");
  const { data: profile } = useLoad<Profile>("/me/profile");
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [search, setSearch] = useState("");
  const scheduled = (data ?? [])
    .filter(
      (item) =>
        ["approved", "completed"].includes(item.status) && item.event_date,
    )
    .filter(
      (item) =>
        !search.trim() ||
        item.activity_title
          .toLocaleLowerCase("vi")
          .includes(search.trim().toLocaleLowerCase("vi")),
    )
    .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""));
  const offset = (month.getDay() + 6) % 7;
  const totalDays = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const dates = Array.from(
    { length: Math.ceil((offset + totalDays) / 7) * 7 },
    (_, index) => index - offset + 1,
  );
  const monthEvents = scheduled.filter((item) => {
    const date = new Date(`${item.event_date}T00:00:00`);
    return (
      date.getMonth() === month.getMonth() &&
      date.getFullYear() === month.getFullYear()
    );
  });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const selectedEvents = monthEvents.filter(
    (item) =>
      selectedDate === null ||
      new Date(`${item.event_date}T00:00:00`).getDate() === selectedDate,
  );
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame
        active="/schedule"
        profile={profile}
        searchPlaceholder="Tìm kiếm theo ngày, sự kiện..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <div className="schedule-page-content">
          <div className="schedule-header-controls">
            <div>
              <h1>
                <i className="ri-calendar-event-line" /> Lịch Hoạt Động Thiện
                Nguyện
              </h1>
              <p>
                Theo dõi các ca trực tình nguyện đã đăng ký và chuẩn bị tham
                gia.
              </p>
            </div>
            <div className="month-navigator-box">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() - 1,
                        1,
                      ),
                  );
                  setSelectedDate(null);
                }}
              >
                ← Tháng trước
              </button>
              <h2 className="current-month-label">
                {month.toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        1,
                      ),
                  );
                  setSelectedDate(null);
                }}
              >
                Tháng sau →
              </button>
            </div>
          </div>
          <StatusMessage error={error || undefined} loading={loading} />
          <div className="calendar-month-grid">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
              <div
                className="cal-header-day"
                key={day}
                style={
                  index === 5
                    ? { color: "#059669" }
                    : index === 6
                      ? { color: "#ef4444" }
                      : {}
                }
              >
                {day}
              </div>
            ))}
            {dates.map((day, index) => {
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const inMonth = date.getMonth() === month.getMonth();
              const event =
                inMonth &&
                monthEvents.some(
                  (item) =>
                    new Date(`${item.event_date}T00:00:00`).getDate() === day,
                );
              const today =
                inMonth && date.toDateString() === new Date().toDateString();
              return (
                <button
                  key={index}
                  type="button"
                  className={`cal-date-slot${event ? " has-event" : ""}${today ? " today" : ""}${!inMonth ? " outside" : ""}`}
                  onClick={() =>
                    inMonth &&
                    setSelectedDate((current) => (current === day ? null : day))
                  }
                  disabled={!inMonth}
                >
                  <span className="cal-date-num">
                    {inMonth ? day : ""}
                    {today ? " (Hôm nay)" : ""}
                  </span>
                  {event && (
                    <span className="cal-event-pill">
                      {
                        monthEvents.filter(
                          (item) =>
                            new Date(
                              `${item.event_date}T00:00:00`,
                            ).getDate() === day,
                        ).length
                      }{" "}
                      hoạt động
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <section className="shift-timeline-card">
            <h3>
              Chi tiết các ca trực trong tháng
              {selectedDate ? ` · ngày ${selectedDate}` : ""}
            </h3>
            {selectedEvents.length ? (
              selectedEvents.map((item) => (
                <article className="shift-item-row" key={item.id}>
                  <span className="shift-date-badge">
                    {formatDate(item.event_date)}
                  </span>
                  <div className="shift-event-info">
                    <strong>{item.activity_title}</strong>
                    <span>
                      {item.event_time || item.shift} ·{" "}
                      {item.city || item.location}
                    </span>
                  </div>
                  <Link
                    className="btn btn-sm btn-outline"
                    href={`/activities/${item.slug || item.activity_id}`}
                  >
                    Chi tiết
                  </Link>
                </article>
              ))
            ) : (
              <div className="schedule-empty">
                Không có ca trực nào trong{" "}
                {month.toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
                {selectedDate ? ` ngày ${selectedDate}` : ""}.
              </div>
            )}
          </section>
        </div>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
