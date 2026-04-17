"use client";

import { useState, useEffect, useCallback } from "react";
import { ProviderMethod } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function useProviderMethod(id: number) {
  const [providerMethod, setProviderMethod] = useState<ProviderMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviderMethod = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getProviderMethod(id);
      setProviderMethod(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProviderMethod();
  }, [fetchProviderMethod]);

  return { providerMethod, loading, error, refresh: fetchProviderMethod, setProviderMethod };
}
