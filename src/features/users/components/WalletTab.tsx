import { useWalletLedger } from "@/features/users/hooks/useWalletLadger";
import { EmptyState } from "@/features/users/components/EmptyState";
import { PageState } from "@/components/common/page-state/PageState";

export function WalletTab({ userId }: { userId: number }) {
  const { entries, loading, error } = useWalletLedger(userId);  
  if (!entries.length) return <EmptyState message="Cüzdan hareketi bulunamadı." />;

  return (
    <PageState loading={loading} error={error}>
        <div className="space-y-2 animate-in fade-in duration-300">
        {entries.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-[var(--background-subtle)]" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
            <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{e.type} · {e.sourceType}</p>
                <p className="text-[11px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>{new Date(e.createdAt).toLocaleString("tr-TR")}</p>
            </div>
            <span className="font-mono font-bold text-sm" style={{ color: e.amount > 0 ? "#00C6A2" : "#FF5050" }}>
                {e.amount > 0 ? "+" : ""}{e.amount.toFixed(2)} {e.currency}
            </span>
            </div>
        ))}
        </div>
    </PageState>
  );
}