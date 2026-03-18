import { api } from "@/lib/api/baseFetcher";
import { Raffle, RaffleFilters } from "@/features/raffles/types";
import { FetcherConfig } from "@/lib/api/types";

const BASE_URL = "/api/raffles";

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
  getAll: (filters: RaffleListParams = {}): Promise<Raffle[]> =>
    api.get<Raffle[]>(BASE_URL, buildParams(filters)),

  getById: (id: string): Promise<Raffle> =>
    api.get<Raffle>(`${BASE_URL}/${id}`),
};