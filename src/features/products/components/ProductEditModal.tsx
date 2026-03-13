"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { toast } from "@/components/common/toast/toast";

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate?: (updated: Product) => void;
}

interface ProductEditForm {
  name: string;
  slug: string;
  basePrice: string;
  spreadRate: string;
  status: PRODUCT_STATUS;
  slugManuallyEdited: boolean;
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
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE, color: "#00C6A2" },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE, color: "#FF5050" },
  { label: "Taslak", value: PRODUCT_STATUS.DRAFT, color: "#FFB400" },
];

export default function ProductEditModal({
  open,
  onClose,
  product,
  onUpdate,
}: ProductEditModalProps) {
  const [form, setForm] = useState<ProductEditForm>({
    name: "",
    slug: "",
    basePrice: "",
    spreadRate: "",
    status: PRODUCT_STATUS.ACTIVE,
    slugManuallyEdited: false,
  });
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.translation.name,
        slug: product.translation.slug,
        basePrice: String(product.basePrice),
        spreadRate: String(product.spreadRate),
        status: product.status,
        slugManuallyEdited: false,
      });
      setErrors({});
    }
  }, [product]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slugManuallyEdited ? prev.slug : generateSlug(value),
    }));
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(e.target.value),
      slugManuallyEdited: true,
    }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; slug?: string } = {};
    if (!form.name.trim()) newErrors.name = "Ürün adı zorunludur.";
    if (!form.slug.trim()) newErrors.slug = "URL zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Ürün güncellendi", `${form.name} başarıyla güncellendi.`);
      onUpdate?.({
        ...product!,
        status: form.status,
        translation: {
          ...product!.translation,
          name: form.name,
          slug: form.slug,
        },
        basePrice: Number(form.basePrice),
        spreadRate: Number(form.spreadRate),
      });
      onClose();
    } catch {
      toast.error("Hata oluştu", "Ürün güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ürün Güncelle"
      description={product?.translation.slug}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="text-sm text-white"
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
          label="Ürün Adı"
          value={form.name}
          onChange={handleNameChange}
          error={errors.name}
          placeholder="Ürün adı"
        />
        <Input
          name="slug"
          label="URL / Slug"
          value={form.slug}
          onChange={handleSlugChange}
          error={errors.slug}
          placeholder="urun-slug"
          hint="Ürün adından otomatik oluşturulur."
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="basePrice"
            label="Fiyat"
            type="number"
            value={form.basePrice}
            onChange={handleChange}
            placeholder="0.00"
            leftIcon={<span className="text-xs">₺</span>}
          />
          <Input
            name="spreadRate"
            label="Makas Oranı"
            type="number"
            value={form.spreadRate}
            onChange={handleChange}
            placeholder="0.00"
            leftIcon={<span className="text-xs">%</span>}
          />
        </div>
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
                onClick={() => setForm((prev) => ({ ...prev, status: s.value }))}
                className="px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all"
                style={{
                  background:
                    form.status === s.value
                      ? `${s.color}20`
                      : "var(--background-card)",
                  borderColor:
                    form.status === s.value
                      ? `${s.color}40`
                      : "var(--border)",
                  color:
                    form.status === s.value
                      ? s.color
                      : "var(--text-secondary)",
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