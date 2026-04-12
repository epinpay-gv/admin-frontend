import { api } from "@/lib/api/baseFetcher";
import { Redirect, RedirectFilters, RedirectCreatePayload } from "@/features/redirect/types";

const BASE_URL = "/api/redirect";

function buildParams(
  filters?: RedirectFilters
): Record<string, string | number | boolean | undefined | null> {
  if (!filters) return {};
  return {
    search: filters.search,
    page: filters.page,
    limit: filters.limit,
  };
}

export const redirectService = {
  getAll: (filters?: RedirectFilters): Promise<Redirect[]> =>
    api.get<Redirect[]>(BASE_URL, buildParams(filters)),

  create: (payload: RedirectCreatePayload): Promise<Redirect[]> =>
    api.post<Redirect[], RedirectCreatePayload>(BASE_URL, payload),

  remove: (id: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${id}`),
};