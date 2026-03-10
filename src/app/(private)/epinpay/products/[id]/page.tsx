"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Copy } from "lucide-react";
import { useProduct } from "@/features/products";
import { PRODUCT_STATUS } from "@/features/products";
import { useProductForm } from "@/features/products/hooks/useProductForm";
import ProductForm from "@/features/products/components/product-form/ProductForm";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<PRODUCT_STATUS, { bg: string; color: string }> = {
  [PRODUCT_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [PRODUCT_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [PRODUCT_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

const STATUS_LABELS: Record<PRODUCT_STATUS, string> = {
  [PRODUCT_STATUS.ACTIVE]: "Aktif",
  [PRODUCT_STATUS.INACTIVE]: "Pasif",
  [PRODUCT_STATUS.DRAFT]: "Taslak",
};

type PageMode = "create" | "edit" | "duplicate";

function resolveMode(id: string): PageMode {
  if (id === "new") return "create";
  if (id.startsWith("copy-")) return "duplicate";
  return "edit";
}

function resolveProductId(id: string): number | null {
  if (id === "new") return null;
  if (id.startsWith("copy-")) return Number(id.replace("copy-", ""));
  return Number(id);
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const mode = resolveMode(id);
  const numericId = resolveProductId(id);

  const { product, loading, error } = useProduct(numericId);
  const { form, errors, saving, isDirty, handleChange, handleSelect, save } =
    useProductForm(product, mode);

  const handleSave = async () => {
    await save((saved) => {
      router.push(`/epinpay/products/${saved.id}`);
    });
  };

  if (loading && numericId !== null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
        />
      </div>
    );
  }

  if (error || (numericId !== null && !product && !loading)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "Ürün bulunamadı."}
        </p>
        <Button variant="ghost" onClick={() => router.back()}>
          Geri dön
        </Button>
      </div>
    );
  }

  const pageTitle =
    mode === "create"
      ? "Yeni Ürün"
      : mode === "duplicate"
      ? `${product?.translation.name} (Kopya)`
      : product?.translation.name ?? "";

  return (
    <div>
      {/* Üst bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isDirty) {
                if (confirm("Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?")) {
                  router.back();
                }
              } else {
                router.back();
              }
            }}
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
            <div className="flex items-center gap-2">
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {pageTitle}
              </h1>
              {product && mode === "edit" && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: STATUS_COLORS[product.status].bg,
                    color: STATUS_COLORS[product.status].color,
                  }}
                >
                  {STATUS_LABELS[product.status]}
                </span>
              )}
              {mode === "create" && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(255,180,0,0.15)",
                    color: "#FFB400",
                  }}
                >
                  Yeni
                </span>
              )}
              {mode === "duplicate" && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(0,133,255,0.15)",
                    color: "#0085FF",
                  }}
                >
                  Kopya
                </span>
              )}
              {isDirty && (
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,180,0,0.15)",
                    color: "#FFB400",
                  }}
                >
                  Kaydedilmemiş değişiklikler
                </span>
              )}
            </div>
            {product && (
              <p
                className="text-xs font-mono mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                #{product.id} · {product.translation.slug}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && product && (
            <Button
              variant="ghost"
              onClick={() => router.push(`/epinpay/products/copy-${product.id}`)}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <Copy size={14} />
              Kopyala
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-white flex items-center gap-2"
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
              <>
                <Save size={14} />
                {mode === "create"
                  ? "Oluştur"
                  : mode === "duplicate"
                  ? "Kopyayı Kaydet"
                  : "Kaydet"}
              </>
            )}
          </Button>
        </div>
      </div>

      <ProductForm
        product={product ?? null}
        mode={mode}
        saving={saving}
        form={form}
        errors={errors}
        handleChange={handleChange}
        handleSelect={handleSelect}
        onSuccess={(saved) => {
          router.push(`/epinpay/products/${saved.id}`);
        }}
      />
    </div>
  );
}