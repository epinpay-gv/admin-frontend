"use client";

import { useState, useEffect } from "react";
import { Category } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  return { categories, loading, error, updateCategory };
}