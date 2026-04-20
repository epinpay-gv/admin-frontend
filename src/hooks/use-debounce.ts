"use client";

import { useEffect, useState } from "react";

/**
 * Bir değerin belirli bir süre boyunca değişmemesini bekleyen hook.
 * Arama işlemleri (autocomplete) gibi sık değişen değerlerde API isteklerini optimize etmek için kullanılır.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
