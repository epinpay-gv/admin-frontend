export enum CATEGORY_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface CategoryCountry {
  code: string;
  code3: string;
  name: string;
  region: string;
}

export interface CategoryTranslation {
  id: number;
  locale: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: number;
  slug: string;
  status: CATEGORY_STATUS;
  productCount: number;
  translation: CategoryTranslation;
  forbiddenCountries: CategoryCountry[];
  createdAt: string;
  updatedAt: string;
}