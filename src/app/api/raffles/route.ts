import { NextRequest, NextResponse } from "next/server";
import { mockRaffles } from "@/mocks/raffles";
import {
  Raffle,
  RaffleFilters,
  RAFFLE_CREATOR_TYPE,
  RAFFLE_STATUS,
  RAFFLE_TYPE,
} from "@/features/raffles/types";

function applyFilters(raffles: Raffle[], filters: RaffleFilters): Raffle[] {
  let result = [...raffles];

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.id.toLowerCase().includes(s) ||
        r.name.toLowerCase().includes(s) ||
        r.creatorName.toLowerCase().includes(s)
    );
  }

  if (filters.creatorType && filters.creatorType !== "all") {
    result = result.filter((r) => r.creatorType === filters.creatorType);
  }

  if (filters.type && filters.type !== "all") {
    result = result.filter((r) => r.type === filters.type);
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter((r) => r.status === filters.status);
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    result = result.filter((r) => new Date(r.startDate) >= start);
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    result = result.filter((r) => new Date(r.endDate) <= end);
  }

  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters: RaffleFilters = {
    search: searchParams.get("search") ?? undefined,
    creatorType: (searchParams.get("creatorType") as RAFFLE_CREATOR_TYPE) ?? "all",
    type: (searchParams.get("type") as RAFFLE_TYPE) ?? "all",
    status: (searchParams.get("status") as RAFFLE_STATUS) ?? "all",
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  };

  const filtered = applyFilters(mockRaffles, filters);

  const sortKey = (searchParams.get("sortKey") ?? "createdAt") as keyof Raffle;
  const sortDir = searchParams.get("sortDir") ?? "desc";

  filtered.sort((a: Raffle, b: Raffle) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return NextResponse.json<Raffle[]>(filtered);
}