"use client";

import { useState } from "react";
import { OfferFormValues, OFFER_STATUS, DELIVERY_TYPE } from "@/features/store/types";
import { offerService } from "@/features/store/services/offer.service";

const defaultValues: OfferFormValues = {
  productId:    0,
  price:        0,
  currency:     "TRY",
  status:       OFFER_STATUS.ACTIVE,
  deliveryType: DELIVERY_TYPE.AUTOMATIC,
};

export function useOfferForm(id?: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (values: OfferFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (id) {
        await offerService.update(id, values);
      } else {
        await offerService.create(values);
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success, defaultValues };
}