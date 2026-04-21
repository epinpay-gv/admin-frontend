"use client";

import { useState, useEffect } from "react";
import { PaymentMethod, PaymentProvider } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";
import { toast } from "@/components/common/toast/toast";
import { useCountries } from "@/features/products/hooks/useCountries";

export function usePaymentCountryStatus(method: PaymentMethod | null) {
  const [forbidden, setForbidden] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();

  useEffect(() => {
    // setForbidden(method?.forbiddenCountries ?? []);
  }, [method]);

  const isForbidden = (code: string) => forbidden.includes(code);

  const toggleCountry = (code: string) => {
    if (isForbidden(code)) {
      setForbidden((prev) => prev.filter((c) => c !== code));
    } else {
      setForbidden((prev) => [...prev, code]);
    }
  };

  const setAllActive = () => setForbidden([]);

  const setAllInactive = () => {
    setForbidden(countries.map((c) => c.code));
  };

  const save = async (onSuccess?: (updated: PaymentMethod) => void) => {
    if (!method) return;
    setSaving(true);
    try {
      // const updated = await paymentService.updateForbiddenCountries(
      //   method.id,
      //   forbidden
      // );
      // toast.success("Güncellendi", "Ülke kısıtlamaları güncellendi.");
      // onSuccess?.(updated);
      toast.success("TEST", "Burası şimdilik testte");

    } catch {
      toast.error("Hata", "Ülke kısıtlamaları güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return {
    forbidden,
    isForbidden,
    toggleCountry,
    setAllActive,
    setAllInactive,
    save,
    saving,
    countries,
    countriesLoading,
  };
}