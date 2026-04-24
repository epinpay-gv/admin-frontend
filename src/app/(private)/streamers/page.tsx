"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Users, Package, FileText, Filter } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

import { useStreamers } from "@/features/streamers/hooks/useStreamers";
import { usePackages } from "@/features/streamers/hooks/usePackages";
import { useContracts } from "@/features/streamers/hooks/useContracts";

import {
  STREAMER_COLUMNS,
  PACKAGE_COLUMNS,
  CONTRACT_COLUMNS,
} from "@/features/streamers/components/StreamerTableConfig";
import { TAB_FILTERS } from "@/features/streamers/hooks/StreamerFilterConfig";

import type {
  StreamerFilters,
  PackageFilters,
  ContractFilters,
} from "@/features/streamers/types";



type TabKey = "streamers" | "packages" | "contracts";
type BaseRow = Record<string, unknown>;

const TAB_INFO: Record<TabKey, { label: string; icon: React.ReactNode }> = {
  streamers: { label: "Yayıncılar",      icon: <Users size={13} /> },
  packages:  { label: "Paket Şablonları", icon: <Package size={13} /> },
  contracts: { label: "Sözleşmeler",     icon: <FileText size={13} /> },
};


export default function StreamersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState<TabKey>("streamers");
  const [showFilters, setShowFilters] = useState(false);

  const streamersHook = useStreamers();
  const packagesHook  = usePackages();
  const contractsHook = useContracts();

  const activeHook = {
    streamers: streamersHook,
    packages:  packagesHook,
    contracts: contractsHook,
  }[activeTab];

const displayData = useMemo<BaseRow[]>(() => {
  switch (activeTab) {
    case "streamers": return (streamersHook.streamers ?? []) as unknown as BaseRow[];
    case "packages":  return (packagesHook.packages   ?? []) as unknown as BaseRow[];
    case "contracts": return (contractsHook.contracts ?? []) as unknown as BaseRow[];
    default: return [];
  }
}, [
  activeTab,
  streamersHook.streamers,
  packagesHook.packages,
  contractsHook.contracts,
]);

  const displayColumns = useMemo<ColumnDef<BaseRow>[]>(() => {
    switch (activeTab) {
      case "streamers": return STREAMER_COLUMNS as unknown as ColumnDef<BaseRow>[];
      case "packages":  return PACKAGE_COLUMNS  as unknown as ColumnDef<BaseRow>[];
      case "contracts": return CONTRACT_COLUMNS as unknown as ColumnDef<BaseRow>[];
    }
  }, [activeTab]);

  const handleView = (row: BaseRow) => {
    const id = (row as { id: string }).id;
    const routes: Record<TabKey, string> = {
      streamers: "/streamers",
      packages:  "/streamers/packages",
      contracts: "/streamers/contracts",
    };
    router.push(`${routes[activeTab]}/${id}`);
  };

  const handleApplyFilters = (f: FilterData) => {
    if (activeTab === "streamers") {
      streamersHook.setFilters(f as unknown as StreamerFilters);
    } else if (activeTab === "packages") {
      packagesHook.setFilters(f as unknown as PackageFilters);
    } else if (activeTab === "contracts") {
      contractsHook.setFilters(f as unknown as ContractFilters);
    }
  };

  const handleResetFilters = () => {
    if (activeTab === "streamers") streamersHook.resetFilters();
    else if (activeTab === "packages")  packagesHook.resetFilters();
    else if (activeTab === "contracts") contractsHook.resetFilters();
  };

  const currentFilters = activeHook.filters as unknown as FilterData;
  const tabFilterConfig = TAB_FILTERS[activeTab] ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Yayıncılar"
        count={displayData.length}
        countLabel="kayıt"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={activeHook.refresh}
              title="Yenile"
            >
              <RefreshCw
                size={14}
                className={activeHook.loading ? "animate-spin" : ""}
              />
            </Button>

            {tabFilterConfig.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowFilters((p) => !p)}
              >
                <Filter size={14} className="mr-2" />
                Filtre
              </Button>
            )}

            {activeTab === "packages" && (
              <Button
                onClick={() => router.push("/streamers/packages/new")}
                style={{
                  background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
                  color: "white",
                }}
              >
                + Yeni Paket
              </Button>
            )}
          </div>
        }
      />

      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4 shrink-0"
        style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
      >
        {(Object.keys(TAB_INFO) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setShowFilters(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background:    activeTab === key ? "var(--background-secondary)" : "transparent",
              color:         activeTab === key ? "var(--text-primary)" : "var(--text-muted)",
              border:        activeTab === key ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            {TAB_INFO[key].icon}
            {TAB_INFO[key].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {showFilters && tabFilterConfig.length > 0 && (
          <FilterPanel
            configs={tabFilterConfig}
            initialFilters={currentFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
      </AnimatePresence>
      <PageState loading={activeHook.loading} error={activeHook.error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={displayData}
            columns={displayColumns}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => handleView(row)}
              />
            )}
          />
        </div>
      </PageState>
    </div>
  );
}