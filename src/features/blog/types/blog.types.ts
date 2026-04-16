export enum BLOG_STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface BlogTranslation {
  id: string;
  locale: string;
  title: string;
  excerpt: string | null;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  slug: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: BLOG_STATUS;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: BlogTranslation[];
}

export interface BlogListResponse {
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogFilters {
  search?: string;
  status?: BLOG_STATUS | "all";
  page?: number;
  limit?: number;
}

// Matches BFF CreateBlogDTO
export interface CreateBlogPayload {
  slug: string;
  locale: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  excerpt?: string;
  coverImage?: string;
  coverImageAlt?: string;
}

// Matches BFF UpdateBlogDTO
export interface UpdateBlogTranslationPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  coverImageAlt?: string;
}

export interface BlogTranslationDetail extends BlogTranslation {
  content: string;
}

export interface BlogDetail {
  id: string;
  slug: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: BLOG_STATUS;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: BlogTranslationDetail[];
}