"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Pagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t flex-wrap gap-3"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        {totalRows > 0 ? `${start}–${end} / ${totalRows} kayıt` : "Kayıt bulunamadı"}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Sayfa başına
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="text-xs rounded-lg px-2 py-1.5 font-mono outline-none border"
            style={{
              background: "var(--background-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size} style={{ background: "var(--background-secondary)" }}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft size={13} />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-xs px-1 font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono transition-all border"
                style={{
                  background: page === p
                    ? "linear-gradient(90deg, rgba(0,198,162,0.2) 0%, rgba(0,133,255,0.1) 100%)"
                    : "var(--background-card)",
                  borderColor: page === p ? "rgba(0,198,162,0.3)" : "var(--border)",
                  color: page === p ? "#00C6A2" : "var(--text-secondary)",
                }}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}