"use client";

import { useState, useCallback } from "react";
import { OFFER_STATUS } from "@/features/store/types";

/**
 * Teklif durum toggle hook'u.
 * Şu an BFF'te write endpoint olmadığı için devre dışı.
 * Write endpoint eklendiğinde burada service çağrısı yapılacak.
 */
export function useOfferToggle(onSuccess?: (id: string, status: OFFER_STATUS) => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (id: string, current: OFFER_STATUS) => {
    const next = current === OFFER_STATUS.ACTIVE
      ? OFFER_STATUS.INACTIVE
      : OFFER_STATUS.ACTIVE;

    setLoadingId(id);
    setError(null);

    try {
      // TODO: BFF write endpoint eklendiğinde aktifleştirilecek
      // await offerService.toggleStatus(id, next);
      onSuccess?.(id, next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Durum güncellenemedi.");
    } finally {
      setLoadingId(null);
    }
  }, [onSuccess]);

  return { toggle, loadingId, error };
}