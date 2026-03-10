"use client";

import { useState } from "react";
import { Product } from "@/features/products/types";
import { useProductForm } from "@/features/products/hooks/useProductForm";
import ProductFormGeneral from "./ProductFormGeneral";
import ProductFormPricing from "./ProductFormPricing";
import ProductFormSeo from "./ProductFormSeo";
import ProductFormMedia from "./ProductFormMedia";
import ProductFormCountries from "./ProductFormCountries";
import Input from "@/components/common/input/Input";

interface ProductFormProps {
  product: Product | null;
  mode: "create" | "edit" | "duplicate";
  onSuccess?: (product: Product) => void;
  saving: boolean;
  form: ReturnType<typeof useProductForm>["form"];
  errors: ReturnType<typeof useProductForm>["errors"];
  handleChange: ReturnType<typeof useProductForm>["handleChange"];
  handleSelect: ReturnType<typeof useProductForm>["handleSelect"];
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span
            className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
            style={{ color: "var(--text-heading)" }}
        >
            {title}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export default function ProductForm({
  product,
  mode,
  saving,
  form,
  errors,
  handleChange,
  handleSelect,
}: ProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sol — Formlar */}
      <div className="lg:col-span-2 space-y-6">
        {/* Genel Bilgiler */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionDivider title="Genel Bilgiler" />
          <div className="mt-4">
            <ProductFormGeneral
              form={form}
              errors={errors}
              onChange={handleChange}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {/* Fiyatlandırma */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionDivider title="Fiyatlandırma" />
          <div className="mt-4">
            <ProductFormPricing
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SEO */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionDivider title="SEO" />
          <div className="mt-4">
            <ProductFormSeo
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ülke Kısıtlamaları */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionDivider title="Ülke Kısıtlamaları" />
          <div className="mt-4">
            <ProductFormCountries product={product} />
          </div>
        </div>
      </div>

      {/* Sağ — Medya */}
      <div className="space-y-4">
        <div
          className="rounded-xl border p-6 sticky top-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionDivider title="Medya" />
          <div className="mt-4 space-y-4">
            <ProductFormMedia
              imgUrl={product?.translation.imgUrl}
              onFileChange={setSelectedFile}
            />

            {/* Alt Etiket */}
            <Input
              name="imgAlt"
              label="Görsel Alt Etiketi"
              value={product?.translation.imgAlt ?? ""}
              onChange={handleChange}
              error={errors.name ? "Alt etiket zorunludur." : undefined}
              placeholder="Ürün görseli açıklaması"
              hint="SEO için zorunludur."
            />
          </div>
        </div>
      </div>
    </div>
  );
}