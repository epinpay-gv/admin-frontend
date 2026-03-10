export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export enum LANGUAGE {
  TR = "tr",
  EN = "en",
  ES = "es",
}
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}


