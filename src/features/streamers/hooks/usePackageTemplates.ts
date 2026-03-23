"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageTemplate, TEMPLATE_STATUS } from "@/features/streamers/types";
import { packageTemplateService } from "../services/streamer.service";


type PackageTemplateFilters = {
  search: string;
  status: TEMPLATE_STATUS | "";
};

const DEFAULT_FILTERS: PackageTemplateFilters = {
  search: "",
  status: "",
};

export function usePackageTemplates() {
  const [templates, setTemplates] = useState<PackageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PackageTemplateFilters>(DEFAULT_FILTERS);
  const [tick, setTick] = useState(0);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await packageTemplateService.getAll({
        search: filters.search || undefined,
        status: (filters.status as TEMPLATE_STATUS) || undefined,
      });
      setTemplates(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, tick]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const setFilters = useCallback((newFilters: PackageTemplateFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const createTemplate = useCallback(
    async (data: Partial<PackageTemplate>): Promise<PackageTemplate> => {
      const created = await packageTemplateService.create(data);
      refresh();
      return created;
    },
    [refresh]
  );

  return {
    templates,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
    createTemplate,
  };
}