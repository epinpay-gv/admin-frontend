"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentProvider } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useUpdateProvider() {
  const [loading, setLoading] = useState(false);

  const updateProvider = async (
    id: number,
    data: Partial<PaymentProvider>,
    onSuccess?: (updated: PaymentProvider) => void
  ) => {
    setLoading(true);
    try {
      const updated = await paymentService.updateProvider(id, data);
      toast.success("Güncellendi", "Ödeme sağlayıcısı başarıyla güncellendi.");
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "Güncelleme sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProvider, loading };
}
