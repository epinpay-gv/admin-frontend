import {
  FetcherConfig,
  FetcherError,
  ApiErrorResponse,
} from "@/lib/api/types";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-api-key": "AIzaSyBFUsWEISiImLREu2usXWXIjOpKowiGwjE",
};

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  customBaseUrl?: string 
): string {
  const base = customBaseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3011";

  let url: URL;
  try {
    if (base.startsWith("http")) {
      // Çift slash (//) hatasını önlemek için endpoint başındaki / kontrolü
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      url = new URL(`${base}${cleanEndpoint}`);
    } else {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      url = new URL(`${origin}${base}${endpoint}`);
    }
  } catch (e) {
    console.error("URL build error:", e);
    return `${base}${endpoint}`;
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

function createFetcherError(
  message: string,
  statusCode: number,
  code?: string,
  errors?: ApiErrorResponse["errors"]
): FetcherError {
  const error = new Error(message) as FetcherError;
  error.statusCode = statusCode;
  error.code = code;
  error.errors = errors;
  return error;
}

export async function baseFetcher<TResponse, TBody = unknown>(
  endpoint: string,
  config: FetcherConfig<TBody> & { baseUrl?: string } = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    baseUrl, 
    cache,
    revalidate,
    tags,
  } = config;

  const url = buildUrl(
    endpoint,
    params as Record<string, string | number | boolean | undefined | null>,
    baseUrl
  );

  const nextConfig: RequestInit["next"] = {};
  if (revalidate !== undefined) nextConfig.revalidate = revalidate;
  if (tags?.length) nextConfig.tags = tags;

  const requestInit: RequestInit = {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    credentials: "include",
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...(cache && { cache }),
    ...(Object.keys(nextConfig).length > 0 && { next: nextConfig }),
  };

  let response: Response;

  try {
    response = await fetch(url, requestInit);
  } catch {
    throw createFetcherError(
      "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.",
      0,
      "NETWORK_ERROR"
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  let json: unknown;

  try {
    json = await response.json();
  } catch {
    throw createFetcherError(
      "Sunucudan geçersiz yanıt alındı.",
      response.status,
      "INVALID_JSON"
    );
  }

  if (!response.ok) {
    const err = json as Partial<ApiErrorResponse>;
    throw createFetcherError(
      err.message ?? "Beklenmeyen bir hata oluştu.",
      response.status,
      err.code,
      err.errors
    );
  }

  return json as TResponse;
}

export const api = {
  get: <TResponse, TParams extends Record<string, unknown> = Record<string, unknown>>(
    endpoint: string,
    params?: TParams,
    config?: Omit<FetcherConfig, "method" | "body" | "params"> & { baseUrl?: string }
  ): Promise<TResponse> =>
    baseFetcher<TResponse>(endpoint, {
      method: "GET",
      params: params as Record<string, string | number | boolean | undefined | null>,
      ...config,
    }),

  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<FetcherConfig<TBody>, "method" | "body"> & { baseUrl?: string }
  ): Promise<TResponse> =>
    baseFetcher<TResponse, TBody>(endpoint, {
      method: "POST",
      body,
      ...config,
    }),

  put: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<FetcherConfig<TBody>, "method" | "body"> & { baseUrl?: string }
  ): Promise<TResponse> =>
    baseFetcher<TResponse, TBody>(endpoint, {
      method: "PUT",
      body,
      ...config,
    }),

  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config?: Omit<FetcherConfig<TBody>, "method" | "body"> & { baseUrl?: string }
  ): Promise<TResponse> =>
    baseFetcher<TResponse, TBody>(endpoint, {
      method: "PATCH",
      body,
      ...config,
    }),

  delete: <TResponse>(
    endpoint: string,
    config?: Omit<FetcherConfig, "method" | "body"> & { baseUrl?: string }
  ): Promise<TResponse> =>
    baseFetcher<TResponse>(endpoint, {
      method: "DELETE",
      ...config,
    }),
};