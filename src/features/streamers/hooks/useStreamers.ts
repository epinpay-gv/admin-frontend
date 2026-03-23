"use client";


import { useState, useEffect, useCallback } from "react";
import { Streamer, STREAMER_STATUS, PACKAGE_STATUS } from "@/features/streamers/types";
import { streamerService } from "../services/streamer.service";


type StreamerFilters = {
  search: string;
  countryCode: string;
  streamerStatus: STREAMER_STATUS | "";
  packageStatus: PACKAGE_STATUS | "";
};

const DEFAULT_FILTERS: StreamerFilters = {
  search: "",
  countryCode: "",
  streamerStatus: "",
  packageStatus: "",
};

export function useStreamers() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<StreamerFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<keyof Streamer>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tick, setTick] = useState(0);

  const fetchStreamers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await streamerService.getAll({
        search: filters.search || undefined,
        countryCode: filters.countryCode || undefined,
        streamerStatus: (filters.streamerStatus as STREAMER_STATUS) || undefined,
        packageStatus: (filters.packageStatus as PACKAGE_STATUS) || undefined,
        sortKey: String(sortKey),
        sortDir,
      });
      setStreamers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, sortKey, sortDir, tick]);

  useEffect(() => {
    fetchStreamers();
  }, [fetchStreamers]);

  const setFilters = useCallback((newFilters: StreamerFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setSort = useCallback((key: keyof Streamer, dir: "asc" | "desc") => {
    setSortKey(key);
    setSortDir(dir);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return {
    streamers,
    loading,
    error,
    filters,
    sortKey,
    sortDir,
    setFilters,
    setSort,
    resetFilters,
    refresh,
  };
}