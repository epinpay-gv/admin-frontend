"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { ProviderMethod } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useUpdateProviderMethod() {
  const [loading, setLoading] = useState(false);

  const updateProviderMethod = async (
    id: number,
    data: Partial<ProviderMethod>,
    onSuccess?: (updated: ProviderMethod) => void
  ) => {
    setLoading(true);
    try {
      const updated = await paymentService.updateProviderMethod(id, data);
      toast.success("Güncellendi", "Sağlayıcı-Yöntem ilişkisi başarıyla güncellendi.");
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "İşlem sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProviderMethod, loading };
}
