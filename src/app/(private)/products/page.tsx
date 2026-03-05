"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table";
import { useProducts } from "@/features/products";
import { Product, PRODUCT_STATUS } from "@/features/products";

const STATUS_LABELS: Record<PRODUCT_STATUS, string> = {
  [PRODUCT_STATUS.ACTIVE]: "Aktif",
  [PRODUCT_STATUS.INACTIVE]: "Pasif",
  [PRODUCT_STATUS.DRAFT]: "Taslak",
};

const STATUS_COLORS: Record<PRODUCT_STATUS, { bg: string; color: string }> = {
  [PRODUCT_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [PRODUCT_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [PRODUCT_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

type ProductRow = Product & Record<string, unknown>;

const COLUMNS: ColumnDef<ProductRow>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    searchable: true,
    width: "80px",
  },
  {
    key: "translation",
    label: "Ürün",
    sortable: true,
    searchable: true,
    searchKey: "translation.name",
    sortKey: "translation.name",
    render: (value, row) => {
      const translation = row.translation as Product["translation"];
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
            <Image
              src={translation.imgUrl}
              alt={translation.imgAlt}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium min-w-32 text-white/80">{translation.name}</p>
            <p className="text-[11px] text-white/30 font-mono">{translation.slug}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "platform",
    label: "Platform",
    sortable: true,
    searchable: true,
  },
  {
    key: "region",
    label: "Bölge",
    sortable: true,
    searchable: true,
  },
  {
    key: "basePrice",
    label: "Fiyat",
    sortable: true,
    render: (value) => (
      <span className="font-mono text-white/70">₺ {Number(value).toFixed(2)}</span>
    ),
  },
  {
    key: "discountRate",
    label: "İndirim",
    sortable: true,
    render: (value) => (
      <span
        className="font-mono text-[11px] px-2 py-0.5 rounded-full"
        style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
      >
        %{String(value)}
      </span>
    ),
  },
  {
    key: "totalStock",
    label: "Stok",
    sortable: true,
    render: (value) => (
      <span className="font-mono text-white/60">{String(value)}</span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as PRODUCT_STATUS;
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
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE },  
];

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-[#00C6A2] rounded-full animate-spin" />
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Ürünler</h1>
        <p className="text-sm text-white/40 mt-1">Tüm ürünleri yönet.</p>
      </div>

      <DataTable
        data={products as ProductRow[]}
        columns={COLUMNS}
        showStatusFilter
        statusOptions={STATUS_OPTIONS}
        actions={(row) => (
            <button
            onClick={() => router.push(`/products/${row.id}`)}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-white/10"
            style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
            }}
            >
            <Eye size={14} />
            </button>
        )}
        />
    </div>
  );
}