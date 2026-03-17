"use client";

import { OfferFormValues } from "@/features/store/types";
import Input from "@/components/common/input/Input";

interface Props {
  values:   OfferFormValues;
  onChange: (patch: Partial<OfferFormValues>) => void;
}

export default function OfferFormAutomatic({ values, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Input
        name="stock"
        label="Stok Adedi"
        type="number"
        value={String(values.stock ?? "")}
        onChange={(e) => onChange({ stock: Number(e.target.value) })}
        placeholder="0"
        hint="Kod havuzundaki mevcut stok sayısı."
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
        hint="Stok bu sayının altına düşünce uyarı verilir. Opsiyonel."
      />
    </div>
  );
}