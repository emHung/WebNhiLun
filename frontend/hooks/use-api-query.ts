"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import { affectsQuery, DATA_CHANGED, type DataChange } from "@/lib/data-events";
export function useLoad<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(Boolean(path)),
    [reload, setReload] = useState(0);
  const generation = useRef(0);
  const refresh = useCallback(() => setReload((value) => value + 1), []);
  useEffect(() => {
    generation.current++;
    if (!path) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }
    let active = true;
    const version = ++generation.current;
    setLoading(true);
    apiRequest<T>(path)
      .then((value) => {
        if (active && version === generation.current) {
          setData(value);
          setError("");
        }
      })
      .catch((reason) => {
        if (active && version === generation.current) {
          setData(null);
          setError(
            reason instanceof Error
              ? reason.message
              : "Không tải được dữ liệu.",
          );
        }
      })
      .finally(() => {
        if (active && version === generation.current) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, reload]);
  useEffect(() => {
    const invalidate = (event: Event) => {
      const detail = (event as CustomEvent<DataChange>).detail;
      if (detail?.authChanged) setData(null);
      if (path && affectsQuery(path, detail)) {
        generation.current++;
        refresh();
      }
    };
    window.addEventListener(DATA_CHANGED, invalidate);
    return () => window.removeEventListener(DATA_CHANGED, invalidate);
  }, [path, refresh]);
  return { data, error, loading, refresh, setData };
}
export function useDebouncedValue<T>(value: T, delay = 250) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}
