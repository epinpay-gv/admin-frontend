"use client";

import { useEffect, useState, useCallback } from "react";
import { OfferListItem, OfferFilters, OFFER_STATUS, DELIVERY_TYPE } from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";


const FILTER_PREDICATES: {
  [K in keyof OfferFilters]: (
    value: NonNullable<OfferFilters[K]>,
    offer: OfferListItem
  ) => boolean;
} = {
  status:       (v, o) => o.status === v,
  deliveryType: (v, o) => o.deliveryType === v,
  currency:     (v, o) => o.price.currency === v,
  minPrice:     (v, o) => o.price.amount >= v,
  maxPrice:     (v, o) => o.price.amount <= v,
  search:       (v, o) => o.productName.toLowerCase().includes(v.toLowerCase()),
};

function applyFiltersToPipeline(data: OfferListItem[], filters: OfferFilters): OfferListItem[] {
  return (Object.entries(filters) as [keyof OfferFilters, unknown][])
    .filter(([, value]) => value !== undefined && value !== "" && value !== null)
    .reduce((result, [key, value]) => {
      const predicate = FILTER_PREDICATES[key];
      return predicate
        ? result.filter((o) => predicate(value as never, o))
        : result;
    }, data);
}

export function useOffers() {
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [all, setAll]       = useState<OfferListItem[]>([]);
  const [filters, setFilters] = useState<OfferFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    offerService
      .getAll()
      .then((data) => { setAll(data); setOffers(data); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback((next: OfferFilters) => {
    setFilters(next);
    setOffers(applyFiltersToPipeline(all, next));
  }, [all]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setOffers(all);
  }, [all]);

  // Toggle sonrası lokal state güncelleme 
  const updateOfferStatus = useCallback((id: number, status: OFFER_STATUS) => {
    const update = (list: OfferListItem[]) =>
      list.map((o) => (o.id === id ? { ...o, status } : o));

    setAll(update);
    setOffers(update);
  }, []);

  return { offers, filters, loading, error, applyFilters, clearFilters, updateOfferStatus };
}