"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { AnimatePresence} from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import {
  useCategories,
  CategoryEditModal,
  CategoryCountryStatusModal,
  CategoryProductsModal,
  CATEGORY_STATUS,
} from "@/features/categories";
import { Category, CategoryFilters } from "@/features/categories/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterValue } from "@/components/common/filter-panel/types";
import { CATEGORY_COLUMNS } from "@/features/categories/components/CategoryTableConfig";
import { CATEGORY_FILTER_CONFIG } from "@/features/categories/hooks/CategoryFilterConfig";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import CategoriesHeaderAction from "@/features/categories/components/CategoriesHeaderAction";

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: CATEGORY_STATUS.ACTIVE },
  { label: "Pasif", value: CATEGORY_STATUS.INACTIVE },
];

export default function CategoriesPage() {
  const router = useRouter();
  const {
    categories,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
    updateCategory,
  } = useCategories();

  const [showFilters, setShowFilters] = useState(false);
  const [countryModal, setCountryModal] = useState<Category | null>(null);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [productsModal, setProductsModal] = useState<Category | null>(null);

  const columns = useMemo(
    () =>
      CATEGORY_COLUMNS(
        setProductsModal,
        setCountryModal,
      ) as unknown as ColumnDef<Record<string, unknown>>[],
    [],
  );

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? "" : status,
    }));
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => v && v !== "" && k !== "status",
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Kategoriler"
        count={categories.length}
        countLabel="kategori"
        actions={
          <CategoriesHeaderAction
            refresh={refresh}
            loading={loading}
            setShowFilters={setShowFilters}
            showFilters={showFilters}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={CATEGORY_FILTER_CONFIG}
            initialFilters={filters as unknown as Record<string, FilterValue>}
            onApply={(data) => setFilters(data as unknown as CategoryFilters)}
            onReset={resetFilters}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={categories as unknown as Record<string, unknown>[]}
            columns={columns}
            showStatusFilter={true}
            statusOptions={STATUS_OPTIONS}
            currentStatus={String(filters.status || "all")}
            onStatusChange={handleStatusChange}
            actions={(row) => (
              <EntityActions
                row={row}
                onEdit={() => setEditModal(row as unknown as Category)}
                onView={() => router.push(`/epinpay/categories/${row.id}`)}
                extraActions={[
                  {
                    icon: <Copy size={13} />,
                    title: "Kopyala",
                    onClick: () =>
                      router.push(`/epinpay/categories/copy-${row.id}`),
                  },
                ]}
              />
            )}
          />
        </div>
      </PageState>

      {/* Modallar */}
      <CategoryCountryStatusModal
        open={!!countryModal}
        onClose={() => setCountryModal(null)}
        category={countryModal}
        onUpdate={(u) => {
          updateCategory(u);
          setCountryModal(null);
        }}
      />
      <CategoryEditModal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        category={editModal}
        onUpdate={(u) => {
          updateCategory(u);
          setEditModal(null);
        }}
      />
      <CategoryProductsModal
        open={!!productsModal}
        onClose={() => setProductsModal(null)}
        category={productsModal}
      />
    </div>
  );
}
