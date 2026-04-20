import * as React from "react";
import { OfferFormValues, OFFER_TYPE, OFFER_STATUS } from "@/features/store/types";
import Input from "@/components/common/input/Input";

import { ProductSearch } from "./ProductSearch";
import { StoreSearch } from "./StoreSearch";
import { CurrencySearch } from "./CurrencySearch";
import { offerService } from "../services/offer.service";

interface Props {
  values: OfferFormValues;
  mode: "create" | "edit";
  onChange: (patch: Partial<OfferFormValues>) => void;
}

const TYPE_OPTIONS = [
  { label: "Stoklu (NORMAL)", value: OFFER_TYPE.NORMAL },
  { label: "Stoksuz (DROPSHIPPING)", value: OFFER_TYPE.DROPSHIPPING },
  { label: "Top-Up", value: OFFER_TYPE.TOP_UP },
];

const STATUS_OPTIONS = [
  { label: "Aktif", value: OFFER_STATUS.ACTIVE },
  { label: "Pasif", value: OFFER_STATUS.INACTIVE },
];

export default function OfferFormBase({ values, mode, onChange }: Props) {
  const [productTypes, setProductTypes] = React.useState<any[]>([]);

  // Ürün tiplerini çek (Eşleşme için)
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await offerService.getProductTypes();
        setProductTypes(types);
      } catch (err) {
        console.error("Failed to fetch product types:", err);
      }
    };
    fetchTypes();
  }, []);

  // Teklif tipine göre filtrele
  const filteredTypeIds = React.useMemo(() => {
    if (!productTypes.length) return undefined;
    
    if (values.type === OFFER_TYPE.TOP_UP) {
      const topupType = productTypes.find(t => t.code === 'topup' || t.code === 'top-up');
      return topupType ? [topupType.id] : undefined;
    }
    
    if (values.type === OFFER_TYPE.NORMAL || values.type === OFFER_TYPE.DROPSHIPPING) {
      const epinType = productTypes.find(t => t.code === 'epin');
      return epinType ? [epinType.id] : undefined;
    }

    return undefined;
  }, [values.type, productTypes]);

  // Ürün seçildiğinde product_id'yi güncelle
  const handleProductChange = (productId: number) => {
    onChange({ product_id: productId });
  };

  return (
    <div className="space-y-4">
      {/* Store & Product Selection (Only editable in create mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mode === "create" ? (
          <>
            <StoreSearch 
              value={values.store_id} 
              onChange={(val) => onChange({ store_id: val })} 
            />
            <ProductSearch 
              value={typeof values.product_id === 'number' ? values.product_id : undefined} 
              onChange={handleProductChange}
              typeIds={filteredTypeIds}
            />
          </>
        ) : (
          <>
            <Input
              name="store_id"
              label="Mağaza ID"
              value={values.store_id}
              disabled
              hint="Mağaza değiştirilemez"
            />
            <Input
              name="product_id"
              label="Ürün ID"
              value={String(values.product_id)}
              disabled
              hint="Ürün değiştirilemez"
            />
          </>
        )}
      </div>

      {/* Offer Type — create'te seçilebilir, edit'te kilitli */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Teklif Tipi
        </label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={mode === "edit"}
              onClick={() => {
                onChange({ 
                  type: opt.value, 
                  product_id: ""
                });
              }}
              className="flex-1 py-2 rounded-lg border text-sm font-mono transition-all"
              style={{
                background: values.type === opt.value
                  ? "rgba(0,133,255,0.12)"
                  : "var(--background-secondary)",
                borderColor: values.type === opt.value
                  ? "#0085FF"
                  : "var(--border)",
                color: values.type === opt.value
                  ? "#0085FF"
                  : "var(--text-muted)",
                opacity: mode === "edit" && values.type !== opt.value ? 0.3 : 1,
                cursor: mode === "edit" ? "not-allowed" : "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fiyat + Para birimi */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            name="amount"
            label="Fiyat (Amount)"
            type="number"
            value={String(values.amount)}
            onChange={(e) => onChange({ amount: e.target.value ? Number(e.target.value) : "" })}
            placeholder="0.00"
          />
        </div>
        <div className="flex-1">
          {mode === "create" ? (
            <CurrencySearch
              value={String(values.currency_id)}
              onChange={(val) => onChange({ currency_id: Number(val) })}
              onNameChange={(name) => onChange({ currency_name: name })}
            />
          ) : (
            <Input
              name="currency_id"
              label="Para Birimi ID"
              value={String(values.currency_id)}
              disabled
              hint="Para birimi değiştirilemez"
            />
          )}
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
              type="button"
              onClick={() => onChange({ status: opt.value })}
              className="flex-1 py-2 rounded-lg border text-sm font-mono transition-all"
              style={{
                background: values.status === opt.value
                  ? opt.value === OFFER_STATUS.ACTIVE
                    ? "rgba(0,198,162,0.12)"
                    : "rgba(255,80,80,0.10)"
                  : "var(--background-secondary)",
                borderColor: values.status === opt.value
                  ? opt.value === OFFER_STATUS.ACTIVE ? "#00C6A2" : "#FF5050"
                  : "var(--border)",
                color: values.status === opt.value
                  ? opt.value === OFFER_STATUS.ACTIVE ? "#00C6A2" : "#FF5050"
                  : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {values.type === OFFER_TYPE.NORMAL && (
        <Input
          name="min_stock_threshold"
          label="Düşük Stok Uyarı Eşiği"
          type="number"
          value={String(values.min_stock_threshold)}
          onChange={(e) => onChange({ min_stock_threshold: e.target.value ? Number(e.target.value) : "" })}
          placeholder="10"
          hint="Stok bu sayının altına düştüğünde bildirim gönderilir."
        />
      )}

    </div>
  );
}