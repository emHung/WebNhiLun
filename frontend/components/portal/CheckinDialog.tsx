"use client";
import { MediaImage } from "@/components/portal/MediaImage";
import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import QRCode from "qrcode";
import { Application } from "./shared";
type Detector = {
  detect: (video: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
};
type DetectorConstructor = new (options: { formats: string[] }) => Detector;
export function CheckinDialog({
  application,
  confirm,
  close,
}: {
  application: Application;
  confirm: (id: string) => Promise<void>;
  close: () => void;
}) {
  const [image, setImage] = useState(""),
    [value, setValue] = useState(application.id),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [scanning, setScanning] = useState(false);
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null),
    timer = useRef<ReturnType<typeof setInterval> | null>(null);
  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setScanning(false);
  }
  useEffect(() => {
    void QRCode.toDataURL(
      JSON.stringify({
        type: "volunteerhub.checkin",
        application_id: application.id,
      }),
    )
      .then(setImage)
      .catch((error) => setMessage(error.message));
    return () => {
      if (timer.current) clearInterval(timer.current);
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [application.id]);
  async function camera() {
    const constructor = (
      window as unknown as { BarcodeDetector?: DetectorConstructor }
    ).BarcodeDetector;
    if (!constructor) {
      setMessage(
        "Trình duyệt này chưa hỗ trợ quét QR bằng camera. Bạn có thể nhập mã đơn bên dưới.",
      );
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setScanning(true);
      if (video.current) {
        video.current.srcObject = stream.current;
        await video.current.play();
        const detector = new constructor({ formats: ["qr_code"] });
        let detecting = false;
        timer.current = setInterval(() => {
          if (detecting || !video.current) return;
          detecting = true;
          void detector
            .detect(video.current)
            .then((results) => {
              if (results[0]) {
                setValue(results[0].rawValue);
                stop();
              }
            })
            .catch((error) => {
              setMessage(error.message);
              stop();
            })
            .finally(() => {
              detecting = false;
            });
        }, 400);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không mở được camera.",
      );
      stop();
    }
  }
  async function submit() {
    let id = value.trim();
    try {
      if (id.startsWith("{")) {
        const parsed = JSON.parse(id);
        if (parsed.type !== "volunteerhub.checkin")
          throw new Error("QR không thuộc hệ thống.");
        id = parsed.application_id;
      }
      if (id !== application.id)
        throw new Error("Mã QR không khớp tình nguyện viên đang chọn.");
      setBusy(true);
      await confirm(id);
      close();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không điểm danh được.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal label="Quét QR điểm danh" onClose={close}>
      <h2>Quét QR điểm danh</h2>
      <p>
        {application.user_name} · {application.id}
      </p>
      {image && (
        <MediaImage
          src={image}
          width={180}
          height={180}
          alt={`QR đơn ${application.id}`}
        />
      )}
      <video
        ref={video}
        muted
        playsInline
        hidden={!scanning}
        className="checkin-camera"
      />
      <button className="btn btn-outline" type="button" onClick={camera}>
        Mở camera
      </button>
      <label className="portal-form">
        Mã đơn hoặc nội dung QR
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <p role="status">{message}</p>
      <button className="btn btn-primary" disabled={busy} onClick={submit}>
        {busy ? "Đang xác nhận…" : "Xác nhận điểm danh"}
      </button>
    </Modal>
  );
}
