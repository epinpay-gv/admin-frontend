"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PaymentMethod, PaymentMethodFilters } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function usePaymentMethods(filters?: PaymentMethodFilters) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getMethods();
      setMethods(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const filteredMethods = useMemo(() => {
    return methods.filter((m) => {
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.slug.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [methods, filters]);

  const removeMethod = (id: number) =>
    setMethods((prev) => prev.filter((m) => m.id !== id));

  const updateMethod = (updated: PaymentMethod) =>
    setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  return { 
    methods: filteredMethods, 
    allMethods: methods,
    loading, 
    error, 
    refresh: fetchMethods, 
    removeMethod, 
    updateMethod 
  };
}
