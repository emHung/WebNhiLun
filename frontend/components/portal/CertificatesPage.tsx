"use client";

import Link from "next/link";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VolunteerWorkspaceFrame } from "./VolunteerWorkspaceFrame";
import { CertificateQr } from "./CertificateQr";

import { apiDownload, apiRequest } from "@/lib/api";
import {
  Certificate,
  EmptyState,
  PortalShell,
  Profile,
  StatusMessage,
  formatDate,
  useLoad,
} from "./shared";

export function CertificatesPage() {
  const { data, error, loading } = useLoad<Certificate[]>("/me/certificates");
  const { data: profile } = useLoad<Profile>("/me/profile");
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [search, setSearch] = useState(searchParams.get("code") ?? "");
  const [verified, setVerified] = useState<{
    valid: boolean;
    recipient_name: string;
    activity_title: string;
    issuer: string;
    hours: number;
    issue_date: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const visibleCertificates = (data ?? []).filter(
    (cert) =>
      !search.trim() ||
      `${cert.certificate_code} ${cert.issuer} ${cert.title}`
        .toLocaleLowerCase("vi")
        .includes(search.trim().toLocaleLowerCase("vi")),
  );
  async function copyCertificateLink(cert: Certificate) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/certificates/verify?code=${encodeURIComponent(cert.certificate_code)}`,
      );
      setCopyMessage("Đã sao chép liên kết xác thực.");
    } catch {
      setCopyMessage("Trình duyệt không cho phép sao chép liên kết.");
    }
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setVerified(null);
    try {
      setVerified(
        await apiRequest<{
          valid: boolean;
          recipient_name: string;
          activity_title: string;
          issuer: string;
          hours: number;
          issue_date: string;
        }>(`/certificates/verify/${encodeURIComponent(code.trim())}`),
      );
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Không tìm thấy chứng nhận.",
      );
    }
  }
  return (
    <PortalShell>
      <VolunteerWorkspaceFrame
        active="/certificates"
        profile={profile}
        searchPlaceholder="Tìm kiếm chứng nhận theo mã, đơn vị cấp, tên hoạt động..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <div className="certificates-page-content">
          <header className="cert-page-heading">
            <h1>
              <i className="ri-award-fill" /> Chứng Nhận &amp; Giấy Khen Điện Tử
            </h1>
            <p>
              Các chứng nhận có mã định danh số và mã QR tra cứu toàn quốc dành
              cho tình nguyện viên {profile?.name || "của bạn"}.
            </p>
          </header>
          <StatusMessage error={error || undefined} loading={loading} />
          {copyMessage && (
            <p className="cert-copy-message" role="status">
              {copyMessage}
            </p>
          )}
          {visibleCertificates.length ? (
            <div className="cert-gallery-grid">
              {visibleCertificates.map((cert, index) => (
                <article className="cert-card-item" key={cert.id}>
                  <div
                    className="cert-gold-header"
                    style={{
                      background:
                        index % 3 === 0
                          ? "linear-gradient(135deg,#0d9d74,#10b981)"
                          : index % 3 === 1
                            ? "linear-gradient(135deg,#b45309,#ea8500)"
                            : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    }}
                  >
                    <div className="cert-header-icon">
                      <i className="ri-award-line" />
                    </div>
                    <div className="cert-badge-type">Chứng nhận hoàn thành</div>
                    <h2 className="cert-main-title">{cert.title}</h2>
                  </div>
                  <div className="cert-body-content">
                    <div className="cert-meta-table">
                      <div>
                        <strong>Đơn vị cấp:</strong> {cert.issuer}
                      </div>
                      <div>
                        <strong>Mã định danh:</strong>{" "}
                        <code>{cert.certificate_code}</code>
                      </div>
                      <div>
                        <strong>Ngày cấp:</strong> {formatDate(cert.issue_date)}{" "}
                        <span>•</span> <strong>Giờ công nhận:</strong> +
                        {cert.hours} giờ
                      </div>
                    </div>
                    <div className="cert-qr-row">
                      <span className="cert-qr-box">
                        <CertificateQr code={cert.certificate_code} />
                      </span>
                      <span>
                        <strong>Xác thực điện tử</strong>
                        <small>
                          <i className="ri-checkbox-circle-line" />{" "}
                          {cert.qr_verified
                            ? "Hợp lệ trên cổng NhiLun"
                            : "Đang chờ xác thực"}
                        </small>
                      </span>
                    </div>
                    <div className="cert-footer-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          void apiDownload(
                            `/certificates/${encodeURIComponent(cert.certificate_code)}/pdf`,
                            `${cert.certificate_code}.pdf`,
                          ).catch((error) => setCopyMessage(error.message));
                        }}
                      >
                        Tải bản in / PDF
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => void copyCertificateLink(cert)}
                      >
                        Sao chép link
                      </button>
                      <Link
                        className="btn btn-outline btn-sm"
                        href={`/certificates/verify?code=${encodeURIComponent(cert.certificate_code)}`}
                        aria-label="Xác minh chứng nhận"
                      >
                        <i className="ri-eye-line" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !loading && (
              <EmptyState>
                {search
                  ? "Không tìm thấy chứng nhận phù hợp."
                  : "Chưa có chứng nhận được cấp."}
              </EmptyState>
            )
          )}
          <section className="cert-verify-section">
            <h2>Tra cứu chứng nhận</h2>
            <form className="portal-toolbar" onSubmit={verify}>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Nhập mã CERT-…"
                aria-label="Mã chứng nhận"
                required
              />
              <button className="btn btn-primary">Xác minh</button>
            </form>
            {message && (
              <div className="portal-message portal-error" role="status">
                {message}
              </div>
            )}
            {verified && (
              <div className="portal-message" role="status">
                <strong>
                  {verified.valid
                    ? "Chứng nhận hợp lệ"
                    : "Chứng nhận không hợp lệ"}
                </strong>
                <p>
                  {verified.recipient_name} · {verified.activity_title} ·{" "}
                  {verified.hours} giờ · {verified.issuer}
                </p>
              </div>
            )}
          </section>
        </div>
      </VolunteerWorkspaceFrame>
    </PortalShell>
  );
}
