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
  status?: CATEGORY_STATUS | string;
  [key: string]: string | number | boolean | undefined | null;
}


// types.ts
export interface CategoryTranslation {
  name: string;
  description: string;
  bannerImageUrl: string;
  bannerImageAlt: string;
  bannerImageStatus: string;
  imgUrl: string;
  imgAlt: string;
  metaTitle: string;
  metaDescription: string;
  activation?: unknown;
  faq?: unknown;
}

export interface Category {
  id: number;
  slug: string;
  status: string;
  translation: CategoryTranslation;
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