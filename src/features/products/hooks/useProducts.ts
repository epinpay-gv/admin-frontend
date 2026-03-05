"use client";

import { useEffect, useState } from "react";
import { Product } from "@/features/products/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setError("Ürünler yüklenirken hata oluştu."))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}