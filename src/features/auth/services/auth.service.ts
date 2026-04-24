import { api } from "@/lib/api/baseFetcher";
import { LoginResponse } from "../types";

export interface AuthLoginRequest {
  firebaseToken: string;
  refreshToken?: string;
  email: string;
}

const NEXT_BASE_URL = typeof window !== "undefined"
  ? window.location.origin
  : "http://localhost:3000";

export const authService = {
  login: (data: AuthLoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>("/api/auth/login", data, {
      baseUrl: NEXT_BASE_URL,
    }),

  refresh: (): Promise<{ success: boolean; token: string }> =>
    api.post("/api/auth/refresh", undefined, {
      baseUrl: NEXT_BASE_URL,
    }),

  logout: (): Promise<{ success: boolean }> =>
    api.post("/api/auth/logout", undefined, {
      baseUrl: NEXT_BASE_URL,
    }),
};