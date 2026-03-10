"use client";

import Input from "@/components/common/input/Input";
import { ProductFormData } from "@/features/products/hooks/useProductForm";

interface ProductFormSeoProps {
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProductFormSeo({
  form,
  errors,
  onChange,
}: ProductFormSeoProps) {
  const titleLength = form.metaTitle.length;
  const descLength = form.metaDescription.length;

  return (
    <div className="space-y-5">
      {/* Meta Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            Meta Title
          </label>
          <span
            className="text-[11px] font-mono"
            style={{ color: titleLength > 60 ? "#FF5050" : "var(--text-muted)" }}
          >
            {titleLength}/60
          </span>
        </div>
        <Input
          name="metaTitle"
          value={form.metaTitle}
          onChange={onChange}
          error={errors.metaTitle}
          placeholder="Ürün başlığı — Site Adı"
          state={titleLength > 60 ? "error" : "default"}
        />
      </div>

      {/* Meta Description */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            Meta Description
          </label>
          <span
            className="text-[11px] font-mono"
            style={{ color: descLength > 160 ? "#FF5050" : "var(--text-muted)" }}
          >
            {descLength}/160
          </span>
        </div>
        <textarea
          name="metaDescription"
          value={form.metaDescription}
          onChange={onChange}
          placeholder="Ürün meta açıklaması..."
          rows={3}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
          style={{
            background: "var(--background-card)",
            borderColor: descLength > 160 ? "rgba(255,80,80,0.5)" : "var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {descLength > 160 && (
          <p className="text-xs text-red-400 font-mono">
            Meta description 160 karakteri geçmemelidir.
          </p>
        )}
      </div>

      {/* SERP Önizleme */}
      {(form.metaTitle || form.metaDescription) && (
        <div
          className="rounded-xl border p-4"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            SERP Önizleme
          </p>
          <div className="space-y-1">
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              epinpay.com › {form.slug || "urun-slug"}
            </p>
            <p className="text-base font-medium text-blue-400">
              {form.metaTitle || "Meta Title"}
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {form.metaDescription || "Meta description burada görünecek."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}