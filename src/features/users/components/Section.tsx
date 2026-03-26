export function Section({ title, fields }: { title: string; fields: { label: string; value: string }[] }) {
  return (
    <div className="rounded-xl border p-6" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest font-mono mb-4" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((f) => (
          <div key={f.label} className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: "var(--text-muted)", opacity: 0.8 }}>
              {f.label}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}