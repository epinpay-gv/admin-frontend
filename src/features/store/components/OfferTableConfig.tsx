import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { OfferListItem, OFFER_STATUS, OFFER_TYPE } from "@/features/store/types";
import { PALETTE } from "@/lib/status-color";

export const STATUS_LABELS: Record<string, string> = {
  [OFFER_STATUS.ACTIVE]: "Aktif",
  [OFFER_STATUS.INACTIVE]: "Pasif",
  [OFFER_STATUS.SOLD_OUT]: "Tükendi",
  [OFFER_STATUS.DELETED]: "Silindi",
};
type PaletteColor = typeof PALETTE[keyof typeof PALETTE];
export const STATUS_COLORS: Record<string, PaletteColor> = {
  [OFFER_STATUS.ACTIVE]: PALETTE.green,
  [OFFER_STATUS.INACTIVE]: PALETTE.red,
  [OFFER_STATUS.SOLD_OUT]: PALETTE.yellow,
  [OFFER_STATUS.DELETED]: PALETTE.red,
};

export const TYPE_LABELS: Record<string, string> = {
  [OFFER_TYPE.NORMAL]: "Stoklu",
  [OFFER_TYPE.DROPSHIPPING]: "Stoksuz",
  [OFFER_TYPE.TOP_UP]: "Top-Up",
};

export const TYPE_COLORS: Record<string, PaletteColor> = {
  [OFFER_TYPE.NORMAL]: PALETTE.blue,
  [OFFER_TYPE.DROPSHIPPING]: PALETTE.yellow,
  [OFFER_TYPE.TOP_UP]: PALETTE.purple,
};

export type OfferRow = OfferListItem & Record<string, unknown>;

export const OFFER_COLUMNS: ColumnDef<OfferRow>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    width: "100px",
    render: (value) => (
      <span
        className="font-mono text-[11px]"
        style={{ color: "var(--text-muted)" }}
        title={String(value)}
      >
        {String(value).slice(0, 8)}…
      </span>
    ),
  },
  {
    key: "product_id",
    label: "Ürün ID",
    sortable: true,
    width: "90px",
    render: (value) => (
      <span className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
        #{String(value)}
      </span>
    ),
  },
  {
    key: "store_id",
    label: "Mağaza",
    sortable: true,
    width: "150px",
    render: (value, row) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {row.store_name || "—"}
        </span>
        <span
          className="font-mono text-[10px]"
          style={{ color: "var(--text-muted)" }}
          title={String(value)}
        >
          {String(value).slice(0, 8)}…
        </span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Tip",
    sortable: true,
    render: (value) => {
      const typeStr = String(value);
      const colors = TYPE_COLORS[typeStr] ?? PALETTE.blue;
      return (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
          style={{ background: colors.bg, color: colors.color }}
        >
          {TYPE_LABELS[typeStr] ?? typeStr}
        </span>
      );
    },
  },
  {
    key: "amount",
    label: "Fiyat",
    sortable: true,
    render: (value, row) => {
      if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      return (
        <div className="flex items-center gap-1">
          <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
            {Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            {row.currency_code ?? row.currency_id}
          </span>
        </div>
      );
    },
  },
  {
    key: "_count",
    label: "Stok",
    render: (_, row) => {
      const count = (row._count as { stocks?: number })?.stocks;
      const type = row.type as string;
      if (type !== OFFER_TYPE.NORMAL) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      const isEmpty = count === 0 || count === undefined;
      return (
        <span
          className="font-mono text-sm font-medium"
          style={{ color: isEmpty ? PALETTE.red.color : "var(--text-primary)" }}
        >
          {count ?? 0}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const statusStr = String(value);
      const colors = STATUS_COLORS[statusStr] ?? PALETTE.red;
      return (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
          style={{ background: colors.bg, color: colors.color }}
        >
          {STATUS_LABELS[statusStr] ?? statusStr}
        </span>
      );
    },
  },
];