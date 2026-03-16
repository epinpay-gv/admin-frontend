import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";
import { Product } from "@/features/products/types";

export async function GET() {
  return NextResponse.json<Product[]>(mockProducts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newProduct: Product = {
    ...body,
    id: Math.max(...mockProducts.map((p) => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockProducts.push(newProduct);

  return NextResponse.json<Product>(newProduct, { status: 201 });
}