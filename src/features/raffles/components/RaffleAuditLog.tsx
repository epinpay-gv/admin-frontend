"use client";

import { RaffleAuditLog as RaffleAuditLogType, AUDIT_ACTION, AUDIT_ACTION_LABELS } from "@/features/raffles/types";
import { AUDIT_ACTION_ICONS } from "@/features/raffles/constants/auditIcons";

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
      <div
        className="flex items-center justify-center py-10 rounded-xl border border-dashed"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-sm font-mono">Log kaydı bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute left-4.75 top-0 bottom-0 w-px"
        style={{ background: "var(--border)" }}
      />
      <div className="space-y-4">
        {[...logs].reverse().map((log) => {
          const colors = ACTION_COLORS[log.action];
          return (
            <div key={log.id} className="flex items-center gap-4 relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2"
                  style={{ background: colors.bg, borderColor: colors.color }}
                >
                  {AUDIT_ACTION_ICONS[log.action]}
                </div>

              <div
                className="flex-1 rounded-xl border p-3"
                style={{
                  background: "var(--background-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{ background: colors.bg, color: colors.color }}
                    >
                      {AUDIT_ACTION_LABELS[log.action]}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {log.adminName}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {new Date(log.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
                {log.description && (
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {log.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}