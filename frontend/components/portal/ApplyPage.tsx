"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import {
  Application,
  PortalShell,
  Profile,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function ApplyPage({ activityId }: { activityId: string }) {
  const {
    data: activity,
    error,
    loading,
  } = useLoad<{
    id: string;
    title: string;
    event_date: string;
    location: string;
    capacity: number;
    applied: number;
  }>(`/activities/${encodeURIComponent(activityId)}`);
  const { data: profile } = useLoad<Profile>("/me/profile");
  const [step, setStep] = useState(1);
  const [shift, setShift] = useState(
    "Toàn thời gian (Cả ngày theo lịch trình)",
  );
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const router = useRouter();
  async function submit() {
    if (!activity) return;
    if (!agreed) {
      setMessage("Vui lòng xác nhận cam kết tham gia trước khi gửi đơn.");
      return;
    }
    setBusy(true);
    try {
      const result = await apiRequest<Application>(
        `/activities/${activity.id}/apply`,
        { method: "POST", body: JSON.stringify({ shift, experience, skills }) },
      );
      setMessage(`Đã gửi đơn thành công. Mã đơn: ${result.id}`);
      setStep(4);
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Không gửi được đơn.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <PortalShell>
      <main className="container">
        <div className="apply-container">
          <StatusMessage error={error || undefined} loading={loading} />
          {activity && (
            <>
              <section
                className="card"
                style={{
                  marginBottom: 10,
                  padding: "12px 16px",
                  borderLeft: "4px solid var(--brand-cta)",
                }}
              >
                <span
                  style={{ fontSize: ".74rem", color: "var(--text-secondary)" }}
                >
                  Bạn đang nộp đơn tham gia:
                </span>
                <h2
                  style={{
                    fontSize: "1.15rem",
                    margin: "4px 0 0",
                    color: "#0f172a",
                  }}
                >
                  {activity.title}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: ".8rem" }}>
                  {formatDate(activity.event_date)} · {activity.location} ·{" "}
                  {activity.applied}/{activity.capacity} người
                </p>
              </section>
              <div className="step-indicator">
                {(["Liên hệ", "Khảo sát", "Cam kết", "Xác nhận"] as const).map(
                  (label, index) => {
                    const number = index + 1;
                    return (
                      <div
                        key={label}
                        className={`step-node${step === number ? " active" : ""}${step > number ? " completed" : ""}`}
                      >
                        <div className="step-circle">
                          {step > number ? (
                            <i className="ri-check-line" />
                          ) : (
                            number
                          )}
                        </div>
                        <span className="step-label">{label}</span>
                      </div>
                    );
                  },
                )}
              </div>
              <section className="card">
                {step === 1 && (
                  <div className="step-pane active">
                    <h3>Bước 1: Thông tin cá nhân &amp; liên hệ</h3>
                    <p className="apply-step-description">
                      Thông tin dùng để liên hệ điều phối và xác nhận hoạt động
                      tình nguyện.
                    </p>
                    <div className="form-group">
                      <label className="form-label">Họ và tên *</label>
                      <input
                        className="form-control"
                        value={profile?.name ?? ""}
                        readOnly
                      />
                    </div>
                    <div className="apply-contact-grid">
                      <div className="form-group">
                        <label className="form-label">
                          Email nhận thông báo *
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          value={profile?.email ?? ""}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Số điện thoại *</label>
                        <input
                          className="form-control"
                          value={profile?.phone ?? ""}
                          readOnly
                        />
                      </div>
                    </div>
                    <p className="apply-profile-link">
                      <Link href="/profile">Cập nhật thông tin hồ sơ →</Link>
                    </p>
                    <div className="apply-step-actions end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setStep(2)}
                      >
                        Tiếp tục →
                      </button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="step-pane active">
                    <h3>Bước 2: Khảo sát phù hợp &amp; ca tham gia</h3>
                    <p className="apply-step-description">
                      Giúp Ban tổ chức phân công nhiệm vụ phù hợp nhất cho bạn.
                    </p>
                    <div className="form-group">
                      <label className="form-label">
                        Kinh nghiệm tham gia hoạt động
                      </label>
                      <textarea
                        className="form-control"
                        value={experience}
                        onChange={(event) => setExperience(event.target.value)}
                        maxLength={5000}
                        placeholder="Chia sẻ kinh nghiệm liên quan…"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Kỹ năng hoặc thế mạnh của bạn
                      </label>
                      <input
                        className="form-control"
                        value={skills}
                        onChange={(event) => setSkills(event.target.value)}
                        maxLength={5000}
                        placeholder="Ví dụ: sơ cấp cứu, hoạt náo, chụp ảnh…"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Chọn ca tham gia</label>
                      <select
                        className="form-control"
                        value={shift}
                        onChange={(event) => setShift(event.target.value)}
                      >
                        <option value="Toàn thời gian (Cả ngày theo lịch trình)">
                          Toàn thời gian (Cả ngày theo lịch trình)
                        </option>
                        <option value="Ca sáng (07:30 - 12:00)">
                          Ca sáng (07:30 - 12:00)
                        </option>
                        <option value="Ca chiều (13:00 - 17:00)">
                          Ca chiều (13:00 - 17:00)
                        </option>
                      </select>
                    </div>
                    <div className="apply-step-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setStep(1)}
                      >
                        ← Quay lại
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setStep(3)}
                      >
                        Tiếp tục →
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="step-pane active">
                    <h3>Bước 3: Cam kết an toàn &amp; chính sách hủy</h3>
                    <p className="apply-step-description">
                      Vui lòng đọc kỹ các quy định trước khi gửi đăng ký chính
                      thức.
                    </p>
                    <div className="apply-policy-box">
                      <strong>Chính sách tham gia NhiLun:</strong>
                      <br />
                      1. Có mặt đúng giờ và tuân thủ hướng dẫn của điều phối
                      viên.
                      <br />
                      2. Nếu không thể tham gia, vui lòng hủy đơn trước 24 giờ
                      để nhường chỗ cho người khác.
                      <br />
                      3. Giờ tình nguyện được xác nhận sau khi điểm danh thực tế
                      tại sự kiện.
                    </div>
                    <label className="apply-agreement">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(event) => setAgreed(event.target.checked)}
                      />
                      <span>
                        Tôi đã đọc, hiểu và cam kết tuân thủ các quy định nêu
                        trên.
                      </span>
                    </label>
                    <div className="apply-step-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setStep(2)}
                      >
                        ← Quay lại
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={busy || !agreed}
                        onClick={submit}
                      >
                        <i className="ri-send-plane-fill" />{" "}
                        {busy ? "Đang gửi…" : "Gửi đăng ký tham gia"}
                      </button>
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="step-pane active apply-success-pane">
                    <div className="apply-success-icon">
                      <i className="ri-checkbox-circle-fill" />
                    </div>
                    <h2>Đăng ký thành công!</h2>
                    <p>
                      {message ||
                        "Đơn tham gia của bạn đã được ghi nhận và chuyển đến Ban tổ chức."}
                    </p>
                    <div className="apply-step-actions center">
                      <Link
                        href="/volunteer/dashboard"
                        className="btn btn-primary"
                      >
                        <i className="ri-file-list-3-line" /> Xem trong đơn của
                        tôi
                      </Link>
                      <Link href="/activities" className="btn btn-outline">
                        Khám phá hoạt động khác
                      </Link>
                    </div>
                  </div>
                )}
                {message && step !== 4 && (
                  <div className="portal-message" role="alert">
                    {message}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </PortalShell>
  );
}
