import { Order, OrderFilters } from "@/features/orders/types";

const BASE_URL = "/api/orders";

function buildQuery(filters?: OrderFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.memberType && filters.memberType !== "all") params.set("memberType", filters.memberType);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.userId) params.set("userId", String(filters.userId));
  const q = params.toString();
  return q ? `?${q}` : "";
}

export const orderService = {
  getAll: async (filters?: OrderFilters): Promise<Order[]> => {
    const res = await fetch(`${BASE_URL}${buildQuery(filters)}`);
    if (!res.ok) throw new Error("Siparişler yüklenemedi.");
    return res.json();
  },

  getById: async (id: number): Promise<Order> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Sipariş bulunamadı.");
    return res.json();
  },

  cancel: async (id: number, reason?: string): Promise<Order> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", cancelReason: reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Sipariş iptal edilemedi.");
    }
    return res.json();
  },

  exportExcel: async (filters?: OrderFilters): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/export${buildQuery(filters)}`);
    if (!res.ok) throw new Error("Excel dosyası oluşturulamadı.");
    return res.blob();
  },
};