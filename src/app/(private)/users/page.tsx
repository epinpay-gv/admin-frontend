"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Filter, RefreshCw } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Components
import { DataTable } from "@/components/common/data-table";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import PageHeader from "@/components/common/page-header/PageHeader";
import { Button } from "@/components/ui/button";
import UserReferralsModal from "@/features/users/components/UserReferalsModal";

// Hooks & Types
import { useUsers } from "@/features/users/hooks/useUsers";
import { UserFilters, UserListItem, USER_STATUS } from "@/features/users/types";
import { FilterValue } from "@/components/common/filter-panel/types";
import { GET_USER_COLUMNS } from "@/features/users/components/UserTableConfig";
import { USER_FILTERS } from "@/features/users/hooks/UserFilterConfig";

// Hook dönüş tipi tanımı - "refresh" ve "goToPage" hatalarını çözer
interface UseUsersReturn {
  users: UserListItem[];
  pagination: { 
    total: number; 
    page: number; 
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  refresh: () => void;
  goToPage: (page: number) => void;
}

export default function UsersPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const [referralModalUser, setReferralModalUser] = useState<UserListItem | null>(null);

  const { 
    users, 
    pagination, 
    loading, 
    error, 
    refresh, 
    goToPage 
  } = useUsers(filters) as UseUsersReturn;

  const columns = useMemo(() => GET_USER_COLUMNS(setReferralModalUser), []);

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === "all" ? undefined : (status as USER_STATUS)
    }));
  };

  const hasActiveFilters = Object.values(filters).some(
    v => v !== undefined && v !== "" && v !== "all"
  );
// TODO: Backendde filtreler aktif edildikten sonra filterpanel düzenlenecek
// TODO: Backendde status geliştirmesi yapıldıktan sonra status akitfleştirilecek
  return (
    <Suspense fallback={<div className="p-8">Yükleniyor...</div>}>
      <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
        <PageHeader
          title="Kullanıcılar"
          count={pagination?.total || 0}
          countLabel="kullanıcı"
          actions={
            <div className="flex items-center gap-2">
              {/* <Button 
                variant="outline" 
                size="icon" 
                onClick={refresh} 
                disabled={loading}
                className="text-(--text-muted)"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </Button> */}
              
              {/* <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
                style={{ 
                  backgroundColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "transparent",
                  color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                  borderColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.2)" : "var(--border)"
                }}
              >
                <Filter size={14} className="mr-2" /> Filtre
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
                )}
              </Button> */}
            </div>
          }
        />

        {/* <AnimatePresence mode="popLayout">
          {showFilters && (
            <FilterPanel
              configs={USER_FILTERS}
              initialFilters={filters as unknown as Record<string, FilterValue>}
              onApply={(data) => setFilters(data as unknown as UserFilters)}
              onReset={() => setFilters({})}
            />
          )}
        </AnimatePresence> */}

        <PageState loading={loading} error={error}>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-10">
            <DataTable<UserListItem & Record<string, unknown>>
              data={users as (UserListItem & Record<string, unknown>)[]}
              columns={columns}
              // showStatusFilter
              // statusOptions={[
              //   { label: "Tümü", value: "all" },
              //   { label: "Aktif", value: USER_STATUS.ACTIVE },
              //   { label: "Askıya Alındı", value: USER_STATUS.SUSPENDED },
              //   { label: "Sınırlı", value: USER_STATUS.LIMITED }
              // ]}
              currentStatus={String(filters.status || "all")}
              onStatusChange={handleStatusChange}          
              // actions={(row) => (
              //   <EntityActions
              //     row={row}
              //     onView={() => router.push(`/epinpay/users/${row.id}`)}
              //   />
              // )}
            />
          </div>
        </PageState>

        {/* Referans Listesi Modalı */}
        <UserReferralsModal
          open={!!referralModalUser}
          onClose={() => setReferralModalUser(null)}
          user={referralModalUser}
        />
      </div>
    </Suspense>
  );
}