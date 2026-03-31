import { ColumnDef } from "@/components/common/data-table";
import { UserListItem, USER_STATUS } from "../types";

// Sayfanızdaki orijinal renk ve etiket tanımları
export const USER_STATUS_LABELS: Record<USER_STATUS, string> = {
  [USER_STATUS.ACTIVE]: "Aktif",
  [USER_STATUS.SUSPENDED]: "Askıya Alındı",
  [USER_STATUS.LIMITED]: "Sınırlı",
};

export const USER_STATUS_COLORS: Record<USER_STATUS, { bg: string; color: string }> = {
  [USER_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [USER_STATUS.SUSPENDED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [USER_STATUS.LIMITED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

export const USER_COLUMNS: ColumnDef<UserListItem & Record<string, unknown>>[] = [
  { key: "id", label: "ID", sortable: true, width: "72px" },
  {
    key: "username",
    label: "Kullanıcı",
    sortable: true,
    render: (value, row) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{String(value)}</p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{row.email as string}</p>
      </div>
    ),
  },
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
    key: "isPremium",
    label: "Premium",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ background: value ? "rgba(0,133,255,0.15)" : "var(--background-subtle)", color: value ? "#0085FF" : "var(--text-muted)" }}>
        {value ? "Premium" : "Ücretsiz"}
      </span>
    ),
  },
  {
    key: "referralCount",
    label: "Referans",
    sortable: true,
    render: (value) => <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>{String(value)}</span>,
  },
  {
    key: "lastLoginAt",
    label: "Son Giriş",
    sortable: true,
    render: (value) => <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{value ? new Date(value as string).toLocaleDateString("tr-TR") : "—"}</span>,
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as USER_STATUS;
      const colors = USER_STATUS_COLORS[status];
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: colors.bg, color: colors.color }}>
          {USER_STATUS_LABELS[status]}
        </span>
      );
    },
  },
];