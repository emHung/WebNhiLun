export const authFetch: typeof fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
  const project = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const action = url.pathname === "/auth/v1/signup" ? "register" : url.pathname === "/auth/v1/recover" ? "recover" : url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "password" ? "login" : null;
  if (!action || !project || url.origin !== new URL(project).origin) return fetch(input, init);
  const response = await fetch(`/api/v1/auth/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: init?.body, cache: "no-store" });
  if (response.ok) return response;
  const result = await response.json().catch(() => null);
  return new Response(JSON.stringify({ msg: result?.error?.message || "Không hoàn tất được xác thực. Vui lòng thử lại sau.", code: response.status === 429 ? "over_request_rate_limit" : "auth_failed" }), { status: response.status, headers: { "Content-Type": "application/json" } });
};
