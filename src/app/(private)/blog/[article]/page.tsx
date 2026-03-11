// src/app/(private)/blog/[article]/page.tsx
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
import { BLOG_TRANSLATION_STATUS } from "@/features/blog/types";
import { blogService } from "@/features/blog/service/blog.service";
import RichTextEditor from "@/components/common/rick-test/contentEditable";

const STATUS_LABELS: Record<BLOG_TRANSLATION_STATUS, string> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: "Yayında",
  [BLOG_TRANSLATION_STATUS.DRAFT]: "Taslak",
  [BLOG_TRANSLATION_STATUS.INACTIVE]: "Pasif",
};

const STATUS_COLORS: Record<BLOG_TRANSLATION_STATUS, { bg: string; color: string }> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [BLOG_TRANSLATION_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [BLOG_TRANSLATION_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

const LANGUAGE_LABELS: Record<LANGUAGE, string> = {
  [LANGUAGE.TR]: "TR",
  [LANGUAGE.EN]: "EN",
  [LANGUAGE.ES]: "ES",
};

interface BlogTranslationForm {
  title: string;
  slug: string;
  body: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  status: BLOG_TRANSLATION_STATUS;
}

const EMPTY_FORM: BlogTranslationForm = {
  title: "",
  slug: "",
  body: "",
  shortDescription: "",
  metaTitle: "",
  metaDescription: "",
  status: BLOG_TRANSLATION_STATUS.DRAFT,
};

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = use(params);
  const router = useRouter();
  const { blog, loading, error } = useBlog(Number(article));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<LANGUAGE | null>(null);
  const [form, setForm] = useState<BlogTranslationForm>(EMPTY_FORM);


  // Blog gelince aktif tab'ı kaynak dile ayarla
  useEffect(() => {
    if (blog && !activeTab) {
      setActiveTab(blog.sourceLanguage);
    }
  }, [blog]);

  // Tab değişince formu o translation'ın verisiyle doldur
  useEffect(() => {
    if (blog && activeTab) {
      const translation = blog.translations.find((t) => t.language === activeTab);
      if (translation) {
        setForm({
          title: translation.title,
          slug: translation.slug,
          body: translation.body,
          shortDescription: translation.shortDescription ?? "",
          metaTitle: translation.metaTitle ?? "",
          metaDescription: translation.metaDescription ?? "",
          status: translation.status,
        });
      } else {
        // Bu dilde henüz translation yok
        setForm(EMPTY_FORM);
      }
    }
  }, [blog, activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!blog || !activeTab) return;
    setSaving(true);
    try {
      const updatedTranslations = blog.translations.map((t) =>
        t.language === activeTab
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
      await blogService.update(blog.id, { translations: updatedTranslations });
      toast.success("Blog güncellendi", `${form.title} başarıyla güncellendi.`);
    } catch {
      toast.error("Hata oluştu", "Blog güncellenirken bir hata oluştu.");
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

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "Blog yazısı bulunamadı."}
        </p>
      </div>
    );
  }

  const activeTranslation = blog.translations.find((t) => t.language === activeTab);
  const statusColors = activeTranslation
    ? STATUS_COLORS[activeTranslation.status]
    : STATUS_COLORS[BLOG_TRANSLATION_STATUS.DRAFT];

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
              {form.title || "Blog Yazısı"}
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              #{blog.id} · {form.slug}
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

      {/* Dil Tab'ları */}
      <div className="flex items-center gap-2 mb-6">
        {blog.translations.map((t) => {
          const isActive = activeTab === t.language;
          const colors = STATUS_COLORS[t.status];
          return (
            <button
              key={t.language}
              onClick={() => setActiveTab(t.language)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
              style={{
                background: isActive ? "var(--background-card)" : "transparent",
                borderColor: isActive ? "var(--border)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              {LANGUAGE_LABELS[t.language]}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono"
                style={{ background: colors.bg, color: colors.color }}
              >
                {STATUS_LABELS[t.status]}
              </span>
            </button>
          );
        })}
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
            {/* <div>{form.body}</div> */}
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

          {/* Kaynak dil bilgisi */}
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
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
            >
              {LANGUAGE_LABELS[blog.sourceLanguage]}
            </span>
          </div>

          {/* Yayın tarihi */}
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
        </div>
      </div>
    </div>
  );
}
