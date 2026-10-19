"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { emitDataChange } from "@/lib/data-events";
export { DATA_CHANGED } from "@/lib/data-events";
export function LiveDataSync() {
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code && !window.location.pathname.startsWith("/auth")) {
      window.location.replace(
        `/auth/callback?code=${encodeURIComponent(code)}`,
      );
      return;
    }
    const client = createClient();
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const entities = new Set<string>();
    let fullRefresh = false;
    const invalidate = (entity?: string) => {
      if (entity) entities.add(entity);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (active) {
          emitDataChange(
            fullRefresh ? undefined : entities.size ? entities : undefined,
          );
          fullRefresh = false;
          entities.clear();
        }
      }, 150);
    };
    const invalidateAll = () => {
      fullRefresh = true;
      entities.clear();
      invalidate();
    };
    let channel: ReturnType<typeof client.channel> | undefined;
    let generation = 0;
    let currentToken: string | undefined;
    async function connect(token?: string) {
      if (!active || (channel && currentToken === token)) return;
      const version = ++generation;
      const previous = channel;
      channel = undefined;
      currentToken = token;
      setOnline(false);
      if (previous) await client.removeChannel(previous);
      await client.realtime.setAuth(token);
      if (!active || version !== generation) return;
      // RLS visibility is established when joining. Join only after installing the
      // session JWT, and rejoin when the authenticated account changes.
      channel = client
        .channel("site-data-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "change_events" },
          (payload) =>
            invalidate(
              typeof payload.new.entity === "string"
                ? payload.new.entity
                : undefined,
            ),
        )
        .subscribe((status) => {
          if (active && version === generation) {
            setOnline(status === "SUBSCRIBED");
            if (status === "SUBSCRIBED") invalidateAll();
          }
        });
    }
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!active) return;
        void connect(session?.access_token).catch((error) => {
          console.error("Kết nối cập nhật trực tiếp tạm thời gián đoạn.");
          if (active) setOnline(false);
        });
        emitDataChange(undefined, true);
      }, 0);
    });
    void client.auth
      .getSession()
      .then(({ data: { session } }) => connect(session?.access_token))
      .catch((error) => {
        console.error("Không khởi tạo được cập nhật trực tiếp.");
      });
    window.addEventListener("focus", invalidateAll);
    window.addEventListener("online", invalidateAll);
    // Poll only while disconnected; this does not replace the database subscription.
    const fallback = setInterval(() => {
      if (channel?.state !== "joined" && document.visibilityState === "visible")
        invalidateAll();
    }, 30000);
    return () => {
      active = false;
      clearTimeout(timer);
      clearInterval(fallback);
      subscription.unsubscribe();
      if (channel) void client.removeChannel(channel);
      window.removeEventListener("focus", invalidateAll);
      window.removeEventListener("online", invalidateAll);
    };
  }, []);
  return (
    <span
      className={`live-sync-indicator${online ? " connected" : ""}`}
      role="status"
      title={
        online
          ? "Đang nhận cập nhật trực tiếp"
          : "Đang kết nối lại; dữ liệu sẽ được tải lại định kỳ"
      }
    >
      {online ? "● Trực tiếp" : "○ Đang kết nối"}
    </span>
  );
}
