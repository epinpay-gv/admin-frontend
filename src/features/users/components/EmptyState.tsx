export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 rounded-xl border border-dashed" 
         style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
      <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}