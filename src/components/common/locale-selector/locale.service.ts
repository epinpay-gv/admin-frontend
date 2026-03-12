export interface Locale {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const BASE_URL = "/api/locales";

export const localeService = {
  getAll: async (): Promise<Locale[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Diller yüklenemedi.");
    return res.json();
  },
};