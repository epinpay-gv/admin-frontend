"use client";

import { useState } from "react";
import { Offer, OFFER_TYPE } from "../types";
import { useOfferForm } from "../hooks/useOfferForm";
import OfferFormBase from "./OfferFormBase";
import OfferFormAutomatic from "./OfferFormAutomatic";
import OfferFormSummary from "./OfferFormSummary";

interface Props {
  initialOffer?: Offer;
  mode?: "create" | "edit";
  onCancel?: () => void;
}

export default function OfferForm({ initialOffer, mode = "create", onCancel }: Props) {
  const { values, loading, handleChange, handleSubmit, addStocks } = useOfferForm(initialOffer);
  const [step, setStep] = useState(1);

  // Edit modunda stepper yok, tek sayfa
  if (mode === "edit") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <OfferFormBase values={values} mode="edit" onChange={handleChange} />
        
        {/* Stoklu teklifse ek stok ekleme bölümü */}
        {values.type === OFFER_TYPE.NORMAL && (
          <div className="pt-6 border-t" style={{ borderColor: "var(--border)" }}>
            <h4 className="text-sm font-bold mb-4">Stok Ekle</h4>
            <OfferFormAutomatic values={values} onChange={handleChange} />
            <button
              type="button"
              onClick={() => addStocks(values.epins)}
              disabled={loading || values.epins.length === 0}
              className="mt-4 px-6 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: "rgba(0,133,255,0.12)",
                color: "#0085FF",
                opacity: loading || values.epins.length === 0 ? 0.5 : 1,
              }}
            >
              {loading ? "Ekleniyor..." : "Seçili Kodları Ek Stok Olarak Kaydet"}
            </button>
          </div>
        )}

        <div className="flex gap-3 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg text-sm font-mono border"
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: "#0085FF",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Kaydediliyor..." : "Teklifi Güncelle"}
          </button>
        </div>
      </form>
    );
  }

  // Create modunda stepper (3 adım)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex-1 h-1 rounded-full transition-all"
            style={{
              background: step >= s ? "#0085FF" : "var(--border)",
              opacity: step === s ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && <OfferFormBase values={values} mode="create" onChange={handleChange} />}
        {step === 2 && (
          values.type === OFFER_TYPE.NORMAL ? (
            <OfferFormAutomatic values={values} onChange={handleChange} />
          ) : (
            <div className="py-12 text-center text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              Bu teklif tipi stok gerektirmez. <br /> Devam edebilirsiniz.
            </div>
          )
        )}
        {step === 3 && <OfferFormSummary values={values} />}
      </div>

      <div className="flex gap-3 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-2 rounded-lg text-sm font-mono border"
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
          >
            Geri
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-2 rounded-lg text-sm font-bold"
            style={{ background: "#0085FF", color: "white" }}
          >
            Devam Et
          </button>
        ) : (
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: "#00C6A2",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Oluşturuluyor..." : "Teklifi Oluştur"}
          </button>
        )}
      </div>
    </div>
  );
}