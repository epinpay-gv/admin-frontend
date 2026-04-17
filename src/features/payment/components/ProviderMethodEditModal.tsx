"use client";

import Modal from "@/components/common/modal/Modal";
import { ProviderMethod } from "@/features/payment/types";
import { ProviderMethodForm } from "./ProviderMethodForm";
import { useUpdateProviderMethod } from "../hooks/useUpdateProviderMethod";

interface ProviderMethodEditModalProps {
  open: boolean;
  onClose: () => void;
  providerMethod: ProviderMethod | null;
  onSuccess?: (updated: ProviderMethod) => void;
}

export function ProviderMethodEditModal({
  open,
  onClose,
  providerMethod,
  onSuccess,
}: ProviderMethodEditModalProps) {
  const { updateProviderMethod, loading } = useUpdateProviderMethod();

  const handleSubmit = async (data: Partial<ProviderMethod>) => {
    if (!providerMethod) return;
    await updateProviderMethod(providerMethod.id, data, (updated: ProviderMethod) => {
      if (onSuccess) onSuccess(updated);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="İlişkiyi Düzenle"
      description="Sağlayıcı-Yöntem eşleşmesini ve komisyon değerlerini güncelleyin."
      size="lg"
    >
      <ProviderMethodForm
        onSubmit={handleSubmit}
        initialData={providerMethod}
        loading={loading}
        onCancel={onClose}
        isEdit={true}
      />
    </Modal>
  );
}
