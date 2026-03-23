"use client";

import { useState, useEffect, useCallback } from "react";
import { CountryPackageVariant } from "@/features/streamers/types";
import { countryPackageVariantService } from "../services/streamer.service";


export function useCountryVariant(id: number | null) {
  const [variant, setVariant] = useState<CountryPackageVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariant = useCallback(async () => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setError(null);
    try {
      const data = await countryPackageVariantService.getById(id);
      if (!cancelled) setVariant(data);
    } catch (err) {
      if (!cancelled) setError((err as Error).message);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchVariant();
  }, [fetchVariant]);

  const updateVariant = useCallback(
    async (data: Partial<CountryPackageVariant>): Promise<CountryPackageVariant> => {
      if (!id) throw new Error("Varyant ID bulunamadı.");
      const updated = await countryPackageVariantService.update(id, data);
      setVariant(updated);
      return updated;
    },
    [id]
  );

  return {
    variant,
    loading,
    error,
    updateVariant,
    refresh: fetchVariant,
  };
}