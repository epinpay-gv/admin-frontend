"use client";

import { Streamer } from "@/features/streamers/types";

function fmt(date?: string | Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

interface PackageCardProps {
  streamer: Streamer;
}

export default function PackageCard({ streamer }: PackageCardProps) {
  const activeAssignment = streamer.package_assignments?.[0] ?? null;
  const activePkg        = activeAssignment?.package ?? null;
  const activeDetail     = activeAssignment?.detail ?? null;

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Paket Bilgileri
      </p>

      {!activePkg ? (
        // Aktif paket yok
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: "rgba(160,160,160,0.08)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
            Bu yayıncının aktif bir paketi bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          {/* Paket Adı */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              Aktif Paket
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {activePkg.name}
            </p>
          </div>

          {/* Sıra / Seviye */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              Sıra
            </p>
            <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
              #{activePkg.order_rank}
            </p>
          </div>

          {/* Atanma tarihi */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              Atanma
            </p>
            <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
              {fmt(activeAssignment.assigned_at)}
            </p>
          </div>

          {/* Bitiş tarihi */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              Bitiş
            </p>
            <p
              className="text-sm font-mono"
              style={{
                color: activeAssignment.expires_at
                  ? new Date(activeAssignment.expires_at) < new Date()
                    ? "#FF5050"
                    : "var(--text-secondary)"
                  : "var(--text-muted)",
              }}
            >
              {fmt(activeAssignment.expires_at)}
            </p>
          </div>

          {/* Değerlendirme süresi */}
          {activeDetail && (
            <div className="col-span-2 sm:col-span-4">
              <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                Değerlendirme Süresi
              </p>
              <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                {activeDetail.evaluation_period_days} gün
                {activeDetail.is_starter && (
                  <span
                    className="ml-2 text-[11px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
                  >
                    Başlangıç Paketi
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}