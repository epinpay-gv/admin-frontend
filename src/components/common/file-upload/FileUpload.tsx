"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMB = 2,
  label,
  hint,
  error,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Kullanıcı yeni dosya seçtiyse onu göster, yoksa dışarıdan gelen value'yu göster
  const preview = localPreview ?? value ?? null;

  const handleFile = useCallback(
    (file: File) => {
      setFileError(null);

      if (!file.type.startsWith("image/")) {
        setFileError("Sadece resim dosyaları yüklenebilir.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileError(`Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır.`);
        return;
      }

      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      onChange?.(file);
    },
    [maxSizeMB, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = () => {
    setLocalPreview(null);
    setFileError(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const resolvedError = error ?? fileError;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label
          className="text-[11px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
      )}

      <div
        onClick={() => !preview && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden",
          !preview && "cursor-pointer hover:border-[#00C6A2]/40 hover:bg-white/[0.02]",
          dragging && "border-[#00C6A2]/60 bg-[#00C6A2]/5 scale-[1.01]"
        )}
        style={{
          borderColor: dragging
            ? "rgba(0,198,162,0.6)"
            : resolvedError
            ? "rgba(239,68,68,0.5)"
            : "var(--border)",
          background: "var(--background-card)",
          minHeight: preview ? "auto" : "140px",
        }}
      >
        {preview ? (
          <div className="relative group">
            <div className="relative w-full aspect-square">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors"
                style={{ background: "rgba(0,198,162,0.8)" }}
              >
                <Upload size={15} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors"
                style={{ background: "rgba(255,80,80,0.8)" }}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "var(--background-secondary)" }}
            >
              <ImageIcon size={20} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="text-center">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Sürükle & bırak veya{" "}
                <span style={{ color: "#00C6A2" }}>dosya seç</span>
              </p>
              <p
                className="text-xs font-mono mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                PNG, JPG, WEBP · Maks {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {resolvedError ? (
        <p className="text-xs text-red-400 font-mono">{resolvedError}</p>
      ) : hint ? (
        <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}