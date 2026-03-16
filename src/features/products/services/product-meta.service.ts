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

const BASE_URL = "/api/product-meta";

export const productMetaService = {
  getAll: async (): Promise<ProductMeta> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Ürün meta verileri yüklenemedi.");
    return res.json();
  },
};