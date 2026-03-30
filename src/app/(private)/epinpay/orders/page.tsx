"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileDown } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import {
  useOrders,
  OrderStatusBadge,
  OrderMemberTypeBadge,
  OrderCancelModal,
  ORDER_STATUS,
  MEMBER_TYPE,
} from "@/features/orders";
import { Order } from "@/features/orders/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { useOrderExport } from "@/features/orders/hooks/useOrderExport";
import OrderProductsModal from "@/features/orders/components/OrderProductsModal";
import Spinner from "@/components/common/spinner/Spinner";
import { PALETTE } from "@/lib/status-color";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

type OrderRow = Order & Record<string, unknown>;

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Bekliyor", value: ORDER_STATUS.PENDING },
  { label: "İşleniyor", value: ORDER_STATUS.PROCESSING },
  { label: "Tamamlandı", value: ORDER_STATUS.COMPLETED },
  { label: "İptal", value: ORDER_STATUS.CANCELLED },
  { label: "İade Edildi", value: ORDER_STATUS.REFUNDED },
  { label: "Başarısız", value: ORDER_STATUS.FAILED },
];

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, error, updateOrder } = useOrders();
  const [cancelModal, setCancelModal] = useState<Order | null>(null);
  const [productsModal, setProductsModal] = useState<Order | null>(null);
  const { exportExcel, exporting } = useOrderExport();

  // ref ile tut — setState döngüsü olmaz, export anında güncel veriyi okur
  const filteredOrdersRef = useRef<Order[]>([]);

  const COLUMNS: ColumnDef<OrderRow>[] = [
    {
      key: "id",
      label: "Sipariş ID",
      sortable: true,
      width: "100px",
      render: (value, row) => (
        <button
          onClick={() => router.push(`/epinpay/orders/${row.id}`)}
          className="text-sm font-mono font-bold transition-colors"
          style={{ color: PALETTE.blue.color, }}
        >
          #{String(value)}
        </button>
      ),
    },
    {
      key: "userId",
      label: "Kullanıcı",
      sortable: true,
      searchable: true,
      searchKey: "user.fullName",
      render: (_, row) => {
        const order = row as unknown as Order;
        if (!order.user) {
          return (
            <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              {order.guestEmail ?? "—"}
            </span>
          );
        }
        return (
          <button
            onClick={() => router.push(`/users/${order.user!.id}`)}
            className="flex flex-col items-start transition-colors"
          >
            <span className="text-sm font-medium" style={{color: PALETTE.blue.color,}}>
              {order.user.fullName}
            </span>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              #{order.user.id}
            </span>
          </button>
        );
      },
    },
    {
      key: "createdAt",
      label: "Tarih",
      sortable: true,
      sortKey: "createdAt",
      datepicker: true,
      render: (value) => {
        const date = new Date(String(value));
        return (
          <div className="flex flex-col">
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
              {date.toLocaleDateString("tr-TR")}
            </span>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              {date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      key: "productCount",
      label: "Ürün Sayısı",
      sortable: true,
      render: (value, row) => {
        const order = row as unknown as Order;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProductsModal(order);
            }}
            className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg transition-all"
            style={{
              background: "var(--background-secondary)",
              color: PALETTE.blue.color,
              border: `1px solid ${PALETTE.blue.color}33`,
            }}
          >
            {String(value)} ürün
          </button>
        );
      },
    },
    {
      key: "memberType",
      label: "Üye Tipi",
      sortable: true,
      render: (value) => <OrderMemberTypeBadge memberType={value as MEMBER_TYPE} />,
    },
    {
      key: "status",
      label: "İşlem Durumu",
      sortable: true,
      render: (value, row) => {
        const order = row as unknown as Order;
        return (
          <OrderStatusBadge
            status={value as ORDER_STATUS}
            slaStatus={order.slaStatus}
          />
        );
      },
    },
    {
      key: "totalAmount",
      label: "Tutar",
      sortable: true,
      render: (value, row) => {
        const order = row as unknown as Order;
        return (
          <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
            {Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {order.currency}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">{error}</p>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Tekrar dene
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Siparişler"
        count={orders.length}
        countLabel="sipariş"
        actions={
          <Button
            onClick={() => exportExcel(filteredOrdersRef.current)}
            disabled={exporting}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {exporting ? (
              <span
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{
                  borderTopColor: "currentColor",
                  borderRightColor: "transparent",
                  borderBottomColor: "transparent",
                  borderLeftColor: "transparent",
                }}
              />
            ) : (
              <FileDown size={16} />
            )}
            Excel İndir
          </Button>
        }
      />

      <DataTable
        data={orders as OrderRow[]}
        columns={COLUMNS}
        showStatusFilter
        statusOptions={STATUS_OPTIONS}
        onFilteredDataChange={(rows) => {
        filteredOrdersRef.current = rows as unknown as Order[];
        }}
     actions={(row) => (<EntityActions row={row} onView={() => router.push(`/epinpay/orders/${row.id}`)}/>)}
      />

      <OrderCancelModal
        open={!!cancelModal}
        onClose={() => setCancelModal(null)}
        order={cancelModal}
        onUpdate={(updated) => {
          updateOrder(updated);
          setCancelModal(null);
        }}
      />

      <OrderProductsModal
        open={!!productsModal}
        onClose={() => setProductsModal(null)}
        order={productsModal}
      />
    </div>
  );
}