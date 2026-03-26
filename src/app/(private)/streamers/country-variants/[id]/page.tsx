"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {PageState} from "@/components/common/page-state/PageState";

import { useCountryVariant }  from "@/features/streamers/hooks/useCountryVariant";
import { usePackageTemplate } from "@/features/streamers/hooks/usePackageTemplate";
import VariantContentList      from "@/features/streamers/components/VariantContentList";

import {
  VARIANT_STATUS,
  VARIANT_STATUS_LABELS,
  PACKAGE_LEVEL_LABELS,
} from "@/features/streamers/types";

const VARIANT_STATUS_COLOR: Record<VARIANT_STATUS, { bg: string; color: string }> = {
  [VARIANT_STATUS.ACTIVE]:   { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  [VARIANT_STATUS.INACTIVE]: { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
};

export default function VariantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();
  const { variant, loading: variantLoading, error: variantError, updateVariant } = useCountryVariant(Number(id));

  const [form, setForm]     = useState({ currency: "", durationDays: "", status: VARIANT_STATUS.ACTIVE });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);

  // Şablon verilerini çek
  const { template: templateData, loading: templateLoading } = usePackageTemplate(variant?.templateId ?? null);

  // Veri geldiğinde form ilklendirme
  useEffect(() => {
    if (variant && !dirty && form.currency === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        currency:     variant.currency,
        durationDays: String(variant.durationDays),
        status:       variant.status,
      });
    }
  }, [variant, dirty, form.currency]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateVariant({
      currency:     form.currency,
      durationDays: Number(form.durationDays),
      status:       form.status as VARIANT_STATUS,
    });
    setSaving(false);
    setDirty(false);
  };

  const handleSaveOverride = async (
    templateContentId: number,
    value: string | number | boolean | null
  ) => {
    if (!variant) return;

    const existingIndex = variant.contents.findIndex(
      (c) => c.templateContentId === templateContentId
    );

    let updatedContents;

    if (existingIndex >= 0) {
      updatedContents = variant.contents.map((c) =>
        c.templateContentId === templateContentId
          ? { ...c, overrideValue: value, updatedAt: new Date().toISOString() }
          : c
      );
    } else {
      updatedContents = [
        ...variant.contents,
        {
          id:                Date.now(),
          variantId:         variant.id,
          templateContentId,
          key:               templateData?.contents.find((c) => c.id === templateContentId)?.key ?? "",
          overrideValue:     value,
          updatedAt:         new Date().toISOString(),
        },
      ];
    }

    await updateVariant({ contents: updatedContents });
  };

  // Sayfa Durum Yönetimi - TypeScript hatasını gidermek için !! (double bang) kullanıldı
  const isPageLoading = !!(variantLoading || (variant && templateLoading));
  const pageError = variantError || (!variant && !variantLoading ? "Varyant bulunamadı." : null);

  return (
    <PageState 
      loading={isPageLoading} 
      error={pageError} 
      onRetry={() => router.back()}
    >
      {variant && (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
          {/* Üst Bar */}
          <div
            className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 mb-4 rounded-xl border"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
                style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {variant.templateName} · {variant.countryCode}
                  </h1>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{ 
                      background: VARIANT_STATUS_COLOR[variant.status].bg, 
                      color: VARIANT_STATUS_COLOR[variant.status].color 
                    }}
                  >
                    {VARIANT_STATUS_LABELS[variant.status]}
                  </span>
                  {dirty && (
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,180,0,0.15)", color: "#FFB400" }}
                    >
                      Kaydedilmemiş değişiklikler
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  #{variant.id} · {PACKAGE_LEVEL_LABELS[variant.templateLevel]} · {variant.countryName}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="text-white flex items-center gap-2 shrink-0"
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
                  Kaydet
                </>
              )}
            </Button>
          </div>

          {/* İçerik */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10 space-y-4">
            {/* Varyant Bilgileri */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Varyant Bilgileri
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Para Birimi
                  </label>
                  <input
                    value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    placeholder="TRY, AED..."
                    className="h-9 rounded-lg border px-3 text-sm outline-none font-mono"
                    style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Paket Süresi (Gün)
                  </label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => handleChange("durationDays", e.target.value)}
                    min={1}
                    className="h-9 rounded-lg border px-3 text-sm outline-none font-mono"
                    style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Durum
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="h-9 rounded-lg border px-3 text-sm outline-none"
                    style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  >
                    {Object.entries(VARIANT_STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Override İçerikler */}
            <VariantContentList
              variant={variant}
              templateContents={templateData?.contents ?? []}
              onSaveOverride={handleSaveOverride}
            />
          </div>
        </div>
      )}
    </PageState>
  );
}