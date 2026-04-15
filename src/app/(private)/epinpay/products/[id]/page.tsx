"use client";
import { use, useEffect, useState } from "react";
import { useProduct } from "@/features/products";
import { useProductForm } from "@/features/products/hooks/useProductForm";
import ProductForm from "@/features/products/components/product-form/ProductForm";
import { PageState } from "@/components/common/page-state/PageState";
import { resolveMode, resolveId } from "@/lib/utils";
import { FormPageHeader } from "@/components/common/page-header/FormPageHeader";
import FormSectionContainer from "@/components/common/container/FormSectionContainer";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const mode = resolveMode(id);
  const numericId = resolveId(id);

  const { product, loading, error } = useProduct(numericId);
  const {
    form,
    errors,
    saving,
    isDirty,
    imgUrl,
    activeLocale,
    enabledLocales,
    forbiddenCountries,
    uploading,
    setForbiddenCountries,
    types,
    platforms,
    regions,
    categories,
    metaLoading,
    handleChange,
    handleSelect,
    handleFileChange,
    handleFaqsChange,
    handleLocaleChange,
    handleLocaleAdd,
    handleLocaleRemove,
    handleSave,
  } = useProductForm(product, mode);

  // ── Scroll-to-top visibility ───────────────────────────────────────────────
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Page title ────────────────────────────────────────────────────────────
  const pageTitle =
    mode === "create"
      ? "Yeni Ürün"
      : mode === "duplicate"
        ? `${product?.translation.name} (Kopya)`
        : (product?.translation.name ?? "");

  return (
    <PageState loading={loading} error={error}>
      <div className="flex flex-col h-full">
        {/* Üst bar */}
        <FormPageHeader
          title={pageTitle}
          isDirty={isDirty}
          data={product}
          type={"product"}
          mode={mode}
          saving={saving}
          handleSave={handleSave}
        />

        {/* Dil Seçimi / Ekleme */}
        <FormSectionContainer
          content={
            <LocaleSelector
              activeLocale={activeLocale}
              enabledLocales={enabledLocales}
              onLocaleChange={handleLocaleChange}
              onLocaleAdd={handleLocaleAdd}
              onLocaleRemove={handleLocaleRemove}
            />
          }
        />

        {/* Form */}
        <ProductForm
          form={form}
          errors={errors}
          imgUrl={imgUrl}
          uploading={uploading}
          forbiddenCountries={forbiddenCountries}
          types={types}
          platforms={platforms}
          regions={regions}
          categories={categories}
          metaLoading={metaLoading}
          handleChange={handleChange}
          handleSelect={handleSelect}
          handleFileChange={handleFileChange}
          handleFaqsChange={handleFaqsChange}
          handleForbiddenCountriesChange={setForbiddenCountries}
        />
      </div>

      {/* Scroll-to-top button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Sayfanın başına git"
        className={[
          "fixed bottom-6 right-6 z-50 flex items-center justify-center",
          "w-10 h-10 rounded-full bg-gray-700 text-gray-200 shadow-lg",
          "hover:bg-gray-600 transition-all duration-200",
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
      >
        ↑
      </button>
    </PageState>
  );
}