import { Product } from "@/features/products/types";

const BASE_URL = "/api/products";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Ürünler yüklenemedi.");
    return res.json();
  },

  getById: async (id: number): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Ürün bulunamadı.");
    return res.json();
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
};