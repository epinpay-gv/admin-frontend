import { api } from "@/lib/api/baseFetcher";
import { Blog, BlogTranslation } from "../types";

const BASE_URL = "/api/blog";

export const blogService = {
  getAll: (): Promise<Blog[]> =>
    api.get<Blog[]>(BASE_URL),

  getById: (id: number): Promise<Blog> =>
    api.get<Blog>(`${BASE_URL}/${id}`),

  create: (data: Partial<Blog>): Promise<Blog> =>
    api.post<Blog, Partial<Blog>>(BASE_URL, data),

  update: (id: number, data: Partial<Blog>): Promise<Blog> =>
    api.patch<Blog, Partial<Blog>>(`${BASE_URL}/${id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${id}`),

  updateTranslation: (
    blogId: number,
    translationId: number,
    data: Partial<BlogTranslation>
  ): Promise<Blog> =>
    api.patch<Blog, Partial<BlogTranslation>>(
      `${BASE_URL}/${blogId}/translations/${translationId}`,
      data
    ),
};