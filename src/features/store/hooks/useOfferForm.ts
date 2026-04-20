"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { offerService } from "../services/offer.service";
import { Offer, OfferFormValues, OFFER_STATUS, OFFER_TYPE } from "../types";

export function useOfferForm(initialOffer?: Offer) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<OfferFormValues>({
    store_id: initialOffer?.store_id ?? "",
    product_id: initialOffer?.product_id ?? "",
    currency_id: initialOffer?.currency_id ?? 1, // Default to TRY
    currency_name: "",
    amount: initialOffer?.amount ?? "",
    type: (initialOffer?.type as OFFER_TYPE) ?? OFFER_TYPE.NORMAL,
    status: (initialOffer?.status as OFFER_STATUS) ?? OFFER_STATUS.ACTIVE,
    epins: [],
    min_stock_threshold: initialOffer?.min_stock_threshold ?? "",
    server_id: initialOffer?.server_id ?? "",
    isStocked: initialOffer?.type === OFFER_TYPE.NORMAL,
  });

  const handleChange = useCallback((patch: Partial<OfferFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (initialOffer) {
        // Update
        const response = await offerService.update(initialOffer.id, {
          amount: Number(values.amount),
          status: values.status,
          server_id: values.server_id,
        });
        if (response.success) {
          toast.success("Teklif başarıyla güncellendi.");
          router.refresh();
        } else {
          toast.error("Teklif güncellenirken bir hata oluştu.");
        }
      } else {
        // Create
        const payload: any = {
          store_id: values.store_id,
          product_id: Number(values.product_id),
          currency_id: Number(values.currency_id),
          amount: Number(values.amount),
          type: values.type,
          status: values.status,
        };

        // NORMAL tipinde epins ve min_stock_threshold ekle
        if (values.type === OFFER_TYPE.NORMAL) {
          payload.epins = values.epins;
          if (values.min_stock_threshold) {
            payload.min_stock_threshold = Number(values.min_stock_threshold);
          }
        }

        // TOP_UP tipinde server_id ekle
        if (values.type === OFFER_TYPE.TOP_UP) {
          if (values.server_id) {
            payload.server_id = values.server_id;
          }
        }

        const response = await offerService.create(payload);
        if (response.success) {
          toast.success("Teklif başarıyla oluşturuldu.");
          router.push("/store");
        } else {
          toast.error("Teklif oluşturulurken bir hata oluştu.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const addStocks = async (epins: string[]) => {
    if (!initialOffer) return;
    setLoading(true);
    try {
      const response = await offerService.addStocks(initialOffer.id, epins);
      if (response.success) {
        toast.success(`${epins.length} yeni stok eklendi.`);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Stok eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    loading,
    handleChange,
    handleSubmit,
    addStocks,
  };
}