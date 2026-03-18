"use client";

import { RaffleWinner, WINNER_STATUS, WINNER_STATUS_LABELS } from "@/features/raffles/types";
import { useRouter } from "next/navigation";
import { Crown, Shield } from "lucide-react";

const WINNER_STATUS_COLORS: Record<WINNER_STATUS, { bg: string; color: string }> = {
  [WINNER_STATUS.PENDING]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [WINNER_STATUS.ASSIGNED]: { bg: "rgba(0,133,255,0.15)", color: "#0085FF" },
  [WINNER_STATUS.COPIED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [WINNER_STATUS.REPLACED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
};

interface RaffleWinnersProps {
  winners: RaffleWinner[];
}

export default function RaffleWinners({ winners }: RaffleWinnersProps) {
  const router = useRouter();

  if (winners.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-10 rounded-xl border border-dashed"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-sm font-mono">Henüz kazanan belirlenmedi</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {winners.map((w) => {
        const colors = WINNER_STATUS_COLORS[w.status];
        return (
          <div
            key={w.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{
              background: w.isBackup
                ? "rgba(255,180,0,0.05)"
                : "rgba(0,198,162,0.05)",
              borderColor: w.isBackup
                ? "rgba(255,180,0,0.2)"
                : "rgba(0,198,162,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: w.isBackup
                    ? "rgba(255,180,0,0.15)"
                    : "rgba(0,198,162,0.15)",
                  color: w.isBackup ? "#FFB400" : "#00C6A2",
                }}
              >
                {w.isBackup ? <Shield size={14} /> : <Crown size={14} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {w.userName}
                  </p>
                  {w.isBackup && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(255,180,0,0.15)",
                        color: "#FFB400",
                      }}
                    >
                      Yedek
                    </span>
                  )}
                </div>
                <p
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {w.rewardName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <button
                  onClick={() => router.push(`/epinpay/users/${w.userId}`)}
                  className="text-[11px] font-mono hover:underline block"
                  style={{ color: "#0085FF" }}
                >
                  {w.userId}
                </button>
                <p
                  className="text-[10px] font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {new Date(w.assignedAt).toLocaleDateString("tr-TR")}
                  {w.copiedAt && (
                    <span className="ml-1">
                      · Kopyalandı: {new Date(w.copiedAt).toLocaleDateString("tr-TR")}
                    </span>
                  )}
                </p>
              </div>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap"
                style={{ background: colors.bg, color: colors.color }}
              >
                {WINNER_STATUS_LABELS[w.status]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}