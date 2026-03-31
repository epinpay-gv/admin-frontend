import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { OfferListItem, OFFER_STATUS, DELIVERY_TYPE } from "@/features/store/types";
import { PALETTE } from "@/lib/status-color";

export const STATUS_LABELS: Record<OFFER_STATUS, string> = {
  [OFFER_STATUS.ACTIVE]: "Aktif",
  [OFFER_STATUS.PASSIVE]: "Pasif",
  [OFFER_STATUS.DRAFT]: "Taslak",
};

export const STATUS_COLORS = {
  [OFFER_STATUS.ACTIVE]: PALETTE.green,
  [OFFER_STATUS.PASSIVE]: PALETTE.red,
  [OFFER_STATUS.DRAFT]: PALETTE.yellow,
};

export const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.AUTOMATIC]: "Otomatik",
  [DELIVERY_TYPE.ID_UPLOAD]: "ID Yükleme",
  [DELIVERY_TYPE.DROPSHIPPING]: "Stoksuz",
};

export const DELIVERY_COLORS = {
  [DELIVERY_TYPE.AUTOMATIC]: PALETTE.blue,
  [DELIVERY_TYPE.ID_UPLOAD]: PALETTE.purple,
  [DELIVERY_TYPE.DROPSHIPPING]: PALETTE.yellow,
};

export type OfferRow = OfferListItem & Record<string, unknown>;

export const OFFER_COLUMNS: ColumnDef<OfferRow>[] = [
  { key: "id", label: "ID", sortable: true, width: "60px" },
  {
    key: "productName",
    label: "Ürün",
    sortable: true,
    render: (value) => (
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: "deliveryType",
    label: "Teslimat",
    sortable: true,
    render: (value) => {
      const type = value as DELIVERY_TYPE;
      const colors = DELIVERY_COLORS[type];
      return (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
          style={{ background: colors.bg, color: colors.color }}
        >
          {DELIVERY_LABELS[type]}
        </span>
      );
    },
  },
  {
    key: "price",
    label: "Fiyat",
    sortable: true,
    sortKey: "price.amount",
    render: (_, row) => {
      const price = row.price as OfferListItem["price"];
      if (!price?.amount) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      return (
        <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
          {price.currency} {price.amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    key: "stock",
    label: "Stok",
    render: (_, row) => {
      const stock = row.stock as OfferListItem["stock"];
      const deliveryType = row.deliveryType as DELIVERY_TYPE;
      if (deliveryType !== DELIVERY_TYPE.AUTOMATIC) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      const isEmpty = !stock || stock.total === 0;
      return (
        <span
          className="font-mono text-sm font-medium"
          style={{ color: isEmpty ? PALETTE.red.color : "var(--text-primary)" }}
        >
          {stock?.total ?? 0}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as OFFER_STATUS;
      const colors = STATUS_COLORS[status];
      return (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
          style={{ background: colors.bg, color: colors.color }}
        >
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
];