"use client";

interface StatusOption {
  label: string;
  value: string;
}

interface DataTableStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options?: StatusOption[];
}

const DEFAULT_OPTIONS: StatusOption[] = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "inactive" },
];

export default function DataTableStatusFilter({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: DataTableStatusFilterProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1 border"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 font-mono"
          style={{
            background: value === option.value
              ? "linear-gradient(90deg, rgba(0,198,162,0.2) 0%, rgba(0,133,255,0.1) 100%)"
              : "transparent",
            color: value === option.value ? "#00C6A2" : "var(--text-muted)",
            border: value === option.value
              ? "1px solid rgba(0,198,162,0.2)"
              : "1px solid transparent",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}