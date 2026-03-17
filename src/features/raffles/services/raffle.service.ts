import { Raffle, RaffleFilters } from "@/features/raffles/types";

const BASE_URL = "/api/raffles";

function buildQueryString(filters: RaffleFilters & {
  sortKey?: string;
  sortDir?: string;
}): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.creatorType && filters.creatorType !== "all")
    params.set("creatorType", filters.creatorType);
  if (filters.type && filters.type !== "all")
    params.set("type", filters.type);
  if (filters.status && filters.status !== "all")
    params.set("status", filters.status);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.sortKey) params.set("sortKey", filters.sortKey);
  if (filters.sortDir) params.set("sortDir", filters.sortDir);
  return params.toString();
}

export const raffleService = {
  getAll: async (
    filters: RaffleFilters & { sortKey?: string; sortDir?: string } = {}
  ): Promise<Raffle[]> => {
    const qs = buildQueryString(filters);
    const res = await fetch(`${BASE_URL}?${qs}`);
    if (!res.ok) throw new Error("Çekiliş listesi yüklenemedi.");
    return res.json();
  },

  getById: async (id: string): Promise<Raffle> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Çekiliş bulunamadı.");
    return res.json();
  },
};