import { NextRequest, NextResponse } from "next/server";
import { mockCountryPackageVariants } from "@/mocks/streamers";
import { CountryPackageVariant, VariantContent } from "@/features/streamers/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const variant = mockCountryPackageVariants.find((v) => v.id === Number(id));

  if (!variant) {
    return NextResponse.json(
      { message: "Ülke paket varyantı bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json<CountryPackageVariant>(variant);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockCountryPackageVariants.findIndex(
    (v) => v.id === Number(id)
  );

  if (index === -1) {
    return NextResponse.json(
      { message: "Ülke paket varyantı bulunamadı." },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { currency, durationDays, status, contents } = body as Partial<
    CountryPackageVariant & { contents: VariantContent[] }
  >;

  const existing = mockCountryPackageVariants[index];

  const updated: CountryPackageVariant = {
    ...existing,
    ...(currency && { currency }),
    ...(durationDays && { durationDays }),
    ...(status && { status }),
    ...(contents && { contents }),
    updatedAt: new Date().toISOString(),
  };

  mockCountryPackageVariants[index] = updated;

  return NextResponse.json<CountryPackageVariant>(updated);
}