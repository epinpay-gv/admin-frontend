import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { PaymentMethod } from "../types";

export const getMethodColumns = (
  onViewProviders: (method: PaymentMethod) => void
): ColumnDef<Record<string, unknown>>[] => [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (_, row) => {
      const m = row as unknown as PaymentMethod;
      return (
        <span className="text-xs font-mono px-2 py-0.5 rounded-md"
          style={{ background: "var(--background-secondary)", color: "var(--text-muted)" }}>
          #{m.id}
        </span>
      );
    },
  },
  {
    key: "name",
    label: "Yöntem Adı",
    sortable: true,
    render: (_, row) => {
      const m = row as unknown as PaymentMethod;
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {m.name}
          </p>
        </div>
      );
    },
  },
  {
    key: "slug",
    label: "Slug",
    sortable: true,
    render: (_, row) => {
      const m = row as unknown as PaymentMethod;
      return (
        <span className="text-xs font-mono px-2.5 py-1 rounded-md"
          style={{ background: "var(--background-secondary)", color: "var(--text-muted)" }}>
          {m.slug}
        </span>
      );
    },
  },
  {
    key: "providers",
    label: "Bağlı Sağlayıcılar",
    render: (_, row) => {
      const m = row as unknown as PaymentMethod;
      const count = m.providers?.length ?? 0;
      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onViewProviders(m);
          }}
          className="text-[11px] font-mono px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{
            background: count > 0 ? "rgba(0,133,255,0.1)" : "rgba(255,165,0,0.1)",
            color: count > 0 ? "#0085FF" : "#FFA500",
          }}
        >
          {count > 0 ? `${count} sağlayıcı` : "Bağlantı yok"}
        </span>
      );
    },
  },
  {
    key: "isActive",
    label: "Durum",
    render: (_, row) => {
      const m = row as unknown as PaymentMethod;
      return (
        <span
          className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${
            m.isActive
              ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)]"
              : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)]"
          }`}
        >
          {m.isActive ? "AKTİF" : "PASİF"}
        </span>
      );
    },
  },
];
