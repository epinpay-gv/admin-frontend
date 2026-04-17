import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { ProviderMethod, FEE_TYPE } from "../types";

export const PROVIDER_METHOD_COLUMNS: ColumnDef<Record<string, unknown>>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{ background: "var(--background-secondary)", color: "var(--text-muted)" }}>
          #{pm.id}
        </span>
      );
    },
  },
  {
    key: "provider",
    label: "Sağlayıcı",
    sortable: true,
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {pm.provider?.name ?? `#${pm.providerId}`}
          </p>
          <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
            Provider ID: {pm.providerId}
          </p>
        </div>
      );
    },
  },
  {
    key: "method",
    label: "Ödeme Yöntemi",
    sortable: true,
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {pm.method?.name ?? `#${pm.methodId}`}
          </p>
          {pm.method?.slug && (
            <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              {pm.method.slug}
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "feeType",
    label: "Komisyon Tipi",
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      if (!pm.feeType) {
        return (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full"
            style={{ background: "var(--background-secondary)", color: "var(--text-muted)" }}>
            Miras
          </span>
        );
      }
      const isPercentage = pm.feeType === FEE_TYPE.PERCENTAGE;
      return (
        <span
          className="text-[11px] font-mono px-2.5 py-1 rounded-full"
          style={{
            background: isPercentage ? "rgba(0,133,255,0.1)" : "rgba(168,85,247,0.1)",
            color: isPercentage ? "#0085FF" : "#A855F7",
          }}
        >
          {isPercentage ? "Yüzdelik (%)" : "Sabit (₺)"}
        </span>
      );
    },
  },
  {
    key: "feeValue",
    label: "Komisyon Değeri",
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      if (pm.feeValue == null) {
        return (
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>—</span>
        );
      }
      return (
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
          {pm.feeType === FEE_TYPE.PERCENTAGE ? `%${pm.feeValue}` : `${pm.feeValue}₺`}
        </span>
      );
    },
  },
  {
    key: "isActive",
    label: "Durum",
    render: (_, row) => {
      const pm = row as unknown as ProviderMethod;
      return (
        <span
          className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${
            pm.isActive
              ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)]"
              : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)]"
          }`}
        >
          {pm.isActive ? "AKTİF" : "PASİF"}
        </span>
      );
    },
  },
];
