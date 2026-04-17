"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentProvider } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useCreateProvider() {
  const [loading, setLoading] = useState(false);

  const createProvider = async (
    data: Partial<PaymentProvider>,
    onSuccess?: (created: PaymentProvider) => void
  ) => {
    setLoading(true);
    try {
      const created = await paymentService.createProvider(data);
      toast.success("Oluşturuldu", "Ödeme sağlayıcısı başarıyla oluşturuldu.");
      if (onSuccess) onSuccess(created);
      return created;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "İşlem sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProvider, loading };
}
