"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Filter, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

import { usePaymentMethods } from "@/features/payment/hooks/usePaymentMethods";
import { METHOD_COLUMNS } from "@/features/payment/components/MethodTableConfig";
import { METHOD_FILTER_CONFIG } from "@/features/payment/components/PaymentFilterConfig";
import { PaymentMethodFilters } from "@/features/payment/types";
import { FilterData } from "@/components/common/filter-panel/types";
import { MethodEditModal } from "@/features/payment/components/MethodEditModal";
import { PaymentMethod } from "@/features/payment/types";

export default function MethodsPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaymentMethodFilters>({});
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);

  const {
    methods,
    loading,
    error,
    refresh,
    updateMethod,
  } = usePaymentMethods(filters);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Ödeme Yöntemleri"
        count={methods.length}
        countLabel="yöntem"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              title="Yenile"
              onClick={refresh}
              disabled={loading}
              className="text-(--text-muted)"
            >
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
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
              )}
            </Button>
            <Button
              className="text-white"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
            >
              <Plus size={14} className="mr-2" /> Yeni Yöntem
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={METHOD_FILTER_CONFIG}
            initialFilters={filters as unknown as FilterData}
            onApply={(data) => setFilters(data as unknown as PaymentMethodFilters)}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={methods as unknown as Record<string, unknown>[]}
            columns={METHOD_COLUMNS}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => router.push(`/payment/methods/${row.id}`)}
                onEdit={() => setEditMethod(row as unknown as PaymentMethod)}
              />
            )}
          />
        </div>
      </PageState>

      <MethodEditModal
        open={!!editMethod}
        onClose={() => setEditMethod(null)}
        method={editMethod}
        onSuccess={(updated) => {
          updateMethod(updated);
          setEditMethod(null);
        }}
      />
    </div>
  );
}
