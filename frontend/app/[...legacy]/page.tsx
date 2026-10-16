import { notFound, redirect } from "next/navigation";

const aliases: Record<string, string> = {
  "index.html": "/",
  "activities.html": "/activities",
  "detail.html": "/activities",
  "dashboard.html": "/volunteer/dashboard",
  "volunteer/dashboard.html": "/volunteer/dashboard",
  "volunteer/apply.html": "/volunteer/apply",
  "organizer/dashboard.html": "/organizer/manage",
  "organizer/create-activity.html": "/organizer/create-event",
  "organizer/register.html": "/auth?mode=register&role=organizer",
  "admin/dashboard.html": "/admin/moderation",
  "admin/organizations.html": "/admin/moderation",
  "admin/activities.html": "/admin/moderation",
  "admin/themes.html": "/admin/theme-settings",
  "schedule.html": "/schedule",
  "certificates.html": "/certificates",
  "notifications.html": "/notifications",
  "profile.html": "/profile",
  "organizer/manage.html": "/organizer/manage",
  "organizer/create-event.html": "/organizer/create-event",
  "admin/moderation.html": "/admin/moderation",
  "admin/theme-settings.html": "/admin/theme-settings",
  "stories.html": "/stories",
  "about.html": "/about",
  "privacy.html": "/privacy",
  "terms.html": "/terms",
  "auth.html": "/auth",
};

export default async function LegacyRoute({
  params: paramsPromise,
  searchParams: searchPromise,
}: {
  params: Promise<{ legacy: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchPromise;
  const requested = params.legacy.join("/");
  const target = aliases[requested];
  if (!target) notFound();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    for (const item of Array.isArray(value)
      ? value
      : value === undefined
        ? []
        : [value])
      query.append(key, item);
  }
  if (requested === "detail.html" && query.has("id")) {
    const id = query.get("id");
    query.delete("id");
    const suffix = query.size ? `?${query}` : "";
    redirect(`/activities/${encodeURIComponent(id ?? "")}${suffix}`);
  }
  if (requested === "volunteer/apply.html") {
    const id = query.get("id") ?? query.get("actId") ?? "ACT-001";
    query.delete("id");
    query.delete("actId");
    const suffix = query.size ? `?${query}` : "";
    redirect(`/volunteer/apply/${encodeURIComponent(id)}${suffix}`);
  }
  const [pathname, defaults] = target.split("?");
  const merged = new URLSearchParams(defaults);
  query.forEach((value, key) => merged.set(key, value));
  const suffix = merged.size ? `?${merged}` : "";
  redirect(`${pathname}${suffix}`);
}
