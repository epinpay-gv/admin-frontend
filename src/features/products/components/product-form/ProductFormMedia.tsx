"use client";

import FileUpload from "@/components/common/file-upload/FileUpload";

interface ProductFormMediaProps {
  imgUrl?: string;
  onFileChange: (file: File | null) => void;
}

export default function ProductFormMedia({
  imgUrl,
  onFileChange,
}: ProductFormMediaProps) {
  return (
    <div className="space-y-5">
      <FileUpload
        value={imgUrl}
        onChange={onFileChange}
        label="Ürün Görseli"
        hint="PNG, JPG, WEBP · Maks 10MB"
        maxSizeMB={10}
      />
    </div>
  );
}