"use client";
import { MediaImage } from "@/components/portal/MediaImage";

import Link from "next/link";

import {
  ActivityEditor,
  ActivityDescription,
  descriptionText,
} from "./ActivityEditor";
import { Fragment, FormEvent, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { apiRequest } from "@/lib/api";

import { Activity, PortalShell, formatDate, useLoad } from "./shared";

export function CreateActivityPage() {
  const [form, setForm] = useState({
    title: "",
    category: "Môi trường",
    event_date: "",
    event_time: "",
    deadline_date: "",
    city: "",
    location: "",
    capacity: 20,
    verified_hours: 4,
    short_description: "",
    description: "",
    requirements: "",
    items_to_bring: "",
    contact: "",
  });
  const [schedule, setSchedule] = useState([
    { time_frame: "07:30", content: "Tập trung và phổ biến hướng dẫn" },
  ]);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const params = useSearchParams();
  const { data: org } = useLoad<{ name: string }>("/organizer/organization");
  const { data: owner } = useLoad<{ id: string }>("/auth/me");
  const [draftId, setDraftId] = useState(params.get("draft") || "");
  const [requestKey, setRequestKey] = useState("");
  const [savedBanner, setSavedBanner] = useState("");
  const loadedDraft = useRef("");
  const draft = useLoad<
    Activity & {
      idempotency_key: string;
      draft_payload?: typeof form;
      status: string;
    }
  >(draftId ? `/organizer/activities/${encodeURIComponent(draftId)}` : null);
  useEffect(() => {
    setRequestKey(crypto.randomUUID());
  }, []);
  useEffect(() => {
    if (owner && !draftId) {
      const id = window.localStorage.getItem(`vh-draft-id:${owner.id}`);
      if (id) setDraftId(id);
    }
  }, [owner, draftId]);
  useEffect(() => {
    if (
      draft.data?.status === "draft" &&
      loadedDraft.current !== draft.data.id
    ) {
      loadedDraft.current = draft.data.id;
      const record = draft.data;
      setForm(
        (current) =>
          Object.fromEntries(
            Object.keys(current).map((key) => [
              key,
              record.draft_payload?.[key as keyof typeof form] ??
                record[key as keyof Activity],
            ]),
          ) as typeof form,
      );
      setSchedule(
        record.schedule?.map((item) => ({
          time_frame: item.time_frame,
          content: item.content,
        })) || [],
      );
      setRequestKey(record.idempotency_key);
      setSavedBanner(record.banner_url || "");
    }
  }, [draft.data]);
  const router = useRouter();

  useEffect(() => {
    if (!banner) {
      setBannerPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(banner);
    setBannerPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner]);
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function nextStep() {
    const required: Partial<Record<number, string[]>> = {
      1: [form.title],
      2: [form.event_date, form.event_time, form.city, form.location],
      3: [form.description],
    };
    if ((required[step] ?? []).some((value) => !value.trim())) {
      setMessage("Vui lòng điền các thông tin bắt buộc trước khi tiếp tục.");
      return;
    }
    setMessage("");
    setStep((current) => current + 1);
  }
  async function persist(publish: boolean) {
    const payload = {
      ...form,
      title: form.title || "Bản nháp hoạt động",
      event_date: form.event_date || new Date().toLocaleDateString("en-CA"),
      event_time: form.event_time || "Chưa cập nhật",
      city: form.city || "Chưa cập nhật",
      location: form.location || "Chưa cập nhật",
      capacity: Number(form.capacity),
      verified_hours: Number(form.verified_hours),
      deadline_date: form.deadline_date || null,
      draft_payload: form,
      publish,
      idempotency_key: requestKey,
      schedule: schedule.filter(
        (item) => item.time_frame.trim() && item.content.trim(),
      ),
    };
    const record = await apiRequest<Activity>(
      draftId ? `/organizer/activities/${draftId}` : "/organizer/activities",
      { method: draftId ? "PUT" : "POST", body: JSON.stringify(payload) },
    );
    setDraftId(record.id);
    if (owner)
      window.localStorage.setItem(`vh-draft-id:${owner.id}`, record.id);
    return record;
  }
  async function saveDraft() {
    setBusy(true);
    setMessage("");
    try {
      await persist(false);
      setMessage("Đã lưu bản nháp vào cơ sở dữ liệu.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không lưu được bản nháp.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (
        !form.title.trim() ||
        !form.event_date ||
        !form.event_time.trim() ||
        !form.city.trim() ||
        !form.location.trim() ||
        !descriptionText(form.description)
      )
        throw new Error("Vui lòng hoàn tất thông tin trước khi gửi duyệt.");
      if (form.deadline_date && form.deadline_date > form.event_date)
        throw new Error("Hạn đăng ký phải trước hoặc bằng ngày diễn ra.");
      const record = await persist(false);
      if (banner) {
        const upload = new FormData();
        upload.append("file", banner);
        await apiRequest(`/organizer/activities/${record.id}/banner`, {
          method: "POST",
          body: upload,
        });
        setBanner(null);
      }
      await apiRequest(`/organizer/activities/${record.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          publish: true,
          idempotency_key: requestKey,
          deadline_date: form.deadline_date || null,
          schedule: schedule.filter(
            (item) => item.time_frame.trim() && item.content.trim(),
          ),
        }),
      });
      if (owner) window.localStorage.removeItem(`vh-draft-id:${owner.id}`);
      router.push("/organizer/manage");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không gửi được hoạt động. Bản nháp đã lưu có thể tiếp tục.",
      );
    } finally {
      setBusy(false);
    }
  }
  const steps = [
    ["Thông tin cơ bản", "Nhập thông tin chung"],
    ["Lịch & Địa điểm", "Thời gian, địa điểm"],
    ["Chi tiết & Hạn chót", "Mô tả, yêu cầu"],
    ["Lịch trình & An toàn", "Kế hoạch & lưu ý"],
    ["Xem trước & Gửi", "Kiểm tra và gửi duyệt"],
  ];
  return (
    <PortalShell>
      <main className="organizer-create-page">
        <div className="organizer-container">
          <aside className="organizer-sidebar">
            <div className="org-badge-card">
              <div className="org-badge-icon">
                <i className="ri-leaf-line" />
              </div>
              <div>
                <div className="org-badge-title">Ban tổ chức</div>
                <div className="org-badge-name">Không gian tổ chức</div>
              </div>
            </div>
            <nav className="org-menu-card">
              <Link href="/organizer/manage" className="org-menu-link">
                <span className="org-menu-left">
                  <i className="ri-file-list-3-line" /> Quản lý hoạt động
                </span>
              </Link>
              <Link
                href="/organizer/create-event"
                className="org-sub-link active"
              >
                <span className="org-sub-circle-icon">+</span> Thêm hoạt động
              </Link>
              <Link href="/organizer/manage" className="org-sub-link">
                <i className="ri-inbox-line" /> Đơn đăng ký &amp; điểm danh
              </Link>
            </nav>
            <div className="org-promo-card">
              <MediaImage
                src="/legacy/images/sapling-soil.jpg"
                alt="Cùng lan tỏa giá trị"
                className="org-promo-img"
              />
              <p className="org-promo-text">
                Cùng lan tỏa giá trị tốt đẹp vì cộng đồng!
              </p>
              <Link href="/organizer/manage" className="org-promo-btn">
                Quản lý hoạt động →
              </Link>
            </div>
          </aside>
          <section className="organizer-main">
            <div className="org-hero-banner">
              <div className="org-hero-left">
                <div className="org-hero-pill">
                  <i className="ri-edit-line" /> Tạo hoạt động mới
                </div>
                <h1 className="org-hero-title-main">Lan tỏa yêu thương</h1>
                <h2 className="org-hero-title-sub">
                  Bắt đầu từ những hành động nhỏ
                </h2>
                <p className="org-hero-desc">
                  Tạo hoạt động tình nguyện để kết nối cộng đồng và góp phần
                  thay đổi cuộc sống tốt đẹp hơn.
                </p>
              </div>
              <div className="org-hero-right">
                <div className="org-hero-quote">
                  Cùng nhau
                  <br />
                  vì cộng đồng
                  <br />
                  bền vững ♡
                </div>
                <MediaImage
                  src="/legacy/images/home-hero-volunteer.jpg"
                  alt="Hoạt động tình nguyện"
                  className="org-hero-banner-img"
                />
              </div>
            </div>
            <nav
              className="org-stepper-bar"
              aria-label="Các bước tạo hoạt động"
            >
              {steps.map(([title, subtitle], index) => (
                <Fragment key={title}>
                  <button
                    type="button"
                    className={`org-step-node${step === index + 1 ? " active" : ""}${step > index + 1 ? " completed" : ""}`}
                    onClick={() => {
                      if (index + 1 <= step) setStep(index + 1);
                    }}
                  >
                    <span className="org-step-num">{index + 1}</span>
                    <span className="org-step-meta">
                      <span className="org-step-label">{title}</span>
                      <span className="org-step-sub">{subtitle}</span>
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <span className="org-step-divider" />
                  )}
                </Fragment>
              ))}
            </nav>
            {message && (
              <div className="portal-message" role="status">
                {message}
              </div>
            )}
            <form className="org-form-card" onSubmit={submit}>
              <div className="org-card-header">
                <div className="org-card-header-icon">
                  <i className="ri-leaf-line" />
                </div>
                <div>
                  <h2 className="org-card-header-title">
                    {steps[step - 1][0]}
                  </h2>
                  <p className="org-card-header-sub">
                    {steps[step - 1][1]} để tạo hoạt động phù hợp với cộng đồng.
                  </p>
                </div>
              </div>
              {step === 1 && (
                <div className="org-form-step">
                  <label className="org-form-label">
                    <span>
                      Tên hoạt động <span className="org-req-star">*</span>
                    </span>
                    <input
                      className="org-input"
                      required
                      minLength={3}
                      maxLength={100}
                      value={form.title}
                      onChange={(event) => set("title", event.target.value)}
                      placeholder="Ví dụ: Ngày hội trồng cây xanh"
                    />
                  </label>
                  <div className="org-form-group org-two-col">
                    <label className="org-form-label">
                      Lĩnh vực hoạt động
                      <select
                        className="org-select"
                        value={form.category}
                        onChange={(event) =>
                          set("category", event.target.value)
                        }
                      >
                        {[
                          "Môi trường",
                          "Giáo dục",
                          "Cộng đồng",
                          "Y tế",
                          "Động vật",
                          "Khác",
                        ].map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </label>
                    <label className="org-form-label">
                      Đơn vị tổ chức
                      <input
                        className="org-input"
                        value={org?.name || "Tổ chức của bạn"}
                        readOnly
                      />
                    </label>
                  </div>
                  <label className="org-form-label">
                    Ảnh đại diện &amp; banner
                    <input
                      className="org-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setBanner(event.target.files?.[0] ?? null)
                      }
                    />
                    <small>
                      Hỗ trợ JPG, PNG, WEBP (tối đa 10MB)
                      {banner ? ` · ${banner.name}` : ""}
                    </small>
                  </label>
                  <div className="org-form-group org-two-col">
                    <label className="org-form-label">
                      Số lượng tình nguyện viên
                      <input
                        className="org-input"
                        type="number"
                        min={1}
                        max={100000}
                        required
                        value={form.capacity}
                        onChange={(event) =>
                          set("capacity", Number(event.target.value))
                        }
                      />
                    </label>
                    <label className="org-form-label">
                      Số giờ xác nhận
                      <input
                        className="org-input"
                        type="number"
                        min={0}
                        max={1000}
                        required
                        value={form.verified_hours}
                        onChange={(event) =>
                          set("verified_hours", Number(event.target.value))
                        }
                      />
                    </label>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="org-form-step org-form-group org-two-col">
                  <label className="org-form-label">
                    Ngày diễn ra
                    <input
                      className="org-input"
                      type="date"
                      required
                      value={form.event_date}
                      onChange={(event) =>
                        set("event_date", event.target.value)
                      }
                    />
                  </label>
                  <label className="org-form-label">
                    Thời gian
                    <input
                      className="org-input"
                      required
                      placeholder="07:30 - 15:00"
                      value={form.event_time}
                      onChange={(event) =>
                        set("event_time", event.target.value)
                      }
                    />
                  </label>
                  <label className="org-form-label">
                    Tỉnh/thành
                    <input
                      className="org-input"
                      required
                      value={form.city}
                      onChange={(event) => set("city", event.target.value)}
                    />
                  </label>
                  <label className="org-form-label">
                    Địa điểm cụ thể
                    <input
                      className="org-input"
                      required
                      value={form.location}
                      onChange={(event) => set("location", event.target.value)}
                    />
                  </label>
                </div>
              )}
              {step === 3 && (
                <div className="org-form-step">
                  <label className="org-form-label">
                    Hạn đăng ký
                    <input
                      className="org-input"
                      type="date"
                      value={form.deadline_date}
                      onChange={(event) =>
                        set("deadline_date", event.target.value)
                      }
                    />
                  </label>
                  <label className="org-form-label">
                    Mô tả ngắn gọn
                    <input
                      className="org-input"
                      maxLength={255}
                      value={form.short_description}
                      onChange={(e) => set("short_description", e.target.value)}
                    />
                  </label>
                  <label className="org-form-label">
                    Nội dung chi tiết
                    <ActivityEditor
                      value={form.description}
                      onChange={(value) => set("description", value)}
                    />
                  </label>
                  <label className="org-form-label">
                    Yêu cầu tình nguyện viên
                    <textarea
                      className="org-input"
                      rows={3}
                      maxLength={10000}
                      value={form.requirements}
                      onChange={(event) =>
                        set("requirements", event.target.value)
                      }
                    />
                  </label>
                </div>
              )}
              {step === 4 && (
                <div className="org-form-step">
                  <label className="org-form-label">
                    Vật dụng cần chuẩn bị
                    <textarea
                      className="org-input"
                      rows={3}
                      maxLength={10000}
                      value={form.items_to_bring}
                      onChange={(event) =>
                        set("items_to_bring", event.target.value)
                      }
                    />
                  </label>
                  <label className="org-form-label">
                    Thông tin liên hệ
                    <input
                      className="org-input"
                      maxLength={500}
                      value={form.contact}
                      onChange={(event) => set("contact", event.target.value)}
                    />
                  </label>
                  <h3>Lịch trình</h3>
                  {schedule.map((item, index) => (
                    <div className="org-form-group org-two-col" key={index}>
                      <label className="org-form-label">
                        Thời gian
                        <input
                          className="org-input"
                          value={item.time_frame}
                          onChange={(event) =>
                            setSchedule((rows) =>
                              rows.map((row, i) =>
                                i === index
                                  ? { ...row, time_frame: event.target.value }
                                  : row,
                              ),
                            )
                          }
                        />
                      </label>
                      <label className="org-form-label">
                        Nội dung
                        <input
                          className="org-input"
                          value={item.content}
                          onChange={(event) =>
                            setSchedule((rows) =>
                              rows.map((row, i) =>
                                i === index
                                  ? { ...row, content: event.target.value }
                                  : row,
                              ),
                            )
                          }
                        />
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={schedule.length >= 30}
                    onClick={() =>
                      setSchedule((rows) => [
                        ...rows,
                        { time_frame: "", content: "" },
                      ])
                    }
                  >
                    + Thêm mốc lịch trình
                  </button>
                </div>
              )}
              {step === 5 && (
                <div className="org-form-step org-preview-card">
                  <h3>{form.title || "Tên hoạt động"}</h3>
                  <p>
                    <strong>{form.category}</strong> ·{" "}
                    {form.event_date || "Chưa chọn ngày"} ·{" "}
                    {form.event_time || "Chưa chọn giờ"}
                  </p>
                  <p>
                    {form.city}
                    {form.location ? ` · ${form.location}` : ""}
                  </p>
                  <ActivityDescription
                    value={form.description || "Chưa nhập mô tả hoạt động."}
                  />
                  <p>
                    {form.capacity} tình nguyện viên · {form.verified_hours} giờ
                    xác nhận
                  </p>
                  <p>Ảnh bìa: {banner?.name || "Chưa chọn"}</p>
                  <small>
                    Hoạt động sẽ được gửi quản trị viên xét duyệt trước khi công
                    khai.
                  </small>
                </div>
              )}
              <div className="portal-form-actions">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStep((current) => current - 1)}
                  >
                    Quay lại
                  </button>
                )}
                {step < 5 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Tiếp tục <i className="ri-arrow-right-line" />
                  </button>
                ) : (
                  <button className="btn btn-primary" disabled={busy}>
                    {busy ? "Đang gửi…" : "Gửi duyệt"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={busy || !requestKey}
                  onClick={saveDraft}
                >
                  <i className="ri-save-line" /> Lưu nháp
                </button>
                <Link className="btn btn-outline" href="/organizer/manage">
                  Hủy
                </Link>
              </div>
            </form>
          </section>
          <aside className="organizer-preview-col">
            <div className="org-preview-card">
              <MediaImage
                className="org-preview-image"
                src={
                  bannerPreview || savedBanner || "/legacy/images/act-tree.jpg"
                }
                alt="Ảnh xem trước hoạt động"
              />
              <div className="org-preview-content">
                <span className="org-preview-category">
                  {form.category || "Lĩnh vực hoạt động"}
                </span>
                <h3>{form.title || "Tên hoạt động"}</h3>
                <p>
                  <i className="ri-calendar-line" />{" "}
                  {form.event_date
                    ? formatDate(form.event_date)
                    : "Ngày tổ chức"}
                </p>
                <p>
                  <i className="ri-map-pin-line" /> {form.city || "Địa điểm"}
                  {form.location ? ` · ${form.location}` : ""}
                </p>
                <p>
                  <i className="ri-group-line" /> {form.capacity} người tham gia
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary org-preview-continue"
                disabled={step === 5}
                onClick={nextStep}
              >
                Tiếp tục <i className="ri-arrow-right-line" />
              </button>
              <Link
                href="/organizer/manage"
                className="btn btn-outline org-preview-manage"
              >
                Quản lý hoạt động
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </PortalShell>
  );
}
