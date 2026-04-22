import { ColumnDef } from "@/components/common/data-table";
import { PALETTE } from "@/lib/status-color";
import {
  STREAMER_STATUS,
  STREAMER_STATUS_LABELS,
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
  StreamerListItem,
  PackageWithCurrentDetail,
  PackageDetail,
  ContractWithRelations,
} from "../types";

const Badge = ({ label, bg, color }: { label: string; bg: string; color: string }) => (
  <span
    className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap"
    style={{ background: bg, color }}
  >
    {label}
  </span>
);

const DateText = ({ value }: { value: string | undefined }) => {
  if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  return (
    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
      {new Date(value).toLocaleDateString("tr-TR")}
    </span>
  );
};

const UUIDText = ({ value }: { value: string }) => (
  <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>
    {value.slice(0, 8)}…
  </span>
);

const STREAMER_COLORS: Record<STREAMER_STATUS, { bg: string; color: string }> = {
  [STREAMER_STATUS.ACTIVE]:       PALETTE.green,
  [STREAMER_STATUS.UNDER_REVIEW]: PALETTE.yellow,
  [STREAMER_STATUS.SUSPENDED]:    PALETTE.red,
  [STREAMER_STATUS.BANNED]:       PALETTE.red,
};

const CONTRACT_COLORS: Record<CONTRACT_STATUS, { bg: string; color: string }> = {
  [CONTRACT_STATUS.PENDING_UPLOAD]: PALETTE.gray,
  [CONTRACT_STATUS.UNDER_REVIEW]:   PALETTE.yellow,
  [CONTRACT_STATUS.APPROVED]:       PALETTE.green,
  [CONTRACT_STATUS.REJECTED]:       PALETTE.red,
  [CONTRACT_STATUS.EXPIRED]:        PALETTE.gray,
};

export const STREAMER_COLUMNS: ColumnDef<StreamerListItem>[] = [
  {
    key:   "id",
    label: "ID",
    width: "100px",
    render: (v) => <UUIDText value={v as string} />,
  },
  {
    key:    "fullName",
    label:  "Yayıncı",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {r.fullName}
        </p>
        {r.nickName && (
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            @{r.nickName}
          </p>
        )}
        {r.email && (
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            {r.email}
          </p>
        )}
      </div>
    ),
  },
  {
    key:    "streamerStatus",
    label:  "Durum",
    render: (v) => {
      const c = STREAMER_COLORS[v as STREAMER_STATUS];
      return <Badge label={STREAMER_STATUS_LABELS[v as STREAMER_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key:    "geoCountry",
    label:  "Ülkeler",
    render: (v) => {
      const countries = v as string[];
      if (!countries?.length) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      return (
        <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
          {countries.join(", ")}
        </span>
      );
    },
  },
  {
    key:    "createdAt",
    label:  "Kayıt",
    render: (v) => <DateText value={v as string} />,
  },
];

export const PACKAGE_COLUMNS: ColumnDef<PackageWithCurrentDetail>[] = [
  {
    key:   "id",
    label: "ID",
    width: "100px",
    render: (v) => <UUIDText value={v as string} />,
  },
  {
    key:    "name",
    label:  "Paket Adı",
    sortable: true,
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {r.name}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          Sıra: #{r.orderRank}
        </p>
      </div>
    ),
  },
  {
    key:    "isActive",
    label:  "Durum",
    render: (v) => (
      <Badge
        label={v ? "Aktif" : "Pasif"}
        bg={v ? PALETTE.green.bg : PALETTE.gray.bg}
        color={v ? PALETTE.green.color : PALETTE.gray.color}
      />
    ),
  },
  {
    key:    "details",
    label:  "Güncel Versiyon",
    render: (_, r) => {
      const current = r.details?.[0];
      if (!current) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      return (
        <div>
          <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
            v{current.version}
          </p>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            {current.evaluationPeriodDays} gün
            {current.isStarter && " · Başlangıç"}
          </p>
        </div>
      );
    },
  },
  {
    key:    "createdAt",
    label:  "Oluşturulma",
    render: (v) => <DateText value={v as string} />,
  },
];

export const PACKAGE_DETAIL_COLUMNS: ColumnDef<PackageDetail>[] = [
  {
    key:   "id",
    label: "ID",
    width: "100px",
    render: (v) => <UUIDText value={v as string} />,
  },
  {
    key:    "packageId",
    label:  "Paket",
    render: (v) => <UUIDText value={v as string} />,
  },
  {
    key:    "version",
    label:  "Versiyon",
    render: (v) => (
      <span className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
        v{v as number}
      </span>
    ),
  },
  {
    key:    "isCurrent",
    label:  "Durum",
    render: (v) => (
      <Badge
        label={v ? "Güncel" : "Eski"}
        bg={v ? PALETTE.green.bg : PALETTE.gray.bg}
        color={v ? PALETTE.green.color : PALETTE.gray.color}
      />
    ),
  },
  {
    key:    "evaluationPeriodDays",
    label:  "Değerlendirme Süresi",
    render: (v) => (
      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
        {v as number} gün
      </span>
    ),
  },
  {
    key:    "isStarter",
    label:  "Başlangıç",
    render: (v) => (
      <Badge
        label={v ? "Evet" : "Hayır"}
        bg={v ? PALETTE.blue.bg : PALETTE.gray.bg}
        color={v ? PALETTE.blue.color : PALETTE.gray.color}
      />
    ),
  },
  {
    key:    "criteria",
    label:  "Kriterler",
    render: (v) => {
      const list = v as unknown[];
      return (
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {list?.length ?? 0} kriter
        </span>
      );
    },
  },
];

export const CONTRACT_COLUMNS: ColumnDef<ContractWithRelations>[] = [
  {
    key:   "id",
    label: "ID",
    width: "100px",
    render: (v) => <UUIDText value={v as string} />,
  },
  {
    key:    "streamerId",
    label:  "Yayıncı",
    render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {r.streamer?.fullName ?? "—"}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {r.streamer?.email ?? r.streamerId.slice(0, 8) + "…"}
        </p>
      </div>
    ),
  },
  {
    key:    "status",
    label:  "Durum",
    render: (v) => {
      const c = CONTRACT_COLORS[v as CONTRACT_STATUS];
      return <Badge label={CONTRACT_STATUS_LABELS[v as CONTRACT_STATUS]} bg={c.bg} color={c.color} />;
    },
  },
  {
    key:    "packageId",
    label:  "Paket",
    render: (_, r) => (
      <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
        {r.package?.name ?? "—"}
      </span>
    ),
  },
  {
    key:    "startDate",
    label:  "Başlangıç",
    render: (v) => <DateText value={v as string} />,
  },
  {
    key:    "endDate",
    label:  "Bitiş",
    render: (v) => <DateText value={v as string} />,
  },
  {
    key:    "createdAt",
    label:  "Başvuru",
    render: (v) => <DateText value={v as string} />,
  },
];