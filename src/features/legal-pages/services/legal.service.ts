import { LegalPage, LegalPageFilters, LegalPageCreatePayload, LegalPageUpdatePayload } from "@/features/legal-pages/types";

const BASE_URL = "/api/legal-pages";

async function fetchLegal<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (response.status === 204) return undefined as T;

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message ?? "Beklenmeyen bir hata oluştu.");
  }

  return json as T;
}

function buildQuery(filters?: LegalPageFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const legalPageService = {
  getAll: (filters?: LegalPageFilters): Promise<LegalPage[]> =>
    fetchLegal<LegalPage[]>(`${BASE_URL}${buildQuery(filters)}`),

  getById: (id: number): Promise<LegalPage> =>
    fetchLegal<LegalPage>(`${BASE_URL}/${id}`),

  create: (payload: LegalPageCreatePayload): Promise<LegalPage> =>
    fetchLegal<LegalPage>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: LegalPageUpdatePayload): Promise<LegalPage> =>
    fetchLegal<LegalPage>(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: number): Promise<void> =>
    fetchLegal<void>(`${BASE_URL}/${id}`, {
      method: "DELETE",
    }),
};