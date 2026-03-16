import { Category, CategoryCountry } from "@/features/categories/types";

const BASE_URL = "/api/categories";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Kategoriler yüklenemedi.");
    return res.json();
  },

  getById: async (id: number): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Kategori bulunamadı.");
    return res.json();
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? `${res.status} Kategori oluşturulamadı.`);
    }
    return res.json();
  },

  update: async (id: number, data: Partial<Category>): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? `${res.status} Kategori güncellenemedi.`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Kategori silinemedi.");
  },

  updateForbiddenCountries: async (
    id: number,
    countries: CategoryCountry[]
  ): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forbiddenCountries: countries }),
    });
    if (!res.ok) throw new Error("Ülke kısıtlamaları güncellenemedi.");
    return res.json();
  },
};