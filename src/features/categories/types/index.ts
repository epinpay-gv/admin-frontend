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
  imgUrl?: string;
  imgAlt?: string;
  content?: string;
}

export interface CategoryFaq {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface Category {
  id: number;
  slug: string;
  status: CATEGORY_STATUS;
  productCount: number;
  genres: string[];
  translation: CategoryTranslation;
  translations?: Record<string, CategoryTranslation>;
  availableLocales: string[];
  forbiddenCountries: CategoryCountry[];
  faqs: CategoryFaq[];
  createdAt: string;
  updatedAt: string;
}