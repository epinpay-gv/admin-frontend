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
          name="spreadRate"
          label="Makas Oranı"
          type="number"
          value={form.spreadRate}
          onChange={onChange}
          leftIcon={<span className="text-xs">%</span>}
          placeholder="0"
          max={100}
          min={0}
          hint="Min fiyat ile satış fiyatı arasındaki makas oranı. Bu oran minimum ve maksimum teklif fiyatını belirler."
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
            { label: "Makas Oranı", value: form.spreadRate ? `%${form.spreadRate}` : "-", color: "#0085FF" },
            { label: "Minimum Fiyat", value: basePrice - (basePrice * (Number(form.spreadRate) / 100)) > 0 ? `₺ ${basePrice - (basePrice * (Number(form.spreadRate) / 100))}` : "-", color: "var(--text-secondary)" },
            { label: "Maksimum Fiyat", value: basePrice + (basePrice * (Number(form.spreadRate) / 100)) > 0 ? `₺ ${basePrice + (basePrice * (Number(form.spreadRate) / 100))}` : "-", color: "#FFB400" },
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