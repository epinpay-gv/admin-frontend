// src/features/store/services/store.service.ts

import { Currency } from "@/features/store/types";

const BASE_URL = "/api/store";

export interface StoreSettings {
  id:               number;
  defaultCurrency:  Currency;
  allowedProductTypes: string[]; 
  commissionRates:  Record<string, number>; 
}

export const storeService = {

  getSettings: async (): Promise<StoreSettings> => {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error("Mağaza bilgileri yüklenemedi.");
    return res.json();
  },
};