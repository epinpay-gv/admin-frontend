"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Copy, Plus, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { useProducts, useProductModal, ProductEditModal } from "@/features/products";
import { Product, ProductFilters } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel"; 
import { FilterValue } from "@/components/common/filter-panel/types";
import ForbiddenCountriesModal from "@/features/products/components/ForbiddenCountriesModal";
import { PRODUCT_FILTER_CONFIG } from "@/features/products/hooks/ProductFilterConfig";
import { PRODUCT_COLUMNS } from "@/features/products/components/ProductTableConfig";

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error, filters, setFilters, resetFilters, refresh } = useProducts();
  const { isOpen, selectedProduct, open, close } = useProductModal();
  
  const [showFilters, setShowFilters] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState<Product | null>(null);

  // Sütunları memoize ediyoruz, modal state değişiminde tablo titremesin
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
            <Button variant="ghost" onClick={refresh} className="text-[var(--text-muted)]">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowFilters((v) => !v)}
              className="relative px-4"
              style={{ 
                backgroundColor: showFilters ? "rgba(0, 198, 162, 0.1)" : "transparent",
                color: showFilters ? "#00C6A2" : "var(--text-muted)" 
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
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => open(row as unknown as Product)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[#00C6A2] transition-all"
                  title="Hızlı Düzenle"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => router.push(`/epinpay/products/copy-${row.id}`)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[#00C6A2] transition-all"
                  title="Kopyala"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => router.push(`/epinpay/products/${String(row.id)}`)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[#00C6A2] transition-all"
                  title="Detay"
                >
                  <Eye size={14} />
                </button>
              </div>
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