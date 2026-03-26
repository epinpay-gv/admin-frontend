import { User, VERIFICATION_STATUS } from "@/features/users/types";
import { EmptyState } from "@/features/users/components/EmptyState";

const VERIFICATION_LABELS: Record<VERIFICATION_STATUS, string> = {
  [VERIFICATION_STATUS.COMPLETED]: "Tamamlandı",
  [VERIFICATION_STATUS.PENDING]: "Bekliyor",
  [VERIFICATION_STATUS.FAILED]: "Başarısız",
  [VERIFICATION_STATUS.CANCELLED]: "İptal",
  [VERIFICATION_STATUS.NOT_REQUIRED]: "Gerekli Değil",
};

const VERIFICATION_COLORS: Record<VERIFICATION_STATUS, { bg: string; color: string }> = {
  [VERIFICATION_STATUS.COMPLETED]: { bg: "rgba(0,198,162,0.15)", color: "#00C6A2" },
  [VERIFICATION_STATUS.PENDING]: { bg: "rgba(255,180,0,0.15)", color: "#FFB400" },
  [VERIFICATION_STATUS.FAILED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [VERIFICATION_STATUS.CANCELLED]: { bg: "rgba(255,80,80,0.15)", color: "#FF5050" },
  [VERIFICATION_STATUS.NOT_REQUIRED]: { bg: "var(--background-subtle)", color: "var(--text-muted)" },
};

export function VerifyTab ({ user }: { user: User }) {
  if (!user.verifications.length) return <EmptyState message="Doğrulama kaydı bulunamadı." />;
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {user.verifications.map((v) => (
        <div key={v.id} className="flex items-center justify-between rounded-xl border p-4" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{v.type.toUpperCase()}</p>
            {v.provider && <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>Sağlayıcı: {v.provider}</p>}
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: VERIFICATION_COLORS[v.status].bg, color: VERIFICATION_COLORS[v.status].color }}>
            {VERIFICATION_LABELS[v.status]}
          </span>
        </div>
      ))}
    </div>
  );
}