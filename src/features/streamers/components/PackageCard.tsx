
import {
  Streamer,
  PACKAGE_STATUS,
  PACKAGE_STATUS_LABELS,
} from "@/features/streamers/types";

const PACKAGE_STATUS_COLOR: Record<PACKAGE_STATUS, { bg: string; color: string }> = {
  [PACKAGE_STATUS.ACTIVE]:  { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  [PACKAGE_STATUS.EXPIRED]: { bg: "rgba(255,80,80,0.15)",   color: "#FF5050" },
  [PACKAGE_STATUS.NONE]:    { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
};

function fmt(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("tr-TR");
}

interface PackageCardProps {
  streamer: Streamer;
}

export default function PackageCard({ streamer }: PackageCardProps) {
  const c = PACKAGE_STATUS_COLOR[streamer.packageStatus];

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
        {/* Paket Durumu */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Durum
          </p>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ background: c.bg, color: c.color }}
          >
            {PACKAGE_STATUS_LABELS[streamer.packageStatus]}
          </span>
        </div>

        {/* Paket Adı */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Aktif Paket
          </p>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {streamer.currentPackageName ?? "—"}
          </p>
        </div>

        {/* Başlangıç */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Başlangıç
          </p>
          <p className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            {fmt(streamer.packageStartDate)}
          </p>
        </div>

        {/* Bitiş */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Bitiş
          </p>
          <p
            className="text-sm font-mono"
            style={{
              color: streamer.packageStatus === PACKAGE_STATUS.EXPIRED ? "#FF5050" : "var(--text-secondary)",
            }}
          >
            {fmt(streamer.packageEndDate)}
          </p>
        </div>
      </div>

      {/* Paketsiz uyarısı */}
      {streamer.packageStatus === PACKAGE_STATUS.NONE && (
        <div
          className="mt-4 rounded-lg px-4 py-3"
          style={{ background: "rgba(160,160,160,0.08)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
            Bu yayıncının aktif bir paketi bulunmuyor.
          </p>
        </div>
      )}

      {/* Süresi dolmuş uyarısı */}
      {streamer.packageStatus === PACKAGE_STATUS.EXPIRED && (
        <div
          className="mt-4 rounded-lg px-4 py-3"
          style={{ background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.2)" }}
        >
          <p className="text-sm font-mono" style={{ color: "#FF5050" }}>
            Paket süresi dolmuş. Yayıncı yenileme veya yükseltme talebi oluşturabilir.
          </p>
        </div>
      )}
    </div>
  );
}