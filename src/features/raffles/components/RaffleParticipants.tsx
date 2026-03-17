"use client";

import { RaffleParticipant } from "@/features/raffles/types";
import { Trophy, Shield } from "lucide-react";

interface RaffleParticipantsProps {
  participants: RaffleParticipant[];
  totalCount: number;
}

export default function RaffleParticipants({
  participants,
  totalCount,
}: RaffleParticipantsProps) {
  if (participants.length === 0) {
    return (
      <p
        className="text-sm font-mono text-center py-6"
        style={{ color: "var(--text-muted)" }}
      >
        Henüz katılımcı yok.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Toplam {totalCount} katılımcı
        </p>
        {participants.length < totalCount && (
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            İlk {participants.length} gösteriliyor
          </p>
        )}
      </div>

      <div className="space-y-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{
              background: "var(--background-secondary)",
              borderColor: p.isWinner
                ? "rgba(255,180,0,0.2)"
                : p.isBackup
                ? "rgba(0,133,255,0.2)"
                : "var(--border)",
            }}
          >
            <div className="min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {p.userName}
              </p>
              <p
                className="text-[11px] font-mono truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {p.userEmail} · {p.userId}
              </p>
              <p
                className="text-[11px] font-mono mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Katıldı: {new Date(p.joinedAt).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              {p.isWinner && (
                <span
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(255,180,0,0.15)",
                    color: "#FFB400",
                  }}
                >
                  <Trophy size={10} />
                  Kazanan
                </span>
              )}
              {p.isBackup && (
                <span
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(0,133,255,0.15)",
                    color: "#0085FF",
                  }}
                >
                  <Shield size={10} />
                  Yedek
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}