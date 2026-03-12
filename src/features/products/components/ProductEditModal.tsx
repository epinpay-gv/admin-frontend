"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import Input from "@/components/common/input/Input";
import Switch from "@/components/common/switch/Switch";
import { Button } from "@/components/ui/button";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { toast } from "@/components/common/toast/toast";

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

interface ProductEditForm {
  name: string;
  basePrice: string;
  discountRate: string;
  totalStock: string;
  isActive: boolean;
  spreadRate: string;
}

export default function ProductEditModal({
  open,
  onClose,
  product,
}: ProductEditModalProps) {
  const [form, setForm] = useState<ProductEditForm>({
    name: "",
    basePrice: "",
    discountRate: "",
    totalStock: "",
    isActive: true,
    spreadRate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.translation.name,
        basePrice: String(product.basePrice),
        discountRate: String(product.discountRate),
        totalStock: String(product.totalStock),
        isActive: product.status === PRODUCT_STATUS.ACTIVE,
        spreadRate: String(product.spreadRate)
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
  setLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Ürün güncellendi", `${form.name} başarıyla güncellendi.`);
    onClose();
  } catch {
    toast.error("Hata oluştu", "Ürün güncellenirken bir hata oluştu.");
  } finally {
    setLoading(false);
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
            disabled={loading}
            className="text-sm text-white"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {loading ? (
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
          onChange={handleChange}
          placeholder="Ürün adı"
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
        
        <Switch
          checked={form.isActive}
          onCheckedChange={(val) => setForm((prev) => ({ ...prev, isActive: val }))}
          label="Aktif"
          hint="Ürünü aktif veya pasif yap"
        />
      </div>
    </Modal>
  );
}