
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldOff, ShieldCheck } from "lucide-react";




import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import { PREMIUM_STATUS, SuspendPayload, SUSPENSION_REASON, User, USER_STATUS, VERIFICATION_STATUS } from "@/features/users/types";
import { useWalletLedger } from "@/features/users/hooks/useWalletLadger";
import { useEPLedger } from "@/features/users/hooks/useEpLedger";
import { useAdminNotes } from "@/features/users/hooks/useAdminNotes";
import { useUser } from "@/features/users/hooks/useUser";
import { useSuspend } from "@/features/users/hooks/useSuspend";
import Spinner from "@/components/common/spinner/Spinner";

// ─── Tab tanımları ────────────────────────────────────────────────────────────

type Tab = "profil" | "dogrulama" | "premium" | "cuzdan" | "ep" | "notlar";

const TABS: { key: Tab; label: string }[] = [
  { key: "profil", label: "Profil" },
  { key: "dogrulama", label: "Doğrulama" },
  { key: "premium", label: "Premium" },
  { key: "cuzdan", label: "Cüzdan" },
  { key: "ep", label: "EP" },
  { key: "notlar", label: "Notlar" },
];

// ─── Yardımcı sabit ve helper'lar ────────────────────────────────────────────

const STATUS_COLORS: Record<USER_STATUS, { bg: string; color: string }> = {
  [USER_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [USER_STATUS.SUSPENDED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [USER_STATUS.LIMITED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

const STATUS_LABELS: Record<USER_STATUS, string> = {
  [USER_STATUS.ACTIVE]: "Aktif",
  [USER_STATUS.SUSPENDED]: "Askıya Alındı",
  [USER_STATUS.LIMITED]: "Sınırlı",
};

const VERIFICATION_LABELS: Record<VERIFICATION_STATUS, string> = {
  [VERIFICATION_STATUS.COMPLETED]: "Tamamlandı",
  [VERIFICATION_STATUS.PENDING]: "Bekliyor",
  [VERIFICATION_STATUS.FAILED]: "Başarısız",
  [VERIFICATION_STATUS.CANCELLED]: "İptal",
  [VERIFICATION_STATUS.NOT_REQUIRED]: "Gerekli Değil",
};

const VERIFICATION_COLORS: Record<VERIFICATION_STATUS, { bg: string; color: string }> = {
  [VERIFICATION_STATUS.COMPLETED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [VERIFICATION_STATUS.PENDING]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [VERIFICATION_STATUS.FAILED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [VERIFICATION_STATUS.CANCELLED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [VERIFICATION_STATUS.NOT_REQUIRED]: { bg: "var(--background-subtle)", color: "var(--text-muted)" },
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("tr-TR") : "—";

//Alt sekme bileşenleri 

// Profil özeti ve son aktivite
function ProfilTab({ user }: { user: User }) {
  const fields = [
    { label: "Kullanıcı Adı", value: user.username },
    { label: "E-posta", value: user.email },
    { label: "Ülke", value: user.country },
    { label: "Referans Sayısı", value: String(user.referralCount) },
    { label: "Referans Kazancı", value: `₺ ${user.referralEarnings.toFixed(2)}` },
    { label: "Kayıt Tarihi", value: formatDate(user.createdAt) },
  ];

  const activityFields = [
    { label: "Son Giriş", value: formatDate(user.activity.lastLoginAt) },
    { label: "Son Sipariş", value: formatDate(user.activity.lastOrderAt) },
    { label: "Son Ödeme Denemesi", value: formatDate(user.activity.lastPaymentAttemptAt) },
    { label: "Son EP İşlemi", value: formatDate(user.activity.lastEPActionAt) },
  ];

  return (
    <div className="space-y-6">
      <Section title="Kimlik Bilgileri" fields={fields} />
      <Section title="Son Aktivite" fields={activityFields} />
    </div>
  );
}

// Doğrulama durumları
function DogrulamaTab({ user }: { user: User }) {
  if (!user.verifications.length) {
    return <EmptyState message="Doğrulama kaydı bulunamadı." />;
  }

  return (
    <div className="space-y-3">
      {user.verifications.map((v) => {
        const colors = VERIFICATION_COLORS[v.status];
        return (
          <div
            key={v.id}
            className="flex items-center justify-between rounded-xl border p-4"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {v.type.toUpperCase()}
              </p>
              {v.provider && (
                <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Sağlayıcı: {v.provider}
                </p>
              )}
              {v.verifiedAt && (
                <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                  {formatDate(v.verifiedAt)}
                </p>
              )}
            </div>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{ background: colors.bg, color: colors.color }}
            >
              {VERIFICATION_LABELS[v.status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Premium durumu
function PremiumTab({ user }: { user: User }) {
  if (!user.premium) {
    return <EmptyState message="Bu kullanıcının aktif premium paketi bulunmuyor." />;
  }

  const { premium } = user;
  const isActive = premium.status === PREMIUM_STATUS.ACTIVE;

  const fields = [
    { label: "Paket", value: premium.planName ?? "—" },
    { label: "Durum", value: isActive ? "Aktif" : "Pasif" },
    { label: "Ülke", value: premium.country ?? "—" },
    { label: "Başlangıç", value: formatDate(premium.startedAt) },
    { label: "Bitiş", value: formatDate(premium.expiresAt) },
    { label: "Kaynak Sipariş", value: premium.sourceOrderId ? `#${premium.sourceOrderId}` : "—" },
  ];

  return <Section title="Premium Bilgisi" fields={fields} />;
}

// Cüzdan hareketleri
function CuzdanTab({ userId }: { userId: number }) {
  const { entries, loading, error } = useWalletLedger(userId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!entries.length) return <EmptyState message="Cüzdan hareketi bulunamadı." />;

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between rounded-xl border p-4"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {e.type} · {e.sourceType}
            </p>
            {e.note && (
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {e.note}
              </p>
            )}
            <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              {formatDate(e.createdAt)}
            </p>
          </div>
          <span
            className="font-mono font-semibold text-sm"
            style={{ color: e.amount > 0 ? "#00C6A2" : "#FF5050" }}
          >
            {e.amount > 0 ? "+" : ""}
            {e.amount.toFixed(2)} {e.currency}
          </span>
        </div>
      ))}
    </div>
  );
}

// EP hareketleri
function EPTab({ userId }: { userId: number }) {
  const { entries, loading, error } = useEPLedger(userId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!entries.length) return <EmptyState message="EP hareketi bulunamadı." />;

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between rounded-xl border p-4"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {e.type} · {e.sourceType}
              </p>
              {e.isFlagged && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,80,80,0.15)", color: "#FF5050" }}
                >
                  Anomali
                </span>
              )}
            </div>
            {e.note && (
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {e.note}
              </p>
            )}
            <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              {formatDate(e.createdAt)} · Bakiye: {e.balanceAfter} EP
            </p>
          </div>
          <span
            className="font-mono font-semibold text-sm"
            style={{ color: e.amount > 0 ? "#00C6A2" : "#FF5050" }}
          >
            {e.amount > 0 ? "+" : ""}
            {e.amount} EP
          </span>
        </div>
      ))}
    </div>
  );
}

// Admin notları
function NotlarTab({ userId }: { userId: number }) {
  const { notes, loading, saving, error, addNote } = useAdminNotes(userId);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await addNote({ content });
      setContent("");
      toast.success("Not eklendi", "Admin notu başarıyla kaydedildi.");
    } catch {
      toast.error("Hata", "Not kaydedilemedi.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      {/* Not ekleme formu */}
      <div
        className="rounded-xl border p-4"
        style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest font-mono mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Yeni Not
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Not içeriği..."
          className="w-full rounded-lg border p-3 text-sm resize-none outline-none"
          style={{
            background: "var(--background-subtle)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleSubmit}
            disabled={saving || !content.trim()}
            className="text-sm text-white"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {/* Mevcut notlar */}
      {notes.length === 0 ? (
        <EmptyState message="Henüz not eklenmemiş." />
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border p-4"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {note.content}
            </p>
            <p className="text-[11px] font-mono mt-2" style={{ color: "var(--text-muted)" }}>
              {note.createdBy} · {formatDate(note.createdAt)}
              {note.updatedAt && ` · Güncellendi: ${formatDate(note.updatedAt)}`}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

// Ortak küçük bileşenler 

function Section({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label}>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              {f.label}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-red-400 text-sm font-mono">{message}</p>
    </div>
  );
}

// Ana Page 

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const userId = Number(id);

  const { user, loading, error, setUser } = useUser(userId);

  const { suspend, activate, loading: actionLoading } = useSuspend();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const handleSuspend = async () => {
    if (!user) return;
    const payload: SuspendPayload = {
      reason: SUSPENSION_REASON.MANUAL_REVIEW,
      note: "Admin panelinden manuel askıya alındı.",
    };
    try {
      await suspend(userId, payload, (updated) => setUser(updated));
      toast.success("Hesap askıya alındı", `${user.username} askıya alındı.`);
    } catch {
      toast.error("Hata", "İşlem tamamlanamadı.");
    }
  };

  const handleActivate = async () => {
    if (!user) return;
    try {
      await activate(userId, undefined, (updated) => setUser(updated));
      toast.success("Hesap aktifleştirildi", `${user.username} yeniden aktif edildi.`);
    } catch {
      toast.error("Hata", "İşlem tamamlanamadı.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "Kullanıcı bulunamadı."}
        </p>
      </div>
    );
  }

  const statusColors = STATUS_COLORS[user.status];

  return (
    <div>
      {/* ── Üst bar ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {user.username}
              </h1>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{ background: statusColors.bg, color: statusColors.color }}
              >
                {STATUS_LABELS[user.status]}
              </span>
            </div>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              #{user.id} · {user.email}
            </p>
          </div>
        </div>

        {/* UC9: Askıya al / aktifleştir butonu */}
        {user.status === USER_STATUS.SUSPENDED ? (
          <Button
            onClick={handleActivate}
            disabled={actionLoading}
            className="text-sm text-white flex items-center gap-2"
            style={{ background: "rgba(0,198,162,0.9)" }}
          >
            <ShieldCheck size={14} />
            {actionLoading ? "İşleniyor..." : "Aktifleştir"}
          </Button>
        ) : (
          <Button
            onClick={handleSuspend}
            disabled={actionLoading}
            className="text-sm text-white flex items-center gap-2"
            style={{ background: "rgba(255,80,80,0.9)" }}
          >
            <ShieldOff size={14} />
            {actionLoading ? "İşleniyor..." : "Askıya Al"}
          </Button>
        )}
      </div>

      {/* ── Sekmeler ── */}
      <div
        className="flex gap-1 mb-6 rounded-xl p-1 w-fit"
        style={{ background: "var(--background-subtle)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: activeTab === tab.key ? "var(--background-card)" : "transparent",
              color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sekme içerikleri ── */}
      {activeTab === "profil" && <ProfilTab user={user} />}
      {activeTab === "dogrulama" && <DogrulamaTab user={user} />}
      {activeTab === "premium" && <PremiumTab user={user} />}
      {activeTab === "cuzdan" && <CuzdanTab userId={userId} />}
      {activeTab === "ep" && <EPTab userId={userId} />}
      {activeTab === "notlar" && <NotlarTab userId={userId} />}
    </div>
  );
}