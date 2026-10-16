"use client";
import { useEffect } from "react";
import { useLoad } from "@/hooks/use-api-query";
type ActiveTheme = {
  primary_color: string;
  cta_color: string;
  cta_hover_color?: string | null;
  surface_color: string;
  mode: "light" | "dark";
};
export function ThemeSync() {
  const { data: theme } = useLoad<ActiveTheme>("/themes");
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", theme.primary_color);
    root.style.setProperty("--brand-cta", theme.cta_color);
    root.style.setProperty(
      "--brand-cta-hover",
      theme.cta_hover_color || theme.cta_color,
    );
    root.style.setProperty("--brand-surface", theme.surface_color);
    root.dataset.mode = theme.mode;
  }, [theme]);
  return null;
}
