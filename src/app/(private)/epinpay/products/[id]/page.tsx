"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Copy } from "lucide-react";
import { useProduct } from "@/features/products";
import { PRODUCT_STATUS } from "@/features/products";
import { useProductForm } from "@/features/products/hooks/useProductForm";
import ProductForm from "@/features/products/components/product-form/ProductForm";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { Locale } from "@/components/common/locale-selector/locale.service";
import { Button } from "@/components/ui/button";
import {PALETTE} from "@/lib/status-color";
import { PageState } from "@/components/common/page-state/PageState";

const STATUS_COLORS = {
  [PRODUCT_STATUS.ACTIVE]:   PALETTE.green,
  [PRODUCT_STATUS.INACTIVE]: PALETTE.red,
  [PRODUCT_STATUS.DRAFT]:    PALETTE.yellow,
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

  const [activeLocale, setActiveLocale] = useState("en");
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["en"]);

  const { product, loading, error } = useProduct(numericId, activeLocale);
  const { form, errors, saving, isDirty, handleChange, handleSelect, save } =
    useProductForm(product, mode);

  // Ürün yüklenince mevcut dilleri set et
  useEffect(() => {
    if (product?.availableLocales?.length) {
      setEnabledLocales(product.availableLocales);
      if (!product.availableLocales.includes(activeLocale)) {
        setActiveLocale(product.availableLocales[0]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const handleLocaleChange = (code: string) => {
    setActiveLocale(code);
  };

  const handleLocaleAdd = (locale: Locale) => {
    setEnabledLocales((prev) =>
      prev.includes(locale.code) ? prev : [...prev, locale.code]
    );
    setActiveLocale(locale.code);
  };

  const handleLocaleRemove = (code: string) => {
    if (enabledLocales.length <= 1) return;
    setEnabledLocales((prev) => prev.filter((l) => l !== code));
    if (activeLocale === code) {
      setActiveLocale(enabledLocales.find((l) => l !== code) ?? "en");
    }
  };

  const handleSave = async () => {
    await save(
      (saved) => {
        router.push(`/epinpay/products/${saved.id}`);
      },
      activeLocale
    );
  };

  const pageTitle =
    mode === "create"
      ? "Yeni Ürün"
      : mode === "duplicate"
      ? `${product?.translation.name} (Kopya)`
      : product?.translation.name ?? "";

  return (
    <PageState loading={loading} error={error}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="pb-4">
          {/* Üst bar */}
          <div
            className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
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
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
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
                    className="text-xl font-semibold tracking-tight truncate"
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
                      style={{ background: PALETTE.yellow.bg, color: PALETTE.yellow.color }}
                    >
                      Yeni
                    </span>
                  )}
                  {mode === "duplicate" && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{ background: PALETTE.blue.bg, color: PALETTE.blue.color }}
                    >
                      Kopya
                    </span>
                  )}
                  {isDirty && (
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: PALETTE.yellow.bg , color: PALETTE.yellow.color}}
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

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                {mode === "edit" && product && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/epinpay/products/copy-${product.id}`)
                    }
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
                    background:
                      "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
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
          </div>

          {/* Locale Selector */}
          <div
            className="p-4 rounded-lg border"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
            }}
          >
            <LocaleSelector
              activeLocale={activeLocale}
              enabledLocales={enabledLocales}
              onLocaleChange={handleLocaleChange}
              onLocaleAdd={handleLocaleAdd}
              onLocaleRemove={handleLocaleRemove}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
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
    </PageState>
  );
}