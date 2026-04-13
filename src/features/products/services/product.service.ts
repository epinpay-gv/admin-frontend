import { api } from "@/lib/api/baseFetcher";
import {
  Product,
  Country,
  ProductFilters,
  ProductQuickUpdatePayload,
} from "@/features/products/types";
import { CatalogPagination } from "@/features/categories";

const BASE_URL = "/api/features/catalog";

export const productService = {
  /* ── Products ─────────────────────────────────────────── */
  getAll: (
    filters?: ProductFilters,
  ): Promise<{ products: Product[]; pagination: CatalogPagination }> =>
    api.get<
      { products: Product[]; pagination: CatalogPagination },
      ProductFilters
    >(`${BASE_URL}/products`, filters),

  getById: (id: number, locale: string = "en"): Promise<Product> =>
    api.get<Product>(`${BASE_URL}/${id}`, { locale }),

  create: (data: Partial<Product>): Promise<Product> =>
    api.post<Product, Partial<Product>>(BASE_URL, data),

  update: (
    id: number,
    data: Partial<Product>,
    locale: string = "en",
  ): Promise<Product> =>
    api.put<Product, Partial<Product> & { locale: string }>(
      `${BASE_URL}/${id}`,
      { ...data, locale },
    ),

  quickUpdate: (
    id: number,
    payload: ProductQuickUpdatePayload,
  ): Promise<{ success: boolean; product?: Product }> =>
    api.patch(`${BASE_URL}/products/${id}/quick-update`, payload),

  delete: (id: number): Promise<void> => api.delete<void>(`${BASE_URL}/${id}`),

  /* ── Country ban/unban ──────────────────────────────────── */

  getCountries: async (): Promise<Country[]> => {
    const res = await fetch("/api/countries");
    if (!res.ok) {
      throw new Error("Failed to fetch countries");
    }
    return res.json();
  },

  banCountries: (payload: {
    productIds: number[];
    countries: string[];
  }): Promise<void> =>
    api.post<void, { productIds: number[]; countries: string[] }>(
      `${BASE_URL}/products/ban-countries`,
      payload,
    ),

  unbanCountries: (payload: {
    productIds: number[];
    countries: string[];
  }): Promise<void> =>
    api.post<void, { productIds: number[]; countries: string[] }>(
      `${BASE_URL}/products/unban-countries`,
      payload,
    ),
};
