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

export interface ProductMeta {
  types: ProductType[];
  platforms: ProductPlatform[];
  regions: ProductRegion[];
}

const BASE_URL = "/api/features/catalog";
 
export const productMetaService = {
  getAll: (): Promise<ProductMeta> =>
    api.get<ProductMeta>(`${BASE_URL}/specs/meta`),
};