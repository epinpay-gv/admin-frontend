"use client";

import Modal from "@/components/common/modal/Modal";
import { PaymentMethod } from "@/features/payment/types";
import { MethodCreateForm } from "./MethodCreateForm";
import { useCreateMethod } from "../hooks/useCreateMethod";

interface MethodCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (created: PaymentMethod) => void;
}

export function MethodCreateModal({
  open,
  onClose,
  onSuccess,
}: MethodCreateModalProps) {
  const { createMethod, loading } = useCreateMethod();

  const handleSubmit = async (data: Partial<PaymentMethod>) => {
    await createMethod(data, (created) => {
      if (onSuccess) onSuccess(created);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Yeni Yöntem Ekle"
      description="Sisteme yeni bir ödeme yöntemi tanımlayın."
      size="md"
    >
      <MethodCreateForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={onClose}
      />
    </Modal>
  );
}
