"use client";

import { useState, useEffect } from "react";
import { Country, Product } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { toast } from "@/components/common/toast/toast";
import { useCountries } from "./useCountries";
import { CategoryCountry } from "@/features/categories";

export function useForbiddenCountries(product: Product | null) {
  const [forbiddenCodes, setForbiddenCodes] = useState<string[]>([]);
  const [originalCodes, setOriginalCodes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();

  useEffect(() => {
    const codes =
      product?.forbiddenCountries?.map((c) =>
        typeof c === "string" ? c : c.code,
      ) ?? [];
    setForbiddenCodes(codes);
    setOriginalCodes(codes);
  }, [product]);

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

  const setAllInactive = () => setForbiddenCodes(countries.map((c) => c.code));

  const save = async (onSuccess?: (updated: Product) => void) => {
    if (!product) return;
    setSaving(true);
    try {
      const toBan = forbiddenCodes.filter((c) => !originalCodes.includes(c));
      const toUnban = originalCodes.filter((c) => !forbiddenCodes.includes(c));

      await Promise.all([
        toBan.length
          ? productService.banCountries({
              productIds: [product.id],
              countries: toBan,
            })
          : Promise.resolve(),
        toUnban.length
          ? productService.unbanCountries({
              productIds: [product.id],
              countries: toUnban,
            })
          : Promise.resolve(),
      ]);

      const updatedProduct: Product = {
        ...product,
        forbiddenCountries: forbiddenCodes
          .map((code) => countries.find((c) => c.code === code))
          .filter((c): c is Country => !!c),
      };

      setOriginalCodes(forbiddenCodes); // commit baseline
      toast.success("Güncellendi", "Ülke kısıtlamaları güncellendi.");
      onSuccess?.(updatedProduct);
    } catch {
      toast.error("Hata", "Ülke kısıtlamaları güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return {
    forbidden, 
    forbiddenCodes, 
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
