import { ColumnDef } from "@/components/common/data-table";
import { UserListItem, USER_STATUS } from "../types";
import { Users } from "lucide-react";

// Etiket tanımları
export const USER_STATUS_LABELS: Record<USER_STATUS, string> = {
  [USER_STATUS.ACTIVE]: "Aktif",
  [USER_STATUS.SUSPENDED]: "Askıya Alındı",
  [USER_STATUS.LIMITED]: "Sınırlı",
};

// Renk tanımları
export const USER_STATUS_COLORS: Record<USER_STATUS, { bg: string; color: string }> = {
  [USER_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [USER_STATUS.SUSPENDED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [USER_STATUS.LIMITED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

export const GET_USER_COLUMNS = (
  setReferralModal: (u: UserListItem) => void
): ColumnDef<UserListItem & Record<string, unknown>>[] => [
  { key: "id", label: "ID", sortable: true, width: "72px" },
  {
    key: "firstName",
    label: "Kullanıcı",
    sortable: true,
    sortKey: "firstname",
    render: (_, row) => (
      <div>
        <p className="text-sm font-medium text-(--text-primary)">
          {`${row.firstName || ''} ${row.lastName || ''}`.trim()}
        </p>        
      </div>
    ),
  },  
  { key: "email", label: "Mail Adresi", sortable: true, sortKey: "email", searchable: true, searchKey: "email"   },
  { key: "country", label: "Ülke", sortable: true, width: "80px" },
  {
    key: "isEmailVerified",
    label: "Doğrulama",
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: row.isEmailVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)", color: row.isEmailVerified ? "#00C6A2" : "#FF5050" }}>E-posta</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: row.isPhoneVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)", color: row.isPhoneVerified ? "#00C6A2" : "#FF5050" }}>Telefon</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: row.isKycVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)", color: row.isKycVerified ? "#00C6A2" : "#FF5050" }}>KYC</span>
      </div>
    ),
  },
  {
    key: "role",
    label: "Rol",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ background: value === 'ADMIN' ? "rgba(0,133,255,0.15)" : "var(--background-subtle)", color: value === 'ADMIN' ? "#0085FF" : "var(--text-muted)" }}>
        {String(value || "USER")}
      </span>
    ),
  },
  {
    key: "referralCode",
    label: "Referans Kodu",
    sortable: true,
    render: (value) => <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>{value ? String(value) : "—"}</span>,
  },
  {
    key: "referralCount",
    label: "Referanslar",
    sortable: true,
    render: (value, row) => {
      const count = Number(value || 0);
      return (
        <button
          disabled={count === 0}
          onClick={(e) => {
            e.stopPropagation();            
            setReferralModal(row as UserListItem);
          }}
          className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
            count > 0
              ? "cursor-pointer bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)] hover:bg-[rgba(0,198,162,0.15)]"
              : "opacity-40 cursor-not-allowed border-transparent text-(--text-muted)"
          }`}
        >
          <Users size={11} />
          {count} Kişi
        </button>
      );
    },
  },
  {
    key: "createdAt",
    label: "Kayıt Tarihi",
    sortable: true,
    render: (value) => <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{value ? new Date(value as string).toLocaleDateString("tr-TR") : "—"}</span>,
  },
  // TODO: Backende status eklendikten sonra açılacak 
  // {
  //   key: "status",
  //   label: "Durum",
  //   sortable: true,
  //   render: (value) => {
  //     const status = (value as USER_STATUS) || USER_STATUS.ACTIVE;
  //     const colors = USER_STATUS_COLORS[status] || USER_STATUS_COLORS[USER_STATUS.ACTIVE];
  //     return (
  //       <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: colors.bg, color: colors.color }}>
  //         {USER_STATUS_LABELS[status] || "Aktif"}
  //       </span>
  //     );
  //   },
  // },
];