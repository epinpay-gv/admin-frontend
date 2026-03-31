import { api } from "@/lib/api/baseFetcher";
import { Blog, BlogTranslation, BlogFilters } from "../types";

const BASE_URL = "/api/blog";

export const blogService = {
  getAll: (filters: BlogFilters = {}): Promise<Blog[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    return api.get<Blog[]>(url);
  },

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