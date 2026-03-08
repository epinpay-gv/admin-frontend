"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useProduct } from "@/features/products";
import { PRODUCT_STATUS } from "@/features/products";
import { productService } from "@/features/products/services/product.service";
import { Button } from "@/components/ui/button";
import Input from "@/components/common/input/Input";
import Switch from "@/components/common/switch/Switch";
import FileUpload from "@/components/common/file-upload/FileUpload";
import { toast } from "@/components/common/toast/toast";

const STATUS_LABELS: Record<PRODUCT_STATUS, string> = {
  [PRODUCT_STATUS.ACTIVE]: "Aktif",
  [PRODUCT_STATUS.INACTIVE]: "Pasif",
  [PRODUCT_STATUS.DRAFT]: "Taslak",
};

const STATUS_COLORS: Record<PRODUCT_STATUS, { bg: string; color: string }> = {
  [PRODUCT_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [PRODUCT_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [PRODUCT_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

interface ProductForm {
  name: string;
  basePrice: string;
  fakePrice: string;
  discountRate: string;
  totalStock: string;
  isActive: boolean;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { product, loading, error } = useProduct(Number(id));
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    basePrice: "",
    fakePrice: "",
    discountRate: "",
    totalStock: "",
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.translation.name,
        basePrice: String(product.basePrice ?? ""),
        fakePrice: String(product.fakePrice ?? ""),
        discountRate: String(product.discountRate),
        totalStock: String(product.totalStock),
        isActive: product.status === PRODUCT_STATUS.ACTIVE,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await productService.update(Number(id), {
        basePrice: Number(form.basePrice),
        fakePrice: Number(form.fakePrice),
        discountRate: Number(form.discountRate),
        totalStock: Number(form.totalStock),
        status: form.isActive ? PRODUCT_STATUS.ACTIVE : PRODUCT_STATUS.INACTIVE,
      });
      toast.success("Ürün güncellendi", `${form.name} başarıyla güncellendi.`);
    } catch {
      toast.error("Hata oluştu", "Ürün güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm font-mono">{error ?? "Ürün bulunamadı."}</p>
      </div>
    );
  }

  const statusColors = STATUS_COLORS[product.status];

  return (
    <div>
      {/* Üst bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {product.translation.name}
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              #{product.id} · {product.translation.slug}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-sm text-white flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </span>
          ) : (
            <>
              <Save size={14} />
              Kaydet
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol — form */}
        <div
          className="lg:col-span-2 rounded-xl border p-6"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest font-mono mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Ürün Bilgileri
          </p>

          <div className="space-y-4">
            <Input
              name="name"
              label="Ürün Adı"
              value={form.name}
              onChange={handleChange}
              disabled
              hint="Ürün adı slug ile bağlantılıdır, değiştirilemez."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="basePrice"
                label="Fiyat"
                type="number"
                value={form.basePrice}
                onChange={handleChange}
                leftIcon={<span className="text-xs">₺</span>}
              />
              <Input
                name="fakePrice"
                label="Fake Fiyat"
                type="number"
                value={form.fakePrice}
                onChange={handleChange}
                leftIcon={<span className="text-xs">₺</span>}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="discountRate"
                label="İndirim Oranı"
                type="number"
                value={form.discountRate}
                onChange={handleChange}
                leftIcon={<span className="text-xs">%</span>}
              />
              <Input
                name="totalStock"
                label="Stok"
                type="number"
                value={form.totalStock}
                onChange={handleChange}
              />
            </div>

            <div
              className="grid grid-cols-2 gap-4 pt-2 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {[
                { label: "Platform", value: product.platform },
                { label: "Bölge", value: product.region },
                { label: "Tür", value: product.type },
                { label: "EP Fiyat", value: product.epPrice ? `₺ ${product.epPrice}` : "-" },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.label}
                  </p>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ — görsel + durum */}
        <div
          className="rounded-xl border p-6 flex flex-col gap-4 h-fit"
          style={{
            background: "var(--background-card)",
            borderColor: "var(--border)",
          }}
        >
          <FileUpload
            value={product.translation.imgUrl}
            onChange={(file) => {
                setSelectedFile(file);
                if (file) {
                toast.info("Görsel seçildi", "Kaydet butonuna basarak yükleyebilirsiniz.");
                }
            }}
            label="Ürün Görseli"
            hint="PNG, JPG, WEBP · Maks 10MB"
            maxSizeMB={10}
            />

          <div className="text-center">
            <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
              {product.translation.name}
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
              {product.platform} · {product.region}
            </p>
          </div>

          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full font-mono self-center"
            style={{ background: statusColors.bg, color: statusColors.color }}
          >
            {STATUS_LABELS[product.status]}
          </span>

          <div
            className="w-full pt-4 border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <Switch
              checked={form.isActive}
              onCheckedChange={(val) =>
                setForm((prev) => ({ ...prev, isActive: val }))
              }
              label="Aktif"
              hint="Ürünü aktif veya pasif yap"
            />
          </div>
        </div>
      </div>
    </div>
  );
}