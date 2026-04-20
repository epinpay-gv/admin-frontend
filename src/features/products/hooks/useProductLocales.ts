"use client";

import { useState, useCallback } from "react";
import { Locale } from "@/components/common/locale-selector/hooks/useLocale";
import { ProductTranslation } from "@/features/products/types";

export interface LocaleTranslation extends Partial<ProductTranslation> {
  locale: string;
}

export function useProductLocales(
  defaultLocale: string = "tr",
  initialTranslations: LocaleTranslation[] = []
) {
  const [activeLocale, setActiveLocale] = useState(defaultLocale);
  const [enabledLocales, setEnabledLocales] = useState<string[]>(
  () => initialTranslations.length > 0
    ? initialTranslations.map((t) => t.locale)
    : [defaultLocale]
);
  const [translations, setTranslations] = useState<Record<string, LocaleTranslation>>(
    () => initialTranslations.reduce(
        (acc, t) => ({ ...acc, [t.locale]: t }),
        {} as Record<string, LocaleTranslation>
    )
  );

  const getTranslation = useCallback(
    (locale: string): LocaleTranslation => {
      return translations[locale] ?? { locale };
    },
    [translations]
  );

  const updateTranslation = useCallback(
    (locale: string, field: keyof ProductTranslation, value: string) => {
      setTranslations((prev) => ({
        ...prev,
        [locale]: {
          ...prev[locale],
          locale,
          [field]: value,
        },
      }));
    },
    []
  );

  const addLocale = useCallback((locale: Locale) => {
    setEnabledLocales((prev) =>
      prev.includes(locale.code) ? prev : [...prev, locale.code]
    );
    setActiveLocale(locale.code);
  }, []);

  const removeLocale = useCallback(
    (code: string) => {
      if (enabledLocales.length <= 1) return;
      setEnabledLocales((prev) => prev.filter((l) => l !== code));
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[code];
        return next;
      });
      if (activeLocale === code) {
        setActiveLocale(enabledLocales.find((l) => l !== code) ?? defaultLocale);
      }
    },
    [enabledLocales, activeLocale, defaultLocale]
  );

  const getAllTranslations = useCallback(() => {
    return Object.values(translations);
  }, [translations]);

  return {
    activeLocale,
    enabledLocales,
    translations,
    getTranslation,
    updateTranslation,
    addLocale,
    removeLocale,
    setActiveLocale,
    getAllTranslations,
  };
}