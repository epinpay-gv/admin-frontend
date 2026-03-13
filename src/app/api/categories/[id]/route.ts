import { NextRequest, NextResponse } from "next/server";
import { mockCategories } from "@/mocks/categories";
import { Category } from "@/features/categories/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = mockCategories.find((c) => c.id === Number(id));
  if (!category) {
    return NextResponse.json({ message: "Kategori bulunamadı." }, { status: 404 });
  }
  return NextResponse.json<Category>(category);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const index = mockCategories.findIndex((c) => c.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Kategori bulunamadı." }, { status: 404 });
  }

  // Slug çakışma kontrolü (kendi id'si hariç)
  if (body.slug) {
    const slugExists = mockCategories.some(
      (c) => c.slug === body.slug && c.id !== Number(id)
    );
    if (slugExists) {
      return NextResponse.json(
        { message: "Bu URL zaten kullanılıyor." },
        { status: 409 }
      );
    }
  }

  const updated: Category = {
    ...mockCategories[index],
    ...body,
    id: Number(id),
    updatedAt: new Date().toISOString(),
  };

  mockCategories[index] = updated;
  return NextResponse.json<Category>(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockCategories.findIndex((c) => c.id === Number(id));
  if (index === -1) {
    return NextResponse.json({ message: "Kategori bulunamadı." }, { status: 404 });
  }
  mockCategories.splice(index, 1);
  return NextResponse.json({ message: "Kategori silindi." });
}