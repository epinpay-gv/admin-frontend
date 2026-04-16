import { ShieldOff, CreditCard } from "lucide-react";
import { ColumnDef } from "@/components/common/data-table/components/DataTableHeader";
import { PaymentMethod, FEE_TYPE } from "../types";

export const PAYMENT_COLUMNS = (
  setCountryModal: (m: PaymentMethod) => void
): ColumnDef<Record<string, unknown>>[] => [
  {
    key: "name",
    label: "Ödeme Yöntemi",
    sortable: true,
    render: (_, row) => {
      const m = (row as unknown) as PaymentMethod;
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate text-(--text-primary)">
            {m.name}
          </p>
          <p className="text-[11px] font-mono opacity-60 truncate text-(--text-muted)">
            {m.slug}
          </p>
        </div>
      );
    },
  },
{
  key: "providers",
  label: "Sağlayıcı & Komisyon",
  render: (_, row) => {
    const m = (row as unknown) as PaymentMethod;
    return (
      <div className="flex flex-col gap-1.5">
        {m.providers.map((p) => (
          <div key={p.id} className="flex items-center gap-2 w-full">
            <span className="text-xs font-medium w-20 shrink-0 text-(--text-primary)">
              {p.name}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full w-16 text-center bg-[rgba(0,133,255,0.1)] text-[#0085FF]">
              {p.feeType === FEE_TYPE.PERCENTAGE ? `%${p.feeValue}` : `${p.feeValue}₺`}
            </span>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full w-12 text-center ${
                p.isActive
                  ? "bg-[rgba(0,198,162,0.15)] text-[#00C6A2]"
                  : "bg-[rgba(255,80,80,0.15)] text-[#FF5050]"
              }`}
            >
              {p.isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        ))}
      </div>
    );
  },
},
  {
    key: "forbiddenCountries",
    label: "Kısıtlamalar",
    render: (_, row) => {
      const m = (row as unknown) as PaymentMethod;
      const hasForbidden = m.forbiddenCountries && m.forbiddenCountries.length > 0;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCountryModal(m);
          }}
          className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
            hasForbidden
              ? "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)] hover:bg-[rgba(255,80,80,0.15)]"
              : "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)] hover:bg-[rgba(0,198,162,0.15)]"
          }`}
        >
          <ShieldOff size={11} />
          {hasForbidden ? `${m.forbiddenCountries.length} ülke kısıtlı` : "Tüm ülkeler aktif"}
        </button>
      );
    },
  },
];