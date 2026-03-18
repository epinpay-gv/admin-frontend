// Standard API Response

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ApiFieldError[];
}

export interface ApiListResponse<T = unknown> {
  data: T[];
  success: boolean;
  message?: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: ApiFieldError[];
  statusCode: number;
}

// Standard Request Types

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortKey?: string;
  sortDir?: "asc" | "desc";
}

export interface BaseListParams extends PaginationParams, SortParams {
  search?: string;
}

// Fetcher Config 

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FetcherConfig<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

export interface FetcherError extends Error {
  statusCode: number;
  code?: string;
  errors?: ApiFieldError[];
}