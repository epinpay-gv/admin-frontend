"use client";

import { useEffect, useState, useCallback } from "react";
import { LegalPage, LegalPageUpdatePayload } from "../types";
import { legalPageService } from "../services/legal.service";


export function useLegalPage(id: number | null) {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await legalPageService.getById(id);
      setLegalPage(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sayfa yüklenirken bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const save = async (payload: LegalPageUpdatePayload): Promise<boolean> => {
    if (id === null) return false;
    setSaving(true);
    setError(null);
    try {
      const updated = await legalPageService.update(id, payload);
      setLegalPage(updated);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Kaydetme işlemi başarısız.";
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { legalPage, loading, saving, error, save };
}