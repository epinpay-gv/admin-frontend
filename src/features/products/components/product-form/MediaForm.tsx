"use client";
import FileUpload from "@/components/common/file-upload/FileUpload";
import Input from "@/components/common/input/Input";
import { ProductFormData } from "../../hooks/useProductForm";

interface MediaFormProps {
  imgUrl: string | null;
  uploading?: boolean;          
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
          label="Ürün Görseli"
          hint="PNG, JPG, WEBP · Otomatik .webp dönüşümü · Maks 10MB"
          maxSizeMB={10}
        />
        {uploading && (
          <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-xs font-mono">Yükleniyor…</span>
            </div>
          </div>
        )}
      </div>
      <Input
        name="imgAlt"
        label="Görsel Alt Etiketi"
        value={form.imgAlt}
        onChange={onChange}
        error={errors.imgAlt}
        placeholder="Ürün görseli açıklaması"
        hint="SEO için zorunludur."
      />
    </div>
  );
}