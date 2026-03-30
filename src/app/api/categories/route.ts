import { NextRequest, NextResponse } from "next/server";
import { mockCategories } from "@/mocks/categories";
import { Category } from "@/features/categories/types";

export async function GET(req: NextRequest) {
  // 1. URL üzerindeki parametreleri yakala
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const name = searchParams.get("name")?.toLowerCase();

  // 2. Filtreleme mantığını uygula
  let filteredData = [...mockCategories];

  // Durum (status) filtresi
  if (status && status !== "" && status !== "all") {
    filteredData = filteredData.filter((c) => c.status === status);
  }

  // İsim (name) filtresi (CategoryTranslation içindeki name alanına bakar)
  if (name) {
    filteredData = filteredData.filter((c) => 
      c.translation.name.toLowerCase().includes(name) || 
      c.slug.toLowerCase().includes(name)
    );
  }

  // 3. Filtrelenmiş veriyi dön
  return NextResponse.json<Category[]>(filteredData);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Slug çakışma kontrolü
  const slugExists = mockCategories.some((c) => c.slug === body.slug);
  if (slugExists) {
    return NextResponse.json(
      { message: "Bu URL zaten kullanılıyor." },
      { status: 409 }
    );
  }

  const newId = mockCategories.length > 0 
    ? Math.max(...mockCategories.map((c) => c.id)) + 1 
    : 1;

  const newCategory: Category = {
    ...body,
    id: newId,
    productCount: 0,
    availableLocales: body.availableLocales ?? ["tr"],
    forbiddenCountries: body.forbiddenCountries ?? [],
    faqs: body.faqs ?? [],
    genres: body.genres ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCategories.push(newCategory);
  return NextResponse.json<Category>(newCategory, { status: 201 });
}