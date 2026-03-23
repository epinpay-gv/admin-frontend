import { NextRequest, NextResponse } from "next/server";
import { mockPackageRequests } from "@/mocks/streamers";
import {
  PackageRequest,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_TYPE,
} from "@/features/streamers/types";

function applyFilters(
  requests: PackageRequest[],
  search?: string,
  countryCode?: string,
  requestType?: PACKAGE_REQUEST_TYPE,
  status?: PACKAGE_REQUEST_STATUS,
  packageId?: number,
  dateFrom?: string,
  dateTo?: string
): PackageRequest[] {
  let result = [...requests];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (r) =>
        r.publisherName.toLowerCase().includes(s) ||
        r.publisherEmail.toLowerCase().includes(s) ||
        String(r.publisherId).includes(s)
    );
  }

  if (countryCode) {
    result = result.filter((r) => r.countryCode === countryCode);
  }

  if (requestType) {
    result = result.filter((r) => r.requestType === requestType);
  }

  if (status) {
    result = result.filter((r) => r.status === status);
  }

  if (packageId) {
    result = result.filter(
      (r) =>
        r.currentVariantId === packageId ||
        r.requestedVariantId === packageId
    );
  }

  if (dateFrom) {
    const from = new Date(dateFrom);
    result = result.filter((r) => new Date(r.createdAt) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    result = result.filter((r) => new Date(r.createdAt) <= to);
  }

  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") ?? undefined;
  const countryCode = searchParams.get("countryCode") ?? undefined;
  const requestType =
    (searchParams.get("requestType") as PACKAGE_REQUEST_TYPE) ?? undefined;
  const status =
    (searchParams.get("status") as PACKAGE_REQUEST_STATUS) ?? undefined;
  const packageId = searchParams.get("packageId")
    ? Number(searchParams.get("packageId"))
    : undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  const filtered = applyFilters(
    mockPackageRequests,
    search,
    countryCode,
    requestType,
    status,
    packageId,
    dateFrom,
    dateTo
  );

  const sortKey =
    (searchParams.get("sortKey") as keyof PackageRequest) ?? "createdAt";
  const sortDir = searchParams.get("sortDir") ?? "desc";

  filtered.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === undefined || bVal === undefined) return 0;
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return NextResponse.json<PackageRequest[]>(filtered);
}