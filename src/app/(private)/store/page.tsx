"use client";

import { useRouter } from "next/navigation";
import { Eye, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/data-table";

import { OfferListItem, OFFER_STATUS, DELIVERY_TYPE } from "@/features/store/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import { useOffers } from "@/features/store/hooks/useOffers";
import { useOfferToggle } from "@/features/store/hooks/useOfferToggle";
<<<<<<< HEAD
import Image from "next/image";
import Spinner from "@/components/common/spinner/Spinner";
=======
>>>>>>> b5a8186ac9a9622265f67ccd0d9edbd0d55f1e35

// Sabitler 
const STATUS_LABELS: Record<OFFER_STATUS, string> = {
  [OFFER_STATUS.ACTIVE]:  "Aktif",
  [OFFER_STATUS.PASSIVE]: "Pasif",
  [OFFER_STATUS.DRAFT]:   "Taslak",
};

const STATUS_COLORS: Record<OFFER_STATUS, { bg: string; color: string }> = {
  [OFFER_STATUS.ACTIVE]:  { bg: "rgba(0,198,162,0.15)",  color: "#00C6A2" },
  [OFFER_STATUS.PASSIVE]: { bg: "rgba(255,80,80,0.15)",  color: "#FF5050" },
  [OFFER_STATUS.DRAFT]:   { bg: "rgba(255,180,0,0.15)",  color: "#FFB400" },
};

const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.AUTOMATIC]:    "Otomatik",
  [DELIVERY_TYPE.ID_UPLOAD]:    "ID Yükleme",
  [DELIVERY_TYPE.DROPSHIPPING]: "Stoksuz",
};

const DELIVERY_COLORS: Record<DELIVERY_TYPE, { bg: string; color: string }> = {
  [DELIVERY_TYPE.AUTOMATIC]:    { bg: "rgba(0,133,255,0.12)",  color: "#0085FF" },
  [DELIVERY_TYPE.ID_UPLOAD]:    { bg: "rgba(162,89,255,0.12)", color: "#A259FF" },
  [DELIVERY_TYPE.DROPSHIPPING]: { bg: "rgba(255,180,0,0.12)",  color: "#FFB400" },
};

const STATUS_OPTIONS = [
  { label: "Tümü",   value: "all" },
  { label: "Aktif",  value: OFFER_STATUS.ACTIVE },
  { label: "Pasif",  value: OFFER_STATUS.PASSIVE },
];

type OfferRow = OfferListItem & Record<string, unknown>;

// Sayfa 

export default function StorePage() {
  const router = useRouter();
  const { offers, loading, error, updateOfferStatus  } = useOffers();

const { toggle, loadingId } = useOfferToggle((id, status) => {
  updateOfferStatus(id, status);
});

  const COLUMNS: ColumnDef<OfferRow>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      width: "60px",
    },
    {
      key: "productName",
      label: "Ürün",
      sortable: true,
      searchable: true,
      render: (value) => (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "deliveryType",
      label: "Teslimat",
      sortable: true,
      render: (value) => {
        const type   = value as DELIVERY_TYPE;
        const colors = DELIVERY_COLORS[type];
        return (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
            style={{ background: colors.bg, color: colors.color }}
          >
            {DELIVERY_LABELS[type]}
          </span>
        );
      },
    },
    
    {
  key: "price",
  label: "Fiyat",
  sortable: true,
  sortKey: "price.amount",
  render: (_, row) => {
    const price = row.price as OfferListItem["price"] | undefined;

    if (!price?.amount) return <span style={{ color: "var(--text-muted)" }}>—</span>;

    return (
      <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
        {price.currency} {price.amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
      </span>
    );
  },
},
    {
      key: "stock",
      label: "Stok",
      render: (_, row) => {
        const stock        = row.stock as OfferListItem["stock"];
        const deliveryType = row.deliveryType as DELIVERY_TYPE;

        if (deliveryType !== DELIVERY_TYPE.AUTOMATIC) {
          return <span style={{ color: "var(--text-muted)" }}>—</span>;
        }

        const isEmpty = !stock || stock.total === 0;
        return (
          <span
            className="font-mono text-sm font-medium"
            style={{ color: isEmpty ? "#FF5050" : "var(--text-primary)" }}
          >
            {stock?.total ?? 0}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Durum",
      sortable: true,
      render: (value) => {
        const status = value as OFFER_STATUS;
        const colors = STATUS_COLORS[status];
        return (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider"
            style={{ background: colors.bg, color: colors.color }}
          >
            {STATUS_LABELS[status]}
          </span>
        );
      },
    },
  ];

  // Loading 

  if (loading) {
    return (
     <div className="flex items-center justify-center h-64">
             <Spinner />
           </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-100 gap-4">
        <p className="text-red-400 text-sm font-mono">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  //  Render 

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Tekliflerim"
        count={offers.length}
        countLabel="teklif"
        actions={
          <Button
            onClick={() => router.push("/store/new")}
            className="text-white flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-semibold text-sm">Yeni Teklif</span>
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
        <DataTable
          data={offers as OfferRow[]}
          columns={COLUMNS}
          showStatusFilter
          statusOptions={STATUS_OPTIONS}
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              {/* Toggle butonu — loadingId ile hangi satırın işlemde olduğu belli */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(row.id as number, row.status as OFFER_STATUS);
                }}
                disabled={loadingId === row.id}
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-black/5"
                title={row.status === OFFER_STATUS.ACTIVE ? "Pasife Al" : "Aktif Et"}
                style={{
                  background:   "var(--background-card)",
                  borderColor:  "var(--border)",
                  color:        row.status === OFFER_STATUS.ACTIVE ? "#00C6A2" : "#FF5050",
                  opacity:      loadingId === row.id ? 0.5 : 1,
                }}
              >
                {row.status === OFFER_STATUS.ACTIVE
                  ? <ToggleRight size={20} />
                  : <ToggleLeft  size={20} />
                }
              </button>
              {/* Detay */}
              <button
                onClick={() => router.push(`/store/${row.id}`)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-black/5"
                title="Teklif Detayı"
                style={{
                  background:  "var(--background-card)",
                  borderColor: "var(--border)",
                  color:       "var(--text-muted)",
                }}
              >
                <Eye size={14} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}