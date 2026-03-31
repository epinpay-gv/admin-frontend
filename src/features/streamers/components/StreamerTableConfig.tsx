import { ColumnDef } from "@/components/common/data-table";
import { PALETTE } from "@/lib/status-color";
import { 
  STREAMER_STATUS, STREAMER_STATUS_LABELS, 
  PACKAGE_STATUS, PACKAGE_STATUS_LABELS,
  TEMPLATE_STATUS, TEMPLATE_STATUS_LABELS,
  VARIANT_STATUS, VARIANT_STATUS_LABELS,
  PACKAGE_REQUEST_STATUS, PACKAGE_REQUEST_STATUS_LABELS,
  PACKAGE_REQUEST_TYPE, PACKAGE_REQUEST_TYPE_LABELS,
  PACKAGE_LEVEL_LABELS,
  Streamer, PackageTemplate, CountryPackageVariant, PackageRequest, TemplateContent
} from "../types";

const Badge = ({ label, bg, color }: { label: string; bg: string; color: string }) => (
  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap" style={{ background: bg, color }}>
    {label}
  </span>
);

const DateText = ({ value }: { value: string | undefined }) => {
  if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  return <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{new Date(value).toLocaleDateString("tr-TR")}</span>;
};

const COLORS = {
  streamer: { [STREAMER_STATUS.PENDING]: PALETTE.yellow, [STREAMER_STATUS.APPROVED]: PALETTE.green, [STREAMER_STATUS.REJECTED]: PALETTE.red },
  package: { [PACKAGE_STATUS.ACTIVE]: PALETTE.green, [PACKAGE_STATUS.EXPIRED]: PALETTE.red, [PACKAGE_STATUS.NONE]: PALETTE.gray },
  template: { [TEMPLATE_STATUS.ACTIVE]: PALETTE.green, [TEMPLATE_STATUS.INACTIVE]: PALETTE.gray },
  variant: { [VARIANT_STATUS.ACTIVE]: PALETTE.green, [VARIANT_STATUS.INACTIVE]: PALETTE.gray },
  request: { [PACKAGE_REQUEST_STATUS.PENDING]: PALETTE.yellow, [PACKAGE_REQUEST_STATUS.APPROVED]: PALETTE.green, [PACKAGE_REQUEST_STATUS.REJECTED]: PALETTE.red },
  reqType: { [PACKAGE_REQUEST_TYPE.RENEWAL]: PALETTE.blue, [PACKAGE_REQUEST_TYPE.UPGRADE]: PALETTE.purple }
};

export const STREAMER_COLUMNS: ColumnDef<Streamer>[] = [
  { key: "id", label: "ID", width: "60px", render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v as number}</span> },
  { key: "name", label: "Yayıncı", sortable: true, render: (_, r) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.name}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{r.email}</p>
      </div>
  )},
  { key: "streamerStatus", label: "Başvuru", render: (v) => {
      const c = COLORS.streamer[v as STREAMER_STATUS];
      return <Badge label={STREAMER_STATUS_LABELS[v as STREAMER_STATUS]} bg={c.bg} color={c.color} />;
  }},
  { key: "packageStatus", label: "Paket", render: (_, r) => {
      const c = COLORS.package[r.packageStatus as PACKAGE_STATUS];
      return <div className="flex flex-col gap-0.5">
        <Badge label={PACKAGE_STATUS_LABELS[r.packageStatus as PACKAGE_STATUS]} bg={c.bg} color={c.color} />
        {r.currentPackageName && <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{r.currentPackageName}</span>}
      </div>
  }},
  { key: "packageEndDate", label: "Bitiş", render: (v) => <DateText value={v as string} /> },
];

export const TEMPLATE_COLUMNS: ColumnDef<PackageTemplate>[] = [
  { key: "id", label: "ID", width: "60px", render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v as number}</span> },
  { key: "name", label: "Şablon", sortable: true, render: (_, r) => (
    <div>
      <p className="text-sm font-medium">{r.name}</p>
      {r.description && <p className="text-[11px] font-mono truncate max-w-[200px] text-[var(--text-muted)]">{r.description}</p>}
    </div>
  )},
  { key: "level", label: "Seviye", render: (v) => <span>{PACKAGE_LEVEL_LABELS[v as keyof typeof PACKAGE_LEVEL_LABELS]}</span> },
  { key: "status", label: "Durum", render: (v) => {
      const c = COLORS.template[v as TEMPLATE_STATUS];
      return <Badge label={TEMPLATE_STATUS_LABELS[v as TEMPLATE_STATUS]} bg={c.bg} color={c.color} />;
  }},
  { 
    key: "contents", 
    label: "İçerik", 
    render: (v) => {
      // HATA ÇÖZÜMÜ: Objeyi değil, dizinin uzunluğunu render ediyoruz
      const contentList = v as TemplateContent[];
      return <span className="text-xs font-mono text-[var(--text-muted)]">{contentList?.length || 0} Madde</span>;
    } 
  }
];

export const VARIANT_COLUMNS: ColumnDef<CountryPackageVariant>[] = [
  { key: "id", label: "ID", width: "60px", render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v as number}</span> },
  { key: "templateName", label: "Şablon · Ülke", render: (_, r) => (
    <div>
      <p className="text-sm font-medium">{r.templateName}</p>
      <p className="text-[11px] font-mono text-[var(--text-muted)]">{r.countryCode} · {r.countryName}</p>
    </div>
  )},
  { key: "durationDays", label: "Süre", render: (v) => <span className="text-sm font-mono">{v as number} Gün</span> },
  { key: "status", label: "Durum", render: (v) => {
      const c = COLORS.variant[v as VARIANT_STATUS];
      return <Badge label={VARIANT_STATUS_LABELS[v as VARIANT_STATUS]} bg={c.bg} color={c.color} />;
  }}
];

export const REQUEST_COLUMNS: ColumnDef<PackageRequest>[] = [
  { key: "id", label: "ID", width: "60px", render: (v) => <span className="font-mono text-xs font-bold" style={{ color: "#0085FF" }}>#{v as number}</span> },
  { key: "publisherName", label: "Yayıncı", render: (_, r) => (
    <div>
      <p className="text-sm font-medium">{r.publisherName}</p>
      <p className="text-[11px] font-mono text-[var(--text-muted)]">{r.publisherEmail}</p>
    </div>
  )},
  { key: "requestType", label: "Tür", render: (v) => {
      const c = COLORS.reqType[v as PACKAGE_REQUEST_TYPE];
      return <Badge label={PACKAGE_REQUEST_TYPE_LABELS[v as PACKAGE_REQUEST_TYPE]} bg={c.bg} color={c.color} />;
  }},
  { key: "status", label: "Durum", render: (v) => {
      const c = COLORS.request[v as PACKAGE_REQUEST_STATUS];
      return <Badge label={PACKAGE_REQUEST_STATUS_LABELS[v as PACKAGE_REQUEST_STATUS]} bg={c.bg} color={c.color} />;
  }}
];