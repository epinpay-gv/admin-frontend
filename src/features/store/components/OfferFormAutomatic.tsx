"use client";

import { OfferFormValues } from "@/features/store/types";
import EpinInput from "@/features/store/components/EpinInput";

interface Props {
  values: OfferFormValues;
  onChange: (patch: Partial<OfferFormValues>) => void;
}

export default function OfferFormAutomatic({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Stok Kodları (E-pin)
        </label>
        <EpinInput
          value={values.epins ?? []}
          onChange={(epins) => onChange({ epins })}
        />
        <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
          Kodları virgülle (,) ayırarak veya yeni satıra geçerek toplu şekilde girebilirsiniz.
        </p>
      </div>
    </div>
  );
}