"use client";

import Input from "@/components/common/input/Input";
import { ProductFormData } from "@/features/products/hooks/useProductForm";
import { PRODUCT_STATUS } from "@/features/products/types";
import { useProductMeta } from "@/features/products/hooks/useProductMeta";
import { ChevronDown } from "lucide-react";

interface ProductFormGeneralProps {
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelect: (name: keyof ProductFormData, value: string) => void;
}

const STATUS_OPTIONS = [
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE, color: "#00C6A2" },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE, color: "#FF5050" },
  { label: "Taslak", value: PRODUCT_STATUS.DRAFT, color: "#FFB400" },
];

function SelectField({
  label,
  value,
  options,
  onChange,
  loading,
  error,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full h-11 rounded-lg border px-3 py-2 text-sm outline-none transition-all appearance-none pr-8"
          style={{
            background: "var(--background-card)",
            borderColor: error ? "rgba(239,68,68,0.5)" : "var(--border)",
            color: value ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          <option value="" style={{ background: "var(--background-secondary)" }}>
            Seçiniz...
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: "var(--background-secondary)" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}

export default function ProductFormGeneral({
  form,
  errors,
  onChange,
  onSelect,
}: ProductFormGeneralProps) {
  const { types, platforms, regions, loading } = useProductMeta();

  return (
    <div className="space-y-5">
      {/* Ürün Adı & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="name"
          label="Ürün Adı"
          value={form.name}
          onChange={onChange}
          error={errors.name}
          placeholder="PUBG Mobile 660 UC"
        />
        <Input
          name="slug"
          label="URL / Slug"
          value={form.slug}
          onChange={onChange}
          error={errors.slug}
          placeholder="pubg-mobile-660-uc"
          hint="Ürün adından otomatik oluşturulur."
        />
      </div>
      {/* Tip, Platform, Bölge */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SelectField
          label="Kategori"
          value={form.category_id}
          options={regions}
          onChange={(val) => onSelect("category_id", val)}
          loading={loading}
          error={errors.category_id}
        />
        <SelectField
          label="Ürün Tipi"
          value={form.type_id}
          options={types}
          onChange={(val) => onSelect("type_id", val)}
          loading={loading}
          error={errors.type_id}
        />
        <SelectField
          label="Platform"
          value={form.platform_id}
          options={platforms}
          onChange={(val) => onSelect("platform_id", val)}
          loading={loading}
          error={errors.platform_id}
        />
        <SelectField
          label="Bölge"
          value={form.region_id}
          options={regions}
          onChange={(val) => onSelect("region_id", val)}
          loading={loading}
          error={errors.region_id}
        />
        
      </div>
      {/* Açıklama */}
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
          placeholder="Ürün açıklaması..."
          rows={4}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      

      {/* Durum */}
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
                background: form.status === s.value ? `${s.color}20` : "var(--background-card)",
                borderColor: form.status === s.value ? `${s.color}40` : "var(--border)",
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