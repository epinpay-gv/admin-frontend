import { api } from "@/lib/api/baseFetcher";
import { LoginResponse } from "../types";

export interface AuthLoginRequest {
  firebaseToken: string;
  email: string;
}

const BASE_URL = "/auth";

export const authService = {
  login: (data: AuthLoginRequest): Promise<LoginResponse> =>
    api.post<LoginResponse>(`${BASE_URL}/login`, data),
};
