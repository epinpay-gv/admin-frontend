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

interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
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
}: UseDataTableProps<T>) {
  const { search, clearSearch } = useSearchStore();
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize });

  // Sayfa değişince search'ü temizle
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

  const filtered = useMemo(() => {
    let result = [...data];

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

    if (statusFilter !== "all") {
      result = result.filter((row) => row["status"] === statusFilter);
    }

    if (sort.column && sort.direction) {
      const col = columns.find((c) => String(c.key) === sort.column);
      const sortPath = col?.sortKey ?? sort.column;
      result.sort((a, b) => {
        const aStr = getNestedValue(a as Record<string, unknown>, sortPath).toString();
        const bStr = getNestedValue(b as Record<string, unknown>, sortPath).toString();
        return sort.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, search, columnFilters, statusFilter, sort, columns]);

  const totalPages = Math.ceil(filtered.length / pagination.pageSize);

  const paginated = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  return {
    rows: paginated,
    totalRows: filtered.length,
    sort,
    handleSort,
    columnFilters,
    setColumnFilter,
    clearColumnFilter,
    statusFilter,
    setStatusFilter,
    pagination,
    setPagination,
    totalPages,
  };
}