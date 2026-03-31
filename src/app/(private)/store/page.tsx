"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { useOffers } from "@/features/store/hooks/useOffers";
import { useOfferToggle } from "@/features/store/hooks/useOfferToggle";
import { OFFER_STATUS, OfferFilters } from "@/features/store/types";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { Button } from "@/components/ui/button";
import { PALETTE } from "@/lib/status-color";

import { OFFER_COLUMNS, STATUS_LABELS, OfferRow } from "@/features/store/components/OfferTableConfig";
import { OFFER_FILTERS } from "@/features/store/hooks/OfferFilterConfig";

type BaseRow = Record<string, unknown>;

export default function StorePage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OfferFilters>({});

  // Hook kullanımı (Refresh desteği ile)
  const { offers, loading, error, refresh, updateOfferStatus } = useOffers(filters);

  const { toggle, loadingId } = useOfferToggle((id, status) => {
    updateOfferStatus(id, status);
  });

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

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Tekliflerim"
        count={offers.length}
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

            <Button
              onClick={() => router.push("/store/new")}
              className="text-white flex items-center gap-2 px-6 h-10 shadow-lg shadow-emerald-500/20"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-semibold text-sm">Yeni Teklif</span>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(row.id as number, row.status as OFFER_STATUS);
                  }}
                  disabled={loadingId === row.id}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-black/5"
                  title={row.status === OFFER_STATUS.ACTIVE ? "Pasife Al" : "Aktif Et"}
                  style={{
                    background: "var(--background-card)",
                    borderColor: "var(--border)",
                    color: row.status === OFFER_STATUS.ACTIVE ? PALETTE.green.color : PALETTE.red.color,
                    opacity: loadingId === row.id ? 0.5 : 1,
                  }}
                >
                  {row.status === OFFER_STATUS.ACTIVE ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>

                <EntityActions
                  row={row}
                  onView={() => router.push(`/store/${row.id}`)}
                />
              </div>
            )}
          />
        </div>
      </PageState>
    </div>
  );
}