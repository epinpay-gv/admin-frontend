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
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Sol — toplam kayıt */}
      <p className="text-xs text-white/30 font-mono">
        {totalRows > 0 ? `${start}–${end} / ${totalRows} kayıt` : "Kayıt bulunamadı"}
      </p>

      <div className="flex items-center gap-4">
        {/* Sayfa boyutu */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">Sayfa başına</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="text-xs rounded-lg px-2 py-1.5 font-mono outline-none border"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size} style={{ background: "#1A1D27" }}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Sayfa navigasyon */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <ChevronLeft size={13} />
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-xs text-white/25 px-1 font-mono"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono transition-all border"
                style={{
                  background:
                    page === p
                      ? "linear-gradient(90deg, rgba(0,198,162,0.2) 0%, rgba(0,133,255,0.1) 100%)"
                      : "rgba(255,255,255,0.05)",
                  borderColor:
                    page === p
                      ? "rgba(0,198,162,0.3)"
                      : "rgba(255,255,255,0.1)",
                  color: page === p ? "#00C6A2" : "rgba(255,255,255,0.5)",
                }}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}