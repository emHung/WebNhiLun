"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VolunteerWorkspaceFrame, imageUrl } from "./VolunteerWorkspaceFrame";

import { ProfileOverview } from "./ProfileOverview";
import { apiRequest } from "@/lib/api";
import {
  Application,
  Certificate,
  EmptyState,
  PortalShell,
  Profile,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function ProfilePage() {
  const { data, error, loading, refresh } = useLoad<Profile>("/me/profile");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => {
    const tab = params.get("tab");
    if (
      tab &&
      ["overview", "info", "skills", "history", "certs", "settings"].includes(
        tab,
      )
    )
      setActiveTab(tab);
  }, [params]);
  const { data: applications } = useLoad<Application[]>("/me/applications");
  const { data: certificates } = useLoad<Certificate[]>("/me/certificates");
  useEffect(() => {
    if (data && !editing) {
      setName(data.name);
      setPhone(data.phone ?? "");
      setDob(data.dob?.slice(0, 10) ?? "");
      setCity(data.city ?? "");
      setBio(data.bio ?? "");
      setInterests((data.interests ?? []).join(", "));
      setSkills((data.skills ?? []).join(", "));
    }
  }, [data, editing]);
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      let avatar_url = data?.avatar_url;
      if (avatar) {
        const upload = new FormData();
        upload.append("file", avatar);
        const result = await apiRequest<{ url: string }>("/me/avatar", {
          method: "POST",
          body: upload,
        });
        avatar_url = result.url;
      }
      await apiRequest("/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          phone,
          dob: dob || null,
          city,
          bio,
          interests: interests
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          skills: skills
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          avatar_url,
        }),
      });
      setEditing(false);
      setAvatar(null);
      setMessage("Đã cập nhật hồ sơ.");
      refresh();
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Không thể cập nhật hồ sơ.",
      );
    }
  }
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame
        active={activeTab === "settings" ? "/profile?tab=settings" : "/profile"}
        profile={data}
      >
        <div className="profile-page-content">
          <StatusMessage error={error || undefined} loading={loading} />
          {message && (
            <div className="portal-message" role="status">
              {message}
            </div>
          )}
          {data && (
            <>
              <section className="profile-hero-card">
                <div
                  className="profile-cover-banner"
                  style={
                    data.cover_url
                      ? {
                          backgroundImage: `url(${JSON.stringify(imageUrl(data.cover_url))})`,
                        }
                      : undefined
                  }
                >
                  <div className="cover-quote-art">
                    “Một hành động nhỏ cũng có thể tạo nên thay đổi lớn.” ♡
                  </div>
                  <button
                    type="button"
                    className="btn-change-cover"
                    onClick={async () => {
                      const url = window.prompt(
                        "URL ảnh bìa",
                        data.cover_url || "",
                      );
                      if (url === null) return;
                      try {
                        await apiRequest("/me/profile", {
                          method: "PATCH",
                          body: JSON.stringify({ cover_url: url }),
                        });
                        refresh();
                      } catch (error) {
                        setMessage(
                          error instanceof Error
                            ? error.message
                            : "Không lưu được ảnh bìa.",
                        );
                      }
                    }}
                  >
                    <i className="ri-camera-line" /> Thay đổi ảnh bìa
                  </button>
                </div>
                <div className="profile-meta-bar">
                  <div className="profile-avatar-wrap">
                    {data.avatar_url ? (
                      <MediaImage
                        className="profile-avatar-img"
                        src={imageUrl(data.avatar_url)}
                        alt="Ảnh đại diện"
                      />
                    ) : (
                      <span className="profile-avatar-img profile-avatar-fallback">
                        {data.name.slice(0, 1)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="avatar-cam-badge"
                      aria-label="Đổi ảnh đại diện"
                      onClick={() => {
                        setActiveTab("info");
                        setEditing(true);
                      }}
                    >
                      <i className="ri-camera-fill" />
                    </button>
                  </div>
                  <div className="profile-info-content">
                    <div className="profile-name-row">
                      <h1 className="profile-user-fullname">{data.name}</h1>
                    </div>
                    <div className="profile-id-sub">
                      {data.role_title || data.role} • ID:{" "}
                      {data.legacy_id || data.id}
                    </div>
                    <div className="profile-contact-details">
                      <span className="profile-contact-item">
                        <i className="ri-mail-line" />
                        {data.email}
                      </span>
                      <span className="profile-contact-item">
                        <i className="ri-map-pin-line" />
                        {data.city || "Chưa cập nhật địa phương"}
                      </span>
                      {data.phone && (
                        <span className="profile-contact-item">
                          <i className="ri-phone-line" />
                          {data.phone}
                        </span>
                      )}
                      {data.dob && (
                        <span className="profile-contact-item">
                          <i className="ri-cake-2-line" />
                          {formatDate(data.dob)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-edit-profile-link"
                    onClick={() => {
                      setActiveTab("info");
                      setEditing(true);
                    }}
                  >
                    Chỉnh sửa hồ sơ →
                  </button>
                </div>
              </section>
              <div className="profile-nav-tabs-bar">
                {[
                  ["overview", "Tổng quan"],
                  ["info", "Thông tin cá nhân"],
                  ["skills", "Kỹ năng"],
                  ["history", "Lịch sử tham gia"],
                  ["certs", "Chứng nhận"],
                  ["settings", "Cài đặt"],
                ].map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    className={`profile-tab-button${activeTab === key ? " active" : ""}`}
                    onClick={() => {
                      setActiveTab(key);
                      if (key === "info" || key === "settings")
                        setEditing(true);
                      else setEditing(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="profile-tab-pane active">
                {activeTab === "overview" && (
                  <ProfileOverview
                    profile={data}
                    applications={applications ?? []}
                    certificates={certificates ?? []}
                    edit={() => {
                      setActiveTab("info");
                      setEditing(true);
                    }}
                    skills={() => {
                      setActiveTab("info");
                      setEditing(true);
                    }}
                  />
                )}
                {activeTab === "info" &&
                  (editing ? (
                    <form
                      className="profile-box-card profile-edit-card portal-form"
                      onSubmit={save}
                    >
                      <h2>Cập nhật thông tin cá nhân</h2>
                      <div className="portal-form-grid">
                        <label>
                          Họ và tên
                          <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            maxLength={150}
                          />
                        </label>
                        <label>
                          Email
                          <input value={data.email} disabled type="email" />
                        </label>
                        <label>
                          Số điện thoại
                          <input
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            maxLength={40}
                          />
                        </label>
                        <label>
                          Ngày sinh
                          <input
                            type="date"
                            value={dob}
                            onChange={(event) => setDob(event.target.value)}
                          />
                        </label>
                        <label>
                          Thành phố
                          <input
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            maxLength={120}
                          />
                        </label>
                        <label>
                          Kỹ năng, phân tách bằng dấu phẩy
                          <input
                            value={skills}
                            onChange={(event) => setSkills(event.target.value)}
                          />
                        </label>
                        <label>
                          Lĩnh vực quan tâm
                          <input
                            value={interests}
                            onChange={(event) =>
                              setInterests(event.target.value)
                            }
                            placeholder="Môi trường, Giáo dục..."
                          />
                        </label>
                        <label>
                          Ảnh đại diện
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) =>
                              setAvatar(event.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      </div>
                      <label>
                        Giới thiệu
                        <textarea
                          value={bio}
                          onChange={(event) => setBio(event.target.value)}
                          maxLength={5000}
                        />
                      </label>
                      <div className="portal-form-actions">
                        <button className="btn btn-primary">
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setEditing(false)}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <section className="profile-box-card">
                      <h2>Thông tin cá nhân</h2>
                      <div className="profile-info-list">
                        <p>
                          <strong>Email</strong>
                          <span>{data.email}</span>
                        </p>
                        <p>
                          <strong>Số điện thoại</strong>
                          <span>{data.phone || "Chưa cập nhật"}</span>
                        </p>
                        <p>
                          <strong>Ngày sinh</strong>
                          <span>
                            {data.dob ? formatDate(data.dob) : "Chưa cập nhật"}
                          </span>
                        </p>
                        <p>
                          <strong>Thành phố</strong>
                          <span>{data.city || "Chưa cập nhật"}</span>
                        </p>
                        <p>
                          <strong>Giới thiệu</strong>
                          <span>{data.bio || "Chưa cập nhật"}</span>
                        </p>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => setEditing(true)}
                      >
                        Chỉnh sửa thông tin
                      </button>
                    </section>
                  ))}
                {activeTab === "skills" && (
                  <section className="profile-box-card">
                    <h2>Kỹ năng &amp; lĩnh vực quan tâm</h2>
                    <div className="box-interest-tags-row">
                      {data.skills?.length
                        ? data.skills.map((skill) => (
                            <span
                              key={skill}
                              className="interest-tag-pill green"
                            >
                              {skill}
                            </span>
                          ))
                        : "Chưa cập nhật kỹ năng."}
                    </div>
                    <button
                      className="btn-box-action"
                      onClick={() => {
                        setActiveTab("info");
                        setEditing(true);
                      }}
                    >
                      Cập nhật kỹ năng
                    </button>
                  </section>
                )}
                {activeTab === "history" && (
                  <section className="profile-box-card">
                    <h2>Lịch sử tham gia</h2>
                    {applications?.length ? (
                      <div className="portal-table-wrap">
                        <table className="portal-table">
                          <thead>
                            <tr>
                              <th>Hoạt động</th>
                              <th>Ngày đăng ký</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.map((item) => (
                              <tr key={item.id}>
                                <td>{item.activity_title}</td>
                                <td>{formatDate(item.applied_at)}</td>
                                <td>{item.status_text || item.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <EmptyState>
                        Bạn chưa có đơn đăng ký hoạt động.
                      </EmptyState>
                    )}
                  </section>
                )}
                {activeTab === "certs" && (
                  <section className="profile-box-card">
                    <h2>Chứng nhận tình nguyện</h2>
                    {certificates?.length ? (
                      certificates.map((item) => (
                        <article className="profile-recent-row" key={item.id}>
                          <div>
                            <strong>{item.title}</strong>
                            <small>
                              {item.issuer} · {formatDate(item.issue_date)}
                            </small>
                          </div>
                          <span>{item.hours} giờ</span>
                        </article>
                      ))
                    ) : (
                      <EmptyState>Chưa có chứng nhận.</EmptyState>
                    )}
                  </section>
                )}
                {activeTab === "settings" && (
                  <section className="profile-box-card">
                    <h2>Cài đặt hồ sơ</h2>
                    <p>Quản lý thông tin và ảnh đại diện của bạn.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setActiveTab("info");
                        setEditing(true);
                      }}
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
