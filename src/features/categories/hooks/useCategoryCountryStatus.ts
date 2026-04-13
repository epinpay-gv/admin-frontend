"use client";
import { useState, useEffect } from "react";
import { Category, CategoryCountry } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { toast } from "@/components/common/toast/toast";
import { useCountries } from "@/features/products/hooks/useCountries";

export function useCategoryCountryStatus(category: Category | null) {
  const [forbiddenCodes, setForbiddenCodes] = useState<string[]>([]);
  const [originalCodes, setOriginalCodes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();

  useEffect(() => {
    // category.forbiddenCountries is string[] from the BFF
    const codes = category?.forbiddenCountries ?? [];
    setForbiddenCodes(codes);
    setOriginalCodes(codes);
  }, [category]);

  // For rendering: resolve codes → full country objects
  const forbidden: CategoryCountry[] = forbiddenCodes
    .map((code) => countries.find((c) => c.code === code))
    .filter((c): c is CategoryCountry => !!c);

  const isForbidden = (code: string) => forbiddenCodes.includes(code);

  const toggleCountry = (country: CategoryCountry) => {
    setForbiddenCodes((prev) =>
      prev.includes(country.code)
        ? prev.filter((c) => c !== country.code)
        : [...prev, country.code],
    );
  };

  const setAllActive = () => setForbiddenCodes([]);

  const setAllInactive = () =>
    setForbiddenCodes(countries.map((c) => c.code));

  const save = async (onSuccess?: (updated: Category) => void) => {
    if (!category) return;
    setSaving(true);
    try {
      const toBan = forbiddenCodes.filter((c) => !originalCodes.includes(c));
      const toUnban = originalCodes.filter((c) => !forbiddenCodes.includes(c));

      await Promise.all([
        toBan.length
          ? categoryService.banCountries({ categoryIds: [category.id], countries: toBan })
          : Promise.resolve(),
        toUnban.length
          ? categoryService.unbanCountries({ categoryIds: [category.id], countries: toUnban })
          : Promise.resolve(),
      ]);

      // Build the updated category locally since the BFF ban/unban endpoints
      // return { message, updated } — not the full category object.
      const updatedCategory: Category = {
        ...category,
        forbiddenCountries: forbiddenCodes,
      };

      setOriginalCodes(forbiddenCodes); // commit baseline
      toast.success("Güncellendi", "Ülke kısıtlamaları güncellendi.");
      onSuccess?.(updatedCategory);
    } catch {
      toast.error("Hata", "Ülke kısıtlamaları güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return {
    forbidden,         // CategoryCountry[] for rendering tags/list
    forbiddenCodes,    // string[] if any child needs raw codes
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