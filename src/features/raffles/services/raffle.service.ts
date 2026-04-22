import { api } from "@/lib/api/baseFetcher";
import { Raffle, RaffleFilters, RaffleSuccessResponse } from "@/features/raffles/types";
import { FetcherConfig } from "@/lib/api/types";

const BASE_URL = "/api/features/raffles";
const API_BASE = "http://localhost:3011";

type RaffleListParams = RaffleFilters & {
  sortKey?: string;
  sortDir?: string;
};

function buildParams(
  filters: RaffleListParams
): FetcherConfig["params"] {
  return {
    search: filters.search,
    creatorType: filters.creatorType !== "all" ? filters.creatorType : undefined,
    type: filters.type !== "all" ? filters.type : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    sortKey: filters.sortKey,
    sortDir: filters.sortDir,
  };
}

export const raffleService = {
  getAll: async (filters: RaffleListParams = {}): Promise<Raffle[]> => {
    const res = await api.get<RaffleSuccessResponse<Raffle[]>>(
      BASE_URL,
      buildParams(filters),
      { baseUrl: API_BASE }
    );
    return res.data;
  },

  getById: async (id: string): Promise<Raffle> => {
    const res = await api.get<RaffleSuccessResponse<Raffle>>(
      `${BASE_URL}/${id}`,
      undefined,
      { baseUrl: API_BASE }
    );
    return res.data;
  },

  cancel: async (id: string, reason?: string): Promise<void> => {
    await api.post(
      `${BASE_URL}/${id}/cancel`,
      { reason },
      { baseUrl: API_BASE }
    );
  },

  draw: async (id: string): Promise<void> => {
    await api.post(
      `${BASE_URL}/${id}/draw`,
      {},
      { baseUrl: API_BASE }
    );
  },
};