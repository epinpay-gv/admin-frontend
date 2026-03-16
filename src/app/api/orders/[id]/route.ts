import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/mocks/orders";
import { Order, ORDER_STATUS, PAYMENT_STATUS, SLA_STATUS } from "@/features/orders/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === Number(id));
  if (!order) {
    return NextResponse.json({ message: "Sipariş bulunamadı." }, { status: 404 });
  }
  return NextResponse.json<Order>(order);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const index = mockOrders.findIndex((o) => o.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ message: "Sipariş bulunamadı." }, { status: 404 });
  }

  const order = mockOrders[index];

  if (body.action === "cancel") {
    const updated: Order = {
      ...order,
      status: ORDER_STATUS.CANCELLED,
      cancelReason: body.cancelReason ?? "Admin tarafından iptal edildi.",
      isSlaCancel: false,
      payment: {
        ...order.payment,
        status: PAYMENT_STATUS.REFUNDED,
        refundedAt: new Date().toISOString(),
        refundAmount: order.totalAmount,
      },
      eventLogs: [
        ...order.eventLogs,
        {
          id: Date.now(),
          event: "ORDER_CANCELLED",
          description: body.cancelReason ?? "Admin tarafından iptal edildi.",
          createdAt: new Date().toISOString(),
          actor: "admin" as const,
        },
        {
          id: Date.now() + 1,
          event: "REFUND_INITIATED",
          description: `${order.totalAmount} ${order.currency} iade işlemi başlatıldı.`,
          createdAt: new Date().toISOString(),
          actor: "system" as const,
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    mockOrders[index] = updated;
    return NextResponse.json<Order>(updated);
  }

  return NextResponse.json({ message: "Geçersiz aksiyon." }, { status: 400 });
}