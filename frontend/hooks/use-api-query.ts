"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import { affectsQuery, DATA_CHANGED, type DataChange } from "@/lib/data-events";
export function useLoad<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(Boolean(path)),
    [isValidating, setIsValidating] = useState(false),
    [reload, setReload] = useState(0);
  const generation = useRef(0);
  const dataRef = useRef<T | null>(null);
  dataRef.current = data;
  const prevPath = useRef<string | null>(path);

  const refresh = useCallback(() => setReload((value) => value + 1), []);

  useEffect(() => {
    generation.current++;
    if (!path) {
      setData(null);
      dataRef.current = null;
      setError("");
      setLoading(false);
      setIsValidating(false);
      prevPath.current = null;
      return;
    }
    let active = true;
    const version = ++generation.current;


    if (prevPath.current !== path) {
      prevPath.current = path;
      dataRef.current = null;
      setData(null);
      setLoading(true);
    } else if (dataRef.current === null) {

      setLoading(true);
    }

    setIsValidating(true);

    apiRequest<T>(path)
      .then((value) => {
        if (active && version === generation.current) {
          setData(value);
          dataRef.current = value;
          setError("");
        }
      })
      .catch((reason) => {
        if (active && version === generation.current) {
          if (dataRef.current === null) {
            setData(null);
          }
          setError(
            reason instanceof Error
              ? reason.message
              : "Không tải được dữ liệu.",
          );
        }
      })
      .finally(() => {
        if (active && version === generation.current) {
          setLoading(false);
          setIsValidating(false);
        }
      });
    return () => {
      active = false;
    };
  }, [path, reload]);

  useEffect(() => {
    const invalidate = (event: Event) => {
      const detail = (event as CustomEvent<DataChange>).detail;
      if (detail?.authChanged) {
        dataRef.current = null;
        setData(null);
      }
      if (path && affectsQuery(path, detail)) {
        generation.current++;
        refresh();
      }
    };
    window.addEventListener(DATA_CHANGED, invalidate);
    return () => window.removeEventListener(DATA_CHANGED, invalidate);
  }, [path, refresh]);

  return { data, error, loading, isValidating, refresh, setData };
}
export function useDebouncedValue<T>(value: T, delay = 250) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}
