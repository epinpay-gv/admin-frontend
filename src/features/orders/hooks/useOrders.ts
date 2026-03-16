"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Order, OrderFilters } from "@/features/orders/types";
import { orderService } from "@/features/orders/services/order.service";

function applyClientFilters(orders: Order[], filters: OrderFilters): Order[] {
  let result = [...orders];

  if (filters.status && filters.status !== "all") {
    result = result.filter((o) => o.status === filters.status);
  }
  if (filters.memberType && filters.memberType !== "all") {
    result = result.filter((o) => o.memberType === filters.memberType);
  }
  if (filters.userId) {
    result = result.filter((o) => o.userId === filters.userId);
  }
  if (filters.dateFrom) {
    result = result.filter((o) => new Date(o.createdAt) >= new Date(filters.dateFrom!));
  }
  if (filters.dateTo) {
    result = result.filter((o) => new Date(o.createdAt) <= new Date(filters.dateTo!));
  }

  return result;
}

export function useOrders(initialFilters?: OrderFilters) {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters ?? {});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Tüm veriyi bir kere çek, filtreleme client-side yapılır
      const data = await orderService.getAll();
      setAllOrders(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Aktif filtrelere göre türetilen liste — DataTable ve export her zaman bunu kullanır
  const orders = useMemo(() => applyClientFilters(allOrders, filters), [allOrders, filters]);

  const applyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const updateOrder = (updated: Order) => {
    setAllOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  return { orders, loading, error, filters, applyFilters, updateOrder, refetch: fetchOrders };
}