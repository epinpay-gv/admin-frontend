"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Copy, Plus, ShieldOff, Package, Eye } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table";
import { useCategories, CategoryEditModal, CategoryCountryStatusModal, CategoryProductsModal, CATEGORY_STATUS } from "@/features/categories";
import { Category } from "@/features/categories";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import Image from "next/image";
import Spinner from "@/components/common/spinner/Spinner";
import { PageState } from "@/components/common/page-state/PageState";


const STATUS_LABELS: Record<CATEGORY_STATUS, string> = {
  [CATEGORY_STATUS.ACTIVE]: "Aktif",
  [CATEGORY_STATUS.INACTIVE]: "Pasif",
};

const STATUS_COLORS: Record<CATEGORY_STATUS, { bg: string; color: string }> = {
  [CATEGORY_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [CATEGORY_STATUS.INACTIVE]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: CATEGORY_STATUS.ACTIVE },
  { label: "Pasif", value: CATEGORY_STATUS.INACTIVE },
];

type CategoryRow = Category & Record<string, unknown>;

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, loading, error, updateCategory } = useCategories();
  const [countryModal, setCountryModal] = useState<Category | null>(null);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [productsModal, setProductsModal] = useState<Category | null>(null);

  const COLUMNS: ColumnDef<CategoryRow>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      width: "60px",
    },
    {
      key: "image",
      label: "Ürün",
      sortable: true,
      searchable: true,
      searchKey: "translation.name",
      sortKey: "translation.name",
      render: (_, row) => {
        const translation = row.translation as Category["translation"];
        return (
          <div className="flex min-w-[200px] items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]"
              style={{ background: "var(--background-secondary)" }}
            >
              <Image
                src={translation.imgUrl || ""}
                alt={translation.imgAlt || "Kategori Görseli"}
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
      key: "translation",
      label: "Kategori",
      sortable: true,
      searchable: true,
      searchKey: "translation.name",
      sortKey: "translation.name",
      render: (_, row) => {
        const translation = row.translation as Category["translation"];
        return (
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {translation.name}
            </p>
            <p
              className="text-[11px] font-mono mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {translation.slug}
            </p>
          </div>
        );
      },
    },
    {
      key: "productCount",
      label: "Ürün Sayısı",
      sortable: true,
      render: (value, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProductsModal(row as Category);
          }}
          className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg transition-all"
          style={{
            background: "var(--background-secondary)",
            color: "#0085FF",
            border: "1px solid rgba(0,133,255,0.2)",
          }}
        >
          <Package size={11} />
          {String(value)} ürün
        </button>
      ),
    },
    {
      key: "forbiddenCountries",
      label: "Ülke Durumu",
      render: (_, row) => {
        const forbidden = row.forbiddenCountries as Category["forbiddenCountries"];
        const hasForbidden = forbidden.length > 0;

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCountryModal(row as Category);
            }}
            className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg transition-all"
            style={{
              background: hasForbidden
                ? "rgba(255,80,80,0.1)"
                : "rgba(0,198,162,0.1)",
              color: hasForbidden ? "#FF5050" : "#00C6A2",
              border: `1px solid ${hasForbidden ? "rgba(255,80,80,0.2)" : "rgba(0,198,162,0.2)"}`,
            }}
          >
            <ShieldOff size={11} />
            {hasForbidden ? `${forbidden.length} ülke kısıtlı` : "Tüm ülkeler aktif"}
          </button>
        );
      },
    },
    {
      key: "status",
      label: "Durum",
      sortable: true,
      render: (value) => {
        const status = value as CATEGORY_STATUS;
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



  return (
    <PageState 
      loading={loading}
      error={error}      
    >
      <div>
        {/* Üst bar */}
        <PageHeader
          title="Kategoriler"
          count={categories.length}
          countLabel="kategori"
          actions={
              <Button
              onClick={() => router.push("/epinpay/categories/new")}
              className="text-white flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
              >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-semibold text-sm">Yeni Kategori Ekle</span>
              </Button>
          }
      />

        <DataTable
          data={categories as CategoryRow[]}
          columns={COLUMNS}
          showStatusFilter
          statusOptions={STATUS_OPTIONS}
          actions={(row) => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => setEditModal(row as Category)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                title="Hızlı Düzenle"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => router.push(`/epinpay/categories/copy-${row.id}`)}
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
                onClick={() => router.push(`/epinpay/categories/${row.id}`)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                title="Düzenle"
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

        <CategoryCountryStatusModal
          open={!!countryModal}
          onClose={() => setCountryModal(null)}
          category={countryModal}
          onUpdate={(updated) => {
            updateCategory(updated);
            setCountryModal(null);
          }}
        />

        <CategoryEditModal
          open={!!editModal}
          onClose={() => setEditModal(null)}
          category={editModal}
          onUpdate={(updated) => {
            updateCategory(updated);
            setEditModal(null);
          }}
        />

        <CategoryProductsModal
          open={!!productsModal}
          onClose={() => setProductsModal(null)}
          category={productsModal}
        />
      </div>
    </PageState>
  );
}