import Image from "next/image";
import { ShieldOff } from "lucide-react";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Product, PRODUCT_STATUS } from "@/features/products/types";
import { PALETTE } from "@/lib/status-color";

const STATUS_LABELS: Record<PRODUCT_STATUS, string> = {
  [PRODUCT_STATUS.ACTIVE]: "Aktif",
  [PRODUCT_STATUS.INACTIVE]: "Pasif",
  [PRODUCT_STATUS.DRAFT]: "Taslak",
};

const STATUS_COLORS = {
  [PRODUCT_STATUS.ACTIVE]: PALETTE.green,
  [PRODUCT_STATUS.INACTIVE]: PALETTE.red,
  [PRODUCT_STATUS.DRAFT]: PALETTE.yellow,
};

export const PRODUCT_COLUMNS = (
  setForbiddenModal: (p: Product) => void
): ColumnDef<Record<string, unknown>>[] => [
  {
    key: "id",
    label: "ID",
    sortable: true,
    width: "60px",
  },
  {
    key: "translation",
    label: "Ürün",
    render: (_, row) => {
      const translation = row.translation as Product["translation"];
      return (
        <div className="flex min-w-50 items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] bg-[var(--background-secondary)]">
            <Image
              src={translation.imgUrl}
              alt={translation.imgAlt}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-[var(--text-primary)]">
              {translation.name}
            </p>
            <p className="text-[11px] font-mono opacity-60 truncate text-[var(--text-muted)]">
              {translation.slug}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "category",
    label: "Kategori",
    render: (_, row) => {
      const category = row.category as Product["category"];
      if (!category) return <span className="text-[var(--text-muted)]">-</span>;
      return (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--text-secondary)]">
          {category.name}
        </span>
      );
    },
  },
  {
    key: "basePrice",
    label: "Fiyat",
    sortable: true,
    render: (value) => (
      <span className="font-mono text-sm text-[var(--text-secondary)]">
        ₺ {Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "forbiddenCountries",
    label: "Kısıtlama",
    render: (_, row) => {
      const forbidden = row.forbiddenCountries as Product["forbiddenCountries"];
      const hasForbidden = forbidden?.length > 0;
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setForbiddenModal(row as unknown as Product);
          }}
          className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95 border"
          style={{
            background: hasForbidden ? PALETTE.red.bg : "var(--background-secondary)",
            color: hasForbidden ? PALETTE.red.color : "var(--text-muted)",
            borderColor: hasForbidden ? `${PALETTE.red.color}33` : "var(--border)",
          }}
        >
          <ShieldOff size={11} />
          {hasForbidden ? `${forbidden.length} Ülke` : "Kısıtlama Yok"}
        </button>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    render: (value) => {
      const status = value as PRODUCT_STATUS;
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