"use client";

import { OfferFormValues, DELIVERY_TYPE, OFFER_STATUS } from "@/features/store/types";
import Input from "@/components/common/input/Input";

interface Props {
  values:   OfferFormValues;
  mode:     "create" | "edit";
  onChange: (patch: Partial<OfferFormValues>) => void;
}

const DELIVERY_OPTIONS = [
  { label: "Otomatik Teslimat", value: DELIVERY_TYPE.AUTOMATIC },
  { label: "ID Yükleme",        value: DELIVERY_TYPE.ID_UPLOAD },
];

const STATUS_OPTIONS = [
  { label: "Aktif", value: OFFER_STATUS.ACTIVE },
  { label: "Pasif", value: OFFER_STATUS.PASSIVE },
];

export default function OfferFormBase({ values, mode, onChange }: Props) {
  return (
    <div className="space-y-4">

      {/* Teslimat tipi — create'te seçilebilir, edit'te kilitli */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Teslimat Tipi
        </label>
        <div className="flex gap-2">
          {DELIVERY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={mode === "edit"}
              onClick={() => onChange({ deliveryType: opt.value })}
              className="flex-1 py-2 rounded-lg border text-sm font-mono transition-all"
              style={{
                background:   values.deliveryType === opt.value
                                ? "rgba(0,133,255,0.12)"
                                : "var(--background-secondary)",
                borderColor:  values.deliveryType === opt.value
                                ? "#0085FF"
                                : "var(--border)",
                color:        values.deliveryType === opt.value
                                ? "#0085FF"
                                : "var(--text-muted)",
                opacity:      mode === "edit" ? 0.6 : 1,
                cursor:       mode === "edit" ? "not-allowed" : "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {mode === "edit" && (
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            Teslimat tipi oluşturulduktan sonra değiştirilemez.
          </p>
        )}
      </div>

      {/* Fiyat + Para birimi */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            name="price"
            label="Fiyat"
            type="number"
            value={String(values.price)}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            placeholder="0.00"
          />
        </div>
        <div className="w-28">
          <Input
            name="currency"
            label="Para Birimi"
            value={values.currency}
            onChange={(e) => onChange({ currency: e.target.value.toUpperCase() })}
            placeholder="TRY"
          />
        </div>
      </div>

      {/* Durum */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Durum
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ status: opt.value })}
              className="flex-1 py-2 rounded-lg border text-sm font-mono transition-all"
              style={{
                background:  values.status === opt.value
                               ? opt.value === OFFER_STATUS.ACTIVE
                                 ? "rgba(0,198,162,0.12)"
                                 : "rgba(255,80,80,0.10)"
                               : "var(--background-secondary)",
                borderColor: values.status === opt.value
                               ? opt.value === OFFER_STATUS.ACTIVE ? "#00C6A2" : "#FF5050"
                               : "var(--border)",
                color:       values.status === opt.value
                               ? opt.value === OFFER_STATUS.ACTIVE ? "#00C6A2" : "#FF5050"
                               : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}