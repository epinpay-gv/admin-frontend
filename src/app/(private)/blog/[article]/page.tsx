"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useBlog } from "@/features/blog/hooks/useBlog";
import { Button } from "@/components/ui/button";
import Input from "@/components/common/input/Input";
import FileUpload from "@/components/common/file-upload/FileUpload";
import { toast } from "@/components/common/toast/toast";
import { BLOG_STATUS } from "@/features/blog/types/blog.types";
import { blogService } from "@/features/blog/service/blog.service";
import RichTextEditor from "@/components/common/rich-text/RichTextEditor";
import LocaleSelector from "@/components/common/locale-selector/LocaleSelector";
import { PALETTE } from "@/lib/status-color";
import { PageState } from "@/components/common/page-state/PageState";
import { Locale } from "@/components/common/locale-selector/hooks/useLocale";

const STATUS_LABELS: Record<BLOG_STATUS, string> = {
  [BLOG_STATUS.PUBLISHED]: "Yayında",
  [BLOG_STATUS.DRAFT]: "Taslak",
  [BLOG_STATUS.ARCHIVED]: "Arşiv",
};

const STATUS_COLORS = {
  [BLOG_STATUS.PUBLISHED]: PALETTE.green,
  [BLOG_STATUS.DRAFT]: PALETTE.yellow,
  [BLOG_STATUS.ARCHIVED]: PALETTE.red,
};

interface BlogTranslationForm {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  coverImage: string;
  coverImageAlt: string;
}

const EMPTY_FORM: BlogTranslationForm = {
  title: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  coverImage: "",
  coverImageAlt: "",
};

type PageMode = "create" | "edit";

function resolveMode(article: string): PageMode {
  return article === "new" ? "create" : "edit";
}

function resolveArticleId(article: string): string | null {
  return article === "new" ? null : article;
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = use(params);
  const router = useRouter();
  const mode = resolveMode(article);
  const blogId = resolveArticleId(article);

  const { blog, loading, error } = useBlog(blogId);

  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<string>("");
  const [enabledLocales, setEnabledLocales] = useState<string[]>([]);
  const [blogStatus, setBlogStatus] = useState<BLOG_STATUS>(BLOG_STATUS.DRAFT);
  const [form, setForm] = useState<BlogTranslationForm>(EMPTY_FORM);
  // Track slug separately — it lives on the post, not per translation
  const [slug, setSlug] = useState("");

  // Update this useEffect to use t.locale and t.content
  useEffect(() => {
    if (blog && activeLocale) {
      const translation = blog.translations.find(
        (t) => t.locale === activeLocale,
      );
      if (translation) {
        setForm({
          title: translation.title,
          excerpt: translation.excerpt ?? "",
          content: translation.content, // now available
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
          coverImage: blog.coverImage ?? "",
          coverImageAlt: blog.coverImageAlt ?? "",
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [blog, activeLocale]);

  // Update the locales initialization useEffect too
  useEffect(() => {
    if (blog) {
      const locales = blog.translations.map((t) => t.locale); // ← locale not language
      if (enabledLocales.length === 0) {
        setEnabledLocales(locales);
      }
      setBlogStatus(blog.status);
      setSlug(blog.slug);
      if (!activeLocale && locales.length > 0) {
        setActiveLocale(locales[0]);
      }
    }
  }, [blog]);

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
    if (!activeLocale) return;
    setSaving(true);
    try {
      if (mode === "create") {
        await blogService.create({
          slug,
          locale: activeLocale,
          title: form.title,
          content: form.content,
          excerpt: form.excerpt || undefined,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          coverImage: form.coverImage || undefined,
          coverImageAlt: form.coverImageAlt || undefined,
        });
        toast.success(
          "Blog oluşturuldu",
          `${form.title} başarıyla oluşturuldu.`,
        );
        router.push("/blog");
      } else {
        if (!blog) return;

        await blogService.updateTranslation(blog.id, activeLocale, {
          title: form.title,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          coverImage: form.coverImage || undefined,
          coverImageAlt: form.coverImageAlt || undefined,
        });

        if (blogStatus !== blog.status) {
          await blogService.changeStatus(blog.id, blogStatus);
        }

        toast.success(
          "Blog güncellendi",
          `${form.title} başarıyla güncellendi.`,
        );
      }
    } catch {
      toast.error("Hata oluştu", "İşlem sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageState
      loading={mode === "edit" && loading}
      error={mode === "edit" ? error : null}
      onRetry={() => router.refresh()}
    >
      <div>
        {/* Top bar */}
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
                {mode === "create"
                  ? "Yeni Blog Yazısı"
                  : form.title || "Blog Yazısı"}
              </h1>
              {mode === "edit" && blog && (
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {blog.id} · {blog.slug}
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
          {/* Left — form */}
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
              {mode === "create" && (
                <Input
                  name="slug"
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-slug"
                />
              )}
              <Input
                name="title"
                label="Başlık"
                value={form.title}
                onChange={handleChange}
                placeholder="Blog başlığı"
              />
              <Input
                name="excerpt"
                label="Kısa Açıklama"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Kısa açıklama"
              />

              <RichTextEditor
                value={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
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

          {/* Right — cover + status */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-4 h-fit"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
            }}
          >
            {/* <FileUpload
              value={form.coverImage}
              onChange={(file) => {
                if (file) {
                  toast.info(
                    "Görsel seçildi",
                    "Kaydet butonuna basarak yükleyebilirsiniz.",
                  );
                }
              }}
              label="Blog Görseli"
              hint="PNG, JPG, WEBP · Maks 10MB"
              maxSizeMB={10}
            /> */}

            {/* Status selector */}
            <div>
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Durum
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {Object.values(BLOG_STATUS).map((status) => {
                  const isSelected = blogStatus === status;
                  const colors = STATUS_COLORS[status];
                  return (
                    <button
                      key={status}
                      onClick={() => setBlogStatus(status)}
                      className="text-[11px] font-bold px-3 py-1 rounded-full font-mono border transition-all"
                      style={{
                        background: isSelected ? colors.bg : "transparent",
                        color: isSelected ? colors.color : "var(--text-muted)",
                        borderColor: isSelected
                          ? colors.color
                          : "var(--border)",
                      }}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Published at */}
            {mode === "edit" && blog && (
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
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
