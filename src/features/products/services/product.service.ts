import { api } from "@/lib/api/baseFetcher";
import { Product, Country } from "@/features/products/types";

const BASE_URL = "/api/products";
const COUNTRIES_URL = "/api/countries";

export const productService = {
  getAll: (): Promise<Product[]> =>
    api.get<Product[]>(BASE_URL),

  getById: (id: number, locale: string = "en"): Promise<Product> =>
    api.get<Product>(`${BASE_URL}/${id}`, { locale }),

  create: (data: Partial<Product>): Promise<Product> =>
    api.post<Product, Partial<Product>>(BASE_URL, data),

  update: (id: number, data: Partial<Product>, locale: string = "en"): Promise<Product> =>
    api.put<Product, Partial<Product> & { locale: string }>(
      `${BASE_URL}/${id}`,
      { ...data, locale },
      { params: { locale } }
    ),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${id}`),

  updateForbiddenCountries: (id: number, forbiddenCountries: Country[]): Promise<Product> =>
    api.patch<Product, { forbiddenCountries: Country[] }>(
      `${BASE_URL}/${id}`,
      { forbiddenCountries }
    ),

  getCountries: (): Promise<Country[]> =>
    api.get<Country[]>(COUNTRIES_URL),
};