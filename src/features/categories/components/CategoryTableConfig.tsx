import Image from "next/image";
import { ShieldOff, Package } from "lucide-react";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Category, CATEGORY_STATUS } from "../types";

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
  setCountryModal: (c: Category) => void
): ColumnDef<Record<string, unknown>>[] => [
  { 
    key: "id", 
    label: "ID", 
    sortable: true, 
    width: "60px" 
  },
  {
    key: "image",
    label: "Görsel",
    render: (_, row) => {
      // Record'u Category tipine güvenli şekilde dönüştürüyoruz
      const c = (row as unknown) as Category;
      return (
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-(--background-secondary)">
          <Image
            src={c.translation.imgUrl || "/placeholder.png"}
            alt={c.translation.imgAlt || "Kategori"}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            // Boş string hatasını engellemek için fallback
            priority={false}
          />
        </div>
      );
    },
  },
  {
    key: "translation",
    label: "Kategori",
    sortable: true,
    render: (_, row) => {
      const c = (row as unknown) as Category;
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate text-(--text-primary)">
            {c.translation.name}
          </p>
          <p className="text-[11px] font-mono opacity-60 truncate text-(--text-muted)">
            {c.translation.slug}
          </p>
        </div>
      );
    },
  },
  {
    key: "productCount",
    label: "Ürün Sayısı",
    sortable: true,
    render: (value, row) => {
      const c = (row as unknown) as Category;
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProductsModal(c);
          }}
          className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border border-[rgba(0,133,255,0.2)] text-[#0085FF] bg-(--background-secondary) hover:bg-[rgba(0,133,255,0.05)] transition-colors"
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
      const c = (row as unknown) as Category;
      const hasForbidden = c.forbiddenCountries && c.forbiddenCountries.length > 0;
      
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCountryModal(c);
          }}
          className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
            hasForbidden 
              ? "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)] hover:bg-[rgba(255,80,80,0.15)]" 
              : "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)] hover:bg-[rgba(0,198,162,0.15)]"
          }`}
        >
          <ShieldOff size={11} />
          {hasForbidden ? `${c.forbiddenCountries.length} ülke kısıtlı` : "Tüm ülkeler aktif"}
        </button>
      );
    },
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (val) => {
      const status = val as CATEGORY_STATUS;
      const isActive = status === CATEGORY_STATUS.ACTIVE;
      
      return (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
            isActive 
              ? "bg-[rgba(0,198,162,0.15)] text-[#00C6A2]" 
              : "bg-[rgba(255,80,80,0.15)] text-[#FF5050]"
          }`}
        >
          {STATUS_LABELS[status] || status}
        </span>
      );
    },
  },
];