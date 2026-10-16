"use client";

import Link from "next/link";
import { Pagination, type PageResult } from "./Pagination";
import { useDebouncedValue } from "@/hooks/use-api-query";

import { FormEvent, useEffect, useState } from "react";

import dynamic from "next/dynamic";
const CheckinDialog = dynamic(() =>
  import("./CheckinDialog").then((module) => module.CheckinDialog),
);
import { apiDownload, apiRequest } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  Application,
  EmptyState,
  PageIntro,
  PortalShell,
  StatusMessage,
  useLoad,
} from "./shared";

export function OrganizerManagePage() {
  const { data: organizationProfile } = useLoad<{ role: string }>("/auth/me");
  const {
    data: activities,
    error,
    loading,
    refresh,
  } = useLoad<Activity[]>(
    organizationProfile?.role === "organizer" ? "/organizer/activities" : null,
  );
  const { data: organization, refresh: refreshOrganization } = useLoad<{
    name: string;
    status: string;
    doc_url?: string | null;
  } | null>("/organizer/organization");
  const [activityId, setActivityId] = useState("");
  const [qrTarget, setQrTarget] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    representative: "",
    category: "",
    description: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [registering, setRegistering] = useState(false);
  useEffect(() => {
    document.body.classList.add("organizer-manage-layout");
    return () => document.body.classList.remove("organizer-manage-layout");
  }, []);
  useEffect(() => {
    const stored = window.localStorage.getItem(
      "volunteerhub.organization-registration-draft",
    );
    if (stored) {
      try {
        setOrganizationForm((current) => ({
          ...current,
          ...JSON.parse(stored),
        }));
      } catch {
        window.localStorage.removeItem(
          "volunteerhub.organization-registration-draft",
        );
      }
    } else {
      createClient()
        .auth.getUser()
        .then(({ data }) => {
          const draft =
            data.user?.user_metadata?.organization_registration_draft;
          if (draft && typeof draft === "object")
            setOrganizationForm((current) => ({ ...current, ...draft }));
        });
    }
  }, []);
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchTerm);
  const listParams = new URLSearchParams({
    page: String(page),
    limit: "20",
    search,
  });
  if (activityId) listParams.set("activity_id", activityId);
  if (statusFilter) listParams.set("status", statusFilter);
  const {
    data: applicantPage,
    refresh: refreshApplicants,
    loading: applicantsLoading,
    error: applicantsError,
  } = useLoad<
    PageResult<Application> & {
      stats: { total: number; approved: number; checked_in: number };
    }
  >(
    organizationProfile?.role === "organizer"
      ? `/organizer/applicants?${listParams}`
      : null,
  );
  useEffect(() => {
    setPage(1);
  }, [activityId, statusFilter, search]);
  async function registerOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistering(true);
    setMessage("");
    try {
      if (!documentFile)
        throw new Error("Vui lòng chọn giấy tờ xác minh tổ chức.");
      await apiRequest("/organizer/organization", {
        method: "POST",
        body: JSON.stringify(organizationForm),
      });
      const form = new FormData();
      form.append("file", documentFile);
      await apiRequest("/organizer/organization/documents", {
        method: "POST",
        body: form,
      });
      window.localStorage.removeItem(
        "volunteerhub.organization-registration-draft",
      );
      await createClient().auth.updateUser({
        data: { organization_registration_draft: null },
      });
      setMessage("Đã gửi hồ sơ tổ chức chờ quản trị viên duyệt.");
      window.location.assign("/organizer/manage");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không gửi được hồ sơ tổ chức.",
      );
    } finally {
      setRegistering(false);
    }
  }
  async function retryOrganizationDocument() {
    if (!documentFile) {
      setMessage("Vui lòng chọn giấy tờ xác minh tổ chức.");
      return;
    }
    setRegistering(true);
    try {
      const form = new FormData();
      form.append("file", documentFile);
      await apiRequest("/organizer/organization/documents", {
        method: "POST",
        body: form,
      });
      window.localStorage.removeItem(
        "volunteerhub.organization-registration-draft",
      );
      setDocumentFile(null);
      setMessage("Đã tải giấy tờ xác minh lên.");
      refreshOrganization();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không tải được giấy tờ.",
      );
    } finally {
      setRegistering(false);
    }
  }
  async function review(
    application: Application,
    decision: "approve" | "reject",
  ) {
    const reason =
      decision === "reject" ? window.prompt("Nhập lý do từ chối đơn:") : null;
    if (decision === "reject" && !reason?.trim()) return;
    try {
      await apiRequest(
        `/organizer/applications/${encodeURIComponent(application.id)}/review`,
        { method: "POST", body: JSON.stringify({ decision, reason }) },
      );
      setMessage("Đã cập nhật đơn ứng viên.");
      refresh();
      refreshApplicants();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không cập nhật được đơn.",
      );
    }
  }
  async function checkin(application: Application) {
    const checkedIn = application.checkin_status !== "checked_in";
    try {
      await apiRequest(
        `/organizer/applications/${encodeURIComponent(application.id)}/checkin?checked_in=${checkedIn}`,
        { method: "POST" },
      );
      setMessage(
        checkedIn ? "Đã điểm danh và cấp chứng nhận." : "Đã thu hồi điểm danh.",
      );
      refreshApplicants();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không cập nhật được điểm danh.",
      );
    }
  }
  async function exportCsv() {
    if (!activityId) return;
    try {
      await apiDownload(
        `/organizer/export-csv?activity_id=${encodeURIComponent(activityId)}`,
        `ung-vien-${activityId}.csv`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không xuất được CSV.",
      );
    }
  }
  const drafts = activities?.filter((item) => item.status === "draft") || [];
  const selected = activities?.find((item) => item.id === activityId);
  const rows = applicantPage?.items || [];
  return (
    <PortalShell>
      {qrTarget && (
        <CheckinDialog
          application={qrTarget}
          close={() => setQrTarget(null)}
          confirm={async (id) => {
            await apiRequest(
              `/organizer/applications/${encodeURIComponent(id)}/checkin`,
              { method: "POST" },
            );
            refreshApplicants();
            setMessage("Đã điểm danh và cấp chứng nhận.");
          }}
        />
      )}
      <div className="container organizer-manage-page">
        <PageIntro
          eyebrow="Ban tổ chức"
          title={`Ban Điều Phối — ${organization?.name || "Tổ chức của bạn"}`}
          description="Quản lý hồ sơ tình nguyện viên, xét duyệt chỉ tiêu, điểm danh và cấp chứng nhận tự động."
          action={
            <div className="organizer-manage-actions">
              <button
                className="btn btn-outline"
                disabled={!activityId}
                onClick={exportCsv}
              >
                <i className="ri-download-2-line" /> Xuất Báo Cáo CSV
              </button>
              <Link href="/organizer/create-event" className="btn btn-primary">
                <i className="ri-add-line" /> Tạo Hoạt Động Mới (Wizard)
              </Link>
            </div>
          }
        />
        <StatusMessage error={error || undefined} loading={loading} />
        {organization && organization.status !== "approved" && (
          <div className="portal-message" role="status">
            Hồ sơ tổ chức đang ở trạng thái: {organization.status}. Bạn có thể
            theo dõi tại đây trong khi chờ quản trị viên xét duyệt.
          </div>
        )}
        {!organization && !loading && (
          <form className="portal-form-card" onSubmit={registerOrganization}>
            <h2>Đăng ký tổ chức</h2>
            <p>Gửi thông tin và giấy tờ để quản trị viên xác minh tổ chức.</p>
            <div className="portal-form-grid">
              <label>
                Tên tổ chức
                <input
                  required
                  maxLength={200}
                  value={organizationForm.name}
                  onChange={(event) =>
                    setOrganizationForm({
                      ...organizationForm,
                      name: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Người đại diện
                <input
                  required
                  maxLength={150}
                  value={organizationForm.representative}
                  onChange={(event) =>
                    setOrganizationForm({
                      ...organizationForm,
                      representative: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Lĩnh vực
                <input
                  required
                  maxLength={120}
                  value={organizationForm.category}
                  onChange={(event) =>
                    setOrganizationForm({
                      ...organizationForm,
                      category: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Giấy tờ xác minh (PDF/JPG/PNG)
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(event) =>
                    setDocumentFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <label className="portal-form-wide">
                Giới thiệu
                <textarea
                  maxLength={5000}
                  value={organizationForm.description}
                  onChange={(event) =>
                    setOrganizationForm({
                      ...organizationForm,
                      description: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button className="btn btn-primary" disabled={registering}>
              {registering ? "Đang gửi..." : "Gửi hồ sơ"}
            </button>
          </form>
        )}
        {organization &&
          organization.status !== "approved" &&
          !organization.doc_url && (
            <section className="portal-form-card">
              <h2>Hoàn tất giấy tờ xác minh</h2>
              <label>
                Giấy tờ tổ chức (PDF/JPG/PNG)
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(event) =>
                    setDocumentFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={registering}
                onClick={retryOrganizationDocument}
              >
                {registering ? "Đang tải..." : "Tải giấy tờ lên"}
              </button>
            </section>
          )}
        {message && (
          <div className="portal-message" role="status">
            {message}
          </div>
        )}
        {drafts.length > 0 && (
          <section className="portal-card">
            <h2>Bản nháp của bạn</h2>
            {drafts.map((item) => (
              <Link
                className="profile-recent-row"
                key={item.id}
                href={`/organizer/create-event?draft=${encodeURIComponent(item.id)}`}
              >
                {item.title}
                <span>Tiếp tục chỉnh sửa →</span>
              </Link>
            ))}
          </section>
        )}
        <div className="portal-kpis">
          <div className="portal-kpi">
            <span>TỔNG HOẠT ĐỘNG</span>
            <strong>{activities?.length ?? 0}</strong>
            <small>Đang điều phối trên hệ thống</small>
          </div>
          <div className="portal-kpi">
            <span>TỔNG ĐƠN ĐĂNG KÝ</span>
            <strong>{applicantPage?.stats.total ?? 0}</strong>
            <small>Tình nguyện viên đã nộp</small>
          </div>
          <div className="portal-kpi">
            <span>ĐÃ PHÊ DUYỆT</span>
            <strong>{applicantPage?.stats.approved ?? 0}</strong>
            <small>Được nhận vào danh sách</small>
          </div>
          <div className="portal-kpi">
            <span>ĐIỂM DANH (+CERT)</span>
            <strong>{applicantPage?.stats.checked_in ?? 0}</strong>
            <small>Đã xác nhận tham gia</small>
          </div>
        </div>
        <div className="portal-toolbar organizer-applicant-filters">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên, email, hoạt động, mã đơn…"
            aria-label="Tìm đơn đăng ký"
          />
          <select
            value={activityId}
            onChange={(event) => setActivityId(event.target.value)}
            aria-label="Lọc hoạt động"
          >
            <option value="">Tất cả hoạt động</option>
            {activities?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Lọc trạng thái"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          {selected && (
            <span className="badge badge-mint">
              {selected.status} · {selected.applied}/{selected.capacity}
            </span>
          )}
          <button
            className="btn btn-outline"
            disabled={!activityId}
            onClick={exportCsv}
          >
            <i className="ri-download-line" /> Xuất CSV
          </button>
        </div>
        <StatusMessage error={applicantsError} loading={applicantsLoading} />
        {rows.length ? (
          <div className="portal-table-wrap">
            <h2 className="organizer-table-title">
              Danh Sách Tình Nguyện Viên Nộp Đơn
            </h2>
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Tình nguyện viên</th>
                  <th>Hoạt động tham gia</th>
                  <th>Ca trực</th>
                  <th>Trạng thái duyệt</th>
                  <th>Điểm danh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>
                      <strong>{item.user_name}</strong>
                      <small style={{ display: "block" }}>
                        {item.user_email}
                      </small>
                      <small>{item.user_phone}</small>
                    </td>
                    <td>{item.activity_title}</td>
                    <td>{item.shift || "—"}</td>
                    <td>{item.status_text || item.status}</td>
                    <td>
                      {item.checkin_status === "checked_in"
                        ? `Đã xác nhận · ${item.verified_hours} giờ`
                        : "Chưa điểm danh"}
                    </td>
                    <td>
                      <div className="portal-form-actions">
                        {item.status === "pending" && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => review(item, "approve")}
                            >
                              Duyệt
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => review(item, "reject")}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {item.status === "approved" &&
                          item.checkin_status !== "checked_in" && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setQrTarget(item)}
                            >
                              <i className="ri-qr-scan-line" /> QR
                            </button>
                          )}
                        {item.status === "approved" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => checkin(item)}
                          >
                            {item.checkin_status === "checked_in"
                              ? "Thu hồi"
                              : "Điểm danh"}
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
            <EmptyState>Chưa có đơn ứng viên cho hoạt động này.</EmptyState>
          )
        )}
        <Pagination
          page={page}
          total={applicantPage?.total || 0}
          limit={20}
          onChange={setPage}
          loading={applicantsLoading}
        />
      </div>
    </PortalShell>
  );
}
