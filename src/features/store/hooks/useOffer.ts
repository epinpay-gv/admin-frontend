"use client";

import { useEffect, useState } from "react";
import { Offer } from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";

export function useOffer(id: number | null) {
  const [offer, setOffer]     = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return; 

    setLoading(true);
    offerService
      .getById(id)
      .then(setOffer)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { offer, loading, error };
}