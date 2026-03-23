import { NextRequest, NextResponse } from "next/server";
import { mockStreamers } from "@/mocks/streamers";
import { Streamer, STREAMER_STATUS, PACKAGE_STATUS } from "@/features/streamers/types";

function applyFilters(
  streamers: Streamer[],
  search?: string,
  countryCode?: string,
  streamerStatus?: STREAMER_STATUS,
  packageStatus?: PACKAGE_STATUS
): Streamer[] {
  let result = [...streamers];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        String(r.userId).includes(s)
    );
  }

  if (countryCode) {
    result = result.filter((r) => r.countryCode === countryCode);
  }

  if (streamerStatus) {
    result = result.filter((r) => r.streamerStatus === streamerStatus);
  }

  if (packageStatus) {
    result = result.filter((r) => r.packageStatus === packageStatus);
  }

  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") ?? undefined;
  const countryCode = searchParams.get("countryCode") ?? undefined;
  const streamerStatus =
    (searchParams.get("streamerStatus") as STREAMER_STATUS) ?? undefined;
  const packageStatus =
    (searchParams.get("packageStatus") as PACKAGE_STATUS) ?? undefined;

  const filtered = applyFilters(
    mockStreamers,
    search,
    countryCode,
    streamerStatus,
    packageStatus
  );

  const sortKey =
    (searchParams.get("sortKey") as keyof Streamer) ?? "createdAt";
  const sortDir = searchParams.get("sortDir") ?? "desc";

  filtered.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return NextResponse.json<Streamer[]>(filtered);
}