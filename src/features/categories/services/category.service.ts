import { api } from "@/lib/api/baseFetcher";
import {
  Category,
  CategoryFilters,
  CategoryListResponse,
  CategoryQuickUpdatePayload,
  BanCountriesPayload,
  BanCountriesResponse,
  CategoryProductsResponse,
  ProductSearchResponse,
  AddProductToCategoryPayload,
} from "@/features/categories/types";

const BASE = "/api/features/catalog";

export const categoryService = {
  /* ── Categories ─────────────────────────────────────────── */

  getAll: (filters?: CategoryFilters): Promise<CategoryListResponse> =>
    api.get<CategoryListResponse, CategoryFilters>(`${BASE}/categories`, filters),

  getById: (id: number): Promise<Category> =>
    api.get<Category>(`${BASE}/categories/${id}`),

  /** Fast-revise modal: name and/or slug */
  quickUpdate: (id: number, payload: CategoryQuickUpdatePayload): Promise<{ success: boolean; category?: Category }> =>
    api.patch(`${BASE}/categories/${id}/quick-update`, payload),

  /* ── Country ban/unban ──────────────────────────────────── */

  banCountries: (payload: BanCountriesPayload): Promise<BanCountriesResponse> =>
    api.post<BanCountriesResponse, BanCountriesPayload>(
      `${BASE}/categories/ban-countries`,
      payload,
    ),

  unbanCountries: (payload: BanCountriesPayload): Promise<BanCountriesResponse> =>
    api.post<BanCountriesResponse, BanCountriesPayload>(
      `${BASE}/categories/unban-countries`,
      payload,
    ),

  /* ── Products ───────────────────────────────────────────── */

  getProducts: (categoryId: number, page = 1, limit = 50): Promise<CategoryProductsResponse> =>
    api.get<CategoryProductsResponse>(
      `${BASE}/categories/${categoryId}/products`,
      { page, limit },
    ),

  searchProducts: (q: string, page = 1, perPage = 10): Promise<ProductSearchResponse> =>
    api.get<ProductSearchResponse>(`${BASE}/products/search`, { q, page, perPage }),

  addProduct: (categoryId: number, payload: AddProductToCategoryPayload): Promise<{ success: boolean }> =>
    api.post(`${BASE}/categories/${categoryId}/products`, payload),

  removeProduct: (categoryId: number, productId: number): Promise<{ success: boolean }> =>
    api.delete(`${BASE}/categories/${categoryId}/products/${productId}`),
};