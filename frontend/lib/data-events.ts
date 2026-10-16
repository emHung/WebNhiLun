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
  if (route === "/stories") return ["stories", "story_likes", "profiles"];
  if (route.includes("favorites")) return ["favorites", "activities"];
  if (route.includes("certificates")) return ["certificates"];
  if (route.includes("applicants") || route.includes("applications"))
    return ["applications", "activities", "profiles"];
  if (route.includes("audit-logs"))
    return [
      "audit_logs",
      "applications",
      "organizations",
      "activities",
      "system_themes",
    ];
  if (route === "/admin/metrics")
    return ["activities", "applications", "organizations"];
  if (route === "/home/metrics") return ["activities", "profiles"];
  if (route.includes("organization")) return ["organizations", "profiles"];
  if (route.includes("activities"))
    return ["activities", "activity_schedules", "organizations"];
  return [];
}
export function mutationEntities(path: string): string[] {
  if (path.startsWith("/auth")) return ["profiles"];
  if (path.includes("checkin"))
    return [
      "applications",
      "certificates",
      "profiles",
      "notifications",
      "audit_logs",
    ];
  if (path.includes("/applications/") || path.endsWith("/apply"))
    return ["applications", "activities", "notifications", "audit_logs"];
  if (path.includes("/like")) return ["story_likes"];
  if (path === "/stories") return ["stories"];
  if (path.includes("/me/favorites")) return ["favorites"];
  if (path.includes("/me/avatar")) return ["profiles"];
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
