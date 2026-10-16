"use client";
import { MediaImage } from "@/components/portal/MediaImage";
import Link from "next/link";
import { Profile, Application, Certificate, formatDate } from "./shared";
import { imageUrl } from "./VolunteerWorkspaceFrame";
import { ProfileDocuments } from "./ProfileDocuments";
type Props = {
  profile: Profile;
  applications: Application[];
  certificates: Certificate[];
  edit: () => void;
  skills: () => void;
};
export function ProfileOverview({
  profile,
  applications,
  certificates,
  edit,
  skills,
}: Props) {
  const completed = applications.filter(
    (item) => item.checkin_status === "checked_in",
  );
  const upcoming = applications
    .filter(
      (item) =>
        item.status === "approved" &&
        item.checkin_status !== "checked_in" &&
        item.event_date &&
        item.event_date >= new Date().toLocaleDateString("en-CA"),
    )
    .slice(0, 3);
  const points = profile.volunteer_points ?? 0,
    threshold = profile.next_rank_points || 200;
  return (
    <div className="profile-content-grid">
      <section className="profile-left-col">
        <div className="profile-kpi-grid profile-kpi-grid-four">
          {[
            [
              "ri-calendar-check-line",
              "green",
              completed.length.toString().padStart(2, "0"),
              "Hoạt động đã tham gia",
            ],
            [
              "ri-time-line",
              "blue",
              `${profile.verified_hours || 0} giờ`,
              "Thời gian đóng góp",
            ],
            [
              "ri-award-line",
              "amber",
              certificates.length.toString().padStart(2, "0"),
              "Chứng nhận đã nhận",
            ],
            ["ri-heart-3-line", "red", points, "Điểm thiện nguyện"],
          ].map(([icon, color, value, label]) => (
            <div className="profile-kpi-card" key={label}>
              <div className={`kpi-icon-bubble ${color}`}>
                <i className={String(icon)} />
              </div>
              <div className="kpi-text-box">
                <span className="kpi-stat-number">{value}</span>
                <span className="kpi-stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">
              <i className="ri-user-smile-line" /> Giới thiệu bản thân
            </h3>
            <button className="btn-box-action" onClick={edit}>
              <i className="ri-edit-line" /> Chỉnh sửa
            </button>
          </div>
          <p className="box-bio-desc">
            {profile.bio || "Chưa cập nhật giới thiệu."}
          </p>
          <div className="box-interest-tags-row">
            {profile.interests?.map((item, index) => (
              <span
                className={`interest-tag-pill ${["green", "blue", "orange", "pink", "purple"][index % 5]}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">
              <i className="ri-tools-line" /> Kỹ năng &amp; Thế mạnh
            </h3>
            <button className="btn-box-action" onClick={skills}>
              Chỉnh sửa
            </button>
          </div>
          <div className="box-skills-wrap">
            {profile.skills?.map((skill) => (
              <span className="skill-item-tag" key={skill}>
                {skill}
              </span>
            ))}
            <button className="btn-add-skill-tag" onClick={skills}>
              + Thêm kỹ năng
            </button>
          </div>
        </section>
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">
              <i className="ri-calendar-event-line" /> Hoạt động sắp tới
            </h3>
            <Link href="/schedule" className="btn-box-action">
              Xem tất cả →
            </Link>
          </div>
          <div className="profile-upcoming-grid">
            {upcoming.map((item) => (
              <Link
                className="profile-upcoming-card"
                key={item.id}
                href={`/activities/${item.slug || item.activity_id}`}
              >
                <MediaImage
                  src={imageUrl(
                    item.banner_url || "/legacy/images/act-tree.jpg",
                  )}
                  alt=""
                />
                <strong>{item.activity_title}</strong>
                <small>
                  {formatDate(item.event_date)} · {item.city}
                </small>
              </Link>
            ))}
          </div>
          {!upcoming.length && (
            <p className="profile-empty-inline">
              Chưa có hoạt động sắp tới đã được duyệt.
            </p>
          )}
        </section>
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">Hoạt động đã tham gia</h3>
            <Link
              className="btn-box-action"
              href="/volunteer/dashboard?section=applications"
            >
              Xem tất cả →
            </Link>
          </div>
          {completed.slice(0, 3).map((item) => (
            <div className="profile-recent-row" key={item.id}>
              <span>{item.activity_title}</span>
              <span>{item.verified_hours} giờ</span>
            </div>
          ))}
        </section>
      </section>
      <aside className="profile-right-col">
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">
              <i className="ri-award-line" /> Cấp bậc tình nguyện
            </h3>
          </div>
          <div className="profile-rank-header">
            <span className="profile-rank-medal">
              <i className="ri-medal-fill" />
            </span>
            <div>
              <strong>{profile.rank_title || "Tình nguyện viên mới"}</strong>
              <p>
                {points} / {threshold} điểm
              </p>
            </div>
          </div>
          <div className="portal-progress">
            <span
              style={{ width: `${Math.min(100, (points / threshold) * 100)}%` }}
            />
          </div>
          <small>
            Còn {Math.max(0, threshold - points)} điểm để lên cấp tiếp theo
          </small>
        </section>
        <section className="profile-box-card">
          <div className="box-card-header">
            <h3 className="box-card-title">
              <i className="ri-star-line" /> Thành tích
            </h3>
            <Link className="btn-box-action" href="/certificates">
              Xem tất cả →
            </Link>
          </div>
          {certificates.slice(0, 4).map((item) => (
            <div className="profile-recent-row" key={item.id}>
              <span>
                <strong>{item.title}</strong>
                <small>{formatDate(item.issue_date)}</small>
              </span>
              <span>{item.hours} giờ</span>
            </div>
          ))}
          {!certificates.length && (
            <p>Thành tích sẽ xuất hiện sau khi hoàn thành hoạt động.</p>
          )}
        </section>
        <ProfileDocuments />
      </aside>
    </div>
  );
}
