"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "@/components/common/search-input/SearchInput";
import { SortState } from "../hooks/useDataTable";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  searchKey?: string;
  sortKey?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sort: SortState;
  onSort: (column: string) => void;
  columnFilters: Record<string, string>;
  onColumnFilter: (column: string, value: string) => void;
  onClearColumnFilter: (column: string) => void;
}

function ColumnHeader<T>({
  col,
  sort,
  onSort,
  columnFilters,
  onColumnFilter,
  onClearColumnFilter,
}: {
  col: ColumnDef<T>;
  sort: SortState;
  onSort: (column: string) => void;
  columnFilters: Record<string, string>;
  onColumnFilter: (column: string, value: string) => void;
  onClearColumnFilter: (column: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const colKey = String(col.key);
  const isFiltered = !!columnFilters[colKey];

  return (
    <th className="px-4 py-3 text-left" style={{ width: col.width }}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {col.sortable ? (
            <button
              onClick={() => onSort(colKey)}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest font-mono transition-colors group"
              style={{ color: "var(--text-muted)" }}
            >
              {col.label}
              <span>
                {sort.column === colKey ? (
                  sort.direction === "asc" ? (
                    <ChevronUp size={12} className="text-[#00C6A2]" />
                  ) : (
                    <ChevronDown size={12} className="text-[#00C6A2]" />
                  )
                ) : (
                  <ChevronsUpDown size={12} style={{ color: "var(--text-muted)" }} />
                )}
              </span>
            </button>
          ) : (
            <span
              className="text-[11px] font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              {col.label}
            </span>
          )}

          {col.searchable && (
            <button
              onClick={() => {
                if (searchOpen && isFiltered) onClearColumnFilter(colKey);
                setSearchOpen((p) => !p);
              }}
              className="w-5 h-5 rounded flex items-center justify-center transition-all"
              style={{
                background: isFiltered ? "rgba(0,198,162,0.2)" : "transparent",
                color: isFiltered ? "#00C6A2" : "var(--text-muted)",
              }}
            >
              {isFiltered ? <X size={11} /> : <Search size={11} />}
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {col.searchable && searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <SearchInput
                autoFocus
                value={columnFilters[colKey] ?? ""}
                onChange={(val) => onColumnFilter(colKey, val)}
                placeholder={`${col.label} ara...`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </th>
  );
}

export default function DataTableHeader<T>({
  columns,
  sort,
  onSort,
  columnFilters,
  onColumnFilter,
  onClearColumnFilter,
}: DataTableHeaderProps<T>) {
  return (
    <thead>
      <tr
        className="border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {columns.map((col) => (
          <ColumnHeader
            key={String(col.key)}
            col={col}
            sort={sort}
            onSort={onSort}
            columnFilters={columnFilters}
            onColumnFilter={onColumnFilter}
            onClearColumnFilter={onClearColumnFilter}
          />
        ))}
      </tr>
    </thead>
  );
}