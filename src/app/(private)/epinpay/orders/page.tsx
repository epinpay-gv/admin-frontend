"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileDown, RefreshCw, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { PageState } from "@/components/common/page-state/PageState";
import { FilterPanel } from "@/components/common/filter-panel/FilterPanel";
import { FilterData } from "@/components/common/filter-panel/types";

import { useOrders, OrderCancelModal, ORDER_STATUS } from "@/features/orders";
import { Order, OrderFilters } from "@/features/orders/types";
import OrderProductsModal from "@/features/orders/components/OrderProductsModal";
import { useOrderExport } from "@/features/orders/hooks/useOrderExport";

import { ORDER_COLUMNS, OrderRow } from "@/features/orders/components/OrderTableConfig";
import { ORDER_FILTER_CONFIG } from "@/features/orders/hooks/OrderFilterConfig";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, error, filters, applyFilters, refetch, updateOrder } = useOrders();

  const [showFilters, setShowFilters] = useState(false);
  const [productsModal, setProductsModal] = useState<Order | null>(null);
  const [cancelModal, setCancelModal] = useState<Order | null>(null);
  
  const { exportExcel, exporting } = useOrderExport();
  const filteredOrdersRef = useRef<Order[]>([]);

  const columns = useMemo(() => 
    ORDER_COLUMNS(
      (id: number) => router.push(`/epinpay/orders/${id}`),
      (order: Order) => setProductsModal(order),
      (userId: number) => router.push(`/users/${userId}`)
    ), [router]);

  const handleStatusChange = (status: string) => {
    applyFilters({
      ...filters,
      status: (status === "all" ? undefined : status) as OrderFilters["status"]
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && v !== "" && k !== "status");

  return (
    // DÜZELTME: PageState'i buradan kaldırdık ki loading sırasında sayfa komple silinmesin
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 px-1">
      <PageHeader
        title="Siparişler"
        count={orders.length}
        countLabel="sipariş"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()} title="Yenile" className="text-(--text-muted)">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)} 
              className="relative px-4"
              style={{ 
                backgroundColor: showFilters || hasActiveFilters  ? "rgba(0, 198, 162, 0.1)" : "",
                color: showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
                borderColor: hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "" 
              }}
            >
              <Filter size={14} className="mr-2" /> Detaylı Filtre
              {hasActiveFilters && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]" />
              )}
            </Button>

            <Button onClick={() => exportExcel(filteredOrdersRef.current)} disabled={exporting} variant="outline" className="gap-2">
              {exporting ? <span className="w-4 h-4 border-2 rounded-full animate-spin border-t-transparent" /> : <FileDown size={16} />}
              Excel
            </Button>
          </div>
        }
      />

      <AnimatePresence mode="popLayout">
        {showFilters && (
          <FilterPanel
            configs={ORDER_FILTER_CONFIG}
            initialFilters={(filters as unknown) as FilterData}
            onApply={(data) => applyFilters((data as unknown) as OrderFilters)}
            onReset={() => applyFilters({} as OrderFilters)}
          />
        )}
      </AnimatePresence>

      {/* DÜZELTME: PageState sadece tabloyu sarmalıyor */}
      <PageState loading={loading} error={error}>
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <DataTable
            data={(orders as unknown) as OrderRow[]}
            columns={columns}
            showStatusFilter
            statusOptions={
              (ORDER_FILTER_CONFIG.find((c) => c.key === "status") as { options?: { label: string; value: string }[] })?.options
            }
            currentStatus={String(filters?.status || "all")}
            onStatusChange={handleStatusChange}
            onFilteredDataChange={(rows) => { filteredOrdersRef.current = (rows as unknown) as Order[]; }}
           actions={(row) => (<EntityActions row={row} onView={() => router.push(`/epinpay/orders/${row.id}`)}/>)}
          />
        </div>
      </PageState>

      <OrderCancelModal open={!!cancelModal} onClose={() => setCancelModal(null)} order={cancelModal} onUpdate={(u) => { updateOrder(u); setCancelModal(null); }} />
      <OrderProductsModal open={!!productsModal} onClose={() => setProductsModal(null)} order={productsModal} />
    </div>
  );
}