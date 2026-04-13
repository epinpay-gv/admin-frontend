"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import Input from "@/components/common/input/Input";
import { PageState } from "@/components/common/page-state/PageState";
import { toast } from "@/components/common/toast/toast";
import RichTextEditor from "@/components/common/rich-text/RichTextEditor";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { Locale } from "@/components/common/locale-selector/hooks/useLocale";

import { useLegalPage } from "@/features/legal-pages/hooks/useLegalPage";
import { LegalPageContent, LegalPageUpdatePayload } from "@/features/legal-pages/types";
import { LANGUAGE } from "@/types";

const EMPTY_CONTENT: Omit<LegalPageContent, "language"> = {
  metaTitle: "",
  metaDescription: "",
  text: "",
};

export default function LegalPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const numericId = Number(id);

  const { legalPage, loading, saving, error, save } = useLegalPage(numericId);

  const [activeLocale, setActiveLocale] = useState<string>("");
  const [enabledLocales, setEnabledLocales] = useState<string[]>([]);
  const [pageName, setPageName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [form, setForm] = useState<Omit<LegalPageContent, "language">>(EMPTY_CONTENT);

  // İlk yüklemede state'leri doldur
  useEffect(() => {
    if (!legalPage) return;

    setPageName(legalPage.pageName);
    setPageUrl(legalPage.pageUrl);

    if (enabledLocales.length === 0) {
      const locales = legalPage.contents.map((c) => c.language as string);
      setEnabledLocales(locales);
      if (locales.length > 0) setActiveLocale(locales[0]);
    }
  }, [legalPage]);

  // Aktif locale değişince formu doldur
  useEffect(() => {
    if (!legalPage || !activeLocale) return;

    const content = legalPage.contents.find((c) => c.language === activeLocale);
    setForm(
      content
        ? { metaTitle: content.metaTitle, metaDescription: content.metaDescription, text: content.text }
        : EMPTY_CONTENT
    );
  }, [activeLocale, legalPage]);

  const handleLocaleAdd = (locale: Locale) => {
    setEnabledLocales((prev) => [...prev, locale.code]);
    setActiveLocale(locale.code);
  };

  const handleLocaleRemove = (code: string) => {
    setEnabledLocales((prev) => prev.filter((l) => l !== code));
    if (activeLocale === code) {
      setActiveLocale(enabledLocales.find((l) => l !== code) ?? "");
    }
  };

  const handleSave = async () => {
    if (!legalPage || !activeLocale) return;

    // Mevcut contents'i güncelle ya da yeni dil ekle
    const existingIndex = legalPage.contents.findIndex(
      (c) => c.language === activeLocale
    );

    const updatedContents: LegalPageContent[] =
      existingIndex >= 0
        ? legalPage.contents.map((c) =>
            c.language === activeLocale
              ? { ...c, ...form }
              : c
          )
        : [
            ...legalPage.contents,
            { language: activeLocale as LANGUAGE, ...form },
          ];

    const payload: LegalPageUpdatePayload = {
      id: numericId,
      pageName,
      pageUrl,
      contents: updatedContents,
    };

    const success = await save(payload);
    if (success) {
      toast.success("Kaydedildi", `${pageName} başarıyla güncellendi.`);
    } else {
      toast.error("Hata oluştu", "Kaydetme sırasında bir hata oluştu.");
    }
  };

  return (
    <PageState loading={loading} error={error} onRetry={() => router.refresh()}>
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
                {pageName || "Yasal Sayfa"}
              </h1>
              {legalPage && (
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  #{legalPage.id} · /{pageUrl}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !activeLocale}
            className="text-sm text-white flex items-center gap-2"
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
                Kaydet
              </>
            )}
          </Button>
        </div>

        {/* Locale Selector */}
        <div className="mb-6">
          <LocaleSelector
            activeLocale={activeLocale}
            enabledLocales={enabledLocales}
            onLocaleChange={setActiveLocale}
            onLocaleAdd={handleLocaleAdd}
            onLocaleRemove={handleLocaleRemove}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol — içerik */}
          <div
            className="lg:col-span-2 rounded-xl border p-6 space-y-4"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Sayfa İçeriği
            </p>

            <RichTextEditor
              value={form.text}
              onChange={(html) => setForm((prev) => ({ ...prev, text: html }))}
              placeholder="Sayfa içeriğini giriniz..."
            />

            <div
              className="pt-4 border-t space-y-4"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                SEO
              </p>
              <Input
                name="metaTitle"
                label="Meta Title"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                placeholder="Meta title"
              />
              <Input
                name="metaDescription"
                label="Meta Description"
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="Meta description"
              />
            </div>
          </div>

          {/* Sağ — sayfa bilgileri */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-4 h-fit"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Sayfa Bilgileri
            </p>

            <Input
              name="pageName"
              label="Sayfa Adı"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Gizlilik Politikası"
            />

            <Input
              name="pageUrl"
              label="Sayfa URL"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="gizlilik-politikasi"
              prefix="/"
            />

            {legalPage && (
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Son Güncelleme
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {legalPage.updatedAt
                    ? new Date(legalPage.updatedAt).toLocaleDateString("tr-TR")
                    : "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageState>
  );
}