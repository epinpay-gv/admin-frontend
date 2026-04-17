import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { PaymentProvider, FEE_TYPE } from "../types";

export const getProviderColumns = (
  onEditCountries?: (p: PaymentProvider) => void
): ColumnDef<Record<string, unknown>>[] => [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{ background: "var(--background-secondary)", color: "var(--text-muted)" }}>
          #{p.id}
        </span>
      );
    },
  },
  {
    key: "name",
    label: "Sağlayıcı Adı",
    sortable: true,
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      return (
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {p.name}
        </span>
      );
    },
  },
  {
    key: "feeType",
    label: "Komisyon Tipi",
    sortable: true,
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      const isPercentage = p.feeType === FEE_TYPE.PERCENTAGE;
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
    label: "Komisyon",
    sortable: true,
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      return (
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
          {p.feeType === FEE_TYPE.PERCENTAGE ? `%${p.feeValue}` : `${p.feeValue}₺`}
        </span>
      );
    },
  },
  {
    key: "isActive",
    label: "Durum",
    sortable: true,
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      return (
        <span
          className="text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold"
          style={{
            background: p.isActive ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)",
            color: p.isActive ? "#00C6A2" : "#FF5050",
          }}
        >
          {p.isActive ? "Aktif" : "Pasif"}
        </span>
      );
    },
  },
  {
    key: "forbiddenCountries",
    label: "Yasaklı Ülkeler",
    render: (_, row) => {
      const p = row as unknown as PaymentProvider;
      const count = p.forbiddenCountries?.length ?? 0;
      return (
        <div 
          onClick={() => onEditCountries?.(p)}
          className="cursor-pointer group flex items-center gap-2 w-fit group"
        >
          <span
            className="text-[11px] font-mono px-2.5 py-1 rounded-full transition-all group-hover:ring-2 group-hover:ring-offset-1"
            style={{
              background: count > 0 ? "rgba(255,80,80,0.1)" : "rgba(0,198,162,0.1)",
              color: count > 0 ? "#FF5050" : "#00C6A2",
              // @ts-ignore
              "--tw-ring-color": count > 0 ? "rgba(255,80,80,0.3)" : "rgba(0,198,162,0.3)",
            }}
          >
            {count > 0 ? `${count} ülke kısıtlı` : "Tümü açık"}
          </span>
        </div>
      );
    },
  },
];
