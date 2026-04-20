"use client";

import { OfferFormValues, OFFER_TYPE, OFFER_STATUS } from "@/features/store/types";

interface Props {
  values: OfferFormValues;
}

export default function OfferFormSummary({ values }: Props) {
  const getLabel = (type: string, options: { label: string; value: any }[]) => 
    options.find(o => o.value === type)?.label || type;

  const typeLabel = getLabel(values.type, [
    { label: "Stoklu (NORMAL)", value: OFFER_TYPE.NORMAL },
    { label: "Stoksuz (DROPSHIPPING)", value: OFFER_TYPE.DROPSHIPPING },
    { label: "Top-Up", value: OFFER_TYPE.TOP_UP },
  ]);

  const statusLabel = getLabel(values.status, [
    { label: "Aktif", value: OFFER_STATUS.ACTIVE },
    { label: "Pasif", value: OFFER_STATUS.INACTIVE },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-y-4 text-sm font-mono">
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Mağaza ID</p>
          <p className="truncate pr-4">{values.store_id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ürün ID</p>
          <p>{values.product_id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Teklif Tipi</p>
          <p>{typeLabel}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Durum</p>
          <p>{statusLabel}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Fiyat</p>
          <p className="text-[#00C6A2] font-bold">{values.amount} (Para Birimi: {values.currency_name || values.currency_id})</p>
        </div>
        {values.type === OFFER_TYPE.NORMAL && (
          <div className="space-y-1">
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Girilmiş Stok</p>
            <p>{values.epins.length} E-pin</p>
          </div>
        )}
      </div>

      {values.epins.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>Yüklenecek Kodlar</p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border max-h-40 overflow-y-auto" style={{ background: "var(--background-secondary)", borderColor: "var(--border)" }}>
            {values.epins.map(key => (
              <span key={key} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(0,133,255,0.10)", color: "#0085FF" }}>
                {key}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}