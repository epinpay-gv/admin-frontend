export interface Locale {
  code: string;   
  name: string;   
  nativeName: string;
  flag: string;   
}

export const LOCALE_REGISTRY: Locale[] = [
  { code: "tr",    name: "Turkish",            nativeName: "Türkçe",              flag: "🇹🇷" },
  { code: "en-US", name: "English (US)",        nativeName: "English",             flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)",        nativeName: "English",             flag: "🇬🇧" },
  { code: "de-DE", name: "German",              nativeName: "Deutsch",             flag: "🇩🇪" },
  { code: "fr-FR", name: "French",              nativeName: "Français",            flag: "🇫🇷" },
  { code: "es-ES", name: "Spanish",             nativeName: "Español",             flag: "🇪🇸" },
  { code: "it-IT", name: "Italian",             nativeName: "Italiano",            flag: "🇮🇹" },
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português",           flag: "🇧🇷" },
  { code: "ru-RU", name: "Russian",             nativeName: "Русский",             flag: "🇷🇺" },
  { code: "ar-SA", name: "Arabic",              nativeName: "العربية",             flag: "🇸🇦" },
  { code: "zh-CN", name: "Chinese (Simplified)",nativeName: "中文",                flag: "🇨🇳" },
  { code: "ja-JP", name: "Japanese",            nativeName: "日本語",              flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean",              nativeName: "한국어",              flag: "🇰🇷" },
  { code: "nl-NL", name: "Dutch",               nativeName: "Nederlands",          flag: "🇳🇱" },
  { code: "pl-PL", name: "Polish",              nativeName: "Polski",              flag: "🇵🇱" },
  { code: "sv-SE", name: "Swedish",             nativeName: "Svenska",             flag: "🇸🇪" },
  { code: "uk-UA", name: "Ukrainian",           nativeName: "Українська",          flag: "🇺🇦" },
  { code: "az-AZ", name: "Azerbaijani",         nativeName: "Azərbaycan",          flag: "🇦🇿" },
  { code: "kk-KZ", name: "Kazakh",              nativeName: "Қазақ",              flag: "🇰🇿" },
  { code: "uz-UZ", name: "Uzbek",               nativeName: "O'zbek",              flag: "🇺🇿" },
];

/**
 * Look up a locale by code. Returns a fallback if the code isn't in the
 * registry so the UI never silently breaks when a new locale is added to
 * the Catalog Service before it's added here.
 */
export function getLocale(code: string): Locale {
  return (
    LOCALE_REGISTRY.find((l) => l.code === code) ?? {
      code,
      name: code.toUpperCase(),
      nativeName: code,
      flag: "🌐",
    }
  );
}

export const localeService = {
  getAll: (): Promise<Locale[]> => Promise.resolve(LOCALE_REGISTRY),

  getByCode: (code: string): Locale => getLocale(code),
};