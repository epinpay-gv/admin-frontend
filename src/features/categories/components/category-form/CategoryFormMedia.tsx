"use client";

import FileUpload from "@/components/common/file-upload/FileUpload";
import Input from "@/components/common/input/Input";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";

interface CategoryFormMediaProps {
  imgUrl: string | null;
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (file: File | null) => void;
}

export default function CategoryFormMedia({
  imgUrl,
  form,
  errors,
  onChange,
  onFileChange,
}: CategoryFormMediaProps) {
  return (
    <div className="space-y-4">
      <FileUpload
        value={imgUrl}
        onChange={onFileChange}
        label="Kategori Görseli"
        hint="PNG, JPG, WEBP · Maks 10MB"
        maxSizeMB={10}
      />
      <Input
        name="imgAlt"
        label="Görsel Alt Etiketi"
        value={form.imgAlt}
        onChange={onChange}
        error={errors.imgAlt}
        placeholder="Kategori görseli açıklaması"
        hint="SEO için zorunludur."
      />
    </div>
  );
}