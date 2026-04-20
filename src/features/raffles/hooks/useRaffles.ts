"use client";

import { useState, useEffect, useCallback } from "react";
import { Raffle, RaffleFilters } from "@/features/raffles/types";
import { raffleService } from "@/features/raffles/services/raffle.service";

const DEFAULT_FILTERS: RaffleFilters = {
  search: "",
  creatorType: "all",
  type: "all",
  status: "all",
  startDate: "",
  endDate: "",
};

export function useRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<RaffleFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<keyof Raffle>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tick, setTick] = useState(0);

  const fetchRaffles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await raffleService.getAll({
        ...filters,
        sortKey: sortKey as string,
        sortDir,
      });
      setRaffles(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, sortKey, sortDir, tick]);

  useEffect(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  const setFilters = useCallback((newFilters: RaffleFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setSort = useCallback((key: keyof Raffle, dir: "asc" | "desc") => {
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
    raffles,
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
