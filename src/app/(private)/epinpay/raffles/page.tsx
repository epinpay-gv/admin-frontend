"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, X, RefreshCw } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { useRaffles } from "@/features/raffles";
import {
  Raffle,
  RAFFLE_STATUS,
  RAFFLE_STATUS_LABELS,
  RAFFLE_TYPE,
  RAFFLE_TYPE_LABELS,
  RAFFLE_CREATOR_TYPE,
  RAFFLE_CREATOR_TYPE_LABELS,
  PARTICIPATION_RESTRICTION_LABELS,
  RaffleFilters,
} from "@/features/raffles/types";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import Spinner from "@/components/common/spinner/Spinner";
import { PageState } from "@/components/common/page-state/PageState";
import { PALETTE } from "@/lib/status-color";


const STATUS_COLORS = {
  [RAFFLE_STATUS.DRAFT]:     PALETTE.yellow,
  [RAFFLE_STATUS.ACTIVE]:    PALETTE.green,
  [RAFFLE_STATUS.FINISHED]:  PALETTE.blue,
  [RAFFLE_STATUS.CANCELLED]: PALETTE.red,
  [RAFFLE_STATUS.INACTIVE]:  PALETTE.gray,
};

const CREATOR_COLORS = {
  [RAFFLE_CREATOR_TYPE.ADMIN]:     PALETTE.purple,
  [RAFFLE_CREATOR_TYPE.STORE]:     PALETTE.blue,
  [RAFFLE_CREATOR_TYPE.PUBLISHER]: PALETTE.green,
};

const TYPE_COLORS = {
  [RAFFLE_TYPE.FREE]:   PALETTE.green,
  [RAFFLE_TYPE.EP]:     PALETTE.yellow,
  [RAFFLE_TYPE.COUPON]: PALETTE.blue,
};

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  ...Object.entries(RAFFLE_STATUS_LABELS).map(([value, label]) => ({ label, value })),
];

type RaffleRow = Raffle & Record<string, unknown>;

export default function RafflesPage() {
  const router = useRouter();
  const {
    raffles,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refresh,
  } = useRaffles();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<RaffleFilters>(filters);

  const handleFilterChange = (key: keyof RaffleFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => setFilters(localFilters);

  const handleReset = () => {
    const empty: RaffleFilters = {
      search: "",
      creatorType: "all",
      type: "all",
      status: "all",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(empty);
    resetFilters();
  };

  const hasActiveFilters =
    filters.search ||
    (filters.creatorType && filters.creatorType !== "all") ||
    (filters.type && filters.type !== "all") ||
    (filters.status && filters.status !== "all") ||
    filters.startDate ||
    filters.endDate;

  const COLUMNS: ColumnDef<RaffleRow>[] = [
    {
      key: "id",
      label: "Çekiliş ID",
      sortable: true,
      width: "100px",
      render: (value) => (
        <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "name",
      label: "Çekiliş Adı",
      sortable: true,
      searchable: true,
      render: (_, row) => (
        <div className="min-w-[200px]">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {row.name as string}
          </p>
          <p className="text-[11px] font-mono mt-0.5 truncate max-w-[250px]" style={{ color: "var(--text-muted)" }}>
            {row.description as string}
          </p>
        </div>
      ),
    },
    {
      key: "creatorType",
      label: "Oluşturan",
      sortable: true,
      render: (_, row) => {
        const creatorType = row.creatorType as RAFFLE_CREATOR_TYPE;
        const colors = CREATOR_COLORS[creatorType];
        return (
          <div>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{ background: colors.bg, color: colors.color }}
            >
              {RAFFLE_CREATOR_TYPE_LABELS[creatorType]}
            </span>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              {row.creatorName as string}
            </p>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Tür",
      sortable: true,
      render: (value) => {
        const type = value as RAFFLE_TYPE;
        const colors = TYPE_COLORS[type];
        return (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: colors.bg, color: colors.color }}
          >
            {RAFFLE_TYPE_LABELS[type]}
          </span>
        );
      },
    },
    {
      key: "participationRestriction",
      label: "Katılım",
      render: (value) => (
        <span
          className="text-[11px] font-mono px-2 py-0.5 rounded-md"
          style={{
            background: "var(--background-secondary)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          {PARTICIPATION_RESTRICTION_LABELS[value as keyof typeof PARTICIPATION_RESTRICTION_LABELS]}
        </span>
      ),
    },
    {
      key: "participantCount",
      label: "Katılımcı",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "winnerCount",
      label: "Kazanan",
      sortable: true,
      render: (_, row) => (
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
          {String(row.winnerCount)} asil / {String(row.backupCount)} yedek
        </span>
      ),
    },
    {
      key: "startDate",
      label: "Tarihler",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
            {new Date(row.startDate as string).toLocaleDateString("tr-TR")}
          </p>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            → {new Date(row.endDate as string).toLocaleDateString("tr-TR")}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Durum",
      sortable: true,
      render: (value) => {
        const status = value as RAFFLE_STATUS;
        const colors = STATUS_COLORS[status];
        return (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: colors.bg, color: colors.color }}
          >
            {RAFFLE_STATUS_LABELS[status]}
          </span>
        );
      },
    },
  ];

  return (
    <PageState loading={loading} error={error} >
      <div>
        <PageHeader
          title="Çekilişler"
          count={raffles.length}
          countLabel="çekiliş"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={refresh}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <RefreshCw size={14} />
                Yenile
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-2 text-sm relative"
                style={{ color: showFilters ? "#00C6A2" : "var(--text-muted)" }}
              >
                <Filter size={14} />
                Filtrele
                {hasActiveFilters && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ background: "#00C6A2" }}
                  />
                )}
              </Button>
            </div>
          }
        />

        {/* Filtre Paneli */}
        {showFilters && (
          <div
            className="rounded-xl border p-4 mb-4 space-y-3"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Arama
                </label>
                <input
                  type="text"
                  value={localFilters.search ?? ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Çekiliş adı, oluşturan..."
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Oluşturan Türü
                </label>
                <select
                  value={localFilters.creatorType ?? "all"}
                  onChange={(e) => handleFilterChange("creatorType", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  <option value="all">Tümü</option>
                  {Object.entries(RAFFLE_CREATOR_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Çekiliş Türü
                </label>
                <select
                  value={localFilters.type ?? "all"}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  <option value="all">Tümü</option>
                  {Object.entries(RAFFLE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Durum
                </label>
                <select
                  value={localFilters.status ?? "all"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={localFilters.startDate ?? ""}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--text-muted)" }}>
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={localFilters.endDate ?? ""}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="h-9 rounded-lg border px-3 text-sm outline-none"
                  style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
                style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <X size={12} />
                Temizle
              </button>
              <button
                onClick={applyFilters}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-white transition-all"
                style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
              >
                <Filter size={12} />
                Uygula
              </button>
            </div>
          </div>
        )}

        <DataTable
          data={raffles as RaffleRow[]}
          columns={COLUMNS}
          showStatusFilter
          statusOptions={STATUS_OPTIONS}
          actions={(row) => (
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => router.push(`/epinpay/raffles/${row.id}`)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                title="Detay"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Eye size={13} />
              </button>
            </div>
          )}
        />
      </div>
    </PageState>
  );
}