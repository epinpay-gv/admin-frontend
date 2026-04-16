"use client";

import { useState } from "react";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentProvider } from "@/features/payment/types";
import { toast } from "@/components/common/toast/toast";

export function useProviderForbiddenCountries() {
  const [loading, setLoading] = useState(false);

  const updateForbiddenCountries = async (
    id: number,
    countries: string[],
    onSuccess?: (updated: PaymentProvider) => void
  ) => {
    setLoading(true);
    try {
      const updated = await paymentService.addForbiddenCountries(id, countries);
      toast.success("Güncellendi", "Ülke kısıtlamaları başarıyla güncellendi.");
      if (onSuccess) onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error("Hata", (err as Error).message || "Ülke kısıtlamaları güncellenirken bir hata oluştu.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateForbiddenCountries, loading };
}
