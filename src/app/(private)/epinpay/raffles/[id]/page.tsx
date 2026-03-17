
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Trophy, ScrollText, Gift } from "lucide-react";
import { useRaffle, RaffleAuditLog, RaffleWinners, RaffleParticipants } from "@/features/raffles";
import {
  RAFFLE_STATUS,
  RAFFLE_STATUS_LABELS,
  RAFFLE_TYPE_LABELS,
  RAFFLE_CREATOR_TYPE_LABELS,
  PARTICIPATION_RESTRICTION_LABELS,
} from "@/features/raffles/types";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/spinner/Spinner";

const STATUS_COLORS: Record<RAFFLE_STATUS, { bg: string; color: string }> = {
  [RAFFLE_STATUS.DRAFT]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [RAFFLE_STATUS.ACTIVE]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [RAFFLE_STATUS.FINISHED]: { bg: "rgba(0,133,255,0.15)", color: "#0085FF" },
  [RAFFLE_STATUS.CANCELLED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [RAFFLE_STATUS.INACTIVE]: { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
};

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span
        className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
        style={{ color: "var(--text-heading)" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export default function RaffleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { raffle, loading, error } = useRaffle(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 text-sm font-mono">
          {error ?? "Çekiliş bulunamadı."}
        </p>
        <Button variant="ghost" onClick={() => router.back()}>
          Geri dön
        </Button>
      </div>
    );
  }

  const statusColors = STATUS_COLORS[raffle.status];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Üst bar */}
      <div
        className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
        style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
            style={{ background: "var(--background-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="text-xl font-semibold tracking-tight truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {raffle.name}
              </h1>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{ background: statusColors.bg, color: statusColors.color }}
              >
                {RAFFLE_STATUS_LABELS[raffle.status]}
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{ background: "var(--background-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
              >
                {RAFFLE_TYPE_LABELS[raffle.type]}
              </span>
            </div>
            <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
              {raffle.id} · {RAFFLE_CREATOR_TYPE_LABELS[raffle.creatorType]}: {raffle.creatorName}
            </p>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
          {/* Sol: Ana bilgiler */}
          <div className="lg:col-span-2 space-y-6">

            {/* Genel Bilgiler */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="Genel Bilgiler" />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Açıklama", value: raffle.description },
                  { label: "Katılım Kısıtı", value: PARTICIPATION_RESTRICTION_LABELS[raffle.participationRestriction] },
                  { label: "Asil Kazanan", value: `${raffle.winnerCount} kişi` },
                  { label: "Yedek Kazanan", value: `${raffle.backupCount} kişi` },
                  { label: "Katılımcı Sayısı", value: `${raffle.participantCount} kişi` },
                  { label: "Başlangıç", value: new Date(raffle.startDate).toLocaleString("tr-TR") },
                  { label: "Bitiş", value: new Date(raffle.endDate).toLocaleString("tr-TR") },
                  { label: "Oluşturulma", value: new Date(raffle.createdAt).toLocaleString("tr-TR") },
                ].map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.label}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
                {raffle.cancelReason && (
                  <div className="sm:col-span-2">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                      style={{ color: "#FF5050" }}
                    >
                      İptal Nedeni
                    </p>
                    <p className="text-sm" style={{ color: "#FF5050" }}>
                      {raffle.cancelReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ödüller */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="Ödüller" />
              <div className="mt-4 space-y-2">
                {raffle.rewards.length === 0 ? (
                  <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
                    Ödül tanımlanmamış.
                  </p>
                ) : (
                  raffle.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Gift size={14} style={{ color: "#00C6A2" }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {reward.name}
                          </p>
                          {reward.description && (
                            <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                              {reward.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
                          {reward.assignedCount}/{reward.quantity}
                        </p>
                        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                          atandı
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Kazananlar */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="Kazananlar" />
              <div className="mt-4">
                <RaffleWinners winners={raffle.winners} />
              </div>
            </div>

            {/* Katılımcılar */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="Katılımcılar" />
              <div className="mt-4">
                <RaffleParticipants
                  participants={raffle.participants}
                  totalCount={raffle.participantCount}
                />
              </div>
            </div>
          </div>

          {/* Sağ: İstatistik + Audit Log */}
          <div className="space-y-6">
            {/* İstatistikler */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="İstatistikler" />
              <div className="mt-4 space-y-3">
                {[
                  { icon: <Users size={14} />, label: "Katılımcı", value: raffle.participantCount, color: "#0085FF" },
                  { icon: <Trophy size={14} />, label: "Kazanan", value: raffle.winnerCount, color: "#FFB400" },
                  { icon: <Gift size={14} />, label: "Ödül Türü", value: raffle.rewards.length, color: "#00C6A2" },
                  { icon: <ScrollText size={14} />, label: "Log Kaydı", value: raffle.auditLogs.length, color: "#A050FF" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log */}
            <div
              className="rounded-xl border p-6"
              style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
            >
              <SectionDivider title="Audit Log" />
              <div className="mt-4">
                <RaffleAuditLog logs={raffle.auditLogs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}