"use client";

import { useState, useEffect } from "react";
import { productMetaService, ProductMeta } from "@/features/products/services/product-meta.service";

export function useProductMeta() {
  const [meta, setMeta] = useState<ProductMeta>({
    types: [],
    platforms: [],
    regions: [],
  categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productMetaService
      .getAll()
      .then(setMeta)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { ...meta, loading, error };
}