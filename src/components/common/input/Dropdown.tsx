import { ChevronDown } from "lucide-react";

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  loading,
  error,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full h-11 rounded-lg border px-3 py-2 text-sm outline-none transition-all appearance-none pr-8"
          style={{
            background: "var(--background-card)",
            borderColor: error ? "rgba(239,68,68,0.5)" : "var(--border)",
            color: value ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          <option value="" style={{ background: "var(--background-secondary)" }}>
            Seçiniz...
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: "var(--background-secondary)" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}