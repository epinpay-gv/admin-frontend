"use client";

import Input from "@/components/common/input/Input";
import { ProductFormData } from "@/features/products/hooks/useProductForm";

interface ProductFormPricingProps {
  form: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProductFormPricing({
  form,
  errors,
  onChange,
}: ProductFormPricingProps) {
  const basePrice = Number(form.basePrice) || 0;
  const fakePrice = Number(form.fakePrice) || 0;
  const discountRate = Number(form.discountRate) || 0;
  const calculatedDiscount = fakePrice > 0
    ? Math.round(((fakePrice - basePrice) / fakePrice) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="basePrice"
          label="Satış Fiyatı"
          type="number"
          value={form.basePrice}
          onChange={onChange}
          error={errors.basePrice}
          leftIcon={<span className="text-xs">₺</span>}
          placeholder="0.00"
        />
        <Input
          name="fakePrice"
          label="Gerçek Fiyat (Üstü Çizili)"
          type="number"
          value={form.fakePrice}
          onChange={onChange}
          leftIcon={<span className="text-xs">₺</span>}
          placeholder="0.00"
          hint="Kampanya öncesi fiyat."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="discountRate"
          label="İndirim Oranı"
          type="number"
          value={form.discountRate}
          onChange={onChange}
          leftIcon={<span className="text-xs">%</span>}
          placeholder="0"
        />
        <Input
          name="epPrice"
          label="EP Fiyatı"
          type="number"
          value={form.epPrice}
          onChange={onChange}
          leftIcon={<span className="text-xs">₺</span>}
          placeholder="0.00"
          hint="Epinpay özel fiyatı."
        />
      </div>

      {/* Fiyat özeti */}
      {basePrice > 0 && (
        <div
          className="rounded-xl border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          {[
            { label: "Satış Fiyatı", value: `₺ ${basePrice.toFixed(2)}`, color: "#00C6A2" },
            { label: "Gerçek Fiyat", value: fakePrice > 0 ? `₺ ${fakePrice.toFixed(2)}` : "-", color: "var(--text-secondary)" },
            { label: "İndirim", value: discountRate > 0 ? `%${discountRate}` : calculatedDiscount > 0 ? `%${calculatedDiscount}` : "-", color: "#FFB400" },
            { label: "EP Fiyatı", value: form.epPrice ? `₺ ${Number(form.epPrice).toFixed(2)}` : "-", color: "#0085FF" },
          ].map((item) => (
            <div key={item.label}>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </p>
              <p className="text-base font-semibold" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}