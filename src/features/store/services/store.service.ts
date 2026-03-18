import { api } from "@/lib/api/baseFetcher";
import { Currency } from "@/features/store/types";

const BASE_URL = "/api/store";

export interface StoreSettings {
  id: number;
  defaultCurrency: Currency;
  allowedProductTypes: string[];
  commissionRates: Record<string, number>;
}

export const storeService = {
  getSettings: (): Promise<StoreSettings> =>
    api.get<StoreSettings>(`${BASE_URL}/settings`),
};