// src/features/streamers/components/TemplateContentList.tsx

"use client";

import { useState } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import {
  PackageTemplate,
  TemplateContent,
  CONTENT_FIELD_TYPE,
  CONTENT_FIELD_TYPE_LABELS,
} from "@/features/streamers/types";

const EMPTY_FORM = {
  key: "",
  label: "",
  fieldType: CONTENT_FIELD_TYPE.BOOLEAN as CONTENT_FIELD_TYPE,
  defaultValue: "" as string | number | boolean | null,
  description: "",
  isActive: true,
};

function ContentRow({
  content,
  onSave,
}: {
  content: TemplateContent;
  onSave: (id: number, data: Partial<TemplateContent>) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    label:        content.label,
    defaultValue: content.defaultValue !== null ? String(content.defaultValue) : "",
    description:  content.description ?? "",
    isActive:     content.isActive,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(content.id, {
      label:        form.label,
      defaultValue: form.defaultValue === "" ? null : form.defaultValue,
      description:  form.description,
      isActive:     form.isActive,
    });
    setSaving(false);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div
        className="flex items-center justify-between rounded-lg px-4 py-3"
        style={{ background: "var(--background-secondary)", border: "1px solid var(--border)" }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{content.label}</p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
            {content.key} · {CONTENT_FIELD_TYPE_LABELS[content.fieldType]}
            {content.description && ` · ${content.description}`}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            {content.defaultValue !== null ? String(content.defaultValue) : "—"}
          </span>
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-md"
            style={{
              background: content.isActive ? "rgba(0,198,162,0.1)" : "rgba(160,160,160,0.1)",
              color: content.isActive ? "#00C6A2" : "#A0A0A0",
            }}
          >
            {content.isActive ? "Aktif" : "Pasif"}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <Pencil size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg px-4 py-3 space-y-3"
      style={{ background: "var(--background-secondary)", border: "1px solid #0085FF44" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Label</label>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Varsayılan Değer</label>
          <input
            value={String(form.defaultValue)}
            onChange={(e) => setForm({ ...form, defaultValue: e.target.value })}
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Açıklama</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id={`active-${content.id}`}
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor={`active-${content.id}`} className="text-sm" style={{ color: "var(--text-secondary)" }}>Aktif</label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          <Check size={13} />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-3 py-1.5 rounded-lg text-xs border"
          style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}


function AddContentForm({
  templateId,
  onAdd,
  onCancel,
}: {
  templateId: number;
  onAdd: (data: Partial<TemplateContent>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.key || !form.label) return;
    setSaving(true);
    await onAdd({ ...form, templateId });
    setSaving(false);
    setForm(EMPTY_FORM);
    onCancel();
  };

  return (
    <div
      className="rounded-lg px-4 py-4 space-y-3"
      style={{ background: "var(--background-secondary)", border: "1px dashed var(--border)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
        Yeni İçerik
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Anahtar (key) <span style={{ color: "#FF5050" }}>*</span>
          </label>
          <input
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            placeholder="örn. min_follower"
            className="h-8 rounded-lg border px-3 text-sm outline-none font-mono"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Label <span style={{ color: "#FF5050" }}>*</span>
          </label>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="örn. Minimum Takipçi"
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Tip</label>
          <select
            value={form.fieldType}
            onChange={(e) => setForm({ ...form, fieldType: e.target.value as CONTENT_FIELD_TYPE })}
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            {Object.entries(CONTENT_FIELD_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Varsayılan Değer</label>
          <input
            value={String(form.defaultValue ?? "")}
            onChange={(e) => setForm({ ...form, defaultValue: e.target.value })}
            placeholder="—"
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Açıklama</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Opsiyonel açıklama"
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          disabled={saving || !form.key || !form.label}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          <Plus size={13} />
          {saving ? "Ekleniyor..." : "Ekle"}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs border"
          style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          İptal
        </button>
      </div>
    </div>
  );
}


interface TemplateContentListProps {
  template: PackageTemplate;
  onUpdateContent: (id: number, data: Partial<TemplateContent>) => Promise<void>;
  onAddContent: (data: Partial<TemplateContent>) => Promise<void>;
}

export default function TemplateContentList({
  template,
  onUpdateContent,
  onAddContent,
}: TemplateContentListProps) {
  const [showAddForm, setShowAddForm] = useState(false);

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
          Paket İçerikleri · {template.contents.length} madde
        </p>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <Plus size={12} />
            İçerik Ekle
          </button>
        )}
      </div>

      <div className="space-y-2">
        {template.contents.map((c) => (
          <ContentRow key={c.id} content={c} onSave={onUpdateContent} />
        ))}

        {template.contents.length === 0 && !showAddForm && (
          <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
            Henüz içerik eklenmemiş.
          </p>
        )}

        {showAddForm && (
          <AddContentForm
            templateId={template.id}
            onAdd={onAddContent}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}