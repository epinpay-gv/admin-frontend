"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderFilters } from "@/features/orders/types";
import { orderService } from "@/features/orders/services/order.service";

export function useOrders(initialFilters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters ?? {});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Filtreler buildParams üzerinden servise, oradan query string'e gider
      const data = await orderService.getAll(filters);
      setOrders(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const applyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const updateOrder = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  return { orders, loading, error, filters, applyFilters, updateOrder, refetch: fetchOrders };
}