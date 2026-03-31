"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Copy, Plus, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { useProducts, useProductModal, ProductEditModal } from "@/features/products";
import { Product, PRODUCT_STATUS, ProductFilters } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import Spinner from "@/components/common/spinner/Spinner";
import { PALETTE } from "@/lib/status-color";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel"; 
import { FilterValue } from "@/components/common/filter-panel/types";
import ForbiddenCountriesModal from "@/features/products/components/ForbiddenCountriesModal";
import { PRODUCT_FILTER_CONFIG } from "@/features/products/hooks/ProductFilterConfig";
import { PRODUCT_COLUMNS } from "@/features/products/components/ProductTableConfig";

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
  const { products, loading, error, filters, setFilters, resetFilters, refresh } = useProducts();
  const { isOpen, selectedProduct, open, close } = useProductModal();
  const [showFilters, setShowFilters] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState<Product | null>(null);  
  const columns = useMemo(() => PRODUCT_COLUMNS(setForbiddenModal), []);
  const hasActiveFilters = Object.entries(filters || {}).some(
    ([_, value]) => value && value !== "all" && value !== ""
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Ürün Yönetimi"
        count={products.length}
        countLabel="ürün"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh} className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              className="relative px-4"
              style={{ 
                backgroundColor: showFilters || hasActiveFilters  ? "rgba(0, 198, 162, 0.1)" : "",
                color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                borderColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "" 
              }}
            >
              <Filter size={14} className="mr-2" />
              Filtrele
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]"
                  />
                )}
              </AnimatePresence>
            </Button>

            <Button
              onClick={() => router.push("/epinpay/products/new")}
              className="text-white"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
            >
              <Plus size={18} className="mr-2" />
              Yeni Ürün Ekle
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            key="product-filter-panel"
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
            actions={(row) => (
               <EntityActions
              row={row}
              onEdit={() => open(row as unknown as Product)}
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
      </PageState>

      <ProductEditModal open={isOpen} onClose={close} product={selectedProduct} />
      
      <ForbiddenCountriesModal
        open={!!forbiddenModal}
        onClose={() => setForbiddenModal(null)}
        product={forbiddenModal}
        onUpdate={() => {
            setForbiddenModal(null);
            refresh(); // Güncelleme sonrası veriyi yenile
        }}
      />
    </div>
  );
}