"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Eye, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { 
  useCategories, 
  CategoryEditModal, 
  CategoryCountryStatusModal, 
  CategoryProductsModal, 
  CATEGORY_STATUS 
} from "@/features/categories";
import { Category, CategoryFilters } from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterValue } from "@/components/common/filter-panel/types";
import { CATEGORY_COLUMNS } from "@/features/categories/components/CategoryTableConfig";
import { CATEGORY_FILTER_CONFIG } from "@/features/categories/hooks/CategoryFilterConfig";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: CATEGORY_STATUS.ACTIVE },
  { label: "Pasif", value: CATEGORY_STATUS.INACTIVE },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, loading, error, filters, setFilters, resetFilters, refresh, updateCategory } = useCategories();
  
  const [showFilters, setShowFilters] = useState(false);
  const [countryModal, setCountryModal] = useState<Category | null>(null);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [productsModal, setProductsModal] = useState<Category | null>(null);

  const columns = useMemo(() => 
    (CATEGORY_COLUMNS(setProductsModal, setCountryModal) as unknown) as ColumnDef<Record<string, unknown>>[], 
  []);

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ 
      ...prev, 
      status: status === "all" ? "" : status 
    }));
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && v !== "" && k !== "status");

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Kategoriler"
        count={categories.length}
        countLabel="kategori"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={refresh} title="Yenile" className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)} className="relative px-4"   style={{ 
                backgroundColor: showFilters ? "rgba(0, 198, 162, 0.1)" : "transparent",
                color: showFilters ? "#00C6A2" : "var(--text-muted)" 
              }}>
              <Filter size={14} className="mr-2" /> Filtre
              {hasActiveFilters && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00C6A2] rounded-full border-2 border-white" />
              )}
            </Button>
            <Button onClick={() => router.push("/epinpay/categories/new")} className="text-white bg-linear-to-r from-[#00C6A2] to-[#0085FF]">
              <Plus size={18} className="mr-1" /> Yeni Kategori Ekle
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={CATEGORY_FILTER_CONFIG}
            initialFilters={(filters as unknown) as Record<string, FilterValue>}
            onApply={(data) => setFilters((data as unknown) as CategoryFilters)}
            onReset={resetFilters}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={(categories as unknown) as Record<string, unknown>[]}
            columns={columns} 
            showStatusFilter={true}
            statusOptions={STATUS_OPTIONS}
            // GÖRSEL SENKRONİZASYON: filters.status değerini gönderiyoruz
            currentStatus={String(filters.status || "all")} 
            onStatusChange={handleStatusChange}
            actions={(row) => {
              const c = (row as unknown) as Category;
              return (
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => setEditModal(c)} className="w-8 h-8 rounded-lg flex items-center justify-center border hover:border-[#00C6A2] bg-(--background-card) transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => router.push(`/epinpay/categories/${c.id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center border hover:border-[#00C6A2] bg-(--background-card) transition-colors"><Eye size={13} /></button>
                </div>
              );
            }}
          />
        </div>
      </PageState>

      {/* Modallar */}
      <CategoryCountryStatusModal open={!!countryModal} onClose={() => setCountryModal(null)} category={countryModal} onUpdate={(u) => { updateCategory(u); setCountryModal(null); }} />
      <CategoryEditModal open={!!editModal} onClose={() => setEditModal(null)} category={editModal} onUpdate={(u) => { updateCategory(u); setEditModal(null); }} />
      <CategoryProductsModal open={!!productsModal} onClose={() => setProductsModal(null)} category={productsModal} />
    </div>
  );
}