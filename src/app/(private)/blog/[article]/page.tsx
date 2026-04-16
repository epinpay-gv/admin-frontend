"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useBlog } from "@/features/blog/hooks/useBlog";
import { LANGUAGE } from "@/types";
import { Button } from "@/components/ui/button";
import Input from "@/components/common/input/Input";
import FileUpload from "@/components/common/file-upload/FileUpload";
import { toast } from "@/components/common/toast/toast";
import { BLOG_TRANSLATION_STATUS } from "@/features/blog/types/blog.types";
import { blogService } from "@/features/blog/service/blog.service";
import RichTextEditor from "@/components/common/rich-text/RichTextEditor";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { Locale } from "@/components/common/locale-selector/locale.service";
import { PALETTE } from "@/lib/status-color";
import {PageState} from "@/components/common/page-state/PageState";

const STATUS_LABELS: Record<BLOG_TRANSLATION_STATUS, string> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: "Yayında",
  [BLOG_TRANSLATION_STATUS.DRAFT]: "Taslak",
  [BLOG_TRANSLATION_STATUS.INACTIVE]: "Pasif",
};

const STATUS_COLORS = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: PALETTE.green,
  [BLOG_TRANSLATION_STATUS.DRAFT]: PALETTE.yellow,
  [BLOG_TRANSLATION_STATUS.INACTIVE]: PALETTE.red,
};

interface BlogTranslationForm {
  title: string;
  slug: string;
  body: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  status: BLOG_TRANSLATION_STATUS;
  categoryId: number | null;
}

const EMPTY_FORM: BlogTranslationForm = {
  title: "",
  slug: "",
  body: "",
  shortDescription: "",
  metaTitle: "",
  metaDescription: "",
  status: BLOG_TRANSLATION_STATUS.DRAFT,
  categoryId: null,
};

type PageMode = "create" | "edit";

function resolveMode(article: string): PageMode {
  return article === "new" ? "create" : "edit";
}

function resolveArticleId(article: string): number | null {
  return article === "new" ? null : Number(article);
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = use(params);
  const router = useRouter();
  const mode = resolveMode(article);
  const numericId = resolveArticleId(article);

  const { blog, loading, error } = useBlog(numericId!);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<string>("");
  const [enabledLocales, setEnabledLocales] = useState<string[]>([]);
  const [form, setForm] = useState<BlogTranslationForm>(EMPTY_FORM);

  useEffect(() => {
    if (blog && enabledLocales.length === 0) {
      const locales = blog.translations.map((t) => t.language as string);
      setEnabledLocales(locales);
    }
  }, [blog]);

  useEffect(() => {
    if (blog && activeLocale) {
      const translation = blog.translations.find(
        (t) => t.language === activeLocale
      );
      if (translation) {
        setForm({
          title: translation.title,
          slug: translation.slug,
          body: translation.body,
          shortDescription: translation.shortDescription ?? "",
          metaTitle: translation.metaTitle ?? "",
          metaDescription: translation.metaDescription ?? "",
          status: translation.status,
          categoryId: blog.category_id ?? null,
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [blog, activeLocale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    setSaving(true);
    try {
      if (mode === "create") {
        const newBlog = await blogService.create({
          category_id: form.categoryId ?? undefined,
          translations: [
            {
              id: 0,
              language: activeLocale as LANGUAGE,
              title: form.title,
              slug: form.slug,
              body: form.body,
              shortDescription: form.shortDescription,
              metaTitle: form.metaTitle,
              metaDescription: form.metaDescription,
              status: form.status,
              imgUrl: "",
              imgAlt: "",
            },
          ],
        });
        toast.success("Blog oluşturuldu", `${form.title} başarıyla oluşturuldu.`);
        router.push(`/blog/${newBlog.id}`);
      } else {
        if (!blog || !activeLocale) return;
        const updatedTranslations = blog.translations.map((t) =>
          t.language === activeLocale
            ? {
                ...t,
                title: form.title,
                slug: form.slug,
                body: form.body,
                shortDescription: form.shortDescription,
                metaTitle: form.metaTitle,
                metaDescription: form.metaDescription,
                status: form.status,
              }
            : t
        );
        await blogService.update(blog.id, {
          category_id: form.categoryId ?? undefined,
          translations: updatedTranslations,
        });
        toast.success("Blog güncellendi", `${form.title} başarıyla güncellendi.`);
      }
    } catch {
      toast.error("Hata oluştu", "İşlem sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const activeTranslation = blog?.translations.find(
    (t) => t.language === activeLocale
  );

  return (
    <PageState
      loading={mode === "edit" && loading}
      error={mode === "edit" ? error : null}
      onRetry={() => router.refresh()}
    >
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
                {mode === "create" ? "Yeni Blog Yazısı" : form.title || "Blog Yazısı"}
              </h1>
              {mode === "edit" && blog && (
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  #{blog.id} · {form.slug}
                </p>
              )}
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
                {mode === "create" ? "Oluşturuluyor..." : "Kaydediliyor..."}
              </span>
            ) : (
              <>
                <Save size={14} />
                {mode === "create" ? "Oluştur" : "Kaydet"}
              </>
            )}
          </Button>
        </div>

        {/* LocaleSelector */}
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
              İçerik Bilgileri
            </p>

            <div className="space-y-4">
              <Input
                name="title"
                label="Başlık"
                value={form.title}
                onChange={handleChange}
                placeholder="Blog başlığı"
              />
              <Input
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="blog-slug"
              />
              <Input
                name="shortDescription"
                label="Kısa Açıklama"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Kısa açıklama"
              />

              <RichTextEditor
                value={form.body}
                onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
                placeholder="İçerik yazısını giriniz..."
              />

              {/* SEO */}
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
                  onChange={handleChange}
                  placeholder="Meta title"
                />
                <Input
                  name="metaDescription"
                  label="Meta Description"
                  value={form.metaDescription}
                  onChange={handleChange}
                  placeholder="Meta description"
                />
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
              value={activeTranslation?.imgUrl ?? ""}
              onChange={(file) => {
                if (file) {
                  toast.info("Görsel seçildi", "Kaydet butonuna basarak yükleyebilirsiniz.");
                }
              }}
              label="Blog Görseli"
              hint="PNG, JPG, WEBP · Maks 10MB"
              maxSizeMB={10}
            />

            {/* Durum seçici */}
            <div>
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Durum
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {Object.values(BLOG_TRANSLATION_STATUS).map((status) => {
                  const isSelected = form.status === status;
                  const colors = STATUS_COLORS[status];
                  return (
                    <button
                      key={status}
                      onClick={() => setForm((prev) => ({ ...prev, status }))}
                      className="text-[11px] font-bold px-3 py-1 rounded-full font-mono border transition-all"
                      style={{
                        background: isSelected ? colors.bg : "transparent",
                        color: isSelected ? colors.color : "var(--text-muted)",
                        borderColor: isSelected ? colors.color : "var(--border)",
                      }}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kategori */}
            <div
              className="pt-4 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <Input
                name="categoryId"
                label="Kategori ID"
                value={form.categoryId?.toString() ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="Kategori ID"
              />
            </div>

            {/* Kaynak dil bilgisi */}
            {mode === "edit" && blog && (
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Kaynak Dil
                </p>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono uppercase"
                  style={{ background: PALETTE.blue.bg, color: PALETTE.blue.color }}
                >
                  {blog.sourceLanguage}
                </span>
              </div>
            )}

            {/* Yayın tarihi */}
            {mode === "edit" && blog && (
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Yayın Tarihi
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("tr-TR")
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