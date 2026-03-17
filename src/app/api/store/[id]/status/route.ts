import { NextRequest, NextResponse } from "next/server";

import { Offer, OFFER_STATUS } from "@/features/store/types";
import { mockOffers } from "@/mocks/store";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id }  = await params;
  const body    = await req.json();
  const index   = mockOffers.findIndex((o) => o.id === Number(id));

  if (index === -1)
    return NextResponse.json({ message: "Teklif bulunamadı." }, { status: 404 });

  const { status, note } = body;

  // Stok 0 iken aktif etme kuralı 
  if (status === OFFER_STATUS.ACTIVE && mockOffers[index].stock?.total === 0) {
    return NextResponse.json(
      { message: "Stok 0 olduğu için teklif aktif edilemez." },
      { status: 422 }
    );
  }

  mockOffers[index] = {
    ...mockOffers[index],
    status,
    note:      note ?? mockOffers[index].note,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json<Offer>(mockOffers[index]);
}