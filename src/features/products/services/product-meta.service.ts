import { api } from "@/lib/api/baseFetcher";

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

export interface ProductCategory {
  id: number;
  value: string;
  label: string;
}

export interface ProductMeta {
  types: ProductType[];
  platforms: ProductPlatform[];
  regions: ProductRegion[];
  categories: ProductCategory[];
}

const BASE_URL = "/api/features/catalog";

export const productMetaService = {
  getAll: (): Promise<ProductMeta> =>
    api.get<ProductMeta>(`${BASE_URL}/specs/meta`, undefined, { baseUrl: "https://admin-gateway-ahj0yeia.ew.gateway.dev" }),
};