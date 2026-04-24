"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";
import { usePackage } from "@/features/streamers/hooks/usePackages";
import { packageService } from "@/features/streamers/services/streamer.service";
import PackageDetailCriteriaList from "@/features/streamers/components/PackageDetailCriteriaList";
import PackageDetailVersionList from "@/features/streamers/components/PackageDetailVersionList";
import type { PackageDetailCriteria } from "@/features/streamers/types";
import { usePackageDetails } from "@/features/streamers/hooks/Usepackagedetails";


export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();
  const isNew   = id === "new";

  const { pkg, loading, error, updatePackage, refresh } = usePackage(isNew ? null : id);
  const {
    details,
    currentDetail,
    loading:  detailLoading, 
    updateCurrent,
  } = usePackageDetails(isNew ? null : id);

  // ── Form state ──
  const [form, setForm]     = useState({ name: "", order_rank: "1", is_active: true });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);

  useEffect(() => {
    if (!isNew && pkg && !dirty) {
      setForm({
        name:       pkg.name,
        order_rank: String(pkg.orderRank),
        is_active:  pkg.isActive,
      });
    }
  }, [pkg, dirty, isNew]);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    console.log("tıklanıyor")
    setSaving(true);
    try {
      if (isNew) {
        const created = await packageService.create({
          name:       form.name,
          order_rank: Number(form.order_rank),
        });
        router.replace(`/streamers/packages/${created.id}`);
      } else {
        await updatePackage({
          name:       form.name,
          order_rank: Number(form.order_rank),
          is_active:  form.is_active,
        });
        setDirty(false);
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCriteria = async (
    criteriaId: string,
    data: Partial<PackageDetailCriteria>
  ) => {
    if (!currentDetail) return;
    const updated = currentDetail.criteria.map((c) =>
      c.id === criteriaId ? { ...c, ...data } : c
    );
    await updateCurrent({
      evaluation_period_days: currentDetail.evaluationPeriodDays,
      eligible_countries:     currentDetail.eligibleCountries ?? undefined,
      is_starter:             currentDetail.isStarter,
      criteria: updated.map((c) => ({
        criteria_id:  c.criteriaId,
        target_value: c.targetValue,
        is_required:  c.isRequired,
      })),
    });
    refresh();
  };


  const handleAddCriteria = async (data: {
    criteria_id: string;
    target_value?: string;
    is_required?: boolean;
  }) => {
    if (!currentDetail) return;
    await updateCurrent({
      evaluation_period_days: currentDetail.evaluationPeriodDays,
      eligible_countries:     currentDetail.eligibleCountries ?? undefined,
      is_starter:             currentDetail.isStarter,
      criteria: [
        ...currentDetail.criteria.map((c) => ({
          criteria_id:  c.criteriaId,
          target_value: c.targetValue,
          is_required:  c.isRequired,
        })),
        data,
      ],
    });
    refresh();
  };


  const isLoading = isNew ? false : loading || detailLoading;
  const pageError = isNew ? null : error || (!pkg && !loading ? "Paket bulunamadı." : null);

  return (
    <PageState loading={isLoading} error={pageError} onRetry={() => router.back()}>
      <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">

        <div
          className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 mb-4 rounded-xl border"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:  "var(--background-secondary)",
                borderColor: "var(--border)",
                color:       "var(--text-muted)",
              }}
            >
              <ArrowLeft size={16} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-lg font-semibold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isNew ? (form.name || "Yeni Paket") : pkg?.name}
                </h1>
                {!isNew && pkg && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: pkg.isActive ? PALETTE.green.bg : PALETTE.gray.bg,
                      color:      pkg.isActive ? PALETTE.green.color : PALETTE.gray.color,
                    }}
                  >
                    {pkg.isActive ? "Aktif" : "Pasif"}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                {isNew ? "Yeni Kayıt" : `${id.slice(0, 8)}… · Sıra: #${pkg?.orderRank}`}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || (!dirty && !isNew)}
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

        {/* ── İçerik ── */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10 space-y-4">
          {/* Paket Bilgileri */}
          <div
            className="rounded-xl border p-6"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Paket Bilgileri
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Paket Adı */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label
                  className="text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Paket Adı
                </label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Paket adı girin"
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{
                    background:  "var(--background-secondary)",
                    borderColor: "var(--border)",
                    color:       "var(--text-primary)",
                  }}
                />
              </div>

              {/* Sıra */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Sıra (order_rank)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.order_rank}
                  onChange={(e) => handleChange("order_rank", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none font-mono"
                  style={{
                    background:  "var(--background-secondary)",
                    borderColor: "var(--border)",
                    color:       "var(--text-primary)",
                  }}
                />
              </div>

              {/* Aktif / Pasif — sadece mevcut pakette */}
              {!isNew && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => handleChange("is_active", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Aktif
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Kriterler — sadece kayıtlı pakette ve currentDetail varsa */}
          {!isNew && currentDetail ? (
            <PackageDetailCriteriaList
              detail={currentDetail}
              onUpdateCriteria={handleUpdateCriteria}
              onAddCriteria={handleAddCriteria}
            />
          ) : !isNew ? (
            <div
              className="p-6 text-center rounded-xl border text-sm"
              style={{
                background:  "var(--background-secondary)",
                borderColor: "var(--border)",
                color:       "var(--text-muted)",
              }}
            >
              Bu pakete henüz versiyon eklenmemiş. Versiyon eklemek için aşağıdaki butonu kullanın.
            </div>
          ) : (
            <div
              className="p-6 text-center rounded-xl border text-sm"
              style={{
                background:  "var(--background-secondary)",
                borderColor: "var(--border)",
                color:       "var(--text-muted)",
              }}
            >
              Paketi kaydettikten sonra versiyon ve kriter ekleyebilirsiniz.
            </div>
          )}

          {/* Versiyon geçmişi — sadece kayıtlı pakette */}
          {!isNew && details.length > 0 && (
            <PackageDetailVersionList versions={details} />
          )}
        </div>
      </div>
    </PageState>
  );
}