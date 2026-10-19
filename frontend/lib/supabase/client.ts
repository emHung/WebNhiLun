import {
  createBrowserClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { authFetch } from "./auth-fetch";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Thiếu cấu hình Supabase công khai trong môi trường frontend.",
    );
  return createBrowserClient(url, key, {
    global: { fetch: authFetch },
    cookieOptions: { sameSite: "lax", secure: typeof window !== "undefined" && window.location.protocol === "https:" },
    cookies: {
      getAll: () =>
        typeof document === "undefined"
          ? []
          : parseCookieHeader(document.cookie).map((cookie) => ({
              name: cookie.name,
              value: cookie.value || "",
            })),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          const opts = { ...options };
          if (
            parseCookieHeader(document.cookie).find(
              (cookie) => cookie.name === "vh-remember",
            )?.value === "0" &&
            opts.maxAge !== 0
          ) {
            delete opts.maxAge;
            delete opts.expires;
          }
          document.cookie = serializeCookieHeader(name, value, opts);
        });
      },
    },
  });
}
