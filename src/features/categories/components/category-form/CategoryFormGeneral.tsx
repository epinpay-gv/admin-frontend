"use client";

import Input from "@/components/common/input/Input";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";
import { CATEGORY_STATUS } from "@/features/categories/types";

interface CategoryFormGeneralProps {
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelect: (name: keyof CategoryFormData, value: string) => void;
}

const STATUS_OPTIONS = [
  { label: "Aktif", value: CATEGORY_STATUS.ACTIVE, color: "#00C6A2" },
  { label: "Pasif", value: CATEGORY_STATUS.INACTIVE, color: "#FF5050" },
];

export default function CategoryFormGeneral({
  form,
  errors,
  onChange,
  onSelect,
}: CategoryFormGeneralProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="name"
          label="Kategori Adı"
          value={form.name}
          onChange={onChange}
          error={errors.name}
          placeholder="PUBG Mobile"
        />
        <Input
          name="slug"
          label="URL / Slug"
          value={form.slug}
          onChange={onChange}
          error={errors.slug}
          placeholder="pubg-mobile"
          hint="Kategori adından otomatik oluşturulur."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-[11px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Açıklama
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Kategori açıklaması..."
          rows={3}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="text-[11px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Durum
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onSelect("status", s.value)}
              className="px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all"
              style={{
                background:
                  form.status === s.value ? `${s.color}20` : "var(--background-card)",
                borderColor:
                  form.status === s.value ? `${s.color}40` : "var(--border)",
                color: form.status === s.value ? s.color : "var(--text-secondary)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}