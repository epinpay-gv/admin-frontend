"use client";

import { useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";

import { useRedirects } from "@/features/redirect/hooks/useRedirects";
import RedirectCreateModal from "@/features/redirect/components/RedirectCreateModal";
import { REDIRECT_COLUMNS, RedirectRow } from "@/features/redirect/components/RedirectTableConfig";
import { useState } from "react";

export default function RedirectPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const canEdit = true;

  const { redirects, loading, error, reload, remove } = useRedirects();

  const columns = useMemo(
    () => REDIRECT_COLUMNS(remove, canEdit),
    [remove, canEdit]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Yönlendirmeler"
        count={redirects.length}
        countLabel="yönlendirme"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={reload}
              title="Yenile"
              className="text-(--text-muted)"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>

            {canEdit && (
              <Button
                onClick={() => setModalOpen(true)}
                className="gap-2"
                style={{ background: "#00C6A2", color: "#fff" }}
              >
                <Plus size={14} />
                Yeni Yönlendirme
              </Button>
            )}
          </div>
        }
      />

      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={redirects as unknown as RedirectRow[]}
            columns={columns}
          />
        </div>
      </PageState>

      <RedirectCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={reload}
      />
    </div>
  );
}