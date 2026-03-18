import { api } from "@/lib/api/baseFetcher";
import { Category, CategoryCountry } from "@/features/categories/types";

const BASE_URL = "/api/categories";

export const categoryService = {
  getAll: (): Promise<Category[]> =>
    api.get<Category[]>(BASE_URL),

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