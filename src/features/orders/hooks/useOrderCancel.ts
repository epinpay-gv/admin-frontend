"use client";

import { useState } from "react";
import { Order, ORDER_STATUS } from "@/features/orders/types";
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
      await orderService.cancel(order.id, reason);
      const updated: Order = { ...order, status: ORDER_STATUS.CANCELLED };
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