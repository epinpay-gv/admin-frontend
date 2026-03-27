"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {PageState} from "@/components/common/page-state/PageState";
import {PALETTE} from "@/lib/status-color";
import { usePackageTemplate } from "@/features/streamers/hooks/usePackageTemplate";
import TemplateContentList from "@/features/streamers/components/TemplateContentList";

import {
  TemplateContent,
  TEMPLATE_STATUS,
  TEMPLATE_STATUS_LABELS,
  PACKAGE_LEVEL_LABELS,
} from "@/features/streamers/types";

const TEMPLATE_STATUS_COLOR = {
  [TEMPLATE_STATUS.ACTIVE]:   PALETTE.green,
  [TEMPLATE_STATUS.INACTIVE]: PALETTE.gray,
};

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();
  const { template, loading, error, updateTemplate, refresh } = usePackageTemplate(Number(id));

  const [form, setForm]     = useState({ name: "", description: "", status: TEMPLATE_STATUS.ACTIVE });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);

  // Veri geldiğinde form state'ini ilklendir
  useEffect(() => {
    if (template && !dirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name:        template.name,
        description: template.description ?? "",
        status:      template.status,
      });
    }
  }, [template, dirty]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateTemplate(form);
    setSaving(false);
    setDirty(false);
  };

  const handleUpdateContent = async (contentId: number, data: Partial<TemplateContent>) => {
    if (!template) return;
    const updated = template.contents.map((c) =>
      c.id === contentId ? { ...c, ...data } : c
    );
    await updateTemplate({ contents: updated });
    await refresh();
  };

  const handleAddContent = async (data: Partial<TemplateContent>) => {
    if (!template) return;
    const newContent = {
      id:           Date.now(),
      templateId:   template.id,
      key:          data.key ?? "",
      label:        data.label ?? "",
      fieldType:    data.fieldType!,
      defaultValue: data.defaultValue ?? null,
      description:  data.description,
      isActive:     data.isActive ?? true,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };
    await updateTemplate({ contents: [...template.contents, newContent] });
    await refresh();
  };

  // Hata mesajını özelleştir
  const pageError = error || (!template && !loading ? "Şablon bulunamadı." : null);

  const sc = template ? TEMPLATE_STATUS_COLOR[template.status] : null;

  return (
    <PageState 
      loading={loading} 
      error={pageError} 
      onRetry={() => router.back()}
    >
      {template && (
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
                    {template.name}
                  </h1>
                  {sc && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {TEMPLATE_STATUS_LABELS[template.status]}
                    </span>
                  )}
                  {dirty && (
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                   style={{ background: PALETTE.yellow.bg, color: PALETTE.yellow.color }}
                    >
                      Kaydedilmemiş değişiklikler
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  #{template.id} · {PACKAGE_LEVEL_LABELS[template.level]}
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
            {/* Şablon Bilgileri */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Şablon Bilgileri
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Şablon Adı
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-9 rounded-lg border px-3 text-sm outline-none"
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
                    {Object.entries(TEMPLATE_STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Açıklama
                  </label>
                  <input
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="h-9 rounded-lg border px-3 text-sm outline-none"
                    style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
              </div>
            </div>

            {/* İçerik Listesi */}
            <TemplateContentList
              template={template}
              onUpdateContent={handleUpdateContent}
              onAddContent={handleAddContent}
            />
          </div>
        </div>
      )}
    </PageState>
  );
}