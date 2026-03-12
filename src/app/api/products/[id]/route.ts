import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";
import { Product } from "@/features/products/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";
  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  // Gerçek backend'de locale'e göre translation gelecek
  // Şimdilik mock translation'ı locale ile döndürüyoruz
  return NextResponse.json<Product>({
    ...product,
    translation: {
      ...product.translation,
      locale,
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const index = mockProducts.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  const updated: Product = {
    ...mockProducts[index],
    ...body,
    id: Number(id),
    updatedAt: new Date().toISOString(),
  };

  mockProducts[index] = updated;

  return NextResponse.json<Product>(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockProducts.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  mockProducts.splice(index, 1);

  return NextResponse.json({ message: "Ürün silindi." });
}