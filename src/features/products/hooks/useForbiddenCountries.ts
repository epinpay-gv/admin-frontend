"use client";

import { useState, useEffect } from "react";
import { Country, Product } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { toast } from "@/components/common/toast/toast";

export function useForbiddenCountries(product: Product | null) {
  const [forbidden, setForbidden] = useState<Country[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForbidden(product?.forbiddenCountries ?? []);
  }, [product]);

  const isForbidden = (code: string) => forbidden.some((f) => f.code === code);

  const addCountry = (country: Country) => {
    if (!isForbidden(country.code)) {
      setForbidden((prev) => [...prev, country]);
    }
  };

  const removeCountry = (code: string) => {
    setForbidden((prev) => prev.filter((f) => f.code !== code));
  };

  const toggleCountry = (country: Country) => {
    if (isForbidden(country.code)) {
      removeCountry(country.code);
    } else {
      addCountry(country);
    }
  };

  const save = async (onSuccess?: (updated: Product) => void) => {
    if (!product) return;
    setSaving(true);
    try {
      const updated = await productService.updateForbiddenCountries(
        product.id,
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

  return { forbidden, isForbidden, addCountry, removeCountry, toggleCountry, save, saving };
}