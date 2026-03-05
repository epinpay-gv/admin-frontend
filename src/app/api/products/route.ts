import { NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";
import { Product } from "@/features/products/types";

export async function GET() {
  return NextResponse.json<Product[]>(mockProducts);
}