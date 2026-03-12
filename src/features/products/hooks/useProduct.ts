"use client";

import { useEffect, useState } from "react";
import { Product } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";

export function useProduct(id: number | null, locale: string = "en") {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getById(id, locale);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [id, locale]);

  return { product, loading, error };
}