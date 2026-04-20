import { api } from "@/lib/api/baseFetcher";
import {
  PaymentProvider,
  PaymentMethod,
  ProviderMethod,
  PaymentSuccessResponse,
} from "@/features/payment/types";

const BASE_URL = "/api/features/payment";
const API_BASE = "https://admin-gateway-ahj0yeia.ew.gateway.dev";

/* ═══════════════════════════════════════════════════════════════════════════
   PAYMENT PROVIDERS
   ═══════════════════════════════════════════════════════════════════════════ */

async function getProviders(): Promise<PaymentProvider[]> {
  const res = await api.get<PaymentSuccessResponse<PaymentProvider[]>>(
    `${BASE_URL}/providers`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function getProvider(id: number): Promise<PaymentProvider> {
  const res = await api.get<PaymentSuccessResponse<PaymentProvider>>(
    `${BASE_URL}/providers/${id}`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function createProvider(data: Partial<PaymentProvider>): Promise<PaymentProvider> {
  const res = await api.post<PaymentSuccessResponse<PaymentProvider>, Partial<PaymentProvider>>(
    `${BASE_URL}/providers`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function updateProvider(id: number, data: Partial<PaymentProvider>): Promise<PaymentProvider> {
  const res = await api.put<PaymentSuccessResponse<PaymentProvider>, Partial<PaymentProvider>>(
    `${BASE_URL}/providers/${id}`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function deleteProvider(id: number): Promise<void> {
  await api.delete<PaymentSuccessResponse<void>>(
    `${BASE_URL}/providers/${id}`,
    { baseUrl: API_BASE }
  );
}

async function addForbiddenCountries(id: number, countries: string[]): Promise<PaymentProvider> {
  const res = await api.post<PaymentSuccessResponse<PaymentProvider>, { countries: string[] }>(
    `${BASE_URL}/providers/${id}/forbidden-countries`,
    { countries },
    { baseUrl: API_BASE }
  );
  return res.data;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAYMENT METHODS
   ═══════════════════════════════════════════════════════════════════════════ */

async function getMethods(): Promise<PaymentMethod[]> {
  const res = await api.get<PaymentSuccessResponse<PaymentMethod[]>>(
    `${BASE_URL}/methods`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function getMethod(id: number): Promise<PaymentMethod> {
  const res = await api.get<PaymentSuccessResponse<PaymentMethod>>(
    `${BASE_URL}/methods/${id}`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function createMethod(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const res = await api.post<PaymentSuccessResponse<PaymentMethod>, Partial<PaymentMethod>>(
    `${BASE_URL}/methods`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function updateMethod(id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const res = await api.put<PaymentSuccessResponse<PaymentMethod>, Partial<PaymentMethod>>(
    `${BASE_URL}/methods/${id}`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function deleteMethod(id: number): Promise<void> {
  await api.delete<PaymentSuccessResponse<void>>(
    `${BASE_URL}/methods/${id}`,
    { baseUrl: API_BASE }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROVIDER METHODS (Provider ↔ Method ilişkileri)
   ═══════════════════════════════════════════════════════════════════════════ */

async function getProviderMethods(): Promise<ProviderMethod[]> {
  const res = await api.get<PaymentSuccessResponse<ProviderMethod[]>>(
    `${BASE_URL}/provider-methods`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function getProviderMethod(id: number): Promise<ProviderMethod> {
  const res = await api.get<PaymentSuccessResponse<ProviderMethod>>(
    `${BASE_URL}/provider-methods/${id}`,
    undefined,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function createProviderMethod(data: Partial<ProviderMethod>): Promise<ProviderMethod> {
  const res = await api.post<PaymentSuccessResponse<ProviderMethod>, Partial<ProviderMethod>>(
    `${BASE_URL}/provider-methods`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function updateProviderMethod(id: number, data: Partial<ProviderMethod>): Promise<ProviderMethod> {
  const res = await api.put<PaymentSuccessResponse<ProviderMethod>, Partial<ProviderMethod>>(
    `${BASE_URL}/provider-methods/${id}`,
    data,
    { baseUrl: API_BASE }
  );
  return res.data;
}

async function deleteProviderMethod(id: number): Promise<void> {
  await api.delete<PaymentSuccessResponse<void>>(
    `${BASE_URL}/provider-methods/${id}`,
    { baseUrl: API_BASE }
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export const paymentService = {
  // Providers
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  addForbiddenCountries,

  // Methods
  getMethods,
  getMethod,
  createMethod,
  updateMethod,
  deleteMethod,

  // Provider Methods
  getProviderMethods,
  getProviderMethod,
  createProviderMethod,
  updateProviderMethod,
  deleteProviderMethod,
};