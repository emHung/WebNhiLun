"use client";
import { useState } from "react";
import { useLoad, StatusMessage } from "./shared";
import { apiRequest } from "@/lib/api";
type Document = { id: string; name: string; created_at: string };
export function ProfileDocuments() {
  const { data, error, loading, refresh } =
    useLoad<Document[]>("/me/documents");
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <section className="profile-box-card">
      <div className="box-card-header">
        <h3 className="box-card-title">
          <i className="ri-file-list-3-line" /> Tài liệu của tôi
        </h3>
        <label className="btn-box-action">
          {busy ? "Đang tải…" : "+ Thêm tài liệu"}
          <input
            hidden
            type="file"
            disabled={busy}
            accept="application/pdf,image/jpeg,image/png"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                const upload = new FormData();
                upload.append("file", file);
                await apiRequest("/me/documents", {
                  method: "POST",
                  body: upload,
                });
                refresh();
                setMessage("Đã lưu tài liệu.");
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "Không tải được tài liệu.",
                );
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      <StatusMessage error={error} loading={loading} />
      <p role="status">{message}</p>
      {data?.length ? (
        data.map((doc) => (
          <div className="profile-recent-row" key={doc.id}>
            <span>{doc.name}</span>
            <button
              className="btn-box-action"
              onClick={async () => {
                try {
                  const result = await apiRequest<{ url: string }>(
                    `/me/documents/${doc.id}/url`,
                  );
                  window.open(result.url, "_blank", "noopener,noreferrer");
                } catch (error) {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Không mở được tài liệu.",
                  );
                }
              }}
            >
              Xem tài liệu
            </button>
          </div>
        ))
      ) : (
        <p className="profile-empty-inline">Chưa có tài liệu hồ sơ.</p>
      )}
    </section>
  );
}
