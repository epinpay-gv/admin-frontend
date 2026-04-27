"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageWithCurrentDetail, PackageFilters } from "@/features/streamers/types";
import { packageService, UpdatePackageBody } from "../services/streamer.service";

const DEFAULT_FILTERS: PackageFilters = {
  search:   "",
  isActive: "all",
};

export function usePackages() {
  const [packages, setPackages]     = useState<PackageWithCurrentDetail[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [filters, setFiltersState]  = useState<PackageFilters>(DEFAULT_FILTERS);
  const [tick, setTick]             = useState(0);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await packageService.getAll(filters);
      setPackages(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, tick]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const setFilters = useCallback((newFilters: PackageFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Sadece local state'den kaldırır — backend'e istek atmaz
  const localDelete = useCallback((id: string) => {
    setDeletedIds((prev) => new Set([...prev, id]));
  }, []);

  // Silinen ID'leri listeden filtrele
  const visiblePackages = packages.filter((p) => !deletedIds.has(p.id));

  return {
    packages: visiblePackages,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
    localDelete,
  };
}

export function usePackage(id: string | null) {
  const [pkg, setPkg]         = useState<PackageWithCurrentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [tick, setTick]       = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const all   = await packageService.getAll({});
        const found = all.find((p) => p.id === id) ?? null;
        if (!cancelled) setPkg(found);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id, tick]);

  const updatePackage = useCallback(async (data: UpdatePackageBody): Promise<void> => {
    if (!id) return;
    setLoading(true);
    try {
      await packageService.update(id, data);
      setTick((t) => t + 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return { pkg, loading, error, updatePackage, refresh };
}