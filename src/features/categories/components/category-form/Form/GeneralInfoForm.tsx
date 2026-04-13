"use client";
import Input from "@/components/common/input/Input";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";

interface GeneralInfoFormProps {
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


export default function GeneralInfoForm({
  form,
  errors,
  onChange,
}: GeneralInfoFormProps) {
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