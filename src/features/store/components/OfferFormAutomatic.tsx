"use client";

import { OfferFormValues } from "@/features/store/types";
import Input from "@/components/common/input/Input";
import EpinInput from "@/features/store/components/EpinInput";

interface Props {
  values:   OfferFormValues;
  onChange: (patch: Partial<OfferFormValues>) => void;
}

export default function OfferFormAutomatic({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
      <EpinInput
        value={values.epins ?? []}
        onChange={(epins) => onChange({ epins })}
      />
      <Input
        name="lowStockAlert"
        label="Düşük Stok Uyarı Eşiği"
        type="number"
        value={String(values.lowStockAlert ?? "")}
        onChange={(e) =>
          onChange({ lowStockAlert: e.target.value ? Number(e.target.value) : undefined })
        }
        placeholder="Örn: 10"
        hint="Stok bu sayının altına düşünce uyarı verilir."
      />
    </div>
  );
}