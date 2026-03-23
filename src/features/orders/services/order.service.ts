import { api } from "@/lib/api/baseFetcher";
import { FetcherError } from "@/lib/api/types";
import { Order, OrderFilters, OrderExportParams } from "@/features/orders/types";

const BASE_URL = "/api/orders";

function buildParams(filters?: OrderFilters): Record<string, string | number | boolean | undefined | null> {
  if (!filters) return {};
  return {
    search: filters.search,
    userId: filters.userId,
    memberType: filters.memberType !== "all" ? filters.memberType : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };
}

function createBlobError(message: string, statusCode: number, code?: string): FetcherError {
  const error = new Error(message) as FetcherError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export const orderService = {
  getAll: (filters?: OrderFilters): Promise<Order[]> =>
    api.get<Order[]>(BASE_URL, buildParams(filters)),

  getById: (id: number): Promise<Order> =>
    api.get<Order>(`${BASE_URL}/${id}`),

  cancel: (id: number, reason?: string): Promise<Order> =>
    api.put<Order, { action: string; cancelReason?: string }>(
      `${BASE_URL}/${id}`,
      { action: "cancel", cancelReason: reason }
    ),

  // exportExcel blob döndürdüğü için baseFetcher yerine fetch kullanıldı
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
    let response: Response;

    try {
      response = await fetch(
        `${BASE_URL}/export${qs ? `?${qs}` : ""}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params ?? {}) }
      );
    } catch {
      throw createBlobError("Sunucuya bağlanılamadı.", 0, "NETWORK_ERROR");
    }

    if (response.status === 422) {
      const err = await response.json().catch(() => ({}));
      throw createBlobError(err.message ?? "Export limiti aşıldı.", 422, "LIMIT_EXCEEDED");
    }

    if (!response.ok) {
      throw createBlobError("Excel dosyası oluşturulamadı. Lütfen tekrar deneyin.", response.status);
    }

    return response.blob();
  },
};