import { LANGUAGE } from "@/types";

export enum BLOG_TRANSLATION_STATUS {
  PUBLISHED = "published",
  DRAFT = "draft",
  INACTIVE = "inactive",
}

export interface BlogTranslation {
  id: number;
  language: LANGUAGE;
  status: BLOG_TRANSLATION_STATUS;
  title: string;
  slug: string;
  body: string;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  imgUrl: string;
  imgAlt: string;
}

export interface Blog {
  id: number;
  category_id: number;
  sourceLanguage: LANGUAGE;
  translations: BlogTranslation[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  status?: BLOG_TRANSLATION_STATUS | "all";
  sourceLanguage?: LANGUAGE | "all";
  categoryId?: number;
}