import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import {
  Blog,
  BlogTranslation,
  BLOG_STATUS,
} from "@/features/blog/types/blog.types";
import { PALETTE } from "@/lib/status-color";
import Image from "next/image";

export const STATUS_LABELS: Record<BLOG_STATUS, string> = {
  [BLOG_STATUS.PUBLISHED]: "Yayında",
  [BLOG_STATUS.DRAFT]: "Taslak",
  [BLOG_STATUS.ARCHIVED]: "Arşiv",
};

export const STATUS_COLOR = {
  [BLOG_STATUS.PUBLISHED]: PALETTE.green,
  [BLOG_STATUS.ARCHIVED]: PALETTE.red,
  [BLOG_STATUS.DRAFT]: PALETTE.yellow,
};

export type BlogRow = Blog & Record<string, unknown>;

export const BLOG_COLUMNS: ColumnDef<BlogRow>[] = [
  { key: "id", label: "ID", width: "120px" },
  {
    key: "slug",
    label: "Yazı",
    render: (_, row) => {
      const c = row as unknown as BlogRow;
      return (
        <div className="flex min-w-50 items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border bg-(--background-secondary)">
            <Image
              // src={c.coverImage || "/placeholder.png"}
              // alt={c.coverImageAlt || "Blog Yazısı"}
              src={"/placeholder.png"}
              alt={"Blog Yazısı"}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {(row.translations as BlogTranslation[])[0]?.title ?? "-"}
            </p>
            <p
              className="font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              {row.slug as string}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "publishedAt",
    label: "Yayın Tarihi",
    render: (value) => (
      <span
        className="font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        {value ? new Date(value as string).toLocaleDateString("tr-TR") : "-"}
      </span>
    ),
  },
  {
    key: "translations",
    label: "Dil",
    render: (value) => {
      const translations = value as BlogTranslation[];
      return (
        <div className="flex items-center gap-1">
          {translations.length === 0 ? (
            <span
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              -
            </span>
          ) : (
            translations.map((t) => (
              <span
                key={t.locale}
                className="font-bold px-2 py-0.5 rounded-full font-mono uppercase"
                style={{ background: "rgba(0,198,162,0.15)", color: "#00C6A2" }}
              >
                {t.locale}
              </span>
            ))
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    render: (value) => {
      const status = value as BLOG_STATUS;
      const colors = STATUS_COLOR[status];
      return (
        <span
          className="font-bold px-2 py-0.5 rounded-full font-mono"
          style={{ background: colors.bg, color: colors.color }}
        >
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
];
