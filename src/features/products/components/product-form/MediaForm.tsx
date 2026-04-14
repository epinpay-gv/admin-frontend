"use client";
import FileUpload from "@/components/common/file-upload/FileUpload";
import Input from "@/components/common/input/Input";
import { ProductFormData } from "../../hooks/useProductForm";

interface MediaFormProps {
  imgUrl: string | null;
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (file: File | null) => void;
}

export default function MediaForm({
  imgUrl,
  form,
  errors,
  onChange,
  onFileChange,
}: MediaFormProps) {
  return (
    <div className="space-y-4">
      <FileUpload
        value={imgUrl}
        onChange={onFileChange}
        label="Ürün Görseli"
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