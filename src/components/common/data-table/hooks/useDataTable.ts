"use client";

import { useState, useMemo } from "react";
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
  pageSize?: number;
  filterKeys?: (keyof T)[];
}

export function useDataTable<T extends Record<string, unknown>>({
  data,
  pageSize = 10,
  filterKeys = [],
}: UseDataTableProps<T>) {
  const { search } = useSearchStore();
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize });

  const handleSort = (column: string) => {
    setSort((prev) => {
      if (prev.column !== column) return { column, direction: "asc" };
      if (prev.direction === "asc") return { column, direction: "desc" };
      return { column: null, direction: null };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filtered = useMemo(() => {
    let result = [...data];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        filterKeys.some((key) =>
          String(row[key] ?? "").toLowerCase().includes(lower)
        )
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((row) => row["status"] === statusFilter);
    }

    if (sort.column && sort.direction) {
      result.sort((a, b) => {
        const aVal = a[sort.column!];
        const bVal = b[sort.column!];
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return sort.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, search, statusFilter, sort, filterKeys]);

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
    statusFilter,
    setStatusFilter,
    pagination,
    setPagination,
    totalPages,
  };
}