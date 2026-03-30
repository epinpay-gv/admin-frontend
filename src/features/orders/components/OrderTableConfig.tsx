import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Order, ORDER_STATUS, MEMBER_TYPE } from "../types";
import { OrderStatusBadge, OrderMemberTypeBadge } from "@/features/orders";
import { PALETTE } from "@/lib/status-color";

export type OrderRow = Record<string, unknown>;

export const ORDER_COLUMNS = (
  onViewDetail: (id: number) => void,
  onShowProducts: (order: Order) => void,
  onUserClick: (userId: number) => void
): ColumnDef<OrderRow>[] => [
  {
    key: "id",
    label: "Sipariş ID",
    sortable: true,
    width: "100px",
    render: (value) => (
      <button
        onClick={() => onViewDetail(Number(value))}
        className="text-sm font-mono font-bold transition-colors hover:underline"
        style={{ color: PALETTE.blue.color }}
      >
        #{String(value)}
      </button>
    ),
  },
  {
    key: "userId",
    label: "Kullanıcı",
    sortable: true,
    render: (_, row) => {
      const order = (row as unknown) as Order;
      if (!order.user) {
        return <span className="text-sm opacity-60">{order.guestEmail ?? "—"}</span>;
      }
      return (
        <button onClick={() => onUserClick(order.user!.id)} className="flex flex-col items-start hover:opacity-80">
          <span className="text-sm font-medium" style={{ color: PALETTE.blue.color }}>{order.user.fullName}</span>
          <span className="text-[11px] opacity-50">#{order.user.id}</span>
        </button>
      );
    },
  },
  {
    key: "createdAt",
    label: "Tarih",
    sortable: true,
    render: (value) => {
      const date = new Date(String(value));
      return (
        <div className="flex flex-col">
          <span className="text-sm">{date.toLocaleDateString("tr-TR")}</span>
          <span className="text-[11px] opacity-50">{date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      );
    },
  },
  {
    key: "productCount",
    label: "Ürünler",
    render: (value, row) => (
      <button
        onClick={() => onShowProducts((row as unknown) as Order)}
        className="text-xs px-2 py-1 rounded border border-blue-500/20 bg-blue-500/5 transition-colors hover:bg-blue-500/10"
        style={{ color: PALETTE.blue.color }}
      >
        {String(value)} Ürün
      </button>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value, row) => {
      const order = (row as unknown) as Order;
      return <OrderStatusBadge status={value as ORDER_STATUS} slaStatus={order.slaStatus} />;
    },
  },
  {
    key: "totalAmount",
    label: "Tutar",
    sortable: true,
    render: (value, row) => {
      const order = (row as unknown) as Order;
      return (
        <span className="font-mono font-bold">
          {Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {order.currency}
        </span>
      );
    },
  },
];