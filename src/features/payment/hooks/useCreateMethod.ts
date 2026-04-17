"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentMethod } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useCreateMethod() {
  const [loading, setLoading] = useState(false);

  const createMethod = async (
    data: Partial<PaymentMethod>,
    onSuccess?: (created: PaymentMethod) => void
  ) => {
    setLoading(true);
    try {
      const created = await paymentService.createMethod(data);
      toast.success("Oluşturuldu", "Ödeme yöntemi başarıyla oluşturuldu.");
      if (onSuccess) onSuccess(created);
      return created;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "İşlem sırasında bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createMethod, loading };
}
