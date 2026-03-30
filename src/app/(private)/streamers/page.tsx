"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Users, Package, Globe, ClipboardList } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/page-header/PageHeader";
import Spinner from "@/components/common/spinner/Spinner";
import { PALETTE } from "@/lib/status-color"
import { useStreamers } from "@/features/streamers/hooks/useStreamers";
import { usePackageTemplates } from "@/features/streamers/hooks/usePackageTemplates";
import { useCountryVariants } from "@/features/streamers/hooks/useCountryVariants";
import { usePackageRequests } from "@/features/streamers/hooks/usePackageRequests";

import {
  STREAMER_STATUS,
  STREAMER_STATUS_LABELS,
  PACKAGE_STATUS,
  PACKAGE_STATUS_LABELS,
  TEMPLATE_STATUS,
  TEMPLATE_STATUS_LABELS,
  VARIANT_STATUS,
  VARIANT_STATUS_LABELS,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_STATUS_LABELS,
  PACKAGE_REQUEST_TYPE,
  PACKAGE_REQUEST_TYPE_LABELS,
  PACKAGE_LEVEL_LABELS,
} from "@/features/streamers/types";
import { EntityActions } from "@/components/common/entity-actions/EntityActions";

type TabKey = "streamers" | "templates" | "variants" | "requests";

type Row = Record<string, any>;


const STREAMER_STATUS_COLOR: Record<STREAMER_STATUS, typeof PALETTE[keyof typeof PALETTE]> = {
  [STREAMER_STATUS.PENDING]: PALETTE.yellow,
  [STREAMER_STATUS.APPROVED]: PALETTE.green,
  [STREAMER_STATUS.REJECTED]: PALETTE.red,
};

const PACKAGE_STATUS_COLOR: Record<PACKAGE_STATUS, typeof PALETTE[keyof typeof PALETTE]> = {
  [PACKAGE_STATUS.ACTIVE]: PALETTE.green,
  [PACKAGE_STATUS.EXPIRED]: PALETTE.red,
  [PACKAGE_STATUS.NONE]: PALETTE.gray,
};

const TEMPLATE_STATUS_COLOR: Record<TEMPLATE_STATUS, typeof PALETTE[keyof typeof PALETTE]> = {
  [TEMPLATE_STATUS.ACTIVE]: PALETTE.green,
  [TEMPLATE_STATUS.INACTIVE]: PALETTE.gray,
};

const VARIANT_STATUS_COLOR: Record<VARIANT_STATUS, typeof PALETTE[keyof typeof PALETTE]> = {
  [VARIANT_STATUS.ACTIVE]: PALETTE.green,
  [VARIANT_STATUS.INACTIVE]: PALETTE.gray,
};

const REQUEST_STATUS_COLOR: Record<PACKAGE_REQUEST_STATUS, typeof PALETTE[keyof typeof PALETTE]> = {
  [PACKAGE_REQUEST_STATUS.PENDING]: PALETTE.yellow,
  [PACKAGE_REQUEST_STATUS.APPROVED]: PALETTE.green,
  [PACKAGE_REQUEST_STATUS.REJECTED]: PALETTE.red,
};

const REQUEST_TYPE_COLOR: Record<PACKAGE_REQUEST_TYPE, typeof PALETTE[keyof typeof PALETTE]> = {
  [PACKAGE_REQUEST_TYPE.RENEWAL]: PALETTE.blue,
  [PACKAGE_REQUEST_TYPE.UPGRADE]: PALETTE.purple,
};

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

function DateText({ value }: { value: string | undefined }) {
  if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  return (
    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
      {new Date(value).toLocaleDateString("tr-TR")}
    </span>
  );
}

const STREAMER_COLUMNS: ColumnDef<Row>[] = [
  {
    key: "id",
    label: "ID",
    width: "60px",
    render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v}</span>,
  },
  {
    key: "name",
    label: "Yayıncı",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.name}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{r.email}</p>
      </div>
    ),
  },
  {
    key: "countryCode",
    label: "Ülke",
    render: (_, r) => (
      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
        {r.countryCode} · {r.countryName}
      </span>
    ),
  },
  {
    key: "streamerStatus",
    label: "Başvuru",
    sortable: true,
    render: (v) => {
      const c = STREAMER_STATUS_COLOR[v as STREAMER_STATUS];
      return <Badge label={STREAMER_STATUS_LABELS[v as STREAMER_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key: "packageStatus",
    label: "Paket",
    sortable: true,
    render: (_, r) => {
      const c = PACKAGE_STATUS_COLOR[r.packageStatus as PACKAGE_STATUS];
      return (
        <div className="flex flex-col gap-0.5">
          <Badge label={PACKAGE_STATUS_LABELS[r.packageStatus as PACKAGE_STATUS]} bg={c.bg} color={c.color} />
          {r.currentPackageName && (
            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              {r.currentPackageName}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "packageEndDate",
    label: "Bitiş",
    sortable: true,
    render: (v) => <DateText value={v} />,
  },
  {
    key: "createdAt",
    label: "Kayıt",
    sortable: true,
    render: (v) => <DateText value={v} />,
  },
];

const TEMPLATE_COLUMNS: ColumnDef<Row>[] = [
  {
    key: "id",
    label: "ID",
    width: "60px",
    render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v}</span>,
  },
  {
    key: "name",
    label: "Şablon",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.name}</p>
        {r.description && (
          <p className="text-[11px] font-mono truncate max-w-[240px]" style={{ color: "var(--text-muted)" }}>
            {r.description}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "level",
    label: "Seviye",
    sortable: true,
    render: (v) => (
      <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-secondary)" }}>
        {PACKAGE_LEVEL_LABELS[v as keyof typeof PACKAGE_LEVEL_LABELS]}
      </span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (v) => {
      const c = TEMPLATE_STATUS_COLOR[v as TEMPLATE_STATUS];
      return <Badge label={TEMPLATE_STATUS_LABELS[v as TEMPLATE_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key: "contents",
    label: "İçerik",
    render: (v) => (
      <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        {(v as unknown[]).length} madde
      </span>
    ),
  },
  {
    key: "updatedAt",
    label: "Güncellendi",
    sortable: true,
    render: (v) => <DateText value={v} />,
  },
];

const VARIANT_COLUMNS: ColumnDef<Row>[] = [
  {
    key: "id",
    label: "ID",
    width: "60px",
    render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v}</span>,
  },
  {
    key: "templateName",
    label: "Şablon · Ülke",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.templateName}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {r.countryCode} · {r.countryName}
        </p>
      </div>
    ),
  },
  {
    key: "currency",
    label: "Para Birimi",
    render: (v) => (
      <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-secondary)" }}>{v}</span>
    ),
  },
  {
    key: "durationDays",
    label: "Süre",
    sortable: true,
    render: (v) => (
      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>{v} gün</span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (v) => {
      const c = VARIANT_STATUS_COLOR[v as VARIANT_STATUS];
      return <Badge label={VARIANT_STATUS_LABELS[v as VARIANT_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key: "updatedAt",
    label: "Güncellendi",
    sortable: true,
    render: (v) => <DateText value={v} />,
  },
];

const REQUEST_COLUMNS: ColumnDef<Row>[] = [
  {
    key: "id",
    label: "ID",
    width: "60px",
    render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v}</span>,
  },
  {
    key: "publisherName",
    label: "Yayıncı",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.publisherName}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{r.publisherEmail}</p>
      </div>
    ),
  },
  {
    key: "requestType",
    label: "Tür",
    sortable: true,
    render: (v) => {
      const c = REQUEST_TYPE_COLOR[v as PACKAGE_REQUEST_TYPE];
      return <Badge label={PACKAGE_REQUEST_TYPE_LABELS[v as PACKAGE_REQUEST_TYPE]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key: "currentPackageName",
    label: "Mevcut → Talep",
    render: (_, r) => (
      <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
        {r.currentPackageName} → {r.requestedPackageName}
      </span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (v) => {
      const c = REQUEST_STATUS_COLOR[v as PACKAGE_REQUEST_STATUS];
      return <Badge label={PACKAGE_REQUEST_STATUS_LABELS[v as PACKAGE_REQUEST_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key: "createdAt",
    label: "Tarih",
    sortable: true,
    render: (v) => <DateText value={v} />,
  },
];



const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "streamers", label: "Yayıncılar", icon: <Users size={13} /> },
  { key: "templates", label: "Paket Şablonları", icon: <Package size={13} /> },
  { key: "variants", label: "Ülke Varyantları", icon: <Globe size={13} /> },
  { key: "requests", label: "Paket Talepleri", icon: <ClipboardList size={13} /> },
];

const DETAIL_ROUTE: Record<TabKey, string> = {
  streamers: "/streamers",
  templates: "/streamers/package-templates",
  variants: "/streamers/country-variants",
  requests: "/streamers",
};

const COUNT_LABEL: Record<TabKey, string> = {
  streamers: "yayıncı",
  templates: "şablon",
  variants: "varyant",
  requests: "talep",
};


function getDetailId(tab: TabKey, row: Row): number {
  if (tab === "requests") return row.publisherId as number;
  return row.id as number;
}

export default function StreamersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("streamers");

  const streamersHook = useStreamers();
  const templatesHook = usePackageTemplates();
  const variantsHook = useCountryVariants();
  const requestsHook = usePackageRequests();

  const hooks = { streamers: streamersHook, templates: templatesHook, variants: variantsHook, requests: requestsHook };
  const data = { streamers: streamersHook.streamers, templates: templatesHook.templates, variants: variantsHook.variants, requests: requestsHook.requests };
  const cols = { streamers: STREAMER_COLUMNS, templates: TEMPLATE_COLUMNS, variants: VARIANT_COLUMNS, requests: REQUEST_COLUMNS };

  const active = hooks[activeTab];

  if (active.loading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>;
  }

  if (active.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">{active.error}</p>
        <Button variant="ghost" onClick={active.refresh}>Tekrar dene</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden px-1">
      <PageHeader
        title="Yayıncılar"
        count={data[activeTab].length}
        countLabel={COUNT_LABEL[activeTab]}
        actions={
          <Button
            variant="ghost"
            onClick={active.refresh}
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <RefreshCw size={14} />
            Yenile
          </Button>
        }
      />

      {/* Tab Bar */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4 shrink-0"
        style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? "var(--background-secondary)" : "transparent",
              color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-muted)",
              border: activeTab === tab.key ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar pb-10">
        <DataTable
          data={data[activeTab] as Row[]}
          columns={cols[activeTab]}
          actions={(row) => (
            <EntityActions
              row={row}
              onView={() => router.push(`${DETAIL_ROUTE[activeTab]}/${getDetailId(activeTab, row)}`)}
            />
          )}
        />
      </div>
    </div>
  );
}