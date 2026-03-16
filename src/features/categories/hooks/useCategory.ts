"use client";

import { useEffect, useState } from "react";
import { Category } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";

export function useCategory(id: number | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoryService.getById(id);
        if (!cancelled) setCategory(data);
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
  }, [id]);

  return { category, loading, error };
}