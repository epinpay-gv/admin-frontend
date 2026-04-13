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
        />
      </div>

    </div>
  );
}