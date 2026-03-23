import { NextRequest, NextResponse } from "next/server";
import { mockPackageRequests } from "@/mocks/streamers";
import { PackageRequest } from "@/features/streamers/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const request = mockPackageRequests.find((r) => r.id === Number(id));

  if (!request) {
    return NextResponse.json(
      { message: "Paket talebi bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json<PackageRequest>(request);
}