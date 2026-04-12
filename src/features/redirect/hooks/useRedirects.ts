"use client";

import { useState, useEffect, useCallback } from "react";
import { Redirect, RedirectFilters } from "@/features/redirect/types";
import { redirectService } from "@/features/redirect/services/redirect.service";

export function useRedirects(filters?: RedirectFilters) {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await redirectService.getAll(filters);
      setRedirects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters?.search]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: number): Promise<boolean> => {
    const confirmed = window.confirm("Bu yönlendirmeyi silmek istediğinize emin misiniz?");
    if (!confirmed) return false;

    try {
      await redirectService.remove(id);
      setRedirects((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return { redirects, loading, error, reload: load, remove };
}