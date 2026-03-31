import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import {Blog, BLOG_TRANSLATION_STATUS } from "@/features/blog/types";
import { PALETTE } from "@/lib/status-color";
import { LANGUAGE } from "@/types";

export const STATUS_LABELS: Record<BLOG_TRANSLATION_STATUS, string> = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: "Yayında",
  [BLOG_TRANSLATION_STATUS.DRAFT]: "Taslak",
  [BLOG_TRANSLATION_STATUS.INACTIVE]: "Pasif",
};

export const STATUS_COLOR = {
  [BLOG_TRANSLATION_STATUS.PUBLISHED]: PALETTE.green,
  [BLOG_TRANSLATION_STATUS.INACTIVE]: PALETTE.red,
  [BLOG_TRANSLATION_STATUS.DRAFT]: PALETTE.yellow,
};

export const LANGUAGE_LABELS: Record<LANGUAGE, string> = {
  [LANGUAGE.TR]: "TR",
  [LANGUAGE.EN]: "EN",
  [LANGUAGE.ES]: "ES",
};

// Düzleştirilmiş satır tipi tanımı
export type BlogRow = {
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

export const BLOG_COLUMNS: ColumnDef<BlogRow>[] = [
  { key: "id", label: "ID", sortable: true, width: "80px" },
  {
    key: "title",
    label: "Başlık",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{row.title as string}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{row.slug as string}</p>
      </div>
    ),
  },
  {
    key: "categoryId",
    label: "Kategori",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
        #{value != null ? String(value) : "-"}
      </span>
    ),
  },
  {
    key: "sourceLanguage",
    label: "Kaynak Dil",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}>
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
              <span key={t.language} className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(0,198,162,0.15)", color: "#00C6A2" }}>
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
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as BLOG_TRANSLATION_STATUS;
      const colors = STATUS_COLOR[status];
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: colors.bg, color: colors.color }}>
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
];