"use client";

import { useState, useEffect, useCallback } from "react";
import { StreamerListItem, StreamerFilters } from "@/features/streamers/types";
import { streamerService } from "../services/streamer.service";

const DEFAULT_FILTERS: StreamerFilters = {
  search:  "",
  country: "",
  status:  "all",
};

export function useStreamers() {
  const [streamers, setStreamers]     = useState<StreamerListItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [filters, setFiltersState]    = useState<StreamerFilters>(DEFAULT_FILTERS);
  const [tick, setTick]               = useState(0);

  const fetchStreamers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await streamerService.getAll(filters);
      setStreamers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, tick]);

  useEffect(() => {
    fetchStreamers();
  }, [fetchStreamers]);

  const setFilters = useCallback((newFilters: StreamerFilters) => {
    setFiltersState(newFilters);
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
    setFilters,
    resetFilters,
    refresh,
  };
}