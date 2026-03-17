"use client";

import { useState } from "react";
import Modal from "@/components/common/modal/Modal";
import { Button } from "@/components/ui/button";
import { Order } from "@/features/orders/types";
import { useOrderCancel } from "@/features/orders/hooks/useOrderCancel";

interface OrderCancelModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdate?: (updated: Order) => void;
}

export default function OrderCancelModal({
  open,
  onClose,
  order,
  onUpdate,
}: OrderCancelModalProps) {
  const [reason, setReason] = useState("");
  const { cancel, cancelling } = useOrderCancel();

  const handleCancel = async () => {
    if (!order) return;
    await cancel(order, reason || "Admin tarafından iptal edildi.", (updated) => {
      onUpdate?.(updated);
      onClose();
      setReason("");
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Siparişi İptal Et"
      description={order ? `#${order.id} — ${order.user?.fullName ?? order.guestEmail}` : ""}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose} style={{ color: "var(--text-muted)" }}>
            Vazgeç
          </Button>
          <Button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-white"
            style={{ background: "linear-gradient(135deg, #FF5050 0%, #FF8C00 100%)" }}
          >
            {cancelling ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İptal Ediliyor...
              </span>
            ) : (
              "İptal Et & İade Başlat"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-xl border p-4 text-sm font-mono"
          style={{ background: "rgba(255,80,80,0.05)", borderColor: "rgba(255,80,80,0.2)", color: "#FF5050" }}
        >
          Bu işlem geri alınamaz. Sipariş iptal edilir ve ödeme iade sürecine alınır.
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            İptal Nedeni
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="İptal nedenini girin (opsiyonel)..."
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}