import { NextRequest, NextResponse } from "next/server";
import { Offer, OfferListItem, DELIVERY_TYPE } from "@/features/store/types";
import { mockOffers } from "@/mocks/store";

export async function GET() {
  const list: OfferListItem[] = mockOffers.map((o) => ({
    id:           o.id,
    productName:  o.product.name,
    price:        o.price,
    status:       o.status,
    deliveryType: o.deliveryType,
    stock:        o.deliveryType === DELIVERY_TYPE.AUTOMATIC && o.stock
                    ? { total: o.stock.total }
                    : undefined,
    updatedAt:    o.updatedAt,
  }));

  return NextResponse.json<OfferListItem[]>(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newOffer: Offer = {
    ...body,
    id:        Math.max(...mockOffers.map((o) => o.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockOffers.push(newOffer);

  return NextResponse.json<Offer>(newOffer, { status: 201 });
}