"use client";

import { useEffect, useState, useCallback } from "react";
import { Category, CategoryFilters } from "../types";
import { categoryService } from "../services/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>({});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll(filters);
      setCategories(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateCategoryInState = (updated: Category) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const resetFilters = () => setFilters({});

  return { 
    categories, 
    loading, 
    error, 
    filters, 
    setFilters, 
    resetFilters, 
    refresh: fetchCategories,
    updateCategory: updateCategoryInState 
  };
}