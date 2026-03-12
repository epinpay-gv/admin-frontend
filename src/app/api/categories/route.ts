import { NextRequest, NextResponse } from "next/server";
import { mockCategories } from "@/mocks/categories";
import { Category } from "@/features/categories/types";

export async function GET() {
  return NextResponse.json<Category[]>(mockCategories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newCategory: Category = {
    ...body,
    id: Math.max(...mockCategories.map((c) => c.id)) + 1,
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCategories.push(newCategory);

  return NextResponse.json<Category>(newCategory, { status: 201 });
}