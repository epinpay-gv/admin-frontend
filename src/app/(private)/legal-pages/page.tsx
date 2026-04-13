"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";

import { useLegalPages } from "@/features/legal-pages/hooks/useLegalPages";
import LegalPageCreateModal from "@/features/legal-pages/components/LegalPageCreateModal";
import {
  LEGAL_PAGE_COLUMNS,
  LegalPageRow,
} from "@/features/legal-pages/components/LegalPageTableConfig";
import { LegalPage } from "@/features/legal-pages/types";

type BaseRow = Record<string, unknown>;

export default function LegalPagesPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const canEdit = true;

  const { legalPages, loading, error, refresh, remove } = useLegalPages();

  const columns = useMemo(
    () =>
      LEGAL_PAGE_COLUMNS(
        (id) => router.push(`/legal-pages/${id}`),
        remove,
        canEdit
      ),
    [remove, canEdit]
  );

  const rows = useMemo((): LegalPageRow[] => {
    return legalPages.map((page: LegalPage) => ({
      id: page.id,
      pageName: page.pageName,
      pageUrl: page.pageUrl,
      languages: page.contents.map((c) => c.language),
      updatedAt: page.updatedAt ?? page.createdAt ?? "",
      _original: page,
    }));
  }, [legalPages]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Yasal Sayfalar"
        count={legalPages.length}
        countLabel="sayfa"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              title="Yenile"
              className="text-(--text-muted)"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>

            {canEdit && (
              <Button
                onClick={() => setModalOpen(true)}
                className="text-white flex items-center gap-2 px-6 h-10 shadow-lg shadow-emerald-500/20"
                style={{
                  background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="font-semibold text-sm">Yeni Ekle</span>
              </Button>
            )}
          </div>
        }
      />

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
          <DataTable
            data={rows as unknown as BaseRow[]}
            columns={columns as unknown as ColumnDef<BaseRow>[]}
          />
        </div>
      </PageState>

      <LegalPageCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(id) => router.push(`/legal-pages/${id}`)}
      />
    </div>
  );
}