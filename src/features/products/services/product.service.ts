import { api } from "@/lib/api/baseFetcher";
import { Product, Country, ProductFilters } from "@/features/products/types";

const BASE_URL = "/api/products";
const COUNTRIES_URL = "/api/countries";

export const productService = {
  getAll: (filters?: ProductFilters): Promise<Product[]> =>
    api.get<Product[], ProductFilters>(BASE_URL, filters),

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

  delete: (id: number): Promise<void> => api.delete<void>(`${BASE_URL}/${id}`),

  updateForbiddenCountries: (
    id: number,
    forbiddenCountries: Country[],
  ): Promise<Product> =>
    api.patch<Product, { forbiddenCountries: Country[] }>(`${BASE_URL}/${id}`, {
      forbiddenCountries,
    }),

  getCountries: async (): Promise<Country[]> => {
    const res = await fetch("/api/countries");
    if (!res.ok) {
      throw new Error("Failed to fetch countries");
    }
    return res.json();
  },
};
