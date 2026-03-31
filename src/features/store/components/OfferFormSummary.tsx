"use client";

import { Save } from "lucide-react";
import { OfferFormValues, DELIVERY_TYPE } from "@/features/store/types";
import { Button } from "@/components/ui/button";

interface Props {
  values:   OfferFormValues;
  saving:   boolean;
  onSubmit: () => void;
}

const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.AUTOMATIC]:    "Otomatik Teslimat",
  [DELIVERY_TYPE.ID_UPLOAD]:    "ID Yükleme",
  [DELIVERY_TYPE.DROPSHIPPING]: "Stoksuz",
};

export default function OfferFormSummary({ values, saving, onSubmit }: Props) {
  return (
    <div className="space-y-4">

      {/* Özet satırları */}
      {[
        { label: "Teslimat",  value: DELIVERY_LABELS[values.deliveryType] },
        { label: "Fiyat",     value: `${values.currency} ${values.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}` },
        { label: "Durum",     value: values.status === "active" ? "Aktif" : "Pasif" },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {label}
          </span>
          <span className="text-sm font-mono font-medium" style={{ color: "var(--text-primary)" }}>
            {value}
          </span>
        </div>
      ))}

      {/* Teslimat süresi  */}
      {values.deliveryType === DELIVERY_TYPE.ID_UPLOAD && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            Teslimat Süresi
          </span>
          <span className="text-sm font-mono" style={{ color: "#FFB400" }}>
            24 saat
          </span>
        </div>
      )}

      <div className="h-px" style={{ background: "var(--border)" }} />

      {/* Not alanı */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Not 
        </label>
        <textarea
          rows={3}
          value={values.note ?? ""}
          onChange={(e) =>
            (values.note !== e.target.value)
          }
          placeholder="Dahili not..."
          className="w-full rounded-lg border px-3 py-2 text-sm font-mono resize-none"
          style={{
            background:  "var(--background-secondary)",
            borderColor: "var(--border)",
            color:       "var(--text-primary)",
          }}
        />
      </div>

      {/* Kaydet */}
      <Button
        onClick={onSubmit}
        disabled={saving}
        className="w-full text-white flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Kaydediliyor...
          </span>
        ) : (
          <>
            <Save size={14} />
            Kaydet
          </>
        )}
      </Button>

    </div>
  );
}