import { Blog, BlogTranslation } from "../types";

const BASE_URL = "/api/blog";

export const blogService = {

  getAll: async (): Promise<Blog[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Blog yazıları yüklenemedi.");
    return res.json();
  },

  getById: async (id: number): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Blog yazısı bulunamadı.");
    return res.json();
  },

  create: async (data: Partial<Blog>): Promise<Blog> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Blog yazısı oluşturulamadı.");
    return res.json();
  },

  update: async (id: number, data: Partial<Blog>): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Blog yazısı güncellenemedi.");
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Blog yazısı silinemedi.");
  },

  //  detay sayfasında TR veya EN tab'ı kaydedince çağrılır
  updateTranslation: async (
    blogId: number,
    translationId: number,
    data: Partial<BlogTranslation>
  ): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/${blogId}/translations/${translationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Çeviri güncellenemedi.");
    return res.json();
  },

};
