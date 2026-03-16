import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/mocks/orders";
import { Order, ORDER_STATUS, MEMBER_TYPE, SLA_STATUS } from "@/features/orders/types";

function applyFilters(orders: Order[], req: NextRequest): Order[] {
  const { searchParams } = req.nextUrl;

  let result = [...orders];

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const memberType = searchParams.get("memberType");
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");

  if (dateFrom) {
    result = result.filter((o) => new Date(o.createdAt) >= new Date(dateFrom));
  }
  if (dateTo) {
    result = result.filter((o) => new Date(o.createdAt) <= new Date(dateTo));
  }
  if (memberType) {
    result = result.filter((o) => o.memberType === memberType);
  }
  if (status) {
    result = result.filter((o) => o.status === status);
  }
  if (userId) {
    result = result.filter((o) => o.userId === Number(userId));
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function GET(req: NextRequest) {
  const isExport = req.nextUrl.pathname.endsWith("/export");

  if (isExport) {
    // Excel export — mock olarak JSON döner, gerçekte xlsx üretilir
    const filtered = applyFilters(mockOrders, req);
    return NextResponse.json(
      { message: "Export başlatıldı.", count: filtered.length, data: filtered },
      { status: 200 }
    );
  }

  const filtered = applyFilters(mockOrders, req);
  return NextResponse.json<Order[]>(filtered);
}