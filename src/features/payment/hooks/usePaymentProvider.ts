"use client";

import { useState, useEffect, useCallback } from "react";
import { PaymentProvider } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function usePaymentProvider(id: number) {
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvider = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getProvider(id);
      setProvider(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  return { provider, loading, error, refresh: fetchProvider, setProvider };
}
