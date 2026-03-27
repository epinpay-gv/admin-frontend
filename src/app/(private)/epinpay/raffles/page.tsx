"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { useRaffles } from "@/features/raffles";
import { Raffle, RaffleFilters } from "@/features/raffles/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel"; 
import { FilterValue } from "@/components/common/filter-panel/types"; 
import { RAFFLE_FILTER_CONFIG } from "@/features/raffles/hooks/RaffleFilterConfig";
import { COLUMNS } from "@/features/raffles/components/RaffleTableConfig";

export default function RafflesPage() {
  const router = useRouter();
  const { 
    raffles, 
    loading, 
    error, 
    filters, 
    setFilters, 
    resetFilters, 
    refresh 
  } = useRaffles();
  
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(
    ([_, value]) => value && value !== "all" && value !== ""
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Çekiliş Yönetimi"
        count={raffles.length}
        countLabel="çekiliş"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={refresh} className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="ml-2">Yenile</span>
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
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-[#00C6A2]"
                  />
                )}
              </AnimatePresence>
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            key="raffle-filter-main"
            configs={RAFFLE_FILTER_CONFIG}                        
            initialFilters={filters as unknown as Record<string, FilterValue>}
            onApply={(data) => setFilters(data as unknown as RaffleFilters)}
            onReset={resetFilters}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <DataTable
          data={raffles as unknown as Record<string, unknown>[]}
          columns={COLUMNS as unknown as ColumnDef<Record<string, unknown>>[]}
          showStatusFilter={false}
          actions={(row) => (
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/epinpay/raffles/${String(row.id)}`)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[#00C6A2] transition-all"
              >
                <Eye size={13} />
              </button>
            </div>
          )}
        />
      </PageState>
    </div>
  );
}