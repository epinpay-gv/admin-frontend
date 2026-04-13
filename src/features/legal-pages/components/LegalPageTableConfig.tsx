import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { LegalPage } from "@/features/legal-pages/types";
import { LANGUAGE } from "@/types";
import { Pencil, Trash2 } from "lucide-react";


export const LANGUAGE_LABELS: Record<LANGUAGE, string> = {
  [LANGUAGE.TR]: "TR",
  [LANGUAGE.EN]: "EN",
  [LANGUAGE.ES]: "ES",
};

export type LegalPageRow = {
  id: number;
  pageName: string;
  pageUrl: string;
  languages: LANGUAGE[];
  updatedAt: string;
  _original: LegalPage;
} & Record<string, unknown>;

export const LEGAL_PAGE_COLUMNS = (
  onEdit: (id: number) => void,
  onRemove: (id: number) => void,
  canEdit: boolean
): ColumnDef<LegalPageRow>[] => [
  {
    key: "id",
    label: "#",
    sortable: true,
    width: "80px",
    render: (value) => (
      <span
        className="text-sm font-mono font-bold"
        style={{ color: "var(--text-muted)" }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: "pageName",
    label: "Sayfa Adı",
    sortable: true,
    render: (_, row) => (
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {row.pageName}
        </p>
        <p
          className="text-[11px] font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          /{row.pageUrl}
        </p>
      </div>
    ),
  },
  {
    key: "languages",
    label: "Dil İçerikleri",
    render: (value) => {
      const languages = value as LANGUAGE[];
      return (
        <div className="flex items-center gap-1">
          {languages.length === 0 ? (
            <span style={{ color: "var(--text-muted)" }} className="text-[11px]">
              —
            </span>
          ) : (
            languages.map((lang) => (
              <span
                key={lang}
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: "rgba(0,198,162,0.15)",
                  color: "#00C6A2",
                }}
              >
                {LANGUAGE_LABELS[lang]}
              </span>
            ))
          )}
        </div>
      );
    },
  },
  {
    key: "updatedAt",
    label: "Son Güncelleme",
    sortable: true,
    width: "150px",
    render: (value) => (
      <div className="flex flex-col">
        <span className="text-sm">
          {new Date(String(value)).toLocaleDateString("tr-TR")}
        </span>
        <span className="text-[11px] opacity-50">
          {new Date(String(value)).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
  },
  ...(canEdit
    ? [
        {
          key: "action",
          label: "",
          width: "80px",
          render: (_: unknown, row: LegalPageRow) => (
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => onEdit(row.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-blue-500/10"
                style={{ color: "var(--text-muted)" }}
                title="Düzenle"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onRemove(row.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: "var(--text-muted)" }}
                title="Sil"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ),
        },
      ]
    : []),
];