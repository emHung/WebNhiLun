"use client";
import { MediaImage } from "@/components/portal/MediaImage";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
export function CertificateQr({ code }: { code: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(
      `${window.location.origin}/certificates/verify?code=${encodeURIComponent(code)}`,
      { width: 120, margin: 1 },
    )
      .then((value) => {
        if (active) setSrc(value);
      })
      .catch((error) => console.error("Không tạo được mã QR."));
    return () => {
      active = false;
    };
  }, [code]);
  return src ? (
    <MediaImage src={src} width={60} height={60} alt={`QR xác thực ${code}`} />
  ) : (
    <span>Đang tạo QR…</span>
  );
}
