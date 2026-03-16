"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "@/components/common/search-input/SearchInput";
import { SortState, DateRangeFilter } from "../hooks/useDataTable";
import DataTableDatePicker from "../components/DataTableDatePicker";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  searchKey?: string;
  sortKey?: string;
  datepicker?: boolean; // ← YENİ: bu kolona datepicker ekle
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
  // datepicker
  dateRange?: DateRangeFilter;
  onDateRangeChange?: (range: DateRangeFilter) => void;
  onDateRangeClear?: () => void;
}

function ColumnHeader<T>({
  col,
  sort,
  onSort,
  columnFilters,
  onColumnFilter,
  onClearColumnFilter,
  dateRange,
  onDateRangeChange,
  onDateRangeClear,
}: {
  col: ColumnDef<T>;
  sort: SortState;
  onSort: (column: string) => void;
  columnFilters: Record<string, string>;
  onColumnFilter: (column: string, value: string) => void;
  onClearColumnFilter: (column: string) => void;
  dateRange?: DateRangeFilter;
  onDateRangeChange?: (range: DateRangeFilter) => void;
  onDateRangeClear?: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const colKey = String(col.key);
  const isFiltered = !!columnFilters[colKey];
  const hasDateRange = !!(dateRange?.from || dateRange?.to);

  // Tek tarih seçilmişse "from → bugün", iki tarih seçilmişse "from → to"
  let dateBadgeLabel = "";
  if (dateRange?.from && dateRange?.to) {
    dateBadgeLabel = `${format(dateRange.from, "dd MMM", { locale: tr })} – ${format(dateRange.to, "dd MMM", { locale: tr })}`;
  } else if (dateRange?.from) {
    dateBadgeLabel = `${format(dateRange.from, "dd MMM", { locale: tr })} – bugün`;
  }

  return (
    <th className="px-4 py-3 text-left" style={{ width: col.width }}>
      <div className="flex flex-col gap-1">
        {/* Başlık satırı */}
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

          {/* Search ikonu */}
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

          {/* Datepicker ikonu */}
          {col.datepicker && dateRange && onDateRangeChange && onDateRangeClear && (
            <DataTableDatePicker
              value={dateRange}
              onChange={onDateRangeChange}
              onClear={onDateRangeClear}
            />
          )}
        </div>

        {/* Search input — slide down */}
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

        {/* Tarih badge — slide down */}
        <AnimatePresence initial={false}>
          {col.datepicker && hasDateRange && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(0,198,162,0.12)",
                    color: "#00C6A2",
                    border: "1px solid rgba(0,198,162,0.25)",
                  }}
                >
                  {dateBadgeLabel}
                </span>
                <button
                  onClick={onDateRangeClear}
                  className="w-4 h-4 rounded flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={9} />
                </button>
              </div>
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
  dateRange,
  onDateRangeChange,
  onDateRangeClear,
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
            dateRange={col.datepicker ? dateRange : undefined}
            onDateRangeChange={col.datepicker ? onDateRangeChange : undefined}
            onDateRangeClear={col.datepicker ? onDateRangeClear : undefined}
          />
        ))}
      </tr>
    </thead>
  );
}