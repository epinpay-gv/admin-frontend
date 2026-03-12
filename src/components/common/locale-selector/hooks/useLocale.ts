"use client";

import { useState, useEffect } from "react";
import { localeService, Locale } from "../locale.service";

export function useLocales() {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localeService
      .getAll()
      .then(setLocales)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { locales, loading, error };
}