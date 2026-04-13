"use client";
import { use, useEffect } from "react";
import {
  useCategory,
  useCategoryForm,
  CategoryForm,
} from "@/features/categories";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { PageState } from "@/components/common/page-state/PageState";
import FormPageTitle from "@/features/categories/components/category-form/Title/FormPageTitle";
import FormSectionContainer from "@/components/common/container/FormSectionContainer";

type PageMode = "create" | "edit" | "duplicate";

function resolveMode(id: string): PageMode {
  if (id === "new") return "create";
  if (id.startsWith("copy-")) return "duplicate";
  return "edit";
}

function resolveId(id: string): number | null {
  if (id === "new") return null;
  if (id.startsWith("copy-")) return Number(id.replace("copy-", ""));
  return Number(id);
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const mode = resolveMode(id);
  const numericId = resolveId(id);

  const { category, loading, error } = useCategory(numericId);
  const {
    form,
    errors,
    saving,
    isDirty,
    imgUrl,
    activeLocale,
    enabledLocales,
    forbiddenCountries,
    setEnabledLocales,
    setActiveLocale,
    setForbiddenCountries,
    handleChange,
    handleSelect,
    handleFileChange,
    handleFaqsChange,
    handleLocaleChange,
    handleLocaleAdd,
    handleLocaleRemove,
    handleSave,
  } = useCategoryForm(category, mode);

  const pageTitle =
    mode === "create"
      ? "Yeni Kategori"
      : mode === "duplicate"
        ? `${category?.translation.name} (Kopya)`
        : (category?.translation.name ?? "");

  return (
    <PageState loading={loading} error={error} >
      <div className="flex flex-col h-full">
        {/* Üst bar */}
        <FormPageTitle
          isDirty={isDirty}
          pageTitle={pageTitle}
          category={category}
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
        <CategoryForm
          product={category ?? null}
          mode={mode}
          saving={saving}
          form={form}
          errors={errors}
          imgUrl={imgUrl}
          forbiddenCountries={forbiddenCountries}
          handleChange={handleChange}
          handleSelect={handleSelect}
          handleFileChange={handleFileChange}
          handleFaqsChange={handleFaqsChange}
          handleForbiddenCountriesChange={setForbiddenCountries}
        />
      </div>
    </PageState>
  );
}
