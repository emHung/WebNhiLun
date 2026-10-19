"use client";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function ResetPage() {
  const [ready, setReady] = useState(false),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    void createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (active) {
          setReady(Boolean(data.user));
          if (!data.user)
            setMessage(
              "Liên kết không hợp lệ hoặc đã hết hạn. Hãy yêu cầu email mới.",
            );
        }
      });
    return () => {
      active = false;
    };
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }
    setBusy(true);
    if (new TextEncoder().encode(password).byteLength > 72) {
      setMessage("Mật khẩu không được vượt quá 72 byte.");
      setBusy(false);
      return;
    }
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      await createClient().auth.signOut();
      setReady(false);
      setMessage("Đã đổi mật khẩu. Bạn có thể đăng nhập lại.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không đổi được mật khẩu.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page-wrapper">
      <form className="auth-glass-card portal-form" onSubmit={submit}>
        <h1>Đặt lại mật khẩu</h1>
        <label>
          Mật khẩu mới
          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready}
          />
        </label>
        <label>
          Xác nhận mật khẩu
          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={!ready}
          />
        </label>
        <p role="status">{message}</p>
        <button className="auth-submit-btn" disabled={!ready || busy}>
          {busy ? "Đang xử lý…" : "Lưu mật khẩu"}
        </button>
        <a href="/auth">Về đăng nhập</a>
      </form>
    </main>
  );
}
