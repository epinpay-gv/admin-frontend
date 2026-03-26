import { useEPLedger } from "@/features/users/hooks/useEpLedger";
import { EmptyState } from "@/features/users/components/EmptyState";
import Spinner from "@/components/common/spinner/Spinner";

export function EPTab({ userId }: { userId: number }) {
  const { entries, loading, error } = useEPLedger(userId);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (error) return <p className="text-red-400 text-center py-10">{error}</p>;
  if (!entries.length) return <EmptyState message="EP hareketi bulunamadı." />;

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      {entries.map((e) => (
        <div key={e.id} className="flex items-center justify-between rounded-xl border p-4" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{e.type} · {e.sourceType}</p>
              {e.isFlagged && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">Anomali</span>}
            </div>
            <p className="text-[11px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>{new Date(e.createdAt).toLocaleString("tr-TR")} · Bakiye: {e.balanceAfter} EP</p>
          </div>
          <span className="font-mono font-bold text-sm" style={{ color: e.amount > 0 ? "#00C6A2" : "#FF5050" }}>
            {e.amount > 0 ? "+" : ""}{e.amount} EP
          </span>
        </div>
      ))}
    </div>
  );
}