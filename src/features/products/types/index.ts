export enum PRODUCT_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

export interface ProductFaq {
  id: number;
  name: string;
  description: string;
}

export interface ProductTranslation {
  id: number;
  locale: string;
  name: string;
  slug: string;
  category_slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  imgUrl: string;
  imgAlt: string;
  faq?: ProductFaq[];
}

export interface CheapestOffer {
  id: number;
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
  category_id: number;
  category: Category;
  region_id: number;
  platform_id: number;
  type_id: number;
  status: PRODUCT_STATUS;
  translation: ProductTranslation;
  cheapestOffer: CheapestOffer | null;
  basePrice: number | null;
  epPrice: number | null;
  discountRate: number;
  fakePrice: number | null;
  isFavorite: boolean;
  genres: string[];
  region: string;
  platform: string;
  type: string;
  platform_icon: string;
  totalStock: number;
  forbiddenCountries: Country[];

  updatedAt: string;
  createdAt: string;
}