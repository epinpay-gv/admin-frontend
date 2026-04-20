"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOffer } from "@/features/store/hooks/useOffer";
import { OFFER_STATUS, OFFER_TYPE } from "@/features/store/types";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";
import OfferForm from "@/features/store/components/OfferForm";
import { Edit2, X } from "lucide-react";
import { useState } from "react";
import { StockManager } from "@/features/store/components/StockManager";

const STATUS_COLORS: Record<string, typeof PALETTE.green> = {
  [OFFER_STATUS.ACTIVE]: PALETTE.green,
  [OFFER_STATUS.INACTIVE]: PALETTE.red,
  [OFFER_STATUS.SOLD_OUT]: PALETTE.yellow,
  [OFFER_STATUS.DELETED]: PALETTE.red,
};
const STATUS_LABELS: Record<string, string> = {
  [OFFER_STATUS.ACTIVE]: "Aktif",
  [OFFER_STATUS.INACTIVE]: "Pasif",
  [OFFER_STATUS.SOLD_OUT]: "Tükendi",
  [OFFER_STATUS.DELETED]: "Silindi",
};
const TYPE_LABELS: Record<string, string> = {
  [OFFER_TYPE.NORMAL]: "Stoklu",
  [OFFER_TYPE.DROPSHIPPING]: "Stoksuz",
  [OFFER_TYPE.TOP_UP]: "Top-Up",
};

function resolveOfferId(id: string): string | null {
  return id === "new" ? null : id;
}

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const offerId = resolveOfferId(id);
  const [isEditing, setIsEditing] = useState(false);

  const { offer, loading, error } = useOffer(offerId);

  const handleBack = () => router.back();

  const isNew = id === "new";

  const statusStr = offer?.status as string ?? "";
  const typeStr = offer?.type as string ?? "";

  // Yeni teklif oluşturma sayfası
  if (isNew) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="pb-4">
          <div
            className="shrink-0 flex items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Yeni Teklif Oluştur
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6 px-6">
          <div 
            className="max-w-3xl mx-auto p-6 rounded-2xl border"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <OfferForm mode="create" onCancel={() => router.back()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageState
      loading={loading}
      error={error || (!offer && !loading ? "Teklif bulunamadı." : null)}
      onRetry={() => router.back()}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="pb-4">
          {/* Üst bar */}
          <div
            className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleBack}
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
                    className="text-xl font-semibold tracking-tight truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Teklif Detay
                  </h1>

                  {offer && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: (STATUS_COLORS[statusStr] ?? PALETTE.red).bg,
                        color: (STATUS_COLORS[statusStr] ?? PALETTE.red).color,
                      }}
                    >
                      {STATUS_LABELS[statusStr] ?? statusStr}
                    </span>
                  )}
                  {offer && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "var(--background-secondary)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {TYPE_LABELS[typeStr] ?? typeStr}
                    </span>
                  )}
                </div>

                {offer && (
                  <span
                    className="text-[11px] font-mono mt-1 block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ID: {offer.id}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="flex items-center gap-2"
                style={{
                  borderColor: isEditing ? "#FF5050" : "var(--border)",
                  color: isEditing ? "#FF5050" : "var(--text-primary)",
                }}
              >
                {isEditing ? <X size={14} /> : <Edit2 size={14} />}
                {isEditing ? "İptal" : "Düzenle"}
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                Geri
              </Button>
            </div>
          </div>
        </div>

        {/* Detail Content */}
        {offer && (
          <div className="flex-1 overflow-y-auto pb-6 px-6">
            {isEditing ? (
              <div 
                className="max-w-3xl mx-auto p-6 rounded-2xl border"
                style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
              >
                <h2 className="text-lg font-bold mb-6">Teklifi Düzenle</h2>
                <OfferForm 
                  initialOffer={offer} 
                  mode="edit" 
                  onCancel={() => setIsEditing(false)} 
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailCard label="Ürün ID" value={`#${offer.product_id}`} />
                  <DetailCard label="Mağaza ID" value={offer.store_id.slice(0, 12) + "…"} title={offer.store_id} />
                  <DetailCard label="Fiyat" value={`${Number(offer.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${offer.currency_code ?? offer.currency_id}`} />
                  {offer.usd_amount !== undefined && (
                    <DetailCard label="USD Fiyat" value={`$${Number(offer.usd_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                  )}
                  <DetailCard label="Tip" value={TYPE_LABELS[typeStr] ?? typeStr} />
                  <DetailCard label="Durum" value={STATUS_LABELS[statusStr] ?? statusStr} />
                  {offer.min_stock_threshold != null && (
                    <DetailCard label="Min Stok Eşiği" value={String(offer.min_stock_threshold)} />
                  )}
                  {offer.server_id && (
                    <DetailCard label="Server ID" value={offer.server_id} />
                  )}
                  {offer._count?.stocks !== undefined && (
                    <DetailCard label="Mevcut Stok" value={String(offer._count.stocks)} />
                  )}
                  <DetailCard label="Oluşturulma" value={new Date(offer.created_at).toLocaleString("tr-TR")} />
                  <DetailCard label="Güncelleme" value={new Date(offer.updated_at).toLocaleString("tr-TR")} />
                </div>

                {/* Stok Yönetimi */}
                {offer.type === "NORMAL" && (
                  <StockManager offerId={offer.id} offerType={offer.type} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageState>
  );
}

function DetailCard({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-sm font-medium font-mono" style={{ color: "var(--text-primary)" }} title={title}>
        {value}
      </span>
    </div>
  );
}