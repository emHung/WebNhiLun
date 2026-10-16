import { Suspense } from "react";
import { CertificatesPage } from "@/components/portal/CertificatesPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="container">Đang tải…</div>}>
      <CertificatesPage />
    </Suspense>
  );
}
