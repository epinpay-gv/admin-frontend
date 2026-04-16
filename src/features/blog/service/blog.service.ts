import { api } from "@/lib/api/baseFetcher";
import { BlogFilters, BlogListResponse, Blog, BlogTranslation, BLOG_STATUS } from "../types/blog.types";

const BASE_URL = "/api/features/content/blogs";

export const blogService = {
  getAll: (filters: BlogFilters = {}): Promise<BlogListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    return api.get<BlogListResponse>(url);
  },

  getById: (id: string): Promise<Blog> =>
    api.get<Blog>(`${BASE_URL}/${id}`),

  create: (data: Partial<Blog>): Promise<Blog> =>
    api.post<Blog, Partial<Blog>>(BASE_URL, data),

  delete: (id: string): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${id}`),

  updateTranslation: (id: string, locale: string, data: Partial<BlogTranslation>): Promise<void> =>
    api.patch<void, Partial<BlogTranslation>>(`${BASE_URL}/${id}/translations/${locale}`, data),

  changeStatus: (id: string, status: BLOG_STATUS): Promise<void> =>
    api.patch<void, { status: BLOG_STATUS }>(`${BASE_URL}/${id}/status`, { status }),
};