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
export interface CategoryFaq {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface CategoryFilters {
  name?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined; 
}

export interface CategoryTranslation {
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
export interface Category {
  id: number;
  slug: string;
  status: CATEGORY_STATUS;
  productCount: number;
  translation: CategoryTranslation;
  availableLocales: string[];
  forbiddenCountries: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


/* RESPONSE AND PAYLOAD TYPES */
export interface CategoryListResponse {
  categories: (Category | null)[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}