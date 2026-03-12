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

  const translation = product.translations?.[locale] ?? {
    ...product.translation,
    locale,
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  };

  return NextResponse.json<Product>({
    ...product,
    translation,
    availableLocales: product.availableLocales ?? ["tr"],
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";
  const body = await req.json();
  const index = mockProducts.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Ürün bulunamadı." }, { status: 404 });
  }

  const updatedTranslations = {
    ...mockProducts[index].translations,
    [locale]: {
      ...mockProducts[index].translations?.[locale],
      ...body.translation,
      locale,
    },
  };

  const availableLocales = Array.from(
    new Set([...(mockProducts[index].availableLocales ?? []), locale])
  );

  const updated: Product = {
    ...mockProducts[index],
    ...body,
    id: Number(id),
    translations: updatedTranslations,
    translation: updatedTranslations[locale],
    availableLocales,
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