"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, Plus, ShieldOff, Shield } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table";
import { useProducts, useProductModal, ProductEditModal } from "@/features/products";
import { Product, PRODUCT_STATUS } from "@/features/products";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ForbiddenCountriesModal from "@/features/products/components/ForbiddenCountriesModal";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import Spinner from "@/components/common/spinner/Spinner";
import { PALETTE } from "@/lib/status-color";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

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
type ProductRow = Product & Record<string, unknown>;

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE },
  { label: "Taslak", value: PRODUCT_STATUS.DRAFT },
];

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error } = useProducts();
  const { isOpen, selectedProduct, open, close } = useProductModal();
  const [forbiddenModal, setForbiddenModal] = useState<Product | null>(null);

  const COLUMNS: ColumnDef<ProductRow>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      searchable: true,
      width: "60px",
    },
    {
      key: "translation",
      label: "Ürün",
      sortable: true,
      searchable: true,
      searchKey: "translation.name",
      sortKey: "translation.name",
      render: (_, row) => {
        const translation = row.translation as Product["translation"];
        return (
          <div className="flex min-w-50 items-center gap-3">

            <div
              className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border"
              style={{ background: "var(--background-secondary)" }}
            >

              <Image
                src={translation.imgUrl}
                alt={translation.imgAlt}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {translation.name}
              </p>
              <p className="text-[11px] font-mono opacity-60 truncate" style={{ color: "var(--text-muted)" }}>
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
      sortable: true,
      searchable: true,
      searchKey: "category.name",
      sortKey: "category.name",
      render: (_, row) => {
        const category = row.category as Product["category"];
        if (!category) return <span style={{ color: "var(--text-muted)" }}>-</span>;
        return (
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-md"
            style={{
              background: "var(--background-secondary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
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
        <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
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
              setForbiddenModal(row as Product);
            }}
            className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: hasForbidden ? PALETTE.red.bg : "var(--background-secondary)",
              color: hasForbidden ? PALETTE.red.color : "var(--text-muted)",
              border: `1px solid ${hasForbidden ? PALETTE.red.color + "33" : "var(--border)"}`,
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
      sortable: true,
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

  return (
    <PageState loading={loading} error={error} >
      <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
        <PageHeader
          title="Ürünler"
          count={products.length}
          countLabel="ürün"
          actions={
              <Button
              onClick={() => router.push("/epinpay/products/new")}
              className="text-white flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
              >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-semibold text-sm">Yeni Ürün Ekle</span>
              </Button>
          }
            />
        
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={products as ProductRow[]}
            columns={COLUMNS}
            showStatusFilter
            statusOptions={STATUS_OPTIONS}
            actions={(row) => (
               <EntityActions
              row={row}
              onEdit={() => open(row as Product)}
              onView={() => router.push(`/epinpay/products/${row.id}`)}
              extraActions={[
                {
                  icon: <Copy size={13} />,
                  title: "Kopyasını Oluştur",
                  onClick: () => router.push(`/epinpay/products/copy-${row.id}`),
                },
              ]}
            />
            )}
          />
        </div>
        
        <ProductEditModal
          open={isOpen}
          onClose={close}
          product={selectedProduct}
        />

        <ForbiddenCountriesModal
          open={!!forbiddenModal}
          onClose={() => setForbiddenModal(null)}
          product={forbiddenModal}
          onUpdate={() => setForbiddenModal(null)}
        />
      </div>
    </PageState>
  );
}