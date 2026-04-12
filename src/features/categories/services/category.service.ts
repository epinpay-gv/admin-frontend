import { api } from "@/lib/api/baseFetcher";
import { Category, CategoryCountry, CategoryFilters, CategoryListResponse } from "@/features/categories/types";

// const BASE_URL = "/api/categories";
const BASE_URL = "/api/features/catalog/categories";

export const categoryService = {
  // REVİZE: CategoryFilters tipinde opsiyonel bir parametre ekledik
  getAll: (filters?: CategoryFilters): Promise<CategoryListResponse> =>
    api.get<CategoryListResponse, CategoryFilters>(BASE_URL, filters),

  getById: (id: number): Promise<Category> =>
    api.get<Category>(`${BASE_URL}/${id}`),

  create: (data: Partial<Category>): Promise<Category> =>
    api.post<Category, Partial<Category>>(BASE_URL, data),

  update: (id: number, data: Partial<Category>): Promise<Category> =>
    api.put<Category, Partial<Category>>(`${BASE_URL}/${id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${id}`),

  updateForbiddenCountries: (id: number, countries: CategoryCountry[]): Promise<Category> =>
    api.put<Category, { forbiddenCountries: CategoryCountry[] }>(
      `${BASE_URL}/${id}`,
      { forbiddenCountries: countries }
    ),
};