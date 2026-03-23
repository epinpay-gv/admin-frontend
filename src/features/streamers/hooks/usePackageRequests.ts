"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PackageRequest,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_TYPE,
} from "@/features/streamers/types";
import { packageRequestService } from "../services/streamer.service";


type PackageRequestFilters = {
  search: string;
  countryCode: string;
  requestType: PACKAGE_REQUEST_TYPE | "";
  status: PACKAGE_REQUEST_STATUS | "";
  packageId: number | "";
  dateFrom: string;
  dateTo: string;
};

const DEFAULT_FILTERS: PackageRequestFilters = {
  search: "",
  countryCode: "",
  requestType: "",
  status: "",
  packageId: "",
  dateFrom: "",
  dateTo: "",
};

export function usePackageRequests() {
  const [requests, setRequests] = useState<PackageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PackageRequestFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<keyof PackageRequest>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tick, setTick] = useState(0);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await packageRequestService.getAll({
        search: filters.search || undefined,
        countryCode: filters.countryCode || undefined,
        requestType: (filters.requestType as PACKAGE_REQUEST_TYPE) || undefined,
        status: (filters.status as PACKAGE_REQUEST_STATUS) || undefined,
        packageId: (filters.packageId as number) || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        sortKey: String(sortKey),
        sortDir,
      });
      setRequests(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters, sortKey, sortDir, tick]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const setFilters = useCallback((newFilters: PackageRequestFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setSort = useCallback(
    (key: keyof PackageRequest, dir: "asc" | "desc") => {
      setSortKey(key);
      setSortDir(dir);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return {
    requests,
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