"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MediaImage } from "@/components/portal/MediaImage";

export default function MfaPage() {
  const router = useRouter();
  const [factor, setFactor] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const client = createClient();
    void client.auth.getUser().then(async ({ data, error }) => {
      if (!active) return;
      if (error || !data.user) { router.replace("/auth"); return; }
      const factors = await client.auth.mfa.listFactors();
      if (!active) return;
      const verified = factors.data?.totp.find((item) => item.status === "verified");
      if (verified) setFactor(verified.id);
      setReady(true);
    }).catch(() => { if (active) setMessage("Không tải được thông tin xác thực. Vui lòng tải lại trang."); });
    return () => { active = false; };
  }, [router]);

  async function enroll() {
    setBusy(true); setMessage("");
    try {
      const client = createClient();
      const factors = await client.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      for (const item of factors.data.all) if (item.status === "unverified" && item.factor_type === "totp") {
        const removed = await client.auth.mfa.unenroll({ factorId: item.id });
        if (removed.error) throw removed.error;
      }
      const { data, error } = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: "NhiLun" });
      if (error) throw error;
      const QRCode = await import("qrcode");
      setQr(await QRCode.toDataURL(data.totp.uri));
      setFactor(data.id);
    } catch { setMessage("Không thiết lập được xác thực hai lớp. Vui lòng thử lại."); }
    finally { setBusy(false); }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const client = createClient();
      const { error } = await client.auth.mfa.challengeAndVerify({ factorId: factor, code });
      if (error) throw error;
      router.replace("/dashboard"); router.refresh();
    } catch { setMessage("Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."); }
    finally { setBusy(false); }
  }

  return <main className="container" style={{ maxWidth: 520, paddingTop: 60 }}>
    <section className="portal-card">
      <h1>Xác thực hai lớp</h1>
      <p>Tài khoản quản trị cần xác nhận bằng ứng dụng tạo mã trước khi truy cập hệ thống.</p>
      {!ready && !message && <p>Đang tải thông tin xác thực…</p>}
      {message && <p role="alert">{message}</p>}
      {ready && !factor && <button className="btn-primary" onClick={enroll} disabled={busy}>Thiết lập ứng dụng xác thực</button>}
      {qr && <><p>Quét mã bằng ứng dụng xác thực. Mã này chỉ hiển thị trong lần thiết lập hiện tại.</p><MediaImage src={qr} alt="Mã thiết lập xác thực hai lớp" width={240} height={240} /></>}
      {factor && <form className="portal-form" onSubmit={verify}>
        <label>Mã gồm 6 chữ số<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required /></label>
        <button className="btn-primary" disabled={busy || code.length !== 6}>Xác nhận</button>
      </form>}
      <p><a href="/">Về trang chủ</a></p>
    </section>
  </main>;
}
