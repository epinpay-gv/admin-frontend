"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { ProviderMethod } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useCreateProviderMethod() {
  const [loading, setLoading] = useState(false);

  const createProviderMethod = async (
    data: Partial<ProviderMethod>,
    onSuccess?: (created: ProviderMethod) => void
  ) => {
    setLoading(true);
    try {
      const created = await paymentService.createProviderMethod(data);
      toast.success("Oluşturuldu", "Sağlayıcı-Yöntem ilişkisi başarıyla oluşturuldu.");
      if (onSuccess) onSuccess(created);
      return created;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "İşlem sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProviderMethod, loading };
}
