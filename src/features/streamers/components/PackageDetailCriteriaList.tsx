"use client";

import { useState } from "react";
import { Plus, Pencil, Check, X, Trash2 } from "lucide-react";
import { PackageDetail, PackageDetailCriteria, PackageCriteria } from "@/features/streamers/types";
import { useCriteria } from "@/features/streamers/hooks/useCriteria";

function CriteriaRow({
  item,
  onSave,
  onDelete,
}: {
  item: PackageDetailCriteria;
  onSave: (id: string, data: Partial<PackageDetailCriteria>) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    targetValue: item.targetValue ?? "",
    isRequired:  item.isRequired,
    description: item.description ?? "",  // ← YENİ
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.id, {
      targetValue: form.targetValue || undefined,
      isRequired:  form.isRequired,
      description: form.description || undefined,  // ← YENİ
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
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {item.criteria?.name ?? item.criteriaId.slice(0, 8) + "…"}
          </p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
            {item.criteria?.unit && `Birim: ${item.criteria.unit} · `}
            {item.isRequired ? "Zorunlu" : "Opsiyonel"}
            {item.description && ` · ${item.description}`}  {/* ← YENİ */}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            Hedef: {item.targetValue ?? "—"}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center border"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <Pencil size={12} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(item.id)}
                className="h-7 px-2 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1"
                style={{ background: "#FF5050" }}
              >
                <Check size={11} /> Sil
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center border"
                style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "#FF5050" }}
            >
              <Trash2 size={12} />
            </button>
          )}
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
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Hedef Değer
          </label>
          <input
            value={form.targetValue}
            onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
            placeholder="örn. 1000"
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id={`req-${item.id}`}
            checked={form.isRequired}
            onChange={(e) => setForm({ ...form, isRequired: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor={`req-${item.id}`} className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Zorunlu
          </label>
        </div>

        {/* Açıklama — YENİ, her zaman edit modunda görünür */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Açıklama
          </label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Bu kriterin bu paketteki açıklaması..."
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
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

function AddCriteriaForm({
  onAdd,
  onCancel,
  availableCriteria,
}: {
  onAdd: (data: { criteria_id: string; target_value?: string; is_required?: boolean; description?: string }) => Promise<void>;
  onCancel: () => void;
  availableCriteria: PackageCriteria[];
}) {
  const [form, setForm] = useState({
    criteria_id:  "",
    target_value: "",
    is_required:  true,
    description:  "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.criteria_id.trim()) return;
    setSaving(true);
    await onAdd({
      criteria_id:  form.criteria_id.trim(),
      target_value: form.target_value || undefined,
      is_required:  form.is_required,
      description:  form.description || undefined,  // ← YENİ
    });
    setSaving(false);
    onCancel();
  };

  return (
    <div
      className="rounded-lg px-4 py-4 space-y-3"
      style={{ background: "var(--background-secondary)", border: "1px dashed var(--border)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
        Yeni Kriter
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Kriter <span style={{ color: "#FF5050" }}>*</span>
          </label>
          <select
            value={form.criteria_id}
            onChange={(e) => setForm({ ...form, criteria_id: e.target.value })}
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "#181A22", borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <option value="">Kriter Seçin</option>
            {availableCriteria.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.unit ? `(${c.unit})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Hedef Değer
          </label>
          <input
            value={form.target_value}
            onChange={(e) => setForm({ ...form, target_value: e.target.value })}
            placeholder="örn. 1000"
            className="h-8 rounded-lg border px-3 text-sm outline-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="new-required"
            checked={form.is_required}
            onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="new-required" className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Zorunlu
          </label>
        </div>

        {/* Açıklama — kriter seçilince açılır */}
        {form.criteria_id && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Açıklama
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Bu kriterin bu paketteki açıklaması..."
              className="h-8 rounded-lg border px-3 text-sm outline-none"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAdd}
          disabled={saving || !form.criteria_id.trim()}
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

interface PackageDetailCriteriaListProps {
  detail: PackageDetail;
  onUpdateCriteria: (id: string, data: Partial<PackageDetailCriteria>) => Promise<void>;
  onAddCriteria: (data: {
    criteria_id:   string;
    target_value?: string;
    is_required?:  boolean;
    description?:  string;   // ← YENİ
  }) => Promise<void>;
  onAddVersion?: () => void;
}

export default function PackageDetailCriteriaList({
  detail,
  onUpdateCriteria,
  onAddCriteria,
  onAddVersion,
}: PackageDetailCriteriaListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletedIds, setDeletedIds]   = useState<Set<string>>(new Set());
  const { criteria: allCriteria, loading: criteriaLoading } = useCriteria();

  const availableCriteria = allCriteria.filter((c) => c.isActive);

  const handleDelete = (id: string) => {
    setDeletedIds((prev) => new Set(prev).add(id));
  };

  const visibleCriteria = detail.criteria.filter((c) => !deletedIds.has(c.id));

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <p className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
          Kriterler · {visibleCriteria.length} madde
        </p>
        <div className="flex items-center gap-2">
          {onAddVersion && (
            <button
              onClick={onAddVersion}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-mono"
              style={{ background: "var(--background-secondary)", borderColor: "#0085FF44", color: "#0085FF" }}
            >
              <Plus size={12} /> Yeni Versiyon
            </button>
          )}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
              style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <Plus size={12} /> Kriter Ekle
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {visibleCriteria.map((c) => (
          <CriteriaRow
            key={c.id}
            item={c}
            onSave={onUpdateCriteria}
            onDelete={handleDelete}
          />
        ))}

        {visibleCriteria.length === 0 && !showAddForm && (
          <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
            Henüz kriter eklenmemiş.
          </p>
        )}

        {showAddForm && (
          <div className="relative">
            {criteriaLoading && (
              <div className="absolute inset-0 bg-black/5 z-10 rounded-lg flex items-center justify-center">
                <span className="text-xs font-mono text-muted-foreground animate-pulse">Yükleniyor...</span>
              </div>
            )}
            <AddCriteriaForm
              onAdd={onAddCriteria}
              onCancel={() => setShowAddForm(false)}
              availableCriteria={availableCriteria}
            />
          </div>
        )}
      </div>
    </div>
  );
}