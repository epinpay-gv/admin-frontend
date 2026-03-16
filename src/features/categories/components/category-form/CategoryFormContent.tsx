"use client";

import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";

interface CategoryFormContentProps {
  form: CategoryFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CategoryFormContent({
  form,
  onChange,
}: CategoryFormContentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Kategori sayfasında görünecek ana içerik metni
        </p>
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {form.content.length} karakter
        </span>
      </div>
      <textarea
        name="content"
        value={form.content}
        onChange={onChange}
        placeholder="Kategori içeriği buraya yazılır. Bu alan kategori sayfasında kullanıcılara gösterilir."
        rows={10}
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
        style={{
          background: "var(--background-card)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
          lineHeight: "1.8",
        }}
      />
    </div>
  );
}