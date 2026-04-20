"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { useOffers } from "@/features/store/hooks/useOffers";
import { OFFER_STATUS, OfferFilters } from "@/features/store/types";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/modal/Modal";
import OfferForm from "@/features/store/components/OfferForm";

import { OFFER_COLUMNS, STATUS_LABELS, OfferRow } from "@/features/store/components/OfferTableConfig";
import { OFFER_FILTERS } from "@/features/store/hooks/OfferFilterConfig";

type BaseRow = Record<string, unknown>;

export default function StorePage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OfferFilters>({});

  const { offers, loading, error, pagination, refresh } = useOffers(filters);

  const STATUS_OPTIONS = useMemo(() => [
    { label: "Tümü", value: "all" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value }))
  ], []);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== "all");

  const handleStatusChange = (status: string) => {
    setFilters((prev: OfferFilters) => ({
      ...prev,
      status: status === "all" ? undefined : (status as OFFER_STATUS)
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Epinpay Teklifleri"
        count={pagination?.total ?? offers.length}
        countLabel="teklif"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refresh?.()} disabled={loading} title="Yenile" className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="relative px-4"
              style={{ 
                backgroundColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
                color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                borderColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "" 
              }}
            >
              <Filter size={14} className="mr-2" /> Filtre
              {hasActiveFilters && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
              )}
            </Button>

            <Button onClick={() => router.push("/store/new")} className="bg-[#0085FF] hover:bg-[#0070D9] text-white">
              <Plus size={16} className="mr-2" /> Yeni Teklif
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={OFFER_FILTERS}
            initialFilters={filters as unknown as FilterData}
            onApply={(f) => setFilters(f as unknown as OfferFilters)}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={offers as unknown as BaseRow[]}
            columns={OFFER_COLUMNS as unknown as ColumnDef<BaseRow>[]}
            showStatusFilter
            statusOptions={STATUS_OPTIONS}
            currentStatus={filters.status || "all"}
            onStatusChange={handleStatusChange}
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <EntityActions
                  row={row}
                  onView={() => router.push(`/store/${row.id}`)}
                />
              </div>
            )}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 mt-2 rounded-xl border"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Toplam {pagination.total} teklif • Sayfa {pagination.page} / {pagination.totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageState>
    </div>
  );
}