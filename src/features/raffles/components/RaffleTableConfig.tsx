import { 
  Raffle, 
  RAFFLE_STATUS, 
  RAFFLE_STATUS_LABELS, 
  RAFFLE_TYPE, 
  RAFFLE_TYPE_LABELS, 
  RAFFLE_CREATOR_TYPE, 
  RAFFLE_CREATOR_TYPE_LABELS,
  PARTICIPATION_RESTRICTION_LABELS
} from "@/features/raffles/types";
import { ColumnDef } from "@/components/common/data-table";
import { PALETTE } from "@/lib/status-color";

export const STATUS_COLORS = {
  [RAFFLE_STATUS.DRAFT]:     PALETTE.yellow,
  [RAFFLE_STATUS.ACTIVE]:    PALETTE.green,
  [RAFFLE_STATUS.FINISHED]:  PALETTE.blue,
  [RAFFLE_STATUS.CANCELLED]: PALETTE.red,
  [RAFFLE_STATUS.INACTIVE]:  PALETTE.gray,
};

export const CREATOR_COLORS = {
  [RAFFLE_CREATOR_TYPE.ADMIN]:     PALETTE.purple,
  [RAFFLE_CREATOR_TYPE.STORE]:     PALETTE.blue,
  [RAFFLE_CREATOR_TYPE.PUBLISHER]: PALETTE.green,
};

export const TYPE_COLORS = {
  [RAFFLE_TYPE.FREE]:   PALETTE.green,
  [RAFFLE_TYPE.EP]:     PALETTE.yellow,
  [RAFFLE_TYPE.COUPON]: PALETTE.blue,
};

export const COLUMNS: ColumnDef<Raffle>[] = [
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
    render: (_, row) => (
      <div className="min-w-[200px]">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {row.name}
        </p>
        <p className="text-[11px] font-mono mt-0.5 truncate max-w-[250px]" style={{ color: "var(--text-muted)" }}>
          {row.description}
        </p>
      </div>
    ),
  },
  {
    key: "creatorType",
    label: "Oluşturan",
    sortable: true,
    render: (_, row) => {
      const colors = CREATOR_COLORS[row.creatorType] || PALETTE.gray;
      return (
        <div>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: colors.bg, color: colors.color }}
          >
            {RAFFLE_CREATOR_TYPE_LABELS[row.creatorType]}
          </span>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
            {row.creatorName}
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
      const colors = TYPE_COLORS[type] || PALETTE.gray;
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
        className="text-[11px] font-mono px-2 py-0.5 rounded-md border"
        style={{
          background: "var(--background-secondary)",
          color: "var(--text-muted)",
          borderColor: "var(--border)",
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
        {row.winnerCount} asil / {row.backupCount} yedek
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
          {new Date(row.startDate).toLocaleDateString("tr-TR")}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          → {new Date(row.endDate).toLocaleDateString("tr-TR")}
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
      const colors = STATUS_COLORS[status] || PALETTE.gray;
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