import { LANGUAGE } from "@/types";

export interface LegalPageContent {
  id?: number;
  language: LANGUAGE;
  metaTitle: string;
  metaDescription: string;
  text: string;
}

export interface LegalPage {
  id: number;
  pageName: string;
  pageUrl: string;
  contents: LegalPageContent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LegalPageFilters {
  search?: string;
}

export interface LegalPageCreatePayload {
  pageName: string;
  pageUrl: string;
  contents: LegalPageContent[];
}

export interface LegalPageUpdatePayload extends LegalPageCreatePayload {
  id: number;
}