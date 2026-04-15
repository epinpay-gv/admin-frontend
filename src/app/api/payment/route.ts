import { NextRequest, NextResponse } from "next/server";
import { mockPaymentMethods } from "@/mocks/payment";
import { PaymentMethod } from "@/features/payment/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const feeType = searchParams.get("feeType");

  let filtered = [...mockPaymentMethods];

  if (search) {
    filtered = filtered.filter((m) =>
      m.name.toLowerCase().includes(search) ||
      m.slug.toLowerCase().includes(search)
    );
  }

  if (feeType && feeType !== "all") {
    filtered = filtered.filter((m) =>
      m.providers.some((p) => p.feeType === feeType)
    );
  }

  return NextResponse.json<PaymentMethod[]>(filtered);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, forbiddenCountries } = body;

  const index = mockPaymentMethods.findIndex((m) => m.id === id);
  if (index === -1) {
    return NextResponse.json(
      { message: "Ödeme yöntemi bulunamadı." },
      { status: 404 }
    );
  }

  mockPaymentMethods[index] = {
    ...mockPaymentMethods[index],
    forbiddenCountries,
  };

  return NextResponse.json(mockPaymentMethods[index]);
}