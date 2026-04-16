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

import { usePaymentProviders } from "@/features/payment/hooks/usePaymentProviders";
import { getProviderColumns } from "@/features/payment/components/ProviderTableConfig";
import { PROVIDER_FILTER_CONFIG } from "@/features/payment/components/PaymentFilterConfig";
import { PaymentProviderFilters } from "@/features/payment/types";
import { FilterData } from "@/components/common/filter-panel/types";
import { ProviderEditModal } from "@/features/payment/components/ProviderEditModal";
import { ProviderCountryRestrictionModal } from "@/features/payment/components/ProviderCountryRestrictionModal";
import { PaymentProvider } from "@/features/payment/types";

export default function ProvidersPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PaymentProviderFilters>({});
  const [editProvider, setEditProvider] = useState<PaymentProvider | null>(null);
  const [editCountriesProvider, setEditCountriesProvider] = useState<PaymentProvider | null>(null);

  const {
    providers,
    loading,
    error,
    refresh,
    updateProvider,
  } = usePaymentProviders(filters);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "" && v !== "all"
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Ödeme Sağlayıcıları"
        count={providers.length}
        countLabel="sağlayıcı"
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
              <Plus size={14} className="mr-2" /> Yeni Sağlayıcı
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={PROVIDER_FILTER_CONFIG}
            initialFilters={filters as unknown as FilterData}
            onApply={(data) => setFilters(data as unknown as PaymentProviderFilters)}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={providers as unknown as Record<string, unknown>[]}
            columns={getProviderColumns((p) => setEditCountriesProvider(p))}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => router.push(`/payment/providers/${row.id}`)}
                onEdit={() => setEditProvider(row as unknown as PaymentProvider)}
              />
            )}
          />
        </div>
      </PageState>

      <ProviderEditModal
        open={!!editProvider}
        onClose={() => setEditProvider(null)}
        provider={editProvider}
        onSuccess={(updated) => {
          updateProvider(updated);
          setEditProvider(null);
        }}
      />

      <ProviderCountryRestrictionModal
        open={!!editCountriesProvider}
        onClose={() => setEditCountriesProvider(null)}
        provider={editCountriesProvider}
        onSuccess={(updated) => {
          updateProvider(updated);
          setEditCountriesProvider(null);
        }}
      />
    </div>
  );
}
