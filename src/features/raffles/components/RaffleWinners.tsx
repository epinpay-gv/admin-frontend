"use client";

import { RaffleWinner, WINNER_STATUS, WINNER_STATUS_LABELS } from "@/features/raffles/types";
import { Trophy, Shield } from "lucide-react";

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
  if (winners.length === 0) {
    return (
      <p
        className="text-sm font-mono text-center py-6"
        style={{ color: "var(--text-muted)" }}
      >
        Henüz kazanan belirlenmedi.
      </p>
    );
  }

  const asil = winners.filter((w) => !w.isBackup);
  const yedek = winners.filter((w) => w.isBackup);

  return (
    <div className="space-y-4">
      {asil.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={13} style={{ color: "#FFB400" }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Asil Kazananlar
            </p>
          </div>
          <div className="space-y-2">
            {asil.map((w) => (
              <WinnerRow key={w.id} winner={w} />
            ))}
          </div>
        </div>
      )}

      {yedek.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={13} style={{ color: "#0085FF" }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Yedek Kazananlar
            </p>
          </div>
          <div className="space-y-2">
            {yedek.map((w) => (
              <WinnerRow key={w.id} winner={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WinnerRow({ winner }: { winner: RaffleWinner }) {
  const colors = WINNER_STATUS_COLORS[winner.status];
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border"
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {winner.userName}
        </p>
        <p
          className="text-[11px] font-mono truncate"
          style={{ color: "var(--text-muted)" }}
        >
          {winner.userEmail} · {winner.rewardName}
        </p>
        <p
          className="text-[11px] font-mono mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Atandı: {new Date(winner.assignedAt).toLocaleString("tr-TR")}
          {winner.copiedAt && (
            <> · Kopyalandı: {new Date(winner.copiedAt).toLocaleString("tr-TR")}</>
          )}
        </p>
      </div>
      <span
        className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap shrink-0 ml-3"
        style={{ background: colors.bg, color: colors.color }}
      >
        {WINNER_STATUS_LABELS[winner.status]}
      </span>
    </div>
  );
}