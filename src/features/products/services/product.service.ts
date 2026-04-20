import { api } from "@/lib/api/baseFetcher";
import {
  Product,
  Country,
  ProductFilters,
  ProductQuickUpdatePayload,
} from "@/features/products/types";
import { CatalogPagination } from "@/features/categories";

const BASE_URL = "/api/features/catalog";
const API_BASE = "http://localhost:3011";

export const productService = {
  /* ── Products ─────────────────────────────────────────── */
  getAll: (
    filters?: ProductFilters,
  ): Promise<{ products: Product[]; pagination: CatalogPagination }> =>
    api.get<{ products: Product[]; pagination: CatalogPagination }, ProductFilters>(
      `${BASE_URL}/products`,
      filters,
      { baseUrl: API_BASE }
    ),

  getById: (id: number): Promise<Product> =>
    api.get<Product>(`${BASE_URL}/products/${id}`,undefined, { baseUrl: API_BASE }),

  create: (data: Partial<Product>): Promise<Product> =>
    api.post<Product, Partial<Product>>(`${BASE_URL}/products`, data , { baseUrl: API_BASE }),

  update: (id: number, data: Partial<Product>): Promise<Product> =>
    api.put<Product, Partial<Product>>(`${BASE_URL}/products/${id}`, data, { baseUrl: API_BASE }),

  quickUpdate: (
    id: number,
    payload: ProductQuickUpdatePayload,
  ): Promise<{ success: boolean; product?: Product }> =>
    api.patch(`${BASE_URL}/products/${id}/quick-update`, payload, { baseUrl: API_BASE }),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/products/${id}`, { baseUrl: API_BASE }),

  /* ── Country ban/unban ──────────────────────────────────── */

  getCountries: async (): Promise<Country[]> => {
    const res = await fetch("/api/countries");
    if (!res.ok) throw new Error("Failed to fetch countries");
    return res.json();
  },

  banCountries: (payload: {
    productIds: number[];
    countries: string[];
  }): Promise<void> =>
    api.post<void, { productIds: number[]; countries: string[] }>(
      `${BASE_URL}/products/ban-countries`,
      payload,
      { baseUrl: API_BASE }
    ),

  unbanCountries: (payload: {
    productIds: number[];
    countries: string[];
  }): Promise<void> =>
    api.post<void, { productIds: number[]; countries: string[] }>(
      `${BASE_URL}/products/unban-countries`,
      payload,
      { baseUrl: API_BASE }
    ),
};