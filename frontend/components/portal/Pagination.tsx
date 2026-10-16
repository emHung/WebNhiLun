"use client";
import { useEffect } from "react";
export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};
export function Pagination({
  page,
  total,
  limit,
  onChange,
  loading = false,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
  loading?: boolean;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  useEffect(() => {
    if (!loading && page > pages) onChange(pages);
  }, [page, pages, loading, onChange]);
  return (
    <nav className="portal-pagination" aria-label="Phân trang">
      <button
        type="button"
        className="btn btn-outline"
        disabled={loading || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Trước
      </button>
      <span>
        Trang {page} / {pages} · {total} kết quả
      </span>
      <button
        type="button"
        className="btn btn-outline"
        disabled={loading || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Sau →
      </button>
    </nav>
  );
}
