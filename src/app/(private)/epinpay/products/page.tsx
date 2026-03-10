"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Copy, Plus, ShieldOff } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table";
import { useProducts, useProductModal, ProductEditModal } from "@/features/products";
import { Product, PRODUCT_STATUS } from "@/features/products";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ForbiddenCountriesModal from "@/features/products/components/ForbiddenCountriesModal";

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
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
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
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {translation.name}
              </p>
              <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
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
            className="text-xs font-mono px-2 py-0.5 rounded-lg"
            style={{
              background: "var(--background-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            {category.name}
          </span>
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
      key: "basePrice",
      label: "Fiyat",
      sortable: true,
      render: (value) => (
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>
          ₺ {Number(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: "totalStock",
      label: "Stok",
      sortable: true,
      render: (value) => (
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "forbiddenCountries",
      label: "Kısıtlama",
      render: (_, row) => {
        const forbidden = row.forbiddenCountries as Product["forbiddenCountries"];
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setForbiddenModal(row as Product);
            }}
            className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg transition-colors"
            style={{
              background: forbidden.length > 0
                ? "rgba(255,80,80,0.1)"
                : "var(--background-secondary)",
              color: forbidden.length > 0 ? "#FF5050" : "var(--text-muted)",
              border: `1px solid ${forbidden.length > 0 ? "rgba(255,80,80,0.2)" : "var(--border)"}`,
            }}
          >
            <ShieldOff size={11} />
            {forbidden.length > 0 ? `${forbidden.length} ülke` : "Kısıtlama yok"}
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
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: colors.bg, color: colors.color }}
          >
            {STATUS_LABELS[status]}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">{error}</p>
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
          style={{ color: "var(--text-muted)" }}
        >
          Tekrar dene
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Üst bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Ürünler
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {products.length} ürün listeleniyor
          </p>
        </div>
        <Button
          onClick={() => router.push("/epinpay/products/new")}
          className="text-white flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          <Plus size={14} />
          Yeni Ürün
        </Button>
      </div>

      <DataTable
        data={products as ProductRow[]}
        columns={COLUMNS}
        showStatusFilter
        statusOptions={STATUS_OPTIONS}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => router.push(`/epinpay/products/${row.id}`)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              title="Düzenle"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => router.push(`/epinpay/products/copy-${row.id}`)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              title="Kopyala"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Copy size={13} />
            </button>
            <button
              onClick={() => router.push(`/epinpay/products/${row.id}`)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              title="Detay"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Eye size={13} />
            </button>
          </div>
        )}
      />

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
  );
}