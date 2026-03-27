"use client";

import { useEffect, useState, useCallback } from "react";
import { Product, ProductFilters } from "../types";
import { productService } from "@/features/products/services/product.service";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetFilters = () => setFilters({});
  const refresh = () => fetchProducts();

  return { products, loading, error, filters, setFilters, resetFilters, refresh };
}