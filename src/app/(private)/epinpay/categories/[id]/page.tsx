"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Copy } from "lucide-react";
import { useCategory, useCategoryForm, CategoryForm, CATEGORY_STATUS } from "@/features/categories";
import { CategoryCountry } from "@/features/categories/types";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { Locale } from "@/components/common/locale-selector/locale.service";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/spinner/Spinner";

const STATUS_COLORS: Record<CATEGORY_STATUS, { bg: string; color: string }> = {
  [CATEGORY_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [CATEGORY_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

const STATUS_LABELS: Record<CATEGORY_STATUS, string> = {
  [CATEGORY_STATUS.ACTIVE]: "Aktif",
  [CATEGORY_STATUS.INACTIVE]: "Pasif",
};

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
  const router = useRouter();
  const mode = resolveMode(id);
  const numericId = resolveId(id);

  const [activeLocale, setActiveLocale] = useState("tr");
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["tr"]);
  const [forbiddenCountries, setForbiddenCountries] = useState<CategoryCountry[]>([]);

  const { category, loading, error } = useCategory(numericId);
  const {
    form,
    errors,
    saving,
    isDirty,
    imgUrl,
    faqs,
    handleChange,
    handleSelect,
    handleGenresChange,
    handleFileChange,
    handleFaqsChange,
    save,
  } = useCategoryForm(category, mode);

  useEffect(() => {
    if (category) {
      setForbiddenCountries(category.forbiddenCountries ?? []);
      if (category.availableLocales?.length) {
        setEnabledLocales(category.availableLocales);
        if (!category.availableLocales.includes(activeLocale)) {
          setActiveLocale(category.availableLocales[0]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id]);

  const handleLocaleChange = (code: string) => setActiveLocale(code);

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
      setActiveLocale(enabledLocales.find((l) => l !== code) ?? "tr");
    }
  };

  const handleSave = async () => {
    await save((saved) => {
      router.push(`/epinpay/categories/${saved.id}`);
    }, activeLocale);
  };

  if (loading && numericId !== null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || (numericId !== null && !category && !loading)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "Kategori bulunamadı."}
        </p>
        <Button variant="ghost" onClick={() => router.back()}>
          Geri dön
        </Button>
      </div>
    );
  }

  const pageTitle =
    mode === "create"
      ? "Yeni Kategori"
      : mode === "duplicate"
      ? `${category?.translation.name} (Kopya)`
      : category?.translation.name ?? "";

  return (
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
                {category && mode === "edit" && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: STATUS_COLORS[category.status].bg,
                      color: STATUS_COLORS[category.status].color,
                    }}
                  >
                    {STATUS_LABELS[category.status]}
                  </span>
                )}
                {mode === "create" && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(255,180,0,0.15)", color: "#FFB400" }}
                  >
                    Yeni
                  </span>
                )}
                {mode === "duplicate" && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
                  >
                    Kopya
                  </span>
                )}
                {isDirty && (
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,180,0,0.15)", color: "#FFB400" }}
                  >
                    Kaydedilmemiş değişiklikler
                  </span>
                )}
              </div>
              {category && (
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  #{category.id} · {category.translation.slug}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {mode === "edit" && category && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    router.push(`/epinpay/categories/copy-${category.id}`)
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
        <CategoryForm
          product={category ?? null}
          mode={mode}
          saving={saving}
          form={form}
          errors={errors}
          imgUrl={imgUrl}
          faqs={faqs}
          forbiddenCountries={forbiddenCountries}
          handleChange={handleChange}
          handleSelect={handleSelect}
          handleGenresChange={handleGenresChange}
          handleFileChange={handleFileChange}
          handleFaqsChange={handleFaqsChange}
          handleForbiddenCountriesChange={setForbiddenCountries}
        />
      </div>
    </div>
  );
}