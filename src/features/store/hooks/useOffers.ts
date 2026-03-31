"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  OfferListItem, 
  OfferFilters, 
  OFFER_STATUS, 
  UseOffersReturn 
} from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";

const FILTER_PREDICATES: {
  [K in keyof OfferFilters]: (
    value: NonNullable<OfferFilters[K]>,
    offer: OfferListItem
  ) => boolean;
} = {
  status: (v, o) => v === "all" || o.status === v,
  deliveryType: (v, o) => v === "all" || o.deliveryType === v,
  currency: (v, o) => o.price.currency === v,
  minPrice: (v, o) => o.price.amount >= (v as number),
  maxPrice: (v, o) => o.price.amount <= (v as number),
  search: (v, o) => o.productName.toLowerCase().includes((v as string).toLowerCase()),
};

function applyFiltersToPipeline(data: OfferListItem[], filters: OfferFilters): OfferListItem[] {
  return (Object.entries(filters) as [keyof OfferFilters, unknown][])
    .filter(([, value]) => value !== undefined && value !== "" && value !== null && value !== "all")
    .reduce((result, [key, value]) => {
      const predicate = FILTER_PREDICATES[key];
      return predicate
        ? result.filter((o) => predicate(value as never, o))
        : result;
    }, data);
}

export function useOffers(externalFilters: OfferFilters = {}): UseOffersReturn {
  const [all, setAll] = useState<OfferListItem[]>([]); 
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await offerService.getAll();
      setAll(data);
      setOffers(applyFiltersToPipeline(data, externalFilters));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Teklifler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [externalFilters]);
  useEffect(() => {
    fetchOffers();
  }, []);
  useEffect(() => {
    if (all.length > 0) {
      const filtered = applyFiltersToPipeline(all, externalFilters);
      setOffers(filtered);
    }
  }, [externalFilters, all]);
  const updateOfferStatus = useCallback(async (id: number, status: OFFER_STATUS) => {
    const updateFn = (list: OfferListItem[]) =>
      list.map((o) => (o.id === id ? { ...o, status } : o));

    setAll(prev => updateFn(prev));
  }, []);

  return { 
    offers, 
    loading, 
    error, 
    refresh: fetchOffers,
    updateOfferStatus 
  };
}