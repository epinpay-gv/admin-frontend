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
  forbiddenCountries: string[]; // ← string[] (ISO codes), matches BFF AdminCategory
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  imgUrl?: string;
  categoryId: number;
  basePrice: number;
}

export interface CatalogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── Response / Payload types ───────────────────────────────── */

// GET /api/features/catalog/categories
export interface CategoryListResponse {
  categories: Category[];
  pagination: CatalogPagination;
}

// GET /api/features/catalog/categories/:id/products
export interface CategoryProductsResponse {
  success: boolean;
  products: AdminProduct[];
  pagination: CatalogPagination;
}

// GET /api/features/catalog/products/search
export interface ProductSearchResponse {
  success: boolean;
  products: AdminProduct[];
  pagination: CatalogPagination;
}

// PATCH /api/features/catalog/categories/:id/quick-update
export interface CategoryQuickUpdatePayload {
  name?: string;
  slug?: string;
  status?: CATEGORY_STATUS;
}

// POST /api/features/catalog/categories/ban-countries
// POST /api/features/catalog/categories/unban-countries
export interface BanCountriesPayload {
  categoryIds: number[];   // ← number[], not string[]
  countries: string[];     // ISO-2 codes e.g. ["TR", "DE"]
}

export interface BanCountriesResponse {
  success: boolean;
  message: string;
  updated: number;
}

// POST /api/features/catalog/categories/:id/products
export interface AddProductToCategoryPayload {
  productId: number;   // ← number, not string
}