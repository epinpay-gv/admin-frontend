"use client";
import Input from "@/components/common/input/Input";
import { ProductFormData } from "../../hooks/useProductForm";
import Dropdown from "@/components/common/input/Dropdown";
import { PRODUCT_STATUS } from "../../types";

const STATUS_OPTIONS = [
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE, color: "#00C6A2" },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE, color: "#FF5050" },
  { label: "Taslak", value: PRODUCT_STATUS.DRAFT, color: "#FFB400" },
];

interface GeneralInfoFormProps {
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  types: { label: string; value: string }[];
  platforms: { label: string; value: string }[];
  regions: { label: string; value: string }[];
  metaLoading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelect: (name: keyof ProductFormData, value: string) => void;
}

export default function GeneralInfoForm({
  form,
  errors,
  types,
  platforms,
  regions,
  metaLoading,
  onChange,
  onSelect,
}: GeneralInfoFormProps) {
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
        />
      </div>

      {/* Kategori, Tip, Platform, Bölge */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Dropdown
          label="Kategori"
          value={form.category_id}
          options={regions}
          onChange={(val) => onSelect("category_id", val)}
          loading={metaLoading}
          error={errors.category_id}
        />
        <Dropdown
          label="Ürün Tipi"
          value={form.type_id}
          options={types}
          onChange={(val) => onSelect("type_id", val)}
          loading={metaLoading}
          error={errors.type_id}
        />
        <Dropdown
          label="Platform"
          value={form.platform_id}
          options={platforms}
          onChange={(val) => onSelect("platform_id", val)}
          loading={metaLoading}
          error={errors.platform_id}
        />
        <Dropdown
          label="Bölge"
          value={form.region_id}
          options={regions}
          onChange={(val) => onSelect("region_id", val)}
          loading={metaLoading}
          error={errors.region_id}
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
                background:
                  form.status === s.value
                    ? `${s.color}20`
                    : "var(--background-card)",
                borderColor:
                  form.status === s.value ? `${s.color}40` : "var(--border)",
                color:
                  form.status === s.value ? s.color : "var(--text-secondary)",
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
