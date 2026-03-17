"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { useUsers } from "@/features/users/hooks/useUsers";
import { UserListItem, USER_STATUS, UserFilters } from "@/features/users/types";
import Spinner from "@/components/common/spinner/Spinner";

// Sabit etiket ve renk tanımları 

const STATUS_LABELS: Record<USER_STATUS, string> = {
  [USER_STATUS.ACTIVE]: "Aktif",
  [USER_STATUS.SUSPENDED]: "Askıya Alındı",
  [USER_STATUS.LIMITED]: "Sınırlı",
};

const STATUS_COLORS: Record<USER_STATUS, { bg: string; color: string }> = {
  [USER_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [USER_STATUS.SUSPENDED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [USER_STATUS.LIMITED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

const STATUS_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: USER_STATUS.ACTIVE },
  { label: "Askıya Alındı", value: USER_STATUS.SUSPENDED },
  { label: "Sınırlı", value: USER_STATUS.LIMITED },
];

// Tablo kolon tanımları 

type UserRow = UserListItem & Record<string, unknown>;

const COLUMNS: ColumnDef<UserRow>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    searchable: true,
    width: "72px",
  },
  {
    key: "username",
    label: "Kullanıcı",
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {String(value)}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          {row.email as string}
        </p>
      </div>
    ),
  },
  {
    key: "country",
    label: "Ülke",
    sortable: true,
    searchable: true,
    width: "80px",
  },
  {
    key: "isEmailVerified",
    label: "Doğrulama",
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            background: row.isEmailVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)",
            color: row.isEmailVerified ? "#00C6A2" : "#FF5050",
          }}
        >
          E-posta
        </span>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            background: row.isPhoneVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)",
            color: row.isPhoneVerified ? "#00C6A2" : "#FF5050",
          }}
        >
          Telefon
        </span>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            background: row.isKycVerified ? "rgba(0,198,162,0.15)" : "rgba(255,80,80,0.15)",
            color: row.isKycVerified ? "#00C6A2" : "#FF5050",
          }}
        >
          KYC
        </span>
      </div>
    ),
  },
  {
    key: "isPremium",
    label: "Premium",
    sortable: true,
    render: (value) => (
      <span
        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
        style={{
          background: value ? "rgba(0,133,255,0.15)" : "var(--background-subtle)",
          color: value ? "#0085FF" : "var(--text-muted)",
        }}
      >
        {value ? "Premium" : "Ücretsiz"}
      </span>
    ),
  },
  {
    key: "referralCount",
    label: "Referans",
    sortable: true,
    render: (value) => (
      <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: "lastLoginAt",
    label: "Son Giriş",
    sortable: true,
    render: (value) => (
      <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
        {value ? new Date(value as string).toLocaleDateString("tr-TR") : "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Durum",
    sortable: true,
    render: (value) => {
      const status = value as USER_STATUS;
      const colors = STATUS_COLORS[status];
      return (
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
          style={{ background: colors.bg, color: colors.color }}
        >
          {STATUS_LABELS[status]}
        </span>
      );
    },
  },
];

// Page 

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<UserFilters>({});
  const { users, loading, error } = useUsers(filters);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Kullanıcılar
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Tüm kullanıcıları görüntüle ve yönet.
        </p>
      </div>

      <DataTable
        data={users as UserRow[]}
        columns={COLUMNS}
        showStatusFilter
        statusOptions={STATUS_OPTIONS}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => router.push(`/users/${row.id}`)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Eye size={14} />
            </button>
          </div>
        )}
      />
    </div>
  );
}