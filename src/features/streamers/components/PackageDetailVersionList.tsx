"use client";

import { PackageDetail } from "@/features/streamers/types";

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

interface PackageDetailVersionListProps {
  versions: PackageDetail[];
  currentDetailId?: string; 
}

export default function PackageDetailVersionList({
  versions,
  currentDetailId,
}: PackageDetailVersionListProps) {
  if (!versions.length) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
      >
        <p className="text-sm font-mono text-center py-4" style={{ color: "var(--text-muted)" }}>
          Bu pakete ait versiyon bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Versiyon Geçmişi · {versions.length} kayıt
      </p>

      <div className="space-y-2">
        {versions.map((v) => {
          const isCurrent = v.isCurrent || v.id === currentDetailId;
          return (
            <div
              key={v.id}
              className="flex items-start justify-between rounded-lg px-4 py-3 gap-4"
              style={{
                background: isCurrent ? "rgba(0,198,162,0.05)" : "var(--background-secondary)",
                border: `1px solid ${isCurrent ? "rgba(0,198,162,0.3)" : "var(--border)"}`,
              }}
            >
              {/* Sol: versiyon bilgisi */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                    v{v.version}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "rgba(0,198,162,0.15)", color: "#00C6A2" }}
                    >
                      Güncel
                    </span>
                  )}
                  {v.isStarter && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "rgba(0,133,255,0.15)", color: "#0085FF" }}
                    >
                      Başlangıç
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  Değerlendirme: {v.evaluationPeriodDays} gün
                  {" · "}
                  {v.criteria.length} kriter
                  {v.eligibleCountries?.length
                    ? ` · ${v.eligibleCountries.join(", ")}`
                    : ""}
                </p>
              </div>

              {/* Sağ: tarih */}
              <div className="text-right shrink-0">
                <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                  {fmt(v.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}