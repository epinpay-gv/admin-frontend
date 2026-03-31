"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { useBlogs } from "@/features/blog/hooks/useBlogs";
import { useBlogModal } from "@/features/blog/hooks/useBlogModal";
import { BLOG_TRANSLATION_STATUS, BlogFilters, Blog } from "@/features/blog/types";
import BlogEditModal from "@/features/blog/components/BlogEditModal";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";
import PageHeader from "@/components/common/page-header/PageHeader";
import { BLOG_COLUMNS, STATUS_LABELS, BlogRow } from "@/features/blog/components/BlogTableConfig";
import { BLOG_FILTERS } from "@/features/blog/hooks/BlogFilterConfig";

type BaseRow = Record<string, unknown>;

export default function BlogPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BlogFilters>({});
  
  const blogHook = useBlogs(filters) as {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    refresh?: () => void;
  };

  const { blogs, loading, error, refresh } = blogHook;
  const { isOpen, selectedBlog, open, close } = useBlogModal();
  const blogRows = useMemo(() => {
    return blogs.map((blog): BlogRow => {
      const sourceTranslation = blog.translations.find(
        (t) => t.language === blog.sourceLanguage
      );
      return {
        id: blog.id,
        title: sourceTranslation?.title ?? "-",
        slug: sourceTranslation?.slug ?? "-",
        categoryId: blog.category_id ?? null,
        sourceLanguage: blog.sourceLanguage,
        status: sourceTranslation?.status ?? BLOG_TRANSLATION_STATUS.DRAFT,
        publishedTranslations: blog.translations.filter(
          (t) => t.status === BLOG_TRANSLATION_STATUS.PUBLISHED
        ),
        publishedAt: blog.publishedAt,
        updatedAt: blog.updatedAt,
        _original: blog,
      };
    });
  }, [blogs]);

  const STATUS_OPTIONS = useMemo(() => [
    { label: "Tümü", value: "all" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value }))
  ], []);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "" && v !== "all"
  );

  const handleStatusChange = (status: string) => {
    setFilters((prev: BlogFilters) => ({
      ...prev,
      status: status === "all" ? undefined : (status as BLOG_TRANSLATION_STATUS)
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Blog Yazıları"
        count={blogs.length}
        countLabel="blog yazısı"
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
                backgroundColor: showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
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

            <Button
              onClick={() => router.push("/blog/new")}
              className="text-white flex items-center gap-2 px-6 h-10 shadow-lg shadow-emerald-500/20"
              style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
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
            configs={BLOG_FILTERS}
            initialFilters={filters as unknown as FilterData}
            onApply={(f) => {
              const validatedFilters = f as unknown as BlogFilters;
              setFilters(validatedFilters);
            }}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={blogRows as unknown as BaseRow[]}
            columns={BLOG_COLUMNS as unknown as ColumnDef<BaseRow>[]}
            showStatusFilter
            statusOptions={STATUS_OPTIONS}
            currentStatus={filters.status || "all"}
            onStatusChange={handleStatusChange}
            actions={(row) => (
              <EntityActions
                row={row}
                onEdit={(r) => open((r as unknown as BlogRow)._original)}
                onView={(r) => router.push(`/blog/${r.id}`)}
              />
            )}
          />
        </div>
      </PageState>

      <BlogEditModal open={isOpen} onClose={close} blog={selectedBlog} />
    </div>
  );
}