"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PaymentProvider, PaymentProviderFilters } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function usePaymentProviders(filters?: PaymentProviderFilters) {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getProviders();
      setProviders(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (filters?.search) {
        if (!p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      }
      if (filters?.feeType && filters.feeType !== "all") {
        if (p.feeType !== filters.feeType) return false;
      }
      if (filters?.isActive !== undefined && filters.isActive !== "all") {
        const isActiveBool = String(filters.isActive) === "true";
        if (p.isActive !== isActiveBool) return false;
      }
      return true;
    });
  }, [providers, filters]);

  const removeProvider = (id: number) =>
    setProviders((prev) => prev.filter((p) => p.id !== id));

  const updateProvider = (updated: PaymentProvider) =>
    setProviders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  return { 
    providers: filteredProviders, 
    allProviders: providers,
    loading, 
    error, 
    refresh: fetchProviders, 
    removeProvider, 
    updateProvider 
  };
}
