export enum PRODUCT_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ProductFaq {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface ProductTranslation {
  locale?: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  imgUrl?: string;
  imgAlt?: string;
  faq?: ProductFaq[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Country {
  code: string;
  code3: string;
  name: string;
  region: string;
}

export interface Product {
  id: number;
  slug: string;
  status: PRODUCT_STATUS;
  // camelCase — matches actual API response
  categoryId: number | null;
  category: Category | null;
  regionId: number;
  platformId: number;
  typeId: number;
  basePrice: number | null;
  spreadRate: number | null;
  discountRate: number;
  fakePrice: number | null;
  isFavorite: boolean;
  genres: string[];
  region: string;
  platform: string;
  type: string;
  platform_icon?: string;
  totalStock: number;
  availableLocales: string[];
  forbiddenCountries: Country[];
  translation: ProductTranslation;
  translations?: Record<string, ProductTranslation>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  name?: string;
  category_id?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  is_favorite?: boolean;
  region_id?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface ProductQuickUpdatePayload {
  basePrice?: string;
  spreadRate?: string;
  status?: PRODUCT_STATUS;
}