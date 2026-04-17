"use client";

import Modal from "@/components/common/modal/Modal";
import { PaymentProvider } from "@/features/payment/types";
import { ProviderCreateForm } from "./ProviderCreateForm";
import { useCreateProvider } from "../hooks/useCreateProvider";

interface ProviderCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (created: PaymentProvider) => void;
}

export function ProviderCreateModal({
  open,
  onClose,
  onSuccess,
}: ProviderCreateModalProps) {
  const { createProvider, loading } = useCreateProvider();

  const handleSubmit = async (data: Partial<PaymentProvider>) => {
    await createProvider(data, (created) => {
      if (onSuccess) onSuccess(created);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yeni Sağlayıcı Ekle"
      description="Sisteme yeni bir ödeme sağlayıcı kaydedin."
      size="md"
    >
      <ProviderCreateForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={onClose}
      />
    </Modal>
  );
}
