import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Redirect } from "@/features/redirect/types";
import { Trash2, ArrowRight } from "lucide-react";


export type RedirectRow = Record<string, unknown>;

export const REDIRECT_COLUMNS = (
  onRemove: (id: number) => void,
  canEdit: boolean
): ColumnDef<RedirectRow>[] => [
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
    key: "url_from",
    label: "Yönlendirme",
    render: (_, row) => {
      const redirect = row as unknown as Redirect;
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-mono px-2 py-0.5 rounded"
            style={{
              background: "rgba(255,80,80,0.08)",
              color: "#FF5050",
            }}
          >
            {redirect.url_from}
          </span>
          <ArrowRight
            size={13}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <span
            className="text-sm font-mono px-2 py-0.5 rounded"
            style={{
              background: "rgba(0,198,162,0.08)",
              color: "#00C6A2",
            }}
          >
            {redirect.url_to}
          </span>
        </div>
      );
    },
  },
  {
    key: "createdAt",
    label: "Tarih",
    sortable: true,
    width: "140px",
    render: (value) => {
      if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      const date = new Date(String(value));
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {date.toLocaleDateString("tr-TR")}
          </span>
          <span className="text-[11px] opacity-50">
            {date.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  ...(canEdit
    ? [
        {
          key: "action",
          label: "",
          width: "56px",
          render: (_: unknown, row: RedirectRow) => {
            const redirect = row as unknown as Redirect;
            return (
              <button
                onClick={() => onRemove(redirect.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: "var(--text-muted)" }}
                title="Sil"
              >
                <Trash2 size={14} />
              </button>
            );
          },
        },
      ]
    : []),
];