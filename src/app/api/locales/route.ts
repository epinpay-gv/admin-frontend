import { NextResponse } from "next/server";

export interface Locale {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const LOCALES: Locale[] = [
  { code: "tr", name: "Türkçe", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "İngilizce", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "Almanca", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Fransızca", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arapça", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Rusça", nativeName: "Русский", flag: "🇷🇺" },
  { code: "es", name: "İspanyolca", nativeName: "Español", flag: "🇪🇸" },
  { code: "it", name: "İtalyanca", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portekizce", nativeName: "Português", flag: "🇵🇹" },
  { code: "zh", name: "Çince", nativeName: "中文", flag: "🇨🇳" },
];

export async function GET() {
  return NextResponse.json(LOCALES);
}