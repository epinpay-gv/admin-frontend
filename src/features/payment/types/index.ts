export enum FEE_TYPE {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface PaymentProvider {
  id: number;
  name: string;
  feeType: FEE_TYPE;
  feeValue: number;
  isActive: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  slug: string;
  forbiddenCountries: string[];
  providers: PaymentProvider[]; 
}

export interface PaymentMethodFilters {
  search?: string;
  isActive?: boolean | "all";
feeType?: FEE_TYPE | "all";
}