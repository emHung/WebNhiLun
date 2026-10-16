import { Suspense } from "react";
import { ActivitiesPage } from "@/components/portal/ActivitiesPage";

export default function Page() {
  return (
    <Suspense>
      <ActivitiesPage />
    </Suspense>
  );
}
