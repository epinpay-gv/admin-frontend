import { NextResponse } from "next/server";

export interface ProductType {
  id: number;
  value: string;
  label: string;
}

export interface ProductPlatform {
  id: number;
  value: string;
  label: string;
  icon?: string;
}

export interface ProductRegion {
  id: number;
  value: string;
  label: string;
}

const PRODUCT_TYPES: ProductType[] = [
  { id: 1, value: "e-pin", label: "E-Pin" },
  { id: 2, value: "top-up", label: "Top-Up" },
  { id: 3, value: "software", label: "Yazılım" },
  { id: 4, value: "gift-card", label: "Gift Card" },
  { id: 5, value: "subscription", label: "Abonelik" },
];

const PRODUCT_PLATFORMS: ProductPlatform[] = [
  { id: 1, value: "mobile", label: "Mobile" },
  { id: 2, value: "pc", label: "PC" },
  { id: 3, value: "console", label: "Console" },
  { id: 4, value: "web", label: "Web" },
  { id: 5, value: "playstation", label: "PlayStation" },
  { id: 6, value: "xbox", label: "Xbox" },
  { id: 7, value: "nintendo", label: "Nintendo" },
];

const PRODUCT_REGIONS: ProductRegion[] = [
  { id: 1, value: "TR", label: "Türkiye" },
  { id: 2, value: "EU", label: "Avrupa" },
  { id: 3, value: "US", label: "Amerika" },
  { id: 4, value: "GLOBAL", label: "Global" },
  { id: 5, value: "ASIA", label: "Asya" },
  { id: 6, value: "ME", label: "Orta Doğu" },
];

export async function GET() {
  return NextResponse.json({
    types: PRODUCT_TYPES,
    platforms: PRODUCT_PLATFORMS,
    regions: PRODUCT_REGIONS,
  });
}