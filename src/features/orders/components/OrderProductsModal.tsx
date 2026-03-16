"use client";

import Modal from "@/components/common/modal/Modal";
import { Order, DELIVERY_TYPE } from "@/features/orders/types";
import { Package } from "lucide-react";

interface OrderProductsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.EPIN]: "E-Pin",
  [DELIVERY_TYPE.TOP_UP]: "Top Up",
  [DELIVERY_TYPE.ID_LOAD]: "ID Yükleme",
};

export default function OrderProductsModal({
  open,
  onClose,
  order,
}: OrderProductsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sipariş Ürünleri"
      description={order ? `#${order.id} — ${order.user?.fullName ?? order.guestEmail}` : ""}
      size="md"
    >
      <div className="space-y-2">
        {order?.products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <Package size={20} className="mb-2 opacity-40" />
            <p className="text-sm font-mono">Ürün bulunamadı</p>
          </div>
        ) : (
          order?.products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl border"
              style={{
                background: "var(--background-secondary)",
                borderColor: "var(--border)",
              }}
            >
              {/* Sol: Ad + Tip */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
                >
                  <Package size={13} style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(0,133,255,0.1)",
                        color: "#0085FF",
                      }}
                    >
                      {DELIVERY_LABELS[product.deliveryType]}
                    </span>
                    {product.quantity > 1 && (
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        x{product.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ: Fiyat */}
              <span
                className="text-sm font-mono font-semibold shrink-0 ml-4"
                style={{ color: "var(--text-primary)" }}
              >
                {(product.unitPrice * product.quantity).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}{" "}
                {product.currency}
              </span>
            </div>
          ))
        )}

        {/* Toplam */}
        {order && order.products.length > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--background-card)" }}
          >
            <span
              className="text-xs font-semibold font-mono uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Toplam
            </span>
            <span
              className="text-base font-bold font-mono"
              style={{ color: "#00C6A2" }}
            >
              {order.totalAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}{" "}
              {order.currency}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}