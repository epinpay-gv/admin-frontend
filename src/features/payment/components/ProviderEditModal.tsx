"use client";

import Modal from "@/components/common/modal/Modal";
import { PaymentProvider } from "@/features/payment/types";
import { ProviderEditForm } from "./ProviderEditForm";
import { useUpdateProvider } from "../hooks/useUpdateProvider";

interface ProviderEditModalProps {
  open: boolean;
  onClose: () => void;
  provider: PaymentProvider | null;
  onSuccess?: (updated: PaymentProvider) => void;
}

export function ProviderEditModal({
  open,
  onClose,
  provider,
  onSuccess,
}: ProviderEditModalProps) {
  const { updateProvider, loading } = useUpdateProvider();

  const handleSubmit = async (data: Partial<PaymentProvider>) => {
    if (!provider) return;
    await updateProvider(provider.id, data, (updated) => {
      if (onSuccess) onSuccess(updated);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hızlı Düzenle"
      description={provider?.name}
      size="lg"
    >
      {provider && (
        <ProviderEditForm
          initialData={provider}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
