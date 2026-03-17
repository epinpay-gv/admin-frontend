"use client";

import { ORDER_STATUS, SLA_STATUS } from "@/features/orders/types";
import { AlertTriangle } from "lucide-react";

const STATUS_CONFIG: Record<ORDER_STATUS, { label: string; bg: string; color: string }> = {
  [ORDER_STATUS.PENDING]: { label: "Bekliyor", bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [ORDER_STATUS.PROCESSING]: { label: "İşleniyor", bg: "rgba(0,133,255,0.15)", color: "#0085FF" },
  [ORDER_STATUS.COMPLETED]: { label: "Tamamlandı", bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [ORDER_STATUS.CANCELLED]: { label: "İptal", bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [ORDER_STATUS.REFUNDED]: { label: "İade Edildi", bg: "rgba(155,89,182,0.15)", color: "#9B59B6" },
  [ORDER_STATUS.FAILED]: { label: "Başarısız", bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

interface OrderStatusBadgeProps {
  status: ORDER_STATUS;
  slaStatus?: SLA_STATUS;
}

export default function OrderStatusBadge({ status, slaStatus }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const showSlaWarning = slaStatus === SLA_STATUS.AT_RISK || slaStatus === SLA_STATUS.BREACHED;

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
        style={{ background: config.bg, color: config.color }}
      >
        {config.label}
      </span>
      {showSlaWarning && (
        <span
          className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono"
          style={{
            background: slaStatus === SLA_STATUS.BREACHED ? "rgba(255,80,80,0.2)" : "rgba(255,180,0,0.2)",
            color: slaStatus === SLA_STATUS.BREACHED ? "#FF5050" : "#FFB400",
          }}
        >
          <AlertTriangle size={9} />
          {slaStatus === SLA_STATUS.BREACHED ? "SLA İhlali" : "SLA Riski"}
        </span>
      )}
    </div>
  );
}