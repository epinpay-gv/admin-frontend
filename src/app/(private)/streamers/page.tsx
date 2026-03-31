"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Users, Package, Globe, ClipboardList, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

import { useStreamers } from "@/features/streamers/hooks/useStreamers";
import { usePackageTemplates } from "@/features/streamers/hooks/usePackageTemplates";
import { useCountryVariants } from "@/features/streamers/hooks/useCountryVariants";
import { usePackageRequests } from "@/features/streamers/hooks/usePackageRequests";

import { STREAMER_COLUMNS, TEMPLATE_COLUMNS, VARIANT_COLUMNS, REQUEST_COLUMNS } from "@/features/streamers/components/StreamerTableConfig";
import { TAB_FILTERS } from "@/features/streamers/hooks/StreamerFilterConfig";
import { 
  Streamer, 
  PackageTemplate, 
  CountryPackageVariant, 
  PackageRequest,
  // Yeni eklenenler:
  StreamerFilters,
  PackageTemplateFilters,
  CountryVariantFilters,
  PackageRequestFilters 
} from "@/features/streamers/types";

type TabKey = "streamers" | "templates" | "variants" | "requests";
type BaseRow = Record<string, unknown>;
type AllFilters = StreamerFilters & PackageTemplateFilters & CountryVariantFilters & PackageRequestFilters;

export default function StreamersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("streamers");
  const [showFilters, setShowFilters] = useState(false);

  const streamers = useStreamers();
  const templates = usePackageTemplates();
  const variants = useCountryVariants();
  const requests = usePackageRequests();

  const hooks = { streamers, templates, variants, requests };
  const active = hooks[activeTab];
  const displayData = useMemo(() => {
    switch (activeTab) {
      case "streamers": return streamers.streamers as unknown as BaseRow[];
      case "templates": return templates.templates as unknown as BaseRow[];
      case "variants": return variants.variants as unknown as BaseRow[]; // hook'tan gelen veri CountryPackageVariant[] olmalı
      case "requests": return requests.requests as unknown as BaseRow[];
      default: return [];
    }
  }, [activeTab, streamers.streamers, templates.templates, variants.variants, requests.requests]);

  const displayColumns = useMemo(() => {
    switch (activeTab) {
      case "streamers": return STREAMER_COLUMNS as unknown as ColumnDef<BaseRow>[];
      case "templates": return TEMPLATE_COLUMNS as unknown as ColumnDef<BaseRow>[];
      case "variants": return VARIANT_COLUMNS as unknown as ColumnDef<BaseRow>[];
      case "requests": return REQUEST_COLUMNS as unknown as ColumnDef<BaseRow>[];
      default: return [];
    }
  }, [activeTab]);

  const hasActiveFilters = Object.entries(active.filters || {}).some(([k, v]) => v && v !== "" && v !== "all");

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Yayıncılar"
        count={displayData.length}
        countLabel="kayıt"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={active.refresh} title="Yenile" className="text-(--text-muted)">
              <RefreshCw size={14} className={active.loading ? "animate-spin" : ""} />
            </Button>
            
            {TAB_FILTERS[activeTab]?.length > 0 && TAB_FILTERS[activeTab] && (
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-4"
                style={{ 
                  backgroundColor: showFilters || hasActiveFilters  ? "rgba(0, 198, 162, 0.1)" : "",
                  color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                  borderColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "" 
                }}
              >
                <Filter size={14} className="mr-2" /> Filtre
                {hasActiveFilters && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
                )}
              </Button>
            )}
          </div>
        }
      />

      <div className="flex items-center gap-1 p-1 rounded-xl mb-4 shrink-0" style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}>
        {(Object.keys(hooks) as TabKey[]).map((key) => {
          const tabInfo = {
            streamers: { label: "Yayıncılar", icon: <Users size={13} /> },
            templates: { label: "Paket Şablonları", icon: <Package size={13} /> },
            variants: { label: "Ülke Varyantları", icon: <Globe size={13} /> },
            requests: { label: "Paket Talepleri", icon: <ClipboardList size={13} /> },
          }[key];
          
          return (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setShowFilters(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === key ? "var(--background-secondary)" : "transparent",
                color: activeTab === key ? "var(--text-primary)" : "var(--text-muted)",
                border: activeTab === key ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              {tabInfo.icon} {tabInfo.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {showFilters && TAB_FILTERS[activeTab]?.length > 0 && (
          <FilterPanel
            configs={TAB_FILTERS[activeTab]}
            initialFilters={active.filters as unknown as FilterData}
            onApply={(f) => {
              const raw = f as unknown;

              if (activeTab === "streamers") {
                // 'as unknown as Parameters<typeof streamers.setFilters>[0]' 
                // Bu ifade: "Fonksiyon ne bekliyorsa ona dönüştür" demektir. any değildir.
                streamers.setFilters(raw as unknown as Parameters<typeof streamers.setFilters>[0]);
              } else if (activeTab === "templates") {
                templates.setFilters(raw as unknown as Parameters<typeof templates.setFilters>[0]);
              } else if (activeTab === "variants") {
                variants.setFilters(raw as unknown as Parameters<typeof variants.setFilters>[0]);
              } else if (activeTab === "requests") {
                requests.setFilters(raw as unknown as Parameters<typeof requests.setFilters>[0]);
              }
            }}
            onReset={() => {
              if (activeTab === "streamers") streamers.setFilters({} as unknown as Parameters<typeof streamers.setFilters>[0]);
              else if (activeTab === "templates") templates.setFilters({} as unknown as Parameters<typeof templates.setFilters>[0]);
              else if (activeTab === "variants") variants.setFilters({} as unknown as Parameters<typeof variants.setFilters>[0]);
              else if (activeTab === "requests") requests.setFilters({} as unknown as Parameters<typeof requests.setFilters>[0]);
            }}
          />
        )}
      </AnimatePresence>

      <PageState loading={active.loading} error={active.error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={displayData}
            columns={displayColumns}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => {
                  const id = activeTab === 'requests' ? (row as unknown as PackageRequest).publisherId : (row as unknown as {id: number}).id;
                  const route = {
                    streamers: "/streamers",
                    templates: "/streamers/package-templates",
                    variants: "/streamers/country-variants",
                    requests: "/streamers",
                  }[activeTab];
                  router.push(`${route}/${id}`);
                }}
              />
            )}
          />
        </div>
      </PageState>
    </div>
  );
}