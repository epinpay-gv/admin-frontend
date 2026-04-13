"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "../types";
import { productService } from "@/features/products/services/product.service";
import { CatalogPagination } from "@/features/categories";

const DEFAULT_LIMIT = 20;

export function useProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL is the source of truth — derived, not state
const filters = {
  name:       searchParams.get("name")       ?? undefined,
  status:     searchParams.get("status")     ?? undefined,
  categoryId: searchParams.get("productId") ? Number(searchParams.get("productId")) : undefined,
  page:       Number(searchParams.get("page")  ?? 1),
  limit:      Number(searchParams.get("limit") ?? DEFAULT_LIMIT),
};

  const [products, setProducts]     = useState<Product[]>([]);
  const [pagination, setPagination] = useState<CatalogPagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT, totalPages: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAll(filters);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // re-fetch whenever URL changes

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setFilters = useCallback((updates: Partial<typeof filters>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

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

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh: fetchProducts,
    updateProduct,
    goToPage,
  };
}