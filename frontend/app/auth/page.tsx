"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api";

const demoRoles = [
  {
    key: "volunteer",
    title: "TNV",
    name: "Nguyễn Văn An",
    icon: "ri-user-heart-line",
    className: "tnv",
    destination: "/volunteer/dashboard",
  },
  {
    key: "organizer",
    title: "BTC",
    name: "Quỹ Xanh VN",
    icon: "ri-building-line",
    className: "btc",
    destination: "/organizer/manage",
  },
  {
    key: "admin",
    title: "Admin",
    name: "Quản trị",
    icon: "ri-shield-check-line",
    className: "admin",
    destination: "/admin/moderation",
  },
] as const;
const organizationDraftKey = "volunteerhub.organization-registration-draft";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("an.nguyen@email.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [name, setName] = useState("");
  const [accountRole, setAccountRole] = useState<"volunteer" | "organizer">(
    "volunteer",
  );
  const [organizationName, setOrganizationName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [organizationCategory, setOrganizationCategory] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [organizationDocument, setOrganizationDocument] = useState<File | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (searchParams.get("mode") === "register") setMode("register");
    if (searchParams.get("role") === "organizer") setAccountRole("organizer");
  }, [searchParams]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code)
      window.location.replace(
        `/auth/callback?code=${encodeURIComponent(code)}`,
      );
    if (searchParams.get("error"))
      setMessage(
        "Không hoàn tất được xác thực. Hãy thử đăng nhập lại hoặc yêu cầu email mới.",
      );
  }, [searchParams]);

  async function finishSignIn(
    accessToken: string,
    refreshToken: string,
    destination = "/dashboard",
  ) {
    const supabase = createClient();
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    router.replace(
      destination === "/dashboard"
        ? await destinationFromVerifiedProfile()
        : destination,
    );
    router.refresh();
  }

  async function destinationFromVerifiedProfile() {
    const profile = await apiRequest<{ role: string }>("/auth/me");
    const {
      data: { user },
    } = await createClient().auth.getUser();
    if (
      profile.role === "volunteer" &&
      user?.user_metadata?.organization_registration_draft
    )
      return "/organizer/manage?onboard=1";
    const returnTo = searchParams.get("returnTo");
    if (
      returnTo?.startsWith("/") &&
      !returnTo.startsWith("//") &&
      !returnTo.startsWith("/auth")
    )
      return returnTo;
    return profile.role === "admin"
      ? "/admin/moderation"
      : profile.role === "organizer"
        ? "/organizer/manage"
        : "/volunteer/dashboard";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      document.cookie = `vh-remember=${rememberSession ? "1" : "0"}; Path=/; SameSite=Lax${rememberSession ? "; Max-Age=31536000" : ""}`;
      const supabase = createClient();
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.replace(await destinationFromVerifiedProfile());
        router.refresh();
        return;
      }
      if (password !== confirmPassword)
        throw new Error("Mật khẩu xác nhận chưa khớp.");
      if (!termsAccepted)
        throw new Error("Vui lòng đồng ý với Quy tắc cộng đồng để tiếp tục.");
      if (
        mode === "register" &&
        accountRole === "organizer" &&
        (!organizationName.trim() ||
          !representative.trim() ||
          !organizationCategory.trim())
      ) {
        throw new Error("Vui lòng điền thông tin tổ chức.");
      }
      if (accountRole === "organizer") {
        window.localStorage.setItem(
          organizationDraftKey,
          JSON.stringify({
            name: organizationName.trim(),
            representative: representative.trim(),
            category: organizationCategory.trim(),
            description: organizationDescription.trim(),
          }),
        );
      }
      const organizationDraft =
        accountRole === "organizer"
          ? {
              name: organizationName.trim(),
              representative: representative.trim(),
              category: organizationCategory.trim(),
              description: organizationDescription.trim(),
            }
          : undefined;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: accountRole,
            ...(organizationDraft
              ? { organization_registration_draft: organizationDraft }
              : {}),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      if (accountRole === "organizer" && data.session) {
        if (!organizationDocument)
          throw new Error("Vui lòng chọn giấy tờ xác minh tổ chức.");
        const organization = await apiRequest<{ id: string }>(
          "/organizer/organization",
          {
            method: "POST",
            body: JSON.stringify({
              name: organizationName.trim(),
              representative: representative.trim(),
              category: organizationCategory.trim(),
              description: organizationDescription.trim() || null,
            }),
          },
        );
        const upload = new FormData();
        upload.append("file", organizationDocument!);
        await apiRequest("/organizer/organization/documents", {
          method: "POST",
          body: upload,
        });
        window.localStorage.removeItem(organizationDraftKey);
        await supabase.auth.updateUser({
          data: { organization_registration_draft: null },
        });
        router.replace("/organizer/manage");
        router.refresh();
        return;
      }
      if (accountRole === "organizer" && !data.session) {
        setMessage(
          "Tài khoản đã tạo. Hãy xác nhận email rồi đăng nhập. Thông tin tổ chức đã được lưu; bạn cần chọn lại tệp giấy tờ để gửi hồ sơ.",
        );
        return;
      }
      setMessage(
        "Tạo tài khoản thành công. Hãy kiểm tra email để xác nhận tài khoản. Sau đó đăng nhập để hoàn tất hồ sơ.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể hoàn tất yêu cầu.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function quickLogin(role: (typeof demoRoles)[number]) {
    setBusy(true);
    setMessage("");
    try {
      const apiBase = "";
      const response = await fetch(
        `${apiBase}/api/v1/auth/demo-login/${role.key}`,
        { method: "POST" },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.error?.message ??
            result?.detail ??
            `Không thể đăng nhập demo (HTTP ${response.status}). Vui lòng kiểm tra kết nối máy chủ.`,
        );
      const session = result?.data;
      await finishSignIn(
        session.access_token,
        session.refresh_token,
        role.destination,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập tài khoản demo.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset`,
        },
      );
      if (error) throw error;
      setMessage("Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không gửi được email khôi phục mật khẩu.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <header className="auth-top-nav">
        <a href="/" className="nav-brand">
          <strong>NhiLun</strong>
          <span className="logo-badge">Xác thực tài khoản</span>
        </a>
        <ul className="auth-nav-links">
          <li>
            <a href="/">Trang chủ</a>
          </li>
          <li>
            <a href="/activities">Hoạt động</a>
          </li>
          <li>
            <a href="/stories">Stories</a>
          </li>
          <li>
            <a href="/about">Giới thiệu</a>
          </li>
        </ul>
      </header>
      <div className="ambient-top-quote" aria-hidden="true">
        <span className="quote-mark">“</span>
        <span>Một hành động nhỏ cũng có thể tạo nên thay đổi lớn.</span>
        <span className="quote-heart">♡</span>
      </div>
      <div className="auth-brand-banner">
        <div className="brand-icon-leaf-heart">
          <i className="ri-heart-pulse-fill" />
        </div>
        <h1 className="auth-brand-name">
          Volunteer <span>Hub</span>
        </h1>
        <p className="auth-brand-slogan">Kết nối trái tim, lan tỏa hành động</p>
      </div>
      <main
        className={`auth-glass-card${mode === "register" ? " register-mode" : ""}`}
      >
        <section className="demo-accounts-ribbon">
          <div className="demo-ribbon-header">
            <span className="demo-ribbon-title">
              <i className="ri-flashlight-line" /> Đăng nhập nhanh 1 chạm
              (Demo):
            </span>
            <span className="demo-ribbon-pwd">Tài khoản Supabase Auth</span>
          </div>
          <div className="demo-quick-buttons-row">
            {demoRoles.map((role) => (
              <button
                key={role.key}
                type="button"
                className="demo-quick-card-btn"
                onClick={() => quickLogin(role)}
                disabled={busy}
              >
                <div className={`demo-avatar-circle ${role.className}`}>
                  <i className={role.icon} />
                </div>
                <div className="demo-btn-text">
                  <strong>{role.title}</strong>
                  <span>{role.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
        <div className="auth-nav-tabs">
          <button
            type="button"
            className={`auth-nav-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            <i className="ri-user-line" /> Đăng Nhập
          </button>
          <button
            type="button"
            className={`auth-nav-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            <i className="ri-user-add-line" /> Đăng Ký Mới
          </button>
        </div>
        <section className="auth-pane active">
          <form onSubmit={submit}>
            {mode === "register" && (
              <>
                <label className="auth-field-label">
                  Chọn vai trò của bạn *
                </label>
                <div className="role-selection-grid">
                  <button
                    type="button"
                    className={`role-select-card${accountRole === "volunteer" ? " selected" : ""}`}
                    onClick={() => setAccountRole("volunteer")}
                  >
                    <span className="role-check-badge">
                      <i className="ri-check-line" />
                    </span>
                    <span className="role-card-avatar volunteer">
                      <i className="ri-user-heart-line" />
                    </span>
                    <span className="role-card-body">
                      <strong>Tình nguyện viên</strong>
                      <p>
                        Tìm kiếm chiến dịch, tích lũy giờ và nhận chứng nhận.
                      </p>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`role-select-card${accountRole === "organizer" ? " selected" : ""}`}
                    onClick={() => setAccountRole("organizer")}
                  >
                    <span className="role-check-badge">
                      <i className="ri-check-line" />
                    </span>
                    <span className="role-card-avatar organizer">
                      <i className="ri-building-line" />
                    </span>
                    <span className="role-card-body">
                      <strong>Ban tổ chức / CLB</strong>
                      <p>Tạo hoạt động, duyệt đơn và quét QR điểm danh.</p>
                    </span>
                  </button>
                </div>
                <div className="auth-form-group">
                  <label className="auth-field-label" htmlFor="signupName">
                    Họ và tên
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon-left">
                      <i className="ri-user-line" />
                    </span>
                    <input
                      id="signupName"
                      className="auth-input"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={120}
                    />
                  </div>
                </div>
                {accountRole === "organizer" && (
                  <>
                    <div className="auth-form-group">
                      <label
                        className="auth-field-label"
                        htmlFor="organizationName"
                      >
                        Tên tổ chức
                      </label>
                      <input
                        id="organizationName"
                        className="auth-input"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        maxLength={200}
                        required={
                          mode === "register" && accountRole === "organizer"
                        }
                      />
                    </div>
                    <div className="auth-form-group">
                      <label
                        className="auth-field-label"
                        htmlFor="representative"
                      >
                        Người đại diện
                      </label>
                      <input
                        id="representative"
                        className="auth-input"
                        value={representative}
                        onChange={(e) => setRepresentative(e.target.value)}
                        maxLength={150}
                        required={
                          mode === "register" && accountRole === "organizer"
                        }
                      />
                    </div>
                    <div className="auth-form-group">
                      <label
                        className="auth-field-label"
                        htmlFor="organizationCategory"
                      >
                        Lĩnh vực hoạt động
                      </label>
                      <input
                        id="organizationCategory"
                        className="auth-input"
                        value={organizationCategory}
                        onChange={(e) =>
                          setOrganizationCategory(e.target.value)
                        }
                        maxLength={120}
                        required={
                          mode === "register" && accountRole === "organizer"
                        }
                      />
                    </div>
                    <div className="auth-form-group">
                      <label
                        className="auth-field-label"
                        htmlFor="organizationDescription"
                      >
                        Giới thiệu tổ chức
                      </label>
                      <textarea
                        id="organizationDescription"
                        className="auth-input"
                        value={organizationDescription}
                        onChange={(e) =>
                          setOrganizationDescription(e.target.value)
                        }
                        maxLength={5000}
                      />
                    </div>
                    <div className="auth-form-group">
                      <label
                        className="auth-field-label"
                        htmlFor="organizationDocument"
                      >
                        Giấy tờ tổ chức (PDF/JPG/PNG, tối đa 15 MB)
                      </label>
                      <input
                        id="organizationDocument"
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        onChange={(e) =>
                          setOrganizationDocument(e.target.files?.[0] ?? null)
                        }
                        required={
                          mode === "register" && accountRole === "organizer"
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <div className="auth-form-group">
              <label className="auth-field-label" htmlFor="loginEmail">
                Email đăng nhập
              </label>
              <div className="auth-input-wrapper">
                <span className="input-icon-left">
                  <i className="ri-mail-line" />
                </span>
                <input
                  id="loginEmail"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={254}
                />
              </div>
            </div>
            {mode === "login" && (
              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label className="auth-field-label" htmlFor="loginPassword">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={resetPassword}
                    disabled={busy}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <span className="input-icon-left">
                    <i className="ri-lock-line" />
                  </span>
                  <input
                    id="loginPassword"
                    className="auth-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <i
                      className={
                        showPassword ? "ri-eye-off-line" : "ri-eye-line"
                      }
                    />
                  </button>
                </div>
              </div>
            )}
            {mode === "login" && (
              <div className="auth-checkbox-row">
                <label className="custom-checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(event) =>
                      setRememberSession(event.target.checked)
                    }
                  />
                  <span>
                    Ghi nhớ phiên đăng nhập{" "}
                    <span
                      className="checkbox-info-tooltip"
                      title="Giữ phiên đăng nhập trên thiết bị này"
                    >
                      ⓘ
                    </span>
                  </span>
                </label>
              </div>
            )}
            {mode === "register" && (
              <>
                <div className="register-pwd-grid">
                  <div className="auth-form-group">
                    <label className="auth-field-label" htmlFor="loginPassword">
                      Mật khẩu *
                    </label>
                    <div className="auth-input-wrapper">
                      <span className="input-icon-left">
                        <i className="ri-lock-line" />
                      </span>
                      <input
                        id="loginPassword"
                        className="auth-input"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={128}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label="Hiện/ẩn mật khẩu"
                      >
                        <i
                          className={
                            showPassword ? "ri-eye-off-line" : "ri-eye-line"
                          }
                        />
                      </button>
                    </div>
                  </div>
                  <div className="auth-form-group">
                    <label
                      className="auth-field-label"
                      htmlFor="confirmPassword"
                    >
                      Xác nhận mật khẩu *
                    </label>
                    <div className="auth-input-wrapper">
                      <span className="input-icon-left">
                        <i className="ri-lock-line" />
                      </span>
                      <input
                        id="confirmPassword"
                        className="auth-input"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={128}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        aria-label="Hiện/ẩn xác nhận mật khẩu"
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "ri-eye-off-line"
                              : "ri-eye-line"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <label className="auth-checkbox-row auth-terms-row">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    required
                  />{" "}
                  <span>
                    Bằng việc bấm đăng ký, bạn đồng ý với{" "}
                    <a href="/terms">Quy tắc cộng đồng</a> của NhiLun.
                  </span>
                </label>
              </>
            )}
            {message && (
              <p
                role="status"
                aria-live="polite"
                className="auth-status-message"
              >
                {message}
              </p>
            )}
            <button type="submit" className="auth-submit-btn" disabled={busy}>
              <span>
                {busy
                  ? "Đang xử lý…"
                  : mode === "login"
                    ? "Đăng Nhập & Vào Hệ Thống"
                    : "Tạo tài khoản"}
              </span>
              <span className="btn-arrow-icon">
                <i className="ri-arrow-right-line" />
              </span>
            </button>
          </form>
          <div className="auth-card-footer-link">
            {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage("");
              }}
            >
              {mode === "login" ? "Đăng ký ngay tại đây" : "Đăng nhập"}
            </button>
          </div>
        </section>
      </main>
      <div className="ambient-bottom-quote" aria-hidden="true">
        Cùng nhau làm nên những điều tốt đẹp hơn ♡
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper" />}>
      <AuthForm />
    </Suspense>
  );
}
