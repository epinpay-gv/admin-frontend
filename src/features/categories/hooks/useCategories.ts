"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "../types";
import { categoryService } from "../services/category.service";

export interface CatalogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 20;

export function useCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filters directly from URL — URL is the source of truth
  const filters = {
    name:   searchParams.get("name")   ?? undefined,
    status: searchParams.get("status") ?? undefined,
    page:   Number(searchParams.get("page")  ?? 1),
    limit:  Number(searchParams.get("limit") ?? DEFAULT_LIMIT),
  };

  const [categories, setCategories]   = useState<Category[]>([]);
  const [pagination, setPagination]   = useState<CatalogPagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT, totalPages: 0 });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll(filters);
      setCategories(response.categories.filter((c): c is Category => c !== null));
      setPagination(response.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // re-fetch whenever URL changes

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Writes filters back to URL — triggers re-fetch automatically
  const setFilters = useCallback((updates: Partial<typeof filters>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    // Any filter change resets to page 1 unless page itself is being changed
    if (!("page" in updates)) {
      current.set("page", "1");
    }

    router.push(`?${current.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const resetFilters = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  const goToPage = useCallback((page: number) => {
    setFilters({ page });
  }, [setFilters]);

  const updateCategory = useCallback((updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  return {
    categories,
    pagination,
    loading,
    error,
    filters,        // derived from URL, not state
    setFilters,     // writes to URL
    resetFilters,
    refresh: fetchCategories,
    updateCategory,
    goToPage,
  };
}