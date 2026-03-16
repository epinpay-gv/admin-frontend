import { NextRequest, NextResponse } from "next/server";
import { EPEntry } from "@/features/users/types";
import { mockEPEntries } from "@/mocks/users";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  let result = mockEPEntries.filter((e) => e.sourceId === Number(id));

  const type = searchParams.get("type");
  const sourceType = searchParams.get("sourceType");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  if (type) {
    result = result.filter((e) => e.type === type);
  }

  if (sourceType) {
    result = result.filter((e) => e.sourceType === sourceType);
  }

  if (dateFrom) {
    result = result.filter((e) => e.createdAt >= dateFrom);
  }

  if (dateTo) {
    result = result.filter((e) => e.createdAt <= dateTo);
  }

  return NextResponse.json<EPEntry[]>(result);
}