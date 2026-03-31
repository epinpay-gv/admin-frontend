"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader"; // Doğru ColumnDef importu
import { useUsers } from "@/features/users/hooks/useUsers";
import { UserFilters, UserListItem, USER_STATUS } from "@/features/users/types";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { Button } from "@/components/ui/button";

import { USER_COLUMNS, USER_STATUS_LABELS } from "@/features/users/components/UserTableConfig";
import { USER_FILTERS } from "@/features/users/hooks/UserFilterConfig";

type BaseRow = Record<string, unknown>;

export default function UsersPage() {
  const STATUS_OPTIONS = [
    { label: "Tümü", value: "all" },
      ...Object.entries(USER_STATUS_LABELS).map(([value, label]) => ({ label, value }))
  ];
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const userHook = useUsers(filters) as { 
    users: UserListItem[]; 
    loading: boolean; 
    error: string | null; 
    refresh?: () => void 
  };

  const { users, loading, error, refresh } = userHook;
  const displayColumns = useMemo(() => 
    USER_COLUMNS as unknown as ColumnDef<BaseRow>[], 
  []);

  const displayData = useMemo(() => 
    users as unknown as BaseRow[], 
  [users]);

  const hasActiveFilters = Object.values(filters).some(
    v => v !== undefined && v !== "" && v !== "all"
  );

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === "all" ? undefined : (status as USER_STATUS)
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Kullanıcılar"
        count={users.length}
        countLabel="kullanıcı"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refresh?.()} 
              disabled={loading}
              title="Yenile"
              className="text-(--text-muted)"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            
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
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]"
                />
              )}
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={USER_FILTERS}
            initialFilters={filters as unknown as FilterData}
            
            onApply={(f) => {
              const validatedFilters = f as unknown as UserFilters;
              setFilters(validatedFilters);
            }}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={displayData}
            columns={displayColumns}
            showStatusFilter
            statusOptions={STATUS_OPTIONS}
            currentStatus={filters.status || "all"}
            onStatusChange={handleStatusChange}
            actions={(row) => (
              <EntityActions
                row={row}
                onView={() => router.push(`/users/${(row as unknown as UserListItem).id}`)}
              />
            )}
          />
        </div>
      </PageState>
    </div>
  );
}