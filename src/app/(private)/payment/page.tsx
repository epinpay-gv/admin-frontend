"use client";

import { useState, useMemo } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { PaymentMethod, PaymentMethodFilters } from "@/features/payment/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterValue } from "@/components/common/filter-panel/types";

import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { PAYMENT_FILTER_CONFIG } from "@/features/payment/components/PaymentFilterConfig";
import PaymentCountryStatusModal from "@/features/payment/components/PaymentCountryStatusModal";
import { usePayment } from "@/features/payment/hooks/usePayment";
import { PAYMENT_COLUMNS } from "@/features/payment/components/PaymentTableConfig";

export default function PaymentPage() {
  const { methods, loading, error, updateMethod } = usePayment();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaymentMethodFilters>({});
  const [countryModal, setCountryModal] = useState<PaymentMethod | null>(null);

  const columns = useMemo(() =>
    (PAYMENT_COLUMNS(setCountryModal) as unknown) as ColumnDef<Record<string, unknown>>[],
  []);

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && v !== "" && k !== "status");

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Ödeme Yöntemi Görünürlüğü"
        count={methods.length}
        countLabel="ödeme yöntemi"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" title="Yenile" className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative px-4"
              style={{
                backgroundColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
                color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                borderColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
              }}
            >
              <Filter size={14} className="mr-2" /> Filtre
              {hasActiveFilters && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
              )}
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={PAYMENT_FILTER_CONFIG}
            initialFilters={(filters as unknown) as Record<string, FilterValue>}
            onApply={(data) => setFilters((data as unknown) as PaymentMethodFilters)}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={(methods as unknown) as Record<string, unknown>[]}
            columns={columns}
            actions={(row) => (
              <EntityActions
                row={row}
                onEdit={() => setCountryModal(row as unknown as PaymentMethod)}
              />
            )}
          />
        </div>
      </PageState>

      <PaymentCountryStatusModal
        open={!!countryModal}
        onClose={() => setCountryModal(null)}
        method={countryModal}
        onUpdate={(u) => { updateMethod(u); setCountryModal(null); }}
      />
    </div>
  );
}