"use client";

import { RaffleAuditLog as RaffleAuditLogType, AUDIT_ACTION, AUDIT_ACTION_LABELS } from "@/features/raffles/types";

const ACTION_COLORS: Record<AUDIT_ACTION, { bg: string; color: string }> = {
  [AUDIT_ACTION.CREATED]: { bg: "rgba(0,133,255,0.15)", color: "#0085FF" },
  [AUDIT_ACTION.PUBLISHED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [AUDIT_ACTION.DEACTIVATED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [AUDIT_ACTION.CANCELLED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [AUDIT_ACTION.WINNER_SELECTED]: { bg: "rgba(160,80,255,0.15)", color: "#A050FF" },
  [AUDIT_ACTION.CODE_DELIVERED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [AUDIT_ACTION.BACKUP_PROMOTED]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
};

interface RaffleAuditLogProps {
  logs: RaffleAuditLogType[];
}

export default function RaffleAuditLog({ logs }: RaffleAuditLogProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm font-mono text-center py-6" style={{ color: "var(--text-muted)" }}>
        Henüz log kaydı yok.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {[...logs].reverse().map((log) => {
        const colors = ACTION_COLORS[log.action];
        return (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-lg border"
            style={{
              background: "var(--background-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono whitespace-nowrap shrink-0 mt-0.5"
              style={{ background: colors.bg, color: colors.color }}
            >
              {AUDIT_ACTION_LABELS[log.action]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {log.adminName}
                </p>
                <p className="text-[11px] font-mono shrink-0" style={{ color: "var(--text-muted)" }}>
                  {new Date(log.createdAt).toLocaleString("tr-TR")}
                </p>
              </div>
              {log.description && (
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {log.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}