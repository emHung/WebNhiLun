import { Suspense } from "react";
import { ProfilePage } from "@/components/portal/ProfilePage";

export default function Page() {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  );
}
