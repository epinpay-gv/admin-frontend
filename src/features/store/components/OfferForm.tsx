"use client";

import { useState } from "react";
import { Offer, OfferFormValues, DELIVERY_TYPE, OFFER_STATUS } from "@/features/store/types";
import { useOfferIdFields } from "@/features/store/hooks/useOfferIdFields";
import OfferFormBase from "./OfferFormBase";
import OfferFormAutomatic from "./OfferFormAutomatic";
import OfferFormIdUpload from "./OfferFormIdUpload";
import OfferFormSummary from "./OfferFormSummary";


function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      <span
        className="text-[12px] font-semibold uppercase tracking-widest font-mono whitespace-nowrap"
        style={{ color: "var(--text-heading)" }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

interface OfferFormProps {
  offer:          Offer | null;
  mode:           "create" | "edit";
  saving:         boolean;
  defaultValues:  OfferFormValues;
  onDirtyChange:  (dirty: boolean) => void;
  onSubmit:       (values: OfferFormValues) => Promise<void>;
}

export default function OfferForm({
  offer,
  mode,
  saving,
  defaultValues,
  onDirtyChange,
  onSubmit,
}: OfferFormProps) {
  const [values, setValues] = useState<OfferFormValues>(
    offer
      ? {
          productId:    offer.product.id,
          price:        offer.price.amount,
          currency:     offer.price.currency,
          status:       offer.status,
          deliveryType: offer.deliveryType,
          stock:        offer.stock?.total,
          lowStockAlert: offer.stock?.lowStockAlert ?? undefined,
          idFields:     offer.idFields,
          note:         offer.note ?? undefined,
        }
      : defaultValues
  );

  const { fields, addField, updateField, removeField } = useOfferIdFields(
    offer?.idFields ?? []
  );

  const handleChange = (patch: Partial<OfferFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    onDirtyChange(true);
  };

  const handleSubmit = async () => {
    await onSubmit({
      ...values,
      idFields: values.deliveryType === DELIVERY_TYPE.ID_UPLOAD ? fields : undefined,
      // AUTOMATIC değilse stok gönderilmez
      stock:    values.deliveryType === DELIVERY_TYPE.AUTOMATIC ? values.stock : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ana form */}
      <div className="lg:col-span-2 pt-6 space-y-6">

        {/* Temel bilgiler */}
        <div
          className="rounded-xl border p-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Teklif Bilgileri" />
          <div className="mt-4">
            <OfferFormBase
              values={values}
              mode={mode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Teslimat tipine göre koşullu bölüm */}
        {values.deliveryType === DELIVERY_TYPE.AUTOMATIC && (
          <div
            className="rounded-xl border p-6"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <SectionDivider title="Stok Yönetimi" />
            <div className="mt-4">
              <OfferFormAutomatic
                values={values}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {values.deliveryType === DELIVERY_TYPE.ID_UPLOAD && (
          <div
            className="rounded-xl border p-6"
            style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
          >
            <SectionDivider title="İstenen Bilgiler" />
            <div className="mt-4">
              <OfferFormIdUpload
                fields={fields}
                onAdd={addField}
                onUpdate={updateField}
                onRemove={removeField}
              />
            </div>
          </div>
        )}

      </div>

      {/* özet  */}
      <div className="space-y-4">
        <div
          className="rounded-xl border p-6 sticky top-6"
          style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
        >
          <SectionDivider title="Özet" />
          <div className="mt-4">
            <OfferFormSummary
              values={values}
              saving={saving}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

    </div>
  );
}