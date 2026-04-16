"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ProviderMethod, ProviderMethodFilters } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function useProviderMethods(filters?: ProviderMethodFilters) {
  const [providerMethods, setProviderMethods] = useState<ProviderMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviderMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getProviderMethods();
      setProviderMethods(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviderMethods();
  }, [fetchProviderMethods]);

  const filteredProviderMethods = useMemo(() => {
    return providerMethods.filter((pm) => {
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const providerName = pm.provider?.name.toLowerCase() || "";
        const methodName = pm.method?.name.toLowerCase() || "";
        if (!providerName.includes(q) && !methodName.includes(q)) {
          return false;
        }
      }
      if (filters?.feeType && filters.feeType !== "all") {
        if (pm.feeType !== filters.feeType) return false;
      }
      return true;
    });
  }, [providerMethods, filters]);

  const removeProviderMethod = (id: number) =>
    setProviderMethods((prev) => prev.filter((pm) => pm.id !== id));

  const updateProviderMethod = (updated: ProviderMethod) =>
    setProviderMethods((prev) =>
      prev.map((pm) => (pm.id === updated.id ? updated : pm))
    );

  return {
    providerMethods: filteredProviderMethods,
    allProviderMethods: providerMethods,
    loading,
    error,
    refresh: fetchProviderMethods,
    removeProviderMethod,
    updateProviderMethod,
  };
}
