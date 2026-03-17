"use client";

import { useState, useCallback } from "react";
import { OFFER_STATUS } from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";

export function useOfferToggle(onSuccess?: (id: number, status: OFFER_STATUS) => void) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError]         = useState<string | null>(null);

  const toggle = useCallback(async (id: number, current: OFFER_STATUS) => {
    const next = current === OFFER_STATUS.ACTIVE
      ? OFFER_STATUS.PASSIVE
      : OFFER_STATUS.ACTIVE;

    setLoadingId(id);
    setError(null);

    try {
      await offerService.toggleStatus(id, next);
      onSuccess?.(id, next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Durum güncellenemedi.");
    } finally {
      setLoadingId(null);
    }
  }, [onSuccess]);

  return { toggle, loadingId, error };
}