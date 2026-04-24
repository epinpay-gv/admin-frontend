import { api } from "@/lib/api/baseFetcher";
import { LoginResponse } from "../types";

export interface AuthLoginRequest {
  firebaseToken: string;
  refreshToken?: string;
  email: string;
}

const BASE_URL = "/api/auth";

export const authService = {
  login: (data: AuthLoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>(`${BASE_URL}/login`, data),

  refresh: (): Promise<{ success: boolean; token: string }> =>
    api.post(`${BASE_URL}/refresh`),

  logout: (): Promise<{ success: boolean }> =>
    api.post(`${BASE_URL}/logout`),
};
