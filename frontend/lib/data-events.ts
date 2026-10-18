/** Invalidate by server entity, with explicit full refresh for auth/reconnect only. */
export const DATA_CHANGED = "volunteerhub-data-change";
export type DataChange = { entities?: string[]; authChanged?: boolean };
let allRevision = 0;
const revisions = new Map<string, number>();
export function queryRevision(path: string) {
  return `${allRevision}:${queryEntities(path)
    .map((entity) => revisions.get(entity) || 0)
    .join(":")}`;
}
export function emitDataChange(
  entities?: Iterable<string>,
  authChanged = false,
) {
  const list = entities ? Array.from(new Set(entities)) : undefined;
  if (list)
    list.forEach((entity) =>
      revisions.set(entity, (revisions.get(entity) || 0) + 1),
    );
  else allRevision++;
  window.dispatchEvent(
    new CustomEvent<DataChange>(DATA_CHANGED, {
      detail: { entities: list, authChanged },
    }),
  );
}
export function queryEntities(path: string): string[] {
  const route = path.split("?")[0];
  if (route.includes("themes")) return ["system_themes"];
  if (route.startsWith("/site-content")) return ["site_content"];
  if (route === "/auth/me" || route === "/me/profile") return ["profiles"];
  if (route.startsWith("/me/documents")) return ["profile_documents"];
  if (route.includes("notifications")) return ["notifications"];
  if (route.includes("story-likes")) return ["story_likes"];
  if (route.includes("stories")) return ["stories", "story_likes", "profiles"];
  if (route.includes("favorites")) return ["favorites", "activities"];
  if (route.includes("certificates"))
    return ["certificates", "applications", "activities"];
  if (
    route.includes("applicants") ||
    route.includes("applications") ||
    route.includes("schedule")
  )
    return ["applications", "activities", "profiles"];
  if (route.includes("audit-logs"))
    return [
      "audit_logs",
      "applications",
      "organizations",
      "activities",
      "system_themes",
      "stories",
    ];
  if (route.includes("admin/metrics") || route === "/admin/metrics")
    return ["activities", "applications", "organizations", "stories", "audit_logs"];
  if (route === "/home/metrics") return ["activities", "profiles", "organizations"];
  if (route.includes("organization")) return ["organizations", "profiles", "audit_logs"];
  if (route.includes("activities"))
    return ["activities", "activity_schedules", "organizations", "audit_logs"];
  return [];
}
export function mutationEntities(path: string): string[] {
  const route = path.split("?")[0];
  if (route.startsWith("/auth")) return ["profiles"];
  if (route.includes("checkin"))
    return [
      "applications",
      "certificates",
      "profiles",
      "notifications",
      "audit_logs",
    ];
  if (route.includes("/applications/") || route.includes("/apply"))
    return ["applications", "activities", "notifications", "audit_logs"];
  if (route.includes("/like")) return ["story_likes", "stories"];
  if (route.includes("stories")) return ["stories", "story_likes", "audit_logs"];
  if (route.includes("favorites")) return ["favorites", "activities"];
  if (route.includes("/avatar") || route.includes("/profile"))
    return ["profiles"];
  if (route.includes("themes")) return ["system_themes", "audit_logs"];
  if (route.includes("review"))
    return [
      "activities",
      "organizations",
      "applications",
      "notifications",
      "audit_logs",
    ];
  if (route.includes("organization"))
    return ["organizations", "profiles", "audit_logs"];
  if (route.includes("documents"))
    return ["profile_documents", "organizations", "audit_logs"];
  if (route.includes("certificates"))
    return ["certificates", "profiles", "applications"];
  if (route.includes("activities"))
    return ["activities", "organizations", "audit_logs"];
  return queryEntities(path).concat(
    path.startsWith("/admin") ? ["audit_logs"] : [],
  );
}
export function affectsQuery(path: string, change?: DataChange) {
  return (
    !change?.entities ||
    queryEntities(path).some((entity) => change.entities!.includes(entity))
  );
}
