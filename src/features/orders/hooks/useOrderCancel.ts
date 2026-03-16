"use client";

import { useState } from "react";
import { Order } from "@/features/orders/types";
import { orderService } from "@/features/orders/services/order.service";
import { toast } from "@/components/common/toast/toast";

export function useOrderCancel() {
  const [cancelling, setCancelling] = useState(false);

  const cancel = async (
    order: Order,
    reason: string,
    onSuccess?: (updated: Order) => void
  ) => {
    setCancelling(true);
    try {
      const updated = await orderService.cancel(order.id, reason);
      toast.success("İptal Edildi", `#${order.id} siparişi iptal edildi. İade işlemi başlatıldı.`);
      onSuccess?.(updated);
    } catch (err) {
      toast.error("Hata", (err as Error).message);
    } finally {
      setCancelling(false);
    }
  };

  return { cancel, cancelling };
}