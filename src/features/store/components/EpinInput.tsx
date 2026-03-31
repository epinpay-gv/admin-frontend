"use client";

import { useState, useCallback } from "react";

interface Props {
  value:    string[];
  onChange: (epins: string[]) => void;
}

function parse(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function EpinInput({ value, onChange }: Props) {
  const [raw, setRaw]             = useState<string>(value.join(", "));
  const [dupeCount, setDupeCount] = useState(0);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const input = e.target.value;
      setRaw(input);
      const items  = parse(input);
      const unique = [...new Set(items)];
      setDupeCount(items.length - unique.length);
      onChange(unique);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    const unique = [...new Set(parse(raw))];
    setDupeCount(0);
    setRaw(unique.join(", "));
    onChange(unique);
  }, [raw, onChange]);

  const unique = [...new Set(parse(raw))];
  const count  = unique.length;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: "var(--border)", background: "var(--background-card)" }}
        >
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Stok kodları
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {count} kod
          </span>
        </div>

        <textarea
          value={raw}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          spellCheck={false}
          placeholder="KEY-ABC-123, KEY-DEF-456, KEY-GHI-789"
          className="w-full resize-none px-3 py-2.5 text-sm font-mono outline-none"
          style={{
            background: "var(--background-secondary)",
            color:      "var(--text-primary)",
            lineHeight: "1.6",
          }}
        />

        <div
          className="flex items-center justify-between px-3 py-2 border-t"
          style={{ borderColor: "var(--border)", background: "var(--background-card)" }}
        >
          <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            Virgülle ayırarak girin. Kopyala-yapıştır desteklenir.
          </span>
          {dupeCount > 0 && (
            <span className="text-[11px] font-mono" style={{ color: "#FF5050" }}>
              {dupeCount} tekrar var
            </span>
          )}
        </div>
      </div>

      {count > 0 && (
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {unique.map((key) => (
            <span
              key={key}
              className="text-[11px] font-mono px-2 py-0.5 rounded"
              style={{
                background: "rgba(0,133,255,0.10)",
                color:      "#0085FF",
                border:     "0.5px solid rgba(0,133,255,0.25)",
              }}
            >
              {key}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}