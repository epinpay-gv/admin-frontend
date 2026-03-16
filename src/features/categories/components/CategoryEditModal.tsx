"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { Category, CATEGORY_STATUS } from "@/features/categories/types";
import { categoryService } from "@/features/categories/services/category.service";
import { toast } from "@/components/common/toast/toast";

interface CategoryEditModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onUpdate: (updated: Category) => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const STATUS_OPTIONS = [
  { label: "Aktif", value: CATEGORY_STATUS.ACTIVE, color: "#00C6A2" },
  { label: "Pasif", value: CATEGORY_STATUS.INACTIVE, color: "#FF5050" },
];

export default function CategoryEditModal({
  open,
  onClose,
  category,
  onUpdate,
}: CategoryEditModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<CATEGORY_STATUS>(CATEGORY_STATUS.ACTIVE);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.translation.name);
      setSlug(category.translation.slug);
      setStatus(category.status);
      setSlugManuallyEdited(false);
      setErrors({});
    }
  }, [category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; slug?: string } = {};
    if (!name.trim()) newErrors.name = "Kategori adı zorunludur.";
    if (!slug.trim()) newErrors.slug = "URL zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!category || !validate()) return;

    setSaving(true);
    try {
      const updated = await categoryService.update(category.id, {
        status,
        slug,
        translation: {
          ...category.translation,
          name,
          slug,
        },
      });
      toast.success("Güncellendi", `${name} başarıyla güncellendi.`);
      onUpdate(updated);
      onClose();
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("URL zaten")) {
        setErrors((prev) => ({ ...prev, slug: "Bu URL zaten kullanılıyor." }));
        toast.error("Hata", "Bu URL zaten kullanılıyor.");
      } else {
        toast.error("Hata", "Kategori güncellenemedi.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hızlı Düzenle"
      description={category?.translation.name}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ color: "var(--text-muted)" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-white"
            style={{
              background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
            }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              "Kaydet"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          name="name"
          label="Kategori Adı"
          value={name}
          onChange={handleNameChange}
          error={errors.name}
          placeholder="PUBG Mobile"
        />
        <Input
          name="slug"
          label="URL / Slug"
          value={slug}
          onChange={handleSlugChange}
          error={errors.slug}
          placeholder="pubg-mobile"
          hint="Kategori adından otomatik oluşturulur."
        />
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            Durum
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className="px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all"
                style={{
                  background:
                    status === s.value ? `${s.color}20` : "var(--background-card)",
                  borderColor:
                    status === s.value ? `${s.color}40` : "var(--border)",
                  color: status === s.value ? s.color : "var(--text-secondary)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}