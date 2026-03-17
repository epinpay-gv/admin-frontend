"use client";

import { Plus, Trash2 } from "lucide-react";
import { IdUploadField } from "@/features/store/types";
import Input from "@/components/common/input/Input";

interface Props {
  fields:   IdUploadField[];
  onAdd:    () => void;
  onUpdate: (key: string, patch: Partial<IdUploadField>) => void;
  onRemove: (key: string) => void;
}

export default function OfferFormIdUpload({ fields, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
          Henüz alan eklenmedi.
        </p>
      )}

      {fields.map((field) => (
        <div
          key={field.key}
          className="flex items-end gap-3 p-3 rounded-lg border"
          style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}
        >
          <div className="flex-1">
            <Input
              name={`label-${field.key}`}
              label="Alan Adı"
              value={field.label}
              onChange={(e) => onUpdate(field.key, { label: e.target.value })}
              placeholder="Örn: Oyun ID, Server"
              disabled={!field.isEditable}
            />
          </div>

          {/* Zorunlu toggle */}
          <div className="flex flex-col items-center gap-1 pb-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              Zorunlu
            </span>
            <button
              onClick={() => onUpdate(field.key, { isRequired: !field.isRequired })}
              disabled={!field.isEditable}
              className="w-8 h-5 rounded-full transition-colors"
              style={{
                background: field.isRequired ? "#00C6A2" : "var(--border)",
                opacity:    !field.isEditable ? 0.5 : 1,
              }}
            />
          </div>

          {/* Sil */}
          {field.isEditable && (
            <button
              onClick={() => onRemove(field.key)}
              className="w-9 h-9 rounded-lg flex items-center justify-center border mb-0.5 transition-all hover:bg-red-500/10"
              style={{ borderColor: "var(--border)", color: "#FF5050" }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="w-full py-2.5 rounded-lg border border-dashed flex items-center justify-center gap-2 text-sm font-mono transition-all hover:bg-black/5"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <Plus size={14} />
        Alan Ekle
      </button>
    </div>
  );
}