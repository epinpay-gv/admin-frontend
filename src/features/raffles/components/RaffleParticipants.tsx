"use client";

import { RaffleParticipant } from "@/features/raffles/types";
import { useRouter } from "next/navigation";
import { Crown, Shield } from "lucide-react";

interface RaffleParticipantsProps {
  participants: RaffleParticipant[];
}

export default function RaffleParticipants({ participants }: RaffleParticipantsProps) {
  const router = useRouter();

  if (participants.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-10 rounded-xl border border-dashed"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-sm font-mono">Henüz katılımcı yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{
            background: p.isWinner
              ? "rgba(0,198,162,0.05)"
              : p.isBackup
              ? "rgba(255,180,0,0.05)"
              : "var(--background-card)",
            borderColor: p.isWinner
              ? "rgba(0,198,162,0.2)"
              : p.isBackup
              ? "rgba(255,180,0,0.2)"
              : "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono"
              style={{
                background: p.isWinner
                  ? "rgba(0,198,162,0.15)"
                  : p.isBackup
                  ? "rgba(255,180,0,0.15)"
                  : "var(--background-secondary)",
                color: p.isWinner
                  ? "#00C6A2"
                  : p.isBackup
                  ? "#FFB400"
                  : "var(--text-muted)",
              }}
            >
              {p.isWinner ? (
                <Crown size={14} />
              ) : p.isBackup ? (
                <Shield size={14} />
              ) : (
                p.userName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {p.userName}
              </p>
              <p
                className="text-[11px] font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                {p.userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {p.isWinner && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: "rgba(0,198,162,0.15)",
                  color: "#00C6A2",
                }}
              >
                Kazanan
              </span>
            )}
            {p.isBackup && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: "rgba(255,180,0,0.15)",
                  color: "#FFB400",
                }}
              >
                Yedek
              </span>
            )}
            <div className="text-right">
              <button
                onClick={() => router.push(`/epinpay/users/${p.userId}`)}
                className="text-[11px] font-mono hover:underline"
                style={{ color: "#0085FF" }}
              >
                {p.userId}
              </button>
              <p
                className="text-[10px] font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                {new Date(p.joinedAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}