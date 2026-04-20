import { api } from "@/lib/api/baseFetcher";

const BFF_BASE = "/api/features/store";
const API_BASE = "http://localhost:3011";

export interface StoreListItem {
  id: string;
  name: string;
  userId: string;
  status: string;
  level: string;
  createdAt: string;
}

export interface StoreApiResponse<T> {
  success: boolean;
  data: T;
}

export const storeService = {
  getAll: (params?: Record<string, unknown>): Promise<StoreApiResponse<StoreListItem[]>> =>
    api.get<StoreApiResponse<StoreListItem[]>>(BFF_BASE, params, { baseUrl: API_BASE }),

  getById: (storeId: string): Promise<StoreApiResponse<unknown>> =>
    api.get<StoreApiResponse<unknown>>(`${BFF_BASE}/${storeId}/full-details`, undefined, { baseUrl: API_BASE }),

  updateStatus: (storeId: string, status: string): Promise<StoreApiResponse<null>> =>
    api.patch<StoreApiResponse<null>, { status: string }>(`${BFF_BASE}/${storeId}/status`, { status }, { baseUrl: API_BASE }),
};