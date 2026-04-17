"use client";

import Modal from "@/components/common/modal/Modal";
import { ProviderMethod } from "@/features/payment/types";
import { ProviderMethodForm } from "./ProviderMethodForm";
import { useCreateProviderMethod } from "../hooks/useCreateProviderMethod";

interface ProviderMethodCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (created: ProviderMethod) => void;
}

export function ProviderMethodCreateModal({
  open,
  onClose,
  onSuccess,
}: ProviderMethodCreateModalProps) {
  const { createProviderMethod, loading } = useCreateProviderMethod();

  const handleSubmit = async (data: Partial<ProviderMethod>) => {
    await createProviderMethod(data, (created) => {
      if (onSuccess) onSuccess(created);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yeni Sağlayıcı-Yöntem İlişkisi"
      description="Sistemdeki mevcut bir sağlayıcı ile yöntemi eşleştirin."
      size="lg"
    >
      <ProviderMethodForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={onClose}
      />
    </Modal>
  );
}
