export enum FEE_TYPE {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

/* ─── Payment Provider ─── */
export interface PaymentProvider {
  id: number;
  name: string;
  feeType: FEE_TYPE;
  feeValue: number;
  isActive: boolean;
  forbiddenCountries: string[];
  methods?: ProviderMethod[];
}

/* ─── Payment Method ─── */
export interface PaymentMethod {
  id: number;
  name: string;
  slug: string;
  providers?: ProviderMethod[];
}

/* ─── Provider ↔ Method ilişkisi ─── */
export interface ProviderMethod {
  id: number;
  providerId: number;
  methodId: number;
  feeType?: FEE_TYPE | null;
  feeValue?: number | null;
  provider?: PaymentProvider;
  method?: PaymentMethod;
}

/* ─── Backend success wrapper ─── */
export interface PaymentSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* ─── Filters ─── */
export interface PaymentProviderFilters {
  search?: string;
  isActive?: boolean | "all";
  feeType?: FEE_TYPE | "all";
}

export interface PaymentMethodFilters {
  search?: string;
}

export interface ProviderMethodFilters {
  search?: string;
  feeType?: FEE_TYPE | "all";
}

/* ─── Tab tanımı ─── */
export type PaymentTab = "providers" | "methods" | "provider-methods";