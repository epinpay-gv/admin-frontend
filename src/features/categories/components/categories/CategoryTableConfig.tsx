import Image from "next/image";
import { ShieldOff, Package } from "lucide-react";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Category, CATEGORY_STATUS } from "../../types";

const STATUS_LABELS: Record<CATEGORY_STATUS, string> = {
  [CATEGORY_STATUS.ACTIVE]: "Aktif",
  [CATEGORY_STATUS.INACTIVE]: "Pasif",
};

/**
 * Kategori tablosu sütun yapılandırması.
 * @param setProductsModal Ürünler modalını açan fonksiyon
 * @param setCountryModal Ülke kısıtlamaları modalını açan fonksiyon
 */
export const CATEGORY_COLUMNS = (
  setProductsModal: (c: Category) => void,
  setCountryModal: (c: Category) => void,
  setEditModal: (c: Category) => void,
): ColumnDef<Record<string, unknown>>[] => [
  {
    key: "id",
    label: "ID",
    width: "60px",
  },

  {
    key: "translation",
    label: "Kategori",
    render: (_, row) => {
      const c = row as unknown as Category;
      return (
        <div className="flex min-w-50 items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border bg-(--background-secondary)">
            <Image
              src={c.translation.imgUrl || "/placeholder.png"}
              alt={c.translation.imgAlt || "Kategori"}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-medium truncate text-(--text-primary)">
              {c.translation.name}
            </p>
            <p className="font-mono opacity-60 truncate text-(--text-muted)">
              {c.slug}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "productCount",
    label: "Ürün Sayısı",
    render: (value, row) => {
      const c = row as unknown as Category;
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProductsModal(c);
          }}
          className="cursor-pointer flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border border-[rgba(0,133,255,0.2)] text-[#0085FF] bg-(--background-secondary) hover:bg-[rgba(0,133,255,0.05)] transition-colors"
        >
          <Package size={11} />
          {String(value)} ürün
        </button>
      );
    },
  },
  {
    key: "forbiddenCountries",
    label: "Ülke Durumu",
    render: (_, row) => {
      const c = row as unknown as Category;
      const hasForbidden =
        c.forbiddenCountries && c.forbiddenCountries.length > 0;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCountryModal(c);
          }}
          className={`cursor-pointer flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
            hasForbidden
              ? "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)] hover:bg-[rgba(255,80,80,0.15)]"
              : "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)] hover:bg-[rgba(0,198,162,0.15)]"
          }`}
        >
          <ShieldOff size={11} />
          {hasForbidden
            ? `${c.forbiddenCountries.length} ülke kısıtlı`
            : "Tüm ülkeler aktif"}
        </button>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    render: (_, row) => {
      const c = row as unknown as Category;
      const isActive = c.status === CATEGORY_STATUS.ACTIVE;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditModal(c);
          }}
          className={`cursor-pointer text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
            isActive
              ? "bg-[rgba(0,198,162,0.15)] border-[rgba(0,198,162,0.2)] text-[#00C6A2]"
              : "bg-[rgba(255,80,80,0.15)] border-[rgba(255,80,80,0.2)] text-[#FF5050]"
          }`}
        >
          {STATUS_LABELS[c.status]}
        </button>
      );
    },
  },
];
