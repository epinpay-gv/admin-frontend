"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageTemplate } from "@/features/streamers/types";
import { packageTemplateService } from "../services/streamer.service";


export function usePackageTemplate(id: number | null) {
  const [template, setTemplate] = useState<PackageTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!id) return;

    let cancelled = false;

    setLoading(true);
    setError(null);
    try {
      const data = await packageTemplateService.getById(id);
      if (!cancelled) setTemplate(data);
    } catch (err) {
      if (!cancelled) setError((err as Error).message);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  // Şablon adı, açıklama, status ve contents array'ini günceller
  const updateTemplate = useCallback(
    async (data: Partial<PackageTemplate>): Promise<PackageTemplate> => {
      if (!id) throw new Error("Şablon ID bulunamadı.");
      const updated = await packageTemplateService.update(id, data);
      setTemplate(updated);
      return updated;
    },
    [id]
  );

  return {
    template,
    loading,
    error,
    updateTemplate,
    refresh: fetchTemplate,
  };
}