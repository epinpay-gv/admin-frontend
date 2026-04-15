"use client";
import FileUpload from "@/components/common/file-upload/FileUpload";
import Input from "@/components/common/input/Input";
import { CategoryFormData } from "@/features/categories/hooks/useCategoryForm";

interface MediaFormProps {
  imgUrl: string | null;
  uploading?: boolean; 
  form: CategoryFormData;
  errors: Partial<Record<keyof CategoryFormData, string>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onFileChange: (file: File | null) => void;
}

export default function MediaForm({
  imgUrl,
  uploading,
  form,
  errors,
  onChange,
  onFileChange,
}: MediaFormProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <FileUpload
          value={imgUrl}
          onChange={onFileChange}
          accept="image/*"
          label="Kategori Görseli"
          hint="Sadece .webp · Maks 10MB"
          maxSizeMB={10}
        />
        {uploading && (
          <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/40 z-10">
            <span className="text-white text-sm font-mono">Yükleniyor…</span>
          </div>
        )}
      </div>
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
