"use client";
import { useLoad } from "./use-api-query";
import type { Notification } from "@/lib/models";
export type NotificationSummary = {
  items: Notification[];
  unread_total: number;
};
export function useNotificationSummary(enabled = true) {
  return useLoad<NotificationSummary>(
    enabled ? "/notifications/summary" : null,
  );
}
