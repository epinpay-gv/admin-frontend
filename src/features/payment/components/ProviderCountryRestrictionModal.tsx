"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import { PaymentProvider } from "@/features/payment/types";
import ProviderCountryRestriction from "./ProviderCountryRestriction";
import { useProviderForbiddenCountries } from "../hooks/useProviderForbiddenCountries";

interface ProviderCountryRestrictionModalProps {
  open: boolean;
  onClose: () => void;
  provider: PaymentProvider | null;
  onSuccess?: (updated: PaymentProvider) => void;
}

export function ProviderCountryRestrictionModal({
  open,
  onClose,
  provider,
  onSuccess,
}: ProviderCountryRestrictionModalProps) {
  const { updateForbiddenCountries, loading } = useProviderForbiddenCountries();
  const [tempForbidden, setTempForbidden] = useState<string[]>([]);

  // Sync state when provider changes or modal opens
  useEffect(() => {
    if (provider && open) {
      setTempForbidden(provider.forbiddenCountries || []);
    }
  }, [provider, open]);

  const handleSave = async (countries: string[]) => {
    if (!provider) return;
    await updateForbiddenCountries(provider.id, countries, (updated) => {
      if (onSuccess) onSuccess(updated);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ülke Kısıtlamalarını Düzenle"
      description={provider?.name}
      size="lg"
    >
      {provider && (
        <div className="py-2 ">
          <ProviderCountryRestriction
            forbidden={tempForbidden}
            onChange={setTempForbidden}
            onSave={handleSave}
            loading={loading}
          />
        </div>
      )}
    </Modal>
  );
}
