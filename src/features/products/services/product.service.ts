import { Product, Country } from "@/features/products/types";

const BASE_URL = "/api/products";
const COUNTRIES_URL = "/api/countries";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Ürünler yüklenemedi.");
    return res.json();
  },

  getById: async (id: number, locale: string = "en"): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}?locale=${locale}`);
    if (!res.ok) throw new Error("Ürün bulunamadı.");
    return res.json();
  },

  update: async (id: number, data: Partial<Product>, locale: string = "en"): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}?locale=${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, locale }),
    });
    if (!res.ok) throw new Error("Ürün güncellenemedi.");
    return res.json();
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Ürün oluşturulamadı.");
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Ürün silinemedi.");
  },

  updateForbiddenCountries: async (id: number, forbiddenCountries: Country[]): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forbiddenCountries }),
    });
    if (!res.ok) throw new Error("Ülke kısıtlamaları güncellenemedi.");
    return res.json();
  },

  getCountries: async (): Promise<Country[]> => {
    const res = await fetch(COUNTRIES_URL);
    if (!res.ok) throw new Error("Ülkeler getirilemedi.");
    return res.json();
  },
};