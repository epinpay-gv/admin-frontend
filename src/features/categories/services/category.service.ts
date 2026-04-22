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
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/features/categories/types";

export const categoryService = {
  /* ── Categories ─────────────────────────────────────────── */

  getAll: (filters?: CategoryFilters): Promise<CategoryListResponse> =>
    api.get<CategoryListResponse, CategoryFilters>(
      `/catalog/categories`,
      filters,
      { baseUrl: process.env.ADMIN_BFF_URL }
    ),

  getById: (id: number): Promise<Category> =>
    api.get<Category>(`/catalog/categories/${id}`,undefined, { baseUrl: process.env.ADMIN_BFF_URL }),

  create: (payload: CategoryCreatePayload): Promise<Category> =>
    api.post<Category, CategoryCreatePayload>(`/catalog/categories`, payload, { baseUrl: process.env.ADMIN_BFF_URL }),

  update: (
    id: number,
    payload: CategoryUpdatePayload,
  ): Promise<{ success: boolean; category: Category }> =>
    api.put(`/catalog/categories/${id}`, payload, { baseUrl: process.env.ADMIN_BFF_URL }),

  quickUpdate: (
    id: number,
    payload: CategoryQuickUpdatePayload,
  ): Promise<{ success: boolean; category?: Category }> =>
    api.patch(`/catalog/categories/${id}/quick-update`, payload, { baseUrl: process.env.ADMIN_BFF_URL }),

  /* ── Country ban/unban ──────────────────────────────────── */

  banCountries: (payload: BanCountriesPayload): Promise<BanCountriesResponse> =>
    api.post<BanCountriesResponse, BanCountriesPayload>(
      `/catalog/categories/ban-countries`,
      payload,
      { baseUrl: process.env.ADMIN_BFF_URL }

    ),

  unbanCountries: (
    payload: BanCountriesPayload,
  ): Promise<BanCountriesResponse> =>
    api.post<BanCountriesResponse, BanCountriesPayload>(
      `/catalog/categories/unban-countries`,
      payload,
      { baseUrl: process.env.ADMIN_BFF_URL }

    ),

  /* ── Category Products ───────────────────────────────────────────── */

  getProducts: (
    categoryId: number,
    page = 1,
    limit = 50,
  ): Promise<CategoryProductsResponse> =>
    api.get<CategoryProductsResponse>(
      `/catalog/categories/${categoryId}/products`,
      { page, limit },
      { baseUrl: process.env.ADMIN_BFF_URL }

    ),

  searchProducts: (
    q: string,
    page = 1,
    perPage = 10,
  ): Promise<ProductSearchResponse> =>
    api.get<ProductSearchResponse>(`/catalog/products/search`, {
      q,
      page,
      perPage,
    }, { baseUrl: process.env.ADMIN_BFF_URL }),

  addProduct: (
    categoryId: number,
    payload: AddProductToCategoryPayload,
  ): Promise<{ success: boolean }> =>
    api.post(`/catalog/categories/${categoryId}/products`, payload, { baseUrl: process.env.ADMIN_BFF_URL }),

  removeProduct: (
    categoryId: number,
    productId: number,
  ): Promise<{ success: boolean }> =>
    api.delete(`/catalog/categories/${categoryId}/products/${productId}`, { baseUrl: process.env.ADMIN_BFF_URL }),
};
