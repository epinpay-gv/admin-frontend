"use client";

import { useState, useEffect } from "react";
import { PaymentMethod, PaymentMethodFilters } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";

export function usePayment(filters?: PaymentMethodFilters) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await paymentService.getAll(filters);
        if (!cancelled) setMethods(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateMethod = (updated: PaymentMethod) =>
    setMethods((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );

  return { methods, loading, error, updateMethod };
}