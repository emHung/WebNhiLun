"use client";
import { Suspense, useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  PortalShell,
  useLoad,
  StatusMessage,
  formatDate,
} from "@/components/portal/shared";
function VerifyForm() {
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("code") || ""),
    [code, setCode] = useState(input);
  const { data, error, loading } = useLoad<{
    valid: boolean;
    recipient_name: string;
    activity_title: string;
    issuer: string;
    hours: number;
    issue_date: string;
  }>(code ? `/certificates/verify/${encodeURIComponent(code)}` : null);
  return (
    <PortalShell>
      <main className="container portal-card">
        <h1>Xác thực chứng nhận</h1>
        <form
          className="portal-toolbar"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            setCode(input.trim());
          }}
        >
          <input
            required
            aria-label="Mã chứng nhận"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary">Tra cứu</button>
        </form>
        <StatusMessage error={error} loading={loading} />
        {data && (
          <section>
            <h2>
              {data.valid ? "Chứng nhận hợp lệ" : "Chứng nhận không hợp lệ"}
            </h2>
            <p>{data.recipient_name}</p>
            <p>{data.activity_title}</p>
            <p>
              {data.issuer} · {data.hours} giờ · {formatDate(data.issue_date)}
            </p>
          </section>
        )}
      </main>
    </PortalShell>
  );
}
export default function Page() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
