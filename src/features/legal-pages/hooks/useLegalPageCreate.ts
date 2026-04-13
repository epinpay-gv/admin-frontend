"use client";

import { useState } from "react";
import { LegalPageCreatePayload } from "../types";
import { legalPageService } from "../services/legal.service";

export function useLegalPageCreate(onSuccess: (id: number) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: LegalPageCreatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const created = await legalPageService.create(payload);
      onSuccess(created.id);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Oluşturma işlemi başarısız.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}