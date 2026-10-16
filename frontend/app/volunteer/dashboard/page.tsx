import { Suspense } from "react";
import { VolunteerDashboardPage } from "@/components/portal/VolunteerDashboardPage";

export default function Page() {
  return (
    <Suspense>
      <VolunteerDashboardPage />
    </Suspense>
  );
}
