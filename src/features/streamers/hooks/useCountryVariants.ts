"use client";

import { useState, useEffect, useCallback } from "react";
import { CountryPackageVariant, VARIANT_STATUS } from "@/features/streamers/types";
import { countryPackageVariantService } from "../services/streamer.service";


type CountryVariantFilters = {
  search: string;
  countryCode: string;
  templateId: number | "";
  status: VARIANT_STATUS | "";
};

const DEFAULT_FILTERS: CountryVariantFilters = {
  search: "",
  countryCode: "",
  templateId: "",
  status: "",
};

export function useCountryVariants() {
  const [variants, setVariants] = useState<CountryPackageVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<CountryVariantFilters>(DEFAULT_FILTERS);
  const [tick, setTick] = useState(0);

  const fetchVariants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await countryPackageVariantService.getAll({
        search: filters.search || undefined,
        countryCode: filters.countryCode || undefined,
        templateId: (filters.templateId as number) || undefined,
        status: (filters.status as VARIANT_STATUS) || undefined,
      });
      setVariants(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, tick]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const setFilters = useCallback((newFilters: CountryVariantFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const createVariant = useCallback(
    async (data: Partial<CountryPackageVariant>): Promise<CountryPackageVariant> => {
      const created = await countryPackageVariantService.create(data);
      refresh();
      return created;
    },
    [refresh]
  );

  return {
    variants,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
    createVariant,
  };
}