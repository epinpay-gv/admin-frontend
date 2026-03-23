import { NextRequest, NextResponse } from "next/server";
import { mockStreamers } from "@/mocks/streamers";
import { Streamer } from "@/features/streamers/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
const streamer = mockStreamers.find(
  (s) => s.id === Number(id) || s.userId === Number(id)
);

  if (!streamer) {
    return NextResponse.json(
      { message: "Yayıncı bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json<Streamer>(streamer);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
const index = mockStreamers.findIndex(
  (s) => s.id === Number(id) || s.userId === Number(id)
);

  if (index === -1) {
    return NextResponse.json(
      { message: "Yayıncı bulunamadı." },
      { status: 404 }
    );
  }

  const body = await req.json();
  const {
    streamerStatus,
    packageStatus,
    currentVariantId,
    currentPackageName,
    packageStartDate,
    packageEndDate,
  } = body as Partial<Streamer>;

  const existing = mockStreamers[index];

  const updated: Streamer = {
    ...existing,
    ...(streamerStatus && { streamerStatus }),
    ...(packageStatus && { packageStatus }),
    ...(currentVariantId !== undefined && { currentVariantId }),
    ...(currentPackageName !== undefined && { currentPackageName }),
    ...(packageStartDate !== undefined && { packageStartDate }),
    ...(packageEndDate !== undefined && { packageEndDate }),
    updatedAt: new Date().toISOString(),
  };

  mockStreamers[index] = updated;

  return NextResponse.json<Streamer>(updated);
}