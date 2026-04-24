"use client";

import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "../components/DataTableHeader";
import { useSearchStore } from "@/store/useSearchStore";

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface DateRangeFilter {
  from: Date | undefined;
  to: Date | undefined;
}

interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  dateKey?: string;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string ?? "";
}

export function useDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  dateKey = "createdAt",
}: UseDataTableProps<T>) {
  const { search, clearSearch } = useSearchStore();
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ from: undefined, to: undefined });
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize });

  useEffect(() => {
    return () => clearSearch();
  }, [clearSearch]);

  const handleSort = (column: string) => {
    setSort((prev) => {
      if (prev.column !== column) return { column, direction: "asc" };
      if (prev.direction === "asc") return { column, direction: "desc" };
      return { column: null, direction: null };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [column]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearColumnFilter = (column: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[column];
      return next;
    });
  };

  const handleDateRangeChange = (range: DateRangeFilter) => {
    setDateRange(range);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filtered = useMemo(() => {
    let result = [...(Array.isArray(data) ? data : [])];

    // Global arama
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const searchPath = col.searchKey ?? String(col.key);
          return getNestedValue(row as Record<string, unknown>, searchPath)
            .toString()
            .toLowerCase()
            .includes(lower);
        })
      );
    }

    // Kolon filtreleri
    Object.entries(columnFilters).forEach(([colKey, val]) => {
      if (!val) return;
      const lower = val.toLowerCase();
      const col = columns.find((c) => String(c.key) === colKey);
      const searchPath = col?.searchKey ?? colKey;
      result = result.filter((row) =>
        getNestedValue(row as Record<string, unknown>, searchPath)
          .toString()
          .toLowerCase()
          .includes(lower)
      );
    });

    // Status filtresi
    if (statusFilter !== "all") {
      result = result.filter((row) => row["status"] === statusFilter);
    }

    // Tarih aralığı filtresi
    if (dateRange.from || dateRange.to) {
      result = result.filter((row) => {
        const raw = getNestedValue(row as Record<string, unknown>, dateKey);
        if (!raw) return false;
        const rowDate = new Date(raw);

        if (dateRange.from && dateRange.to) {
          // to günün sonuna kadar dahil et
          const toEnd = new Date(dateRange.to);
          toEnd.setHours(23, 59, 59, 999);
          return rowDate >= dateRange.from && rowDate <= toEnd;
        }
        if (dateRange.from) return rowDate >= dateRange.from;
        if (dateRange.to) {
          const toEnd = new Date(dateRange.to);
          toEnd.setHours(23, 59, 59, 999);
          return rowDate <= toEnd;
        }
        return true;
      });
    }

    // Sıralama — tarih kolonları için doğru karşılaştırma
    if (sort.column && sort.direction) {
      const col = columns.find((c) => String(c.key) === sort.column);
      const sortPath = col?.sortKey ?? sort.column;
      result.sort((a, b) => {
        const aRaw = getNestedValue(a as Record<string, unknown>, sortPath);
        const bRaw = getNestedValue(b as Record<string, unknown>, sortPath);

        // Tarih mi kontrol et
        const aDate = Date.parse(aRaw);
        const bDate = Date.parse(bRaw);
        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sort.direction === "asc" ? aDate - bDate : bDate - aDate;
        }

        // Sayı mı kontrol et
        const aNum = Number(aRaw);
        const bNum = Number(bRaw);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // String karşılaştırma
        return sort.direction === "asc"
          ? aRaw.toString().localeCompare(bRaw.toString())
          : bRaw.toString().localeCompare(aRaw.toString());
      });
    }

    return result;
  }, [data, search, columnFilters, statusFilter, dateRange, dateKey, sort, columns]);

  const totalPages = Math.ceil(filtered.length / pagination.pageSize);

  const paginated = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  return {
    rows: paginated,
    filteredRows: filtered, // ← callback yerine doğrudan dışarı aç
    totalRows: filtered.length,
    sort,
    handleSort,
    columnFilters,
    setColumnFilter,
    clearColumnFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    handleDateRangeChange,
    clearDateRange,
    pagination,
    setPagination,
    totalPages,
  };
}