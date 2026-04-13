"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { toast } from "@/components/common/toast/toast";
import { productService } from "../services/product.service";

interface ProductEditForm {
  basePrice: string;
  spreadRate: string;
  status: PRODUCT_STATUS;
}

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate?: (updated: Product) => void;
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
    basePrice: "",
    spreadRate: "",
    status: PRODUCT_STATUS.ACTIVE,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        basePrice: product.basePrice != null ? String(product.basePrice) : "",
        spreadRate: product.spreadRate != null ? String(product.spreadRate) : "",
        status: product.status,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      const result  = await productService.quickUpdate(product.id, {
        basePrice: form.basePrice ? form.basePrice : undefined,
        spreadRate: form.spreadRate ? form.spreadRate : undefined,
        status: form.status,
      });
       onUpdate?.(result.product ?? product);
      onClose();
    } catch (err) {
      toast.error("Hata", `Ürün güncellenemedi. ${err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Hızlı Düzenle : ${product?.translation.name}`}
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
            onClick={handleSave}
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="basePrice"
            label="Fiyat"
            type="number"
            value={form.basePrice}
            onChange={(e) => setForm((prev) => ({ ...prev, basePrice: e.target.value }))}
            placeholder="0.00"
            leftIcon={<span className="text-xs">₺</span>}
          />
          <Input
            name="spreadRate"
            label="Makas Oranı"
            type="number"
            value={form.spreadRate}
            onChange={(e) => setForm((prev) => ({ ...prev, spreadRate: e.target.value }))}
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
                    form.status === s.value ? `${s.color}20` : "var(--background-card)",
                  borderColor:
                    form.status === s.value ? `${s.color}40` : "var(--border)",
                  color:
                    form.status === s.value ? s.color : "var(--text-secondary)",
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