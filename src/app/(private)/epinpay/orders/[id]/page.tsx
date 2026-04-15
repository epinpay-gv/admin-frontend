"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";
import {
  useOrder,
  OrderStatusBadge,
  OrderMemberTypeBadge,
  OrderCancelModal,
  ORDER_STATUS,
} from "@/features/orders";
import { Button } from "@/components/ui/button";
import { DELIVERY_TYPE, SLA_STATUS } from "@/features/orders/types";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";

const DELIVERY_TYPE_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.EPIN]: "E-Pin",
  [DELIVERY_TYPE.TOP_UP]: "Top Up",
  [DELIVERY_TYPE.ID_LOAD]: "ID Yükleme",
};

const ACTOR_LABELS = {
  system: "Sistem",
  admin: "Admin",
  user: "Kullanıcı",
};

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span
        className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
        style={{ color: "var(--text-heading)" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { order, loading, error, updateOrder } = useOrder(id);
  const [cancelModal, setCancelModal] = useState(false);

  const pageError =
    error ||
    (!loading && !order ? "Sipariş bulunamadı veya erişim kısıtlı." : null);

  const canCancel = order
    ? [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(order.status)
    : false;

  return (
    <PageState
      loading={loading}
      error={pageError}
      onRetry={() => router.back()}
    >
      {order && (
        <div className="flex flex-col h-full">
          {/* Üst bar */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-6 rounded-xl border gap-4"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1
                    className="text-xl font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Sipariş #{order.id}
                  </h1>
                  <OrderStatusBadge
                    status={order.status}
                    slaStatus={order.slaStatus}
                  />
                  {order.isSlaCancel && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "rgba(255,80,80,0.15)",
                        color: "#FF5050",
                      }}
                    >
                      SLA İptal
                    </span>
                  )}
                </div>
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {new Date(order.createdAt).toLocaleString("tr-TR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canCancel && (
                <Button
                  onClick={() => setCancelModal(true)}
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                  style={{
                    borderColor: "rgba(255,80,80,0.3)",
                    color: "#FF5050",
                  }}
                >
                  <XCircle size={14} />
                  Siparişi İptal Et
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-6">
            {/* Sol: Ana bilgiler */}
            <div className="lg:col-span-2 space-y-6">
              {/* Kullanıcı Bilgileri */}
              <div
                className="rounded-xl border p-6"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <SectionDivider title="Kullanıcı" />
                <div className="mt-4 space-y-3">
                  {order.user ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Ad Soyad
                        </span>
                        <button
                          onClick={() =>
                            router.push(`/epinpay/users/${order.user!.id}`)
                          }
                          className="text-sm font-medium"
                          style={{ color: "#0085FF" }}
                        >
                          {order.user.fullName}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Kullanıcı ID
                        </span>
                        <span
                          className="text-sm font-mono"
                          style={{ color: "var(--text-primary)" }}
                        >
                          #{order.user.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          E-posta
                        </span>
                        <span
                          className="text-sm font-mono"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {order.user.email}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Misafir E-posta
                      </span>
                      <span
                        className="text-sm font-mono"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.guestEmail}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Üye Tipi
                    </span>
                    <OrderMemberTypeBadge memberType={order.memberType} />
                  </div>
                </div>
              </div>

              {/* Ürünler */}
              <div
                className="rounded-xl border p-6"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <SectionDivider title="Ürünler" />
                <div className="mt-4 space-y-3">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: "var(--background-secondary)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg overflow-hidden border"
                          style={{
                            background: "var(--background-card)",
                            borderColor: "var(--border)",
                          }}
                        >
                          {product.imgUrl && (
                            <img
                              src={product.imgUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-[11px] font-mono"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {DELIVERY_TYPE_LABELS[product.deliveryType]} · x
                            {product.quantity}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-sm font-mono font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {(product.unitPrice * product.quantity).toLocaleString(
                          "tr-TR",
                          { minimumFractionDigits: 2 },
                        )}{" "}
                        {product.currency}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-between pt-2 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Toplam
                    </span>
                    <span
                      className="text-base font-bold font-mono"
                      style={{ color: "#00C6A2" }}
                    >
                      {order.totalAmount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {order.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Teslimat */}
              <div
                className="rounded-xl border p-6"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <SectionDivider title="Teslimat" />
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Teslimat Tipi
                    </span>
                    <span
                      className="text-sm font-mono"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {DELIVERY_TYPE_LABELS[order.delivery.deliveryType]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      SLA Durumu
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background:
                          order.slaStatus === SLA_STATUS.OK
                            ? PALETTE.green.bg
                            : order.slaStatus === SLA_STATUS.AT_RISK
                              ? PALETTE.yellow.bg
                              : PALETTE.red.bg,
                        color:
                          order.slaStatus === SLA_STATUS.OK
                            ? PALETTE.green.color
                            : order.slaStatus === SLA_STATUS.AT_RISK
                              ? PALETTE.yellow.color
                              : PALETTE.red.color,
                      }}
                    >
                      {order.slaStatus === SLA_STATUS.OK
                        ? "Normal"
                        : order.slaStatus === SLA_STATUS.AT_RISK
                          ? "Risk Altında"
                          : "İhlal Edildi"}
                    </span>
                  </div>
                  {order.delivery.slaDeadline && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        SLA Deadline
                      </span>
                      <span
                        className="text-sm font-mono"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {new Date(order.delivery.slaDeadline).toLocaleString(
                          "tr-TR",
                        )}
                      </span>
                    </div>
                  )}
                  {order.delivery.deliveredAt && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Teslim Tarihi
                      </span>
                      <span
                        className="text-sm font-mono"
                        style={{ color: "#00C6A2" }}
                      >
                        {new Date(order.delivery.deliveredAt).toLocaleString(
                          "tr-TR",
                        )}
                      </span>
                    </div>
                  )}
                  {order.delivery.payload && (
                    <div className="flex flex-col gap-1.5 pt-2">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Teslimat Kodu
                      </span>
                      <div
                        className="px-4 py-3 rounded-lg font-mono text-sm font-bold tracking-widest text-center"
                        style={{
                          background: "var(--background-secondary)",
                          color: "#00C6A2",
                          border: "1px solid rgba(0,198,162,0.2)",
                        }}
                      >
                        {order.delivery.payload}
                      </div>
                    </div>
                  )}
                  {order.cancelReason && (
                    <div className="flex flex-col gap-1.5 pt-2">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        İptal Nedeni
                      </span>
                      <p
                        className="text-sm font-mono px-3 py-2 rounded-lg"
                        style={{
                          background: "rgba(255,80,80,0.05)",
                          color: "#FF5050",
                          border: "1px solid rgba(255,80,80,0.15)",
                        }}
                      >
                        {order.cancelReason}
                        {order.isSlaCancel && " (SLA İhlali)"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Log */}
              <div
                className="rounded-xl border p-6"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <SectionDivider title="Event Log" />
                <div className="mt-4 space-y-2">
                  {order.eventLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 py-2 border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background:
                              log.actor === "system"
                                ? "#0085FF"
                                : log.actor === "admin"
                                  ? "#FFB400"
                                  : "#00C6A2",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-xs font-bold font-mono"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {log.event}
                          </span>
                          <span
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{
                              background: "var(--background-secondary)",
                              color: "var(--text-muted)",
                            }}
                          >
                            {
                              ACTOR_LABELS[
                                log.actor as keyof typeof ACTOR_LABELS
                              ]
                            }
                          </span>
                        </div>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {log.description}
                        </p>
                      </div>
                      <span
                        className="text-[11px] font-mono shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {new Date(log.createdAt).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: Ödeme özeti */}
            <div className="space-y-4">
              <div
                className="rounded-xl border p-6 sticky top-6"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <SectionDivider title="Ödeme" />
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Yöntem
                    </span>
                    <span
                      className="text-sm font-mono"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.payment.method.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Durum
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background:
                          order.payment.status === "success"
                            ? PALETTE.green.bg
                            : order.payment.status === "refunded"
                              ? PALETTE.purple.bg
                              : PALETTE.red.bg,
                        color:
                          order.payment.status === "success"
                            ? PALETTE.green.color
                            : order.payment.status === "refunded"
                              ? PALETTE.purple.color
                              : PALETTE.red.color,
                      }}
                    >
                      {order.payment.status === "success"
                        ? "Başarılı"
                        : order.payment.status === "refunded"
                          ? "İade Edildi"
                          : order.payment.status === "failed"
                            ? "Başarısız"
                            : "Bekliyor"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Tutar
                    </span>
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.payment.amount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {order.payment.currency}
                    </span>
                  </div>
                  {order.payment.paidAt && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Ödeme Tarihi
                      </span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {new Date(order.payment.paidAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <OrderCancelModal
            open={cancelModal}
            onClose={() => setCancelModal(false)}
            order={order}
            onUpdate={(updated) => {
              updateOrder(updated);
              setCancelModal(false);
            }}
          />
        </div>
      )}
    </PageState>
  );
}