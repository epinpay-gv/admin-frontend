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
      <div className="flex flex-col items-center justify-center h-64 gap-3 px-4 text-center">
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
    <div className="flex flex-col h-full overflow-hidden bg-background">   
      <div
        className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between  px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-[0px_3px_3px_0px_oklch(0.6_0.118_184.704)] gap-4 mx-4"
        style={{
          background: "var(--background-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
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
            className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors hover:bg-black/5"
            style={{
              background: "var(--background-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="text-base sm:text-lg md:text-xl font-semibold tracking-tight truncate max-w-[180px] sm:max-w-none"
                style={{ color: "var(--text-primary)" }}
              >
                {pageTitle}
              </h1>
              
              <div className="flex flex-wrap gap-1.5">
                {product && mode === "edit" && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap"
                    style={{
                      background: STATUS_COLORS[product.status].bg,
                      color: STATUS_COLORS[product.status].color,
                    }}
                  >
                    {STATUS_LABELS[product.status]}
                  </span>
                )}
                {mode === "create" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono bg-[rgba(255,180,0,0.15)] text-[#FFB400]">
                    Yeni
                  </span>
                )}
                {isDirty && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(255,180,0,0.15)] text-[#FFB400]">
                    <span className="hidden xs:inline">Değişiklikler var</span>
                    <span className="xs:hidden">Düzenlendi</span>
                  </span>
                )}
              </div>
            </div>
            {product && (
              <p className="text-[10px] sm:text-xs font-mono mt-0.5 opacity-70 truncate" style={{ color: "var(--text-muted)" }}>
                #{product.id} · {product.translation.slug}
              </p>
            )}
          </div>
        </div>

        {/* Sağ Kısım: Aksiyon Butonları */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {mode === "edit" && product && (
            <Button
              variant="ghost"
              onClick={() => router.push(`/epinpay/products/copy-${product.id}`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm h-10 px-3 border border-transparent hover:border-[var(--border)]"
              style={{ color: "var(--text-muted)" }}
            >
              <Copy size={14} />
              <span className="hidden xs:inline">Kopyala</span>
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none text-white flex items-center justify-center gap-2 h-10 px-4 min-w-[110px]"
            style={{
              background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
            }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-xs">Kaydediliyor</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span className="text-xs sm:text-sm">
                  {mode === "create" ? "Oluştur" : mode === "duplicate" ? "Kopyayı Kaydet" : "Kaydet"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>    
      <div className="flex-1 mt-4 overflow-y-auto px-4 ">
        <div className=" mx-auto">
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
      </div>
    </div>
  );
}