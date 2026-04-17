"use client";

import Modal from "@/components/common/modal/Modal";
import { PaymentMethod } from "@/features/payment/types";
import { MethodEditForm } from "./MethodEditForm";
import { useUpdateMethod } from "../hooks/useUpdateMethod";

interface MethodEditModalProps {
  open: boolean;
  onClose: () => void;
  method: PaymentMethod | null;
  onSuccess?: (updated: PaymentMethod) => void;
}

export function MethodEditModal({
  open,
  onClose,
  method,
  onSuccess,
}: MethodEditModalProps) {
  const { updateMethod, loading } = useUpdateMethod();

  const handleSubmit = async (data: Partial<PaymentMethod>) => {
    if (!method) return;
    await updateMethod(method.id, data, (updated) => {
      if (onSuccess) onSuccess(updated);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hızlı Düzenle"
      description={method?.name}
      size="md"
    >
      {method && (
        <MethodEditForm
          initialData={method}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
