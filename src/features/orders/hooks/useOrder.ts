"use client";

import { useState, useEffect } from "react";
import { Order } from "@/features/orders/types";
import { orderService } from "@/features/orders/services/order.service";

export function useOrder(id: number | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getById(id);
        if (!cancelled) setOrder(data);
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
  }, [id]);

  const updateOrder = (updated: Order) => setOrder(updated);

  return { order, loading, error, updateOrder };
}