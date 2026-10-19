import {
  emitDataChange,
  mutationEntities,
  queryRevision,
} from "@/lib/data-events";
import { createClient } from "@/lib/supabase/client";

const baseUrl = "";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string | null;
  detail?: unknown;
  error?: { message?: string };
};


const pending = new Map<string, Promise<unknown>>();
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  const read =
    (!init.method || init.method === "GET") && !init.signal && !init.headers;
  const key = `${session?.access_token || "anonymous"}:${path}:${queryRevision(path)}`;
  if (read && pending.has(key)) return pending.get(key) as Promise<T>;
  const task = (async () => {
    const response = await fetch(`${baseUrl}/api/v1${path}`, {
      ...init,
      headers: {
        ...(init.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
    const body = (await response
      .json()
      .catch(() => null)) as ApiEnvelope<T> | null;
    if (!response.ok) {
      if (response.status === 401 && session) window.dispatchEvent(new Event("auth-session-ended"));
      if (response.headers.get("X-Auth-Action") === "mfa" && !window.location.pathname.startsWith("/auth")) window.location.assign("/auth/mfa");
      throw new Error(
        body?.error?.message ??
          (typeof body?.detail === "string"
            ? body.detail
            : `Yêu cầu thất bại (${response.status}).`),
      );
    }
    if (init.method && init.method !== "GET")
      emitDataChange(mutationEntities(path));
    return body?.data as T;
  })();
  if (read) pending.set(key, task);
  try {
    return await task;
  } finally {
    if (pending.get(key) === task) pending.delete(key);
  }
}

export async function apiDownload(
  path: string,
  filename: string,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const response = await fetch(`${baseUrl}/api/v1${path}`, {
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? body?.detail ?? "Không thể tải tệp.",
    );
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
