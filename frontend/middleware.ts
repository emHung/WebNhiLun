import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { pageSecurity, securePage } from "@/lib/http-security";

export async function middleware(request: NextRequest) {
  const security = pageSecurity(request);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const path = request.nextUrl.pathname;
  const privatePage =
    /^\/(profile|schedule|notifications|favorites|dashboard|volunteer|organizer|admin)(\/|$)/.test(
      path,
    ) || path === "/certificates";
  if (!url || !key)
    return privatePage
      ? securePage(NextResponse.redirect(new URL("/auth?error=config", request.url)), security.csp)
      : securePage(NextResponse.next({ request: { headers: security.headers } }), security.csp);

  let response = NextResponse.next({ request: { headers: security.headers } });
  const supabase = createServerClient(url, key, {
    cookieOptions: { sameSite: "lax", secure: process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        security.headers.set("cookie", request.headers.get("cookie") || "");
        response = NextResponse.next({ request: { headers: security.headers } });
        cookiesToSet.forEach(({ name, value, options }) => {
          const opts = { ...options };
          if (
            request.cookies.get("vh-remember")?.value === "0" &&
            opts.maxAge !== 0
          ) {
            delete opts.maxAge;
            delete opts.expires;
          }
          response.cookies.set(name, value, opts);
        });
      },
    },
  });
  const redirect = (target: string) => {
    const next = NextResponse.redirect(new URL(target, request.url));
    response.cookies.getAll().forEach((cookie) => next.cookies.set(cookie));
    next.headers.set("Cache-Control", "private, no-store");
    return securePage(next, security.csp);
  };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!privatePage) return securePage(response, security.csp);
  if (!user)
    return redirect(
      `/auth?returnTo=${encodeURIComponent(path + request.nextUrl.search)}`,
    );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  try {
    const result = await fetch(
      `${process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/api/v1/auth/me`,
      {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        cache: "no-store",
      },
    );
    if (!result.ok) return redirect("/auth?error=profile");
    const { data: profile } = await result.json();
    if (profile.role === "admin" && profile.requires_mfa) return redirect("/auth/mfa");
    const home =
      profile.role === "admin"
        ? "/admin/moderation"
        : profile.role === "organizer"
          ? "/organizer/manage"
          : "/volunteer/dashboard";
    if (path === "/dashboard") return redirect(home);
    if (path.startsWith("/admin") && profile.role !== "admin")
      return redirect("/forbidden");
    if (
      path.startsWith("/organizer") &&
      profile.role !== "organizer" &&
      !(
        path === "/organizer/manage" &&
        profile.role === "volunteer" &&
        request.nextUrl.searchParams.get("onboard") === "1"
      )
    )
      return redirect("/forbidden");
    if (
      (path.startsWith("/volunteer") || path === "/certificates") &&
      profile.role !== "volunteer"
    )
      return redirect("/forbidden");
  } catch {
    return redirect("/auth?error=service");
  }
  response.headers.set("Cache-Control", "private, no-store");
  return securePage(response, security.csp);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|legacy/|api/).*)"],
};
