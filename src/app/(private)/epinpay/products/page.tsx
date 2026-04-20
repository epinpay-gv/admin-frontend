"use client";
import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { useProducts, ProductEditModal } from "@/features/products";
import {
  Product,
  PRODUCT_STATUS,
  ProductFilters,
} from "@/features/products/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterValue } from "@/components/common/filter-panel/types";
import ForbiddenCountriesModal from "@/features/products/components/products/ForbiddenCountriesModal";
import { PRODUCT_FILTER_CONFIG } from "@/features/products/hooks/ProductFilterConfig";
import { PRODUCT_COLUMNS } from "@/features/products/components/products/ProductTableConfig";
import ProductsHeaderAction from "@/features/products/components/products/ProductsHeaderAction";

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: PRODUCT_STATUS.ACTIVE },
  { label: "Pasif", value: PRODUCT_STATUS.INACTIVE },
];

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const {
    products,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
    goToPage,
  } = useProducts();

  const [editModal, setEditModal] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState<Product | null>(null);

  const columns = useMemo(() => PRODUCT_COLUMNS(setForbiddenModal, setEditModal), []);

  const handleStatusChange = (status: string) => {
    setFilters({ status: status === "all" ? undefined : status });
  };

  const hasActiveFilters = Object.entries(filters || {}).some(
    ([_, value]) => value && value !== "all" && value !== "",
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Ürünler"
        count={pagination.total}
        countLabel="ürün"
        actions={
          <ProductsHeaderAction
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
            configs={PRODUCT_FILTER_CONFIG}
            initialFilters={filters as unknown as Record<string, FilterValue>}
            onApply={(data) => setFilters(data as unknown as ProductFilters)}
            onReset={resetFilters}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-10">
          <DataTable
            data={products as unknown as Record<string, unknown>[]}
            columns={columns}
            showStatusFilter={false}
            statusOptions={STATUS_OPTIONS}
            currentStatus={String(filters.status || "all")}
            onStatusChange={handleStatusChange}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => router.push(`/epinpay/products/${row.id}`)}
                extraActions={[
                  {
                    icon: <Copy size={13} />,
                    title: "Kopyasını Oluştur",
                    onClick: () =>
                      router.push(`/epinpay/products/copy-${row.id}`),
                  },
                ]}
              />
            )}
          />
        </div>
      </PageState>

      <ProductEditModal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        product={editModal}
      />

      <ForbiddenCountriesModal
        open={!!forbiddenModal}
        onClose={() => setForbiddenModal(null)}
        product={forbiddenModal}
        onUpdate={() => {
          setForbiddenModal(null);
          refresh();
        }}
      />
    </div>
  );
}