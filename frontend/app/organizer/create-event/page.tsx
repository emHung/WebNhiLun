import { Suspense } from "react";
import { CreateActivityPage } from "@/components/portal/CreateActivityPage";

export default function Page() {
  return (
    <Suspense>
      <CreateActivityPage />
    </Suspense>
  );
}
