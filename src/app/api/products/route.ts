import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";
import { Product, PRODUCT_STATUS } from "@/features/products/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name")?.toLowerCase();
  const categoryId = searchParams.get("category_id");
  const status = searchParams.get("status") as PRODUCT_STATUS | null;
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  let filteredProducts = [...mockProducts];

  if (name) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.translation.name.toLowerCase().includes(name) ||
        p.translation.slug.toLowerCase().includes(name)
    );
  }

  if (categoryId) {
    filteredProducts = filteredProducts.filter(
      (p) => String(p.category_id) === categoryId
    );
  }

  if (status) {
    filteredProducts = filteredProducts.filter((p) => p.status === status);
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => (p.basePrice ?? 0) >= Number(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => (p.basePrice ?? 0) <= Number(maxPrice)
    );
  }

  return NextResponse.json<Product[]>(filteredProducts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newProduct: Product = {
      ...body,
      id: mockProducts.length > 0 ? Math.max(...mockProducts.map((p) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProducts.push(newProduct);
    return NextResponse.json<Product>(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Geçersiz veri" }, { status: 400 });
  }
}