import { NextRequest, NextResponse } from "next/server";

import { Offer } from "@/features/store/types";
import { mockOffers } from "@/mocks/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const offer  = mockOffers.find((o) => o.id === Number(id));

  if (!offer)
    return NextResponse.json({ message: "Teklif bulunamadı." }, { status: 404 });

  return NextResponse.json<Offer>(offer);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id }  = await params;
  const body    = await req.json();
  const index   = mockOffers.findIndex((o) => o.id === Number(id));

  if (index === -1)
    return NextResponse.json({ message: "Teklif bulunamadı." }, { status: 404 });

  const updated: Offer = {
    ...mockOffers[index],
    ...body,
    id:        Number(id),
    updatedAt: new Date().toISOString(),
  };

  mockOffers[index] = updated;

  return NextResponse.json<Offer>(updated);
}