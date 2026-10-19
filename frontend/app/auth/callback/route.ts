import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next");
  const supabase = await createClient();
  if (!code)
    return NextResponse.redirect(new URL("/auth?error=callback", request.url));
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session)
    return NextResponse.redirect(new URL("/auth?error=callback", request.url));
  if (
    next === "/auth/reset" ||
    (data as { redirectType?: string }).redirectType === "recovery"
  )
    return NextResponse.redirect(new URL("/auth/reset", request.url));

  const onboarding = data.user?.user_metadata?.organization_registration_draft;
  return NextResponse.redirect(
    new URL(
      onboarding ? "/organizer/manage?onboard=1" : "/dashboard",
      request.url,
    ),
  );
}
