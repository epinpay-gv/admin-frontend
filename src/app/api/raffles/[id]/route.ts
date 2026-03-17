import { NextRequest, NextResponse } from "next/server";
import { mockRaffles } from "@/mocks/raffles";
import { Raffle } from "@/features/raffles/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const raffle = mockRaffles.find((r) => r.id === id);

  if (!raffle) {
    return NextResponse.json({ message: "Çekiliş bulunamadı." }, { status: 404 });
  }

  return NextResponse.json<Raffle>(raffle);
}