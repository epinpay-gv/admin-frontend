export interface Redirect {
  id: number;
  url_from: string;
  url_to: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RedirectFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface RedirectCreatePayload {
  redirects: RedirectEntry[];
}

export interface RedirectEntry {
  url_from: string;
  url_to: string;
}

export interface RedirectDeletePayload {
  id: number;
}