// src/features/streamers/components/VariantContentList.tsx

"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import {
  CountryPackageVariant,
  TemplateContent,
  VariantContent,
} from "@/features/streamers/types";

function OverrideRow({
  templateContent,
  variantContent,
  onSave,
}: {
  templateContent: TemplateContent;
  variantContent?: VariantContent;
  onSave: (contentId: number, value: string | number | boolean | null) => Promise<void>;
}) {
  const [editing, setEditing]   = useState(false);
  const [value, setValue]       = useState(
    variantContent ? String(variantContent.overrideValue ?? "") : ""
  );
  const [saving, setSaving]     = useState(false);

  const currentValue = variantContent?.overrideValue ?? null;
  const hasOverride  = variantContent !== undefined;

  const handleSave = async () => {
    setSaving(true);
    await onSave(templateContent.id, value === "" ? null : value);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3 gap-4"
      style={{ background: "var(--background-secondary)", border: "1px solid var(--border)" }}
    >
      {/* Sol: içerik bilgisi */}
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {templateContent.label}
        </p>
        <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
          {templateContent.key}
          {!hasOverride && (
            <span style={{ color: "var(--text-muted)" }}> · şablon varsayılanı: {String(templateContent.defaultValue ?? "—")}</span>
          )}
        </p>
      </div>

      {/* Sağ: değer + düzenleme */}
      <div className="flex items-center gap-3 shrink-0">
        {!editing ? (
          <>
            <div className="text-right">
              {hasOverride ? (
                <span className="text-sm font-mono font-semibold" style={{ color: "#00C6A2" }}>
                  {String(currentValue ?? "—")}
                </span>
              ) : (
                <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                  {String(templateContent.defaultValue ?? "—")}
                </span>
              )}
              {hasOverride && (
                <p className="text-[10px] font-mono" style={{ color: "#00C6A2" }}>override</p>
              )}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <Pencil size={12} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={String(templateContent.defaultValue ?? "")}
              className="h-8 w-32 rounded-lg border px-3 text-sm outline-none text-right font-mono"
              style={{ background: "var(--background-card)", borderColor: "#0085FF44", color: "var(--text-primary)" }}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white disabled:opacity-50"
              style={{ background: "#00C6A2" }}
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => { setEditing(false); setValue(variantContent ? String(variantContent.overrideValue ?? "") : ""); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


interface VariantContentListProps {
  variant: CountryPackageVariant;
  templateContents: TemplateContent[];
  onSaveOverride: (templateContentId: number, value: string | number | boolean | null) => Promise<void>;
}

export default function VariantContentList({
  variant,
  templateContents,
  onSaveOverride,
}: VariantContentListProps) {
  // templateContents içindeki her madde için variantın override'ını bul
  const getVariantContent = (templateContentId: number): VariantContent | undefined =>
    variant.contents.find((c) => c.templateContentId === templateContentId);

  const overrideCount = variant.contents.length;

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Ülkeye Özel Değerler
        </p>
        {overrideCount > 0 && (
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,198,162,0.1)", color: "#00C6A2" }}
          >
            {overrideCount} override aktif
          </span>
        )}
      </div>

      {templateContents.length === 0 ? (
        <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
          Şablonda içerik tanımlanmamış.
        </p>
      ) : (
        <div className="space-y-2">
          {templateContents.map((tc) => (
            <OverrideRow
              key={tc.id}
              templateContent={tc}
              variantContent={getVariantContent(tc.id)}
              onSave={onSaveOverride}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] font-mono mt-4" style={{ color: "var(--text-muted)" }}>
        Değer girilmeyen satırlarda şablon varsayılanı geçerlidir.
      </p>
    </div>
  );
}