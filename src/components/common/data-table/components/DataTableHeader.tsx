"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SortState } from "../hooks/useDataTable";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sort: SortState;
  onSort: (column: string) => void;
}

export default function DataTableHeader<T>({
  columns,
  sort,
  onSort,
}: DataTableHeaderProps<T>) {
  return (
    <thead>
      <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "rgba(255,255,255,0.35)", width: col.width }}
          >
            {col.sortable ? (
              <button
                onClick={() => onSort(String(col.key))}
                className="flex items-center gap-1.5 hover:text-white/60 transition-colors group"
              >
                {col.label}
                <span className="text-white/20 group-hover:text-white/40 transition-colors">
                  {sort.column === String(col.key) ? (
                    sort.direction === "asc" ? (
                      <ChevronUp size={12} className="text-[#00C6A2]" />
                    ) : (
                      <ChevronDown size={12} className="text-[#00C6A2]" />
                    )
                  ) : (
                    <ChevronsUpDown size={12} />
                  )}
                </span>
              </button>
            ) : (
              col.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}