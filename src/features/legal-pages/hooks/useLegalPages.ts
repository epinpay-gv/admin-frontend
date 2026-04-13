"use client";

import { useEffect, useState, useCallback } from "react";
import { LegalPage, LegalPageFilters } from "../types";
import { legalPageService } from "../services/legal.service";


export function useLegalPages(filters: LegalPageFilters = {}) {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLegalPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await legalPageService.getAll(filters);
      setLegalPages(data);
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Yasal sayfalar yüklenirken bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters.search]);

  useEffect(() => {
    fetchLegalPages();
  }, [fetchLegalPages]);

  const remove = async (id: number): Promise<boolean> => {
    const confirmed = window.confirm(
      "Bu yasal sayfayı silmek istediğinize emin misiniz?"
    );
    if (!confirmed) return false;

    try {
      await legalPageService.remove(id);
      setLegalPages((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Silme işlemi başarısız.";
      setError(message);
      return false;
    }
  };

  return { legalPages, loading, error, refresh: fetchLegalPages, remove };
}