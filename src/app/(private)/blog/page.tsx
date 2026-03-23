"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table";
import { LANGUAGE } from "@/types";
import { Blog, BLOG_TRANSLATION_STATUS } from "@/features/blog/types";
import { useBlogs } from "@/features/blog/hooks/useBlogs";
import { useBlogModal } from "@/features/blog/hooks/useBlogModal";
import BlogEditModal from "@/features/blog/components/BlogEditModal";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/spinner/Spinner";

const STATUS_LABELS: Record<BLOG_TRANSLATION_STATUS, string> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: "Yayında",
  [BLOG_TRANSLATION_STATUS.DRAFT]: "Taslak",
  [BLOG_TRANSLATION_STATUS.INACTIVE]: "Pasif",
};

const STATUS_COLORS: Record<BLOG_TRANSLATION_STATUS, { bg: string; color: string }> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [BLOG_TRANSLATION_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [BLOG_TRANSLATION_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

const LANGUAGE_LABELS: Record<LANGUAGE, string> = {
  [LANGUAGE.TR]: "TR",
  [LANGUAGE.EN]: "EN",
  [LANGUAGE.ES]: "ES",
};

// Düzleştirilmiş satır tipi — DataTable'ın anlayacağı format
type BlogRow = {
  id: number;
  title: string;
  slug: string;
  categoryId: number | null;
  sourceLanguage: LANGUAGE;
  status: BLOG_TRANSLATION_STATUS;
  publishedTranslations: { language: LANGUAGE }[];
  publishedAt: string | null;
  updatedAt: string;
  _original: Blog;
} & Record<string, unknown>;

const COLUMNS: ColumnDef<BlogRow>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    searchable: true,
    width: "80px",
  },
  {
    key: "title",
    label: "Başlık",
    sortable: true,
    searchable: true,
    render: (_, row) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {row.title as string}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {row.slug as string}
        </p>
      </div>
    ),
  },
  {
    key: "categoryId",
    label: "Kategori",
    sortable: true,
    // TODO: Kategori sayfası hazır olduğunda bu render,
    // ID yerine kategori adını gösterecek şekilde güncellenecek.
    render: (value) => (
      <span
        className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        #{value != null ? String(value) : "-"}
      </span>
    ),
  },
  {
    key: "sourceLanguage",
    label: "Kaynak Dil",
    sortable: true,
    render: (value) => (
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
        style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
      >
        {LANGUAGE_LABELS[value as LANGUAGE]}
      </span>
    ),
  },
  {
    key: "publishedTranslations",
    label: "Dil Varyasyonları",
    render: (value) => {
      const translations = value as { language: LANGUAGE }[];
      return (
        <div className="flex items-center gap-1">
          {translations.length === 0 ? (
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>-</span>
          ) : (
            translations.map((t) => (
              <span
                key={t.language}
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{ background: "rgba(0,198,162,0.15)", color: "#00C6A2" }}
              >
                {LANGUAGE_LABELS[t.language]}
              </span>
            ))
          )}
        </div>
      );
    },
  },
  {
    key: "publishedAt",
    label: "Yayın Tarihi",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
        {value ? new Date(value as string).toLocaleDateString("tr-TR") : "-"}
      </span>
    ),
  },
  {
    key: "updatedAt",
    label: "Son Güncelleme",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
        {new Date(value as string).toLocaleDateString("tr-TR")}
      </span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as BLOG_TRANSLATION_STATUS;
      const colors = STATUS_COLORS[status];
      return (
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
          style={{ background: colors.bg, color: colors.color }}
        >
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
];

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Yayında", value: BLOG_TRANSLATION_STATUS.PUBLISHED },
  { label: "Taslak", value: BLOG_TRANSLATION_STATUS.DRAFT },
  { label: "Pasif", value: BLOG_TRANSLATION_STATUS.INACTIVE },
];

export default function BlogPage() {
  const router = useRouter();
  const { blogs, loading, error } = useBlogs();
  const { isOpen, selectedBlog, open, close } = useBlogModal();

  // Blog verisini DataTable'ın anlayacağı düz yapıya çevir
  const blogRows: BlogRow[] = blogs.map((blog) => {
    const sourceTranslation = blog.translations.find(
      (t) => t.language === blog.sourceLanguage
    );
    return {
      id: blog.id,
      title: sourceTranslation?.title ?? "-",
      slug: sourceTranslation?.slug ?? "-",
      categoryId: blog.category_id ?? null,
      sourceLanguage: blog.sourceLanguage,
      status: sourceTranslation?.status ?? BLOG_TRANSLATION_STATUS.DRAFT,
      publishedTranslations: blog.translations.filter(
        (t) => t.status === BLOG_TRANSLATION_STATUS.PUBLISHED
      ),
      publishedAt: blog.publishedAt,
      updatedAt: blog.updatedAt,
      _original: blog,
    };
  });

  if (loading) {
    return (
    <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Blog Yazıları
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Toplam <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{blogs.length}</span> blog yazısı yönetiliyor.
          </p>
        </div>
        <Button
          onClick={() => router.push("/blog/new")}
          className="text-white flex items-center gap-2 px-6 h-11 shadow-lg shadow-emerald-500/20"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="font-semibold text-sm">Yeni Blog Ekle</span>
        </Button>
      </div>

      <DataTable
        data={blogRows}
        columns={COLUMNS}
        showStatusFilter
        statusOptions={STATUS_OPTIONS}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => open(row._original as Blog)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => router.push(`/blog/${row.id}`)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Eye size={14} />
            </button>
          </div>
        )}
      />

      <BlogEditModal
        open={isOpen}
        onClose={close}
        blog={selectedBlog}
      />
    </div>
  );
}