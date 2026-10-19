"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api";

export function SessionGuard() {
  useEffect(() => {
    const client = createClient();
    let signedIn = false, lastActivity = 0, ending = false, active = true;
    const touch = () => {
      if (!signedIn || Date.now() - lastActivity < 60000) return;
      lastActivity = Date.now();
      void apiRequest("/auth/activity", { method: "POST" }).catch(() => {});
    };
    const end = async () => {
      if (ending || !signedIn) return;
      ending = true;
      await client.auth.signOut({ scope: "local" });
      window.location.replace("/auth?error=session");
    };
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      signedIn = Boolean(session);
      if (event === "SIGNED_IN") setTimeout(() => { if (active) touch(); }, 0);
    });
    void client.auth.getSession().then(({ data }) => { if (active) signedIn = Boolean(data.session); });
    const userActivity = (event: Event) => { if (event.isTrusted) touch(); };
    window.addEventListener("pointerdown", userActivity);
    window.addEventListener("keydown", userActivity);
    window.addEventListener("auth-session-ended", end);
    const timer = setInterval(() => { if (signedIn) void apiRequest("/auth/me").catch(() => {}); }, 60000);
    return () => {
      active = false;
      subscription.unsubscribe();
      clearInterval(timer);
      window.removeEventListener("pointerdown", userActivity);
      window.removeEventListener("keydown", userActivity);
      window.removeEventListener("auth-session-ended", end);
    };
  }, []);
  return null;
}
