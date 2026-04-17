"use client";

import { useState, useEffect, useCallback } from "react";
import { PaymentMethod } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function usePaymentMethod(id: number) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethod = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getMethod(id);
      setMethod(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMethod();
  }, [fetchMethod]);

  return { method, loading, error, refresh: fetchMethod, setMethod };
}
