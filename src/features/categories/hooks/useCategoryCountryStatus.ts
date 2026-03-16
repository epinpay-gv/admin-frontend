"use client";

import { useState, useEffect } from "react";
import { Category, CategoryCountry } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { toast } from "@/components/common/toast/toast";
import { useCountries } from "@/features/products/hooks/useCountries";

export function useCategoryCountryStatus(category: Category | null) {
  const [forbidden, setForbidden] = useState<CategoryCountry[]>([]);
  const [saving, setSaving] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();

  useEffect(() => {
    setForbidden(category?.forbiddenCountries ?? []);
  }, [category]);

  const isForbidden = (code: string) =>
    forbidden.some((f) => f.code === code);

  const toggleCountry = (country: CategoryCountry) => {
    if (isForbidden(country.code)) {
      setForbidden((prev) => prev.filter((f) => f.code !== country.code));
    } else {
      setForbidden((prev) => [...prev, country]);
    }
  };

  const setAllActive = () => setForbidden([]);

  const setAllInactive = () => {
    setForbidden(
      countries.map((c) => ({
        code: c.code,
        code3: c.code3,
        name: c.name,
        region: c.region,
      }))
    );
  };

  const save = async (onSuccess?: (updated: Category) => void) => {
    if (!category) return;
    setSaving(true);
    try {
      const updated = await categoryService.updateForbiddenCountries(
        category.id,
        forbidden
      );
      toast.success("Güncellendi", "Ülke kısıtlamaları güncellendi.");
      onSuccess?.(updated);
    } catch {
      toast.error("Hata", "Ülke kısıtlamaları güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return {
    forbidden,
    isForbidden,
    toggleCountry,
    setAllActive,
    setAllInactive,
    save,
    saving,
    countries,
    countriesLoading,
  };
}