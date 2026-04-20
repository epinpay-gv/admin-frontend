import { api } from "@/lib/api/baseFetcher";
import { Order, OrderFilters, OrderExportParams } from "@/features/orders/types";
import { ApiResponse } from "@/lib/api/types";

const BASE_URL = "/api/features/order";
const API_BASE = "http://localhost:3011";

/**
 * Filtreleri hem getAll hem de exportExcel için ortak bir formatta hazırlar.
 */
function buildParams(filters?: OrderFilters): Record<string, string | number | boolean | undefined | null> {
  if (!filters) return {};
  return {
    id: filters.id,
    userEmail: filters.userEmail,
    search: filters.search,
    userId: filters.userId,
    memberType: filters.memberType !== "all" ? filters.memberType : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page: filters.page,
    limit: filters.limit,
  };
}

export interface OrderListResponse extends ApiResponse<Order[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const orderService = {
  // Liste çekme - BFF yapısına uygun şekilde veri dönüyoruz
  getAll: async (filters?: OrderFilters): Promise<Order[]> => {
    const response = await api.get<OrderListResponse>(BASE_URL, buildParams(filters), { baseUrl: API_BASE });
    return response.data;
  },

  getAllFull: (filters?: OrderFilters): Promise<OrderListResponse> =>
    api.get<OrderListResponse>(BASE_URL, buildParams(filters), { baseUrl: API_BASE }),

  getById: async (id: string | number): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`${BASE_URL}/${id}`, undefined, { baseUrl: API_BASE });
    return response.data;
  },

  cancel: (id: string | number, reason?: string): Promise<ApiResponse<void>> =>
    api.post<ApiResponse<void>, { reason?: string }>(
      `${BASE_URL}/${id}/cancel`,
      { reason },
      { baseUrl: API_BASE }
    ),

  updateStatus: (id: string | number, status: string): Promise<ApiResponse<void>> =>
    api.patch<ApiResponse<void>, { status: string }>(
      `${BASE_URL}/${id}/status`,
      { status },
      { baseUrl: API_BASE }
    ),

  // Excel Export şimdilik mevcut haliyle kalıyor, BFF'de henüz karşılığı yok
  exportExcel: async (params?: OrderExportParams): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all") {
          searchParams.set(key, String(value));
        }
      });
    }

    const qs = searchParams.toString();
    const response = await fetch(
      `${BASE_URL}/export${qs ? `?${qs}` : ""}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params ?? {})
      }
    );

    if (!response.ok) {
      throw new Error("Excel dosyası oluşturulamadı.");
    }

    return response.blob();
  },
};