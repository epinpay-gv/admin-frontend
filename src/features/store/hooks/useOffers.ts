"use client";

import { useEffect, useState, useCallback } from "react";
import {
  OfferListItem,
  OfferFilters,
  Pagination,
  UseOffersReturn,
} from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";

export function useOffers(externalFilters: OfferFilters = {}): UseOffersReturn {
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await offerService.getAll(externalFilters);
      setOffers(response.data ?? []);
      setPagination(response.pagination ?? null);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Teklifler yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(externalFilters)]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    loading,
    error,
    pagination,
    refresh: fetchOffers,
  };
}