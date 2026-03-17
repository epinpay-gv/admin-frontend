"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useOffer } from "@/features/store/hooks/useOffer";
import { useOfferForm } from "@/features/store/hooks/useOfferForm";
import { OFFER_STATUS, DELIVERY_TYPE } from "@/features/store/types";
import { Button } from "@/components/ui/button";
import OfferForm from "@/features/store/components/OfferForm";


// ─── Sabitler ──────────────────────────────────────────────

const STATUS_COLORS: Record<OFFER_STATUS, { bg: string; color: string }> = {
  [OFFER_STATUS.ACTIVE]:  { bg: "rgba(0,198,162,0.15)",  color: "#00C6A2" },
  [OFFER_STATUS.PASSIVE]: { bg: "rgba(255,80,80,0.15)",  color: "#FF5050" },
  [OFFER_STATUS.DRAFT]:   { bg: "rgba(255,180,0,0.15)",  color: "#FFB400" },
};

const STATUS_LABELS: Record<OFFER_STATUS, string> = {
  [OFFER_STATUS.ACTIVE]:  "Aktif",
  [OFFER_STATUS.PASSIVE]: "Pasif",
  [OFFER_STATUS.DRAFT]:   "Taslak",
};

const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.AUTOMATIC]:    "Otomatik Teslimat",
  [DELIVERY_TYPE.ID_UPLOAD]:    "ID Yükleme",
  [DELIVERY_TYPE.DROPSHIPPING]: "Stoksuz",
};

// ─── Mode yardımcıları — product kalıbıyla aynı ───────────

type PageMode = "create" | "edit";

function resolveMode(id: string): PageMode {
  return id === "new" ? "create" : "edit";
}

function resolveOfferId(id: string): number | null {
  return id === "new" ? null : Number(id);
}

// ─── Sayfa ─────────────────────────────────────────────────

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }      = use(params);
  const router      = useRouter();
  const mode        = resolveMode(id);
  const numericId   = resolveOfferId(id);

  const { offer, loading, error } = useOffer(numericId);
  const { submit, loading: saving, error: saveError, defaultValues } = useOfferForm(numericId ?? undefined);

  const [isDirty, setIsDirty] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      if (confirm("Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  // Loading / Error 

  if (loading && numericId !== null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
        />
      </div>
    );
  }

if (error || (numericId !== null && !offer && !loading)) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-red-400 text-sm font-mono">
        {error ?? "Teklif bulunamadı."}
      </p>
      <Button variant="ghost" onClick={() => router.back()}>
        Geri dön
      </Button>
    </div>
  );
}
  const pageTitle = mode === "create" ? "Yeni Teklif" : offer?.product.name ?? "";

  // Render 

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="pb-4">

        {/* Üst bar — product kalıbıyla aynı yapı */}
        <div
          className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBack}
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
              style={{
                background:  "var(--background-secondary)",
                borderColor: "var(--border)",
                color:       "var(--text-muted)",
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
                  {pageTitle}
                </h1>

                {/* Durum badge */}
                {offer && mode === "edit" && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: STATUS_COLORS[offer.status].bg,
                      color:      STATUS_COLORS[offer.status].color,
                    }}
                  >
                    {STATUS_LABELS[offer.status]}
                  </span>
                )}

                {/* Teslimat tipi badge */}
                {offer && (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: "var(--background-secondary)",
                      color:      "var(--text-muted)",
                    }}
                  >
                    {DELIVERY_LABELS[offer.deliveryType]}
                  </span>
                )}

                {mode === "create" && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(255,180,0,0.15)", color: "#FFB400" }}
                  >
                    Yeni
                  </span>
                )}

                {isDirty && (
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,180,0,0.15)", color: "#FFB400" }}
                  >
                    Kaydedilmemiş değişiklikler
                  </span>
                )}
              </div>

              {offer && (
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  #{offer.id} · {offer.product.slug}
                </p>
              )}
            </div>
          </div>

          {/* Kaydet butonu */}
          <Button
            onClick={() => {}} 
            disabled={saving}
            className="text-white flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              <>
                <Save size={14} />
                {mode === "create" ? "Oluştur" : "Kaydet"}
              </>
            )}
          </Button>
        </div>
      </div>

     
      <div className="flex-1 overflow-y-auto">
        <OfferForm
          offer={offer ?? null}
          mode={mode}
          saving={saving}
          defaultValues={defaultValues}
          onDirtyChange={setIsDirty}
          onSubmit={async (values) => {
            await submit(values);
            router.push("/epinpay/store");
          }}
        />
      </div>

      {saveError && (
        <p className="text-red-400 text-xs font-mono px-6 py-2">{saveError}</p>
      )}
    </div>
  );
}