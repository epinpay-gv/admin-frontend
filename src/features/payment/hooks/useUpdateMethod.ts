"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentMethod } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useUpdateMethod() {
  const [loading, setLoading] = useState(false);

  const updateMethod = async (
    id: number,
    data: Partial<PaymentMethod>,
    onSuccess?: (updated: PaymentMethod) => void
  ) => {
    setLoading(true);
    try {
      const updated = await paymentService.updateMethod(id, data);
      toast.success("Güncellendi", "Ödeme yöntemi başarıyla güncellendi.");
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "Güncelleme sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateMethod, loading };
}
