import { api } from "@/lib/api/baseFetcher";
import { PaymentMethod, PaymentMethodFilters } from "@/features/payment/types";

const BASE_URL = "/api/payment";

function buildParams(
  filters?: PaymentMethodFilters
): Record<string, string | boolean | undefined> {
  if (!filters) return {};
  return {
    search: filters.search,
    isActive:
      filters.isActive !== "all" ? filters.isActive : undefined,
    feeType: filters.feeType !== "all" ? filters.feeType : undefined,
  };
}

export const paymentService = {
  getAll: (filters?: PaymentMethodFilters): Promise<PaymentMethod[]> =>
    api.get<PaymentMethod[]>(BASE_URL, buildParams(filters)),

  getById: (id: number): Promise<PaymentMethod> =>
    api.get<PaymentMethod>(`${BASE_URL}/${id}`),

updateForbiddenCountries: (
  id: number,
  forbiddenCountries: string[]
): Promise<PaymentMethod> =>
  api.put<PaymentMethod, { id: number; forbiddenCountries: string[] }>(
    BASE_URL,
    { id, forbiddenCountries }
  ),
};