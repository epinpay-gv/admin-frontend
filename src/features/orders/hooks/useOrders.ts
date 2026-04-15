"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderFilters } from "@/features/orders/types";
import { orderService, OrderListResponse } from "@/features/orders/services/order.service";

export function useOrders(initialFilters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrderListResponse["pagination"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters ?? {});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // getFullResponse gibi bir yardımcı metot ekleyebilirdik ama şimdilik servis içinden hallediyoruz
      const response = await orderService.getAllFull(filters);
      setOrders(response.data);
      setPagination(response.pagination);
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

  return { 
    orders, 
    pagination,
    loading, 
    error, 
    filters, 
    applyFilters, 
    updateOrder, 
    refetch: fetchOrders 
  };
}