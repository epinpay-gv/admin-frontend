"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { useBlogs } from "@/features/blog/hooks/useBlogs";
import { BLOG_STATUS, BlogFilters } from "@/features/blog/types/blog.types";
import BlogEditModal from "@/features/blog/components/BlogEditModal";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import {
  BLOG_COLUMNS,
  STATUS_LABELS,
  BlogRow,
} from "@/features/blog/components/BlogTableConfig";
import { BLOG_FILTERS } from "@/features/blog/hooks/BlogFilterConfig";

type BaseRow = Record<string, unknown>;

export default function BlogPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BlogFilters>({ page: 1, limit: 10 });

  const {
    isOpen,
    selectedBlog,
    open,
    close,
    blogs,
    pagination,
    loading,
    error,
    refresh,
  } = useBlogs(filters);

  const STATUS_OPTIONS = useMemo(
    () => [
      { label: "Tümü", value: "all" },
      ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
        label,
        value,
      })),
    ],
    [],
  );

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "" && v !== "all",
  );

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: status === "all" ? undefined : (status as BLOG_STATUS),
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, page: 1, limit }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Blog Yazıları"
        count={pagination.total}
        countLabel="blog yazısı"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refresh()}
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
                backgroundColor:
                  showFilters || hasActiveFilters
                    ? "rgba(0, 198, 162, 0.1)"
                    : "",
                color:
                  showFilters || hasActiveFilters
                    ? "#00C6A2"
                    : "var(--text-muted)",
                borderColor:
                  showFilters || hasActiveFilters
                    ? "rgba(0, 198, 162, 0.1)"
                    : "",
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

            <Button
              onClick={() => router.push("/blog/new")}
              className="text-white flex items-center gap-2 px-6 h-10 shadow-lg shadow-emerald-500/20"
              style={{
                background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-semibold text-sm">Yeni Ekle</span>
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            key={JSON.stringify({
              status: filters.status,
              search: filters.search,
            })}
            configs={BLOG_FILTERS}
            initialFilters={
              {
                status: filters.status ?? "all",
                search: filters.search ?? "",
              } as unknown as FilterData
            }
            onApply={(f) => {
              const applied = f as unknown as BlogFilters;
              setFilters((prev) => ({
                ...prev,
                page: 1,
                status: applied.status === "all" ? undefined : applied.status,
                search: applied.search || undefined,
              }));
            }}
            onReset={() => setFilters({ page: 1, limit: 10 })}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={blogs as unknown as BaseRow[]}
            columns={BLOG_COLUMNS as unknown as ColumnDef<BaseRow>[]}
            showStatusFilter
            statusOptions={STATUS_OPTIONS}
            currentStatus={filters.status || "all"}
            onStatusChange={handleStatusChange}
            serverSide
            serverTotalRows={pagination.total}
            serverTotalPages={pagination.totalPages}
            serverPage={filters.page ?? 1}
            onServerPageChange={handlePageChange}
            onServerPageSizeChange={handlePageSizeChange}
            actions={(row) => (
              <EntityActions
                row={row}
                onEdit={(r) => open(r as unknown as BlogRow)}
                onView={(r) =>
                  router.push(`/blog/${(r as unknown as BlogRow).id}`)
                }
              />
            )}
          />
        </div>
      </PageState>

      <BlogEditModal open={isOpen} onClose={close} blog={selectedBlog} />
    </div>
  );
}
