"use client";

import { useState, useEffect } from "react";
import { Country } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productService
      .getCountries()
      .then(setCountries)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
}