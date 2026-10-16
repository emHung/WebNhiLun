"use client";
import { usePathname } from "next/navigation";
const groups: Record<string, string[]> = {
  home: ["home"],
  auth: ["auth"],
  activities: ["activities", "detail"],
  volunteer: ["profile", "volunteer", "dashboard"],
  profile: ["profile"],
  favorites: ["profile", "activities"],
  schedule: ["profile", "schedule"],
  certificates: ["profile", "certificates"],
  notifications: ["profile", "notifications"],
  organizer: ["organizer"],
  admin: ["admin"],
  stories: ["stories"],
  about: ["about"],
};
export function LegacyStyles() {
  const pathname = usePathname();
  const key = pathname.split("/")[1] || "home";
  return (
    <>
      {(groups[key] || []).map((name) => (
        <link key={name} rel="stylesheet" href={`/legacy/css/${name}.css`} />
      ))}
    </>
  );
}
