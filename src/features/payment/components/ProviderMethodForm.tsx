"use client";

import { useState, useEffect } from "react";
import { ProviderMethod, PaymentProvider, PaymentMethod, FEE_TYPE } from "@/features/payment/types";
import { paymentService } from "@/features/payment/services/payment.service";
import { SearchableDropdown } from "@/components/common/input/SearchableDropdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Input from "@/components/common/input/Input";
import Dropdown from "@/components/common/input/Dropdown";
import { cn } from "@/lib/utils";

interface ProviderMethodFormProps {
  onSubmit: (data: Partial<ProviderMethod>) => Promise<void>;
  initialData?: ProviderMethod | null;
  loading?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function ProviderMethodForm({
  onSubmit,
  initialData,
  loading,
  onCancel,
  isEdit = false,
}: ProviderMethodFormProps) {
  const [formData, setFormData] = useState({
    providerId: "",
    methodId: "",
    isActive: true,
    hasCustomCommission: false,
    feeType: FEE_TYPE.PERCENTAGE,
    feeValue: "" as string | number,
  });

  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      paymentService.getProviders(),
      paymentService.getMethods()
    ]).then(([p, m]) => {
      setProviders(p);
      setMethods(m);
      
      if (initialData) {
        setFormData({
          providerId: initialData.providerId.toString(),
          methodId: initialData.methodId.toString(),
          isActive: initialData.isActive,
          hasCustomCommission: initialData.feeValue !== null && initialData.feeValue !== undefined,
          feeType: initialData.feeType || FEE_TYPE.PERCENTAGE,
          feeValue: initialData.feeValue ?? "",
        });
      }
      
      setDataLoading(false);
    });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      providerId: Number(formData.providerId),
      methodId: Number(formData.methodId),
      isActive: formData.isActive,
      feeType: formData.hasCustomCommission ? formData.feeType : null,
      feeValue: formData.hasCustomCommission ? Number(formData.feeValue) : null,
    });
  };

  const isFormValid = formData.providerId && formData.methodId && 
    (!formData.hasCustomCommission || (formData.feeValue !== "" && !isNaN(Number(formData.feeValue))));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableDropdown
            label="Ödeme Sağlayıcısı"
            value={formData.providerId}
            options={providers.map(p => ({ label: p.name, value: p.id.toString() }))}
            onChange={(val) => setFormData(prev => ({ ...prev, providerId: val }))}
            placeholder={dataLoading ? "Yükleniyor..." : "Bir sağlayıcı seçin..."}
          />
          
          <SearchableDropdown
            label="Ödeme Yöntemi"
            value={formData.methodId}
            options={methods.map(m => ({ label: m.name, value: m.id.toString() }))}
            onChange={(val) => setFormData(prev => ({ ...prev, methodId: val }))}
            placeholder={dataLoading ? "Yükleniyor..." : "Bir yöntem seçin..."}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border bg-[var(--background-subtle)]" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="space-y-0.5">
            <Label className="text-sm font-bold">Özel Komisyon Tanımla</Label>
            <p className="text-xs text-muted-foreground">Global sağlayıcı komisyonu yerine bu ilişkiye özel değer kullanın.</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, hasCustomCommission: !prev.hasCustomCommission }))}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00C6A2] focus:ring-offset-2",
              formData.hasCustomCommission ? "bg-[#00C6A2]" : "bg-gray-200"
            )}
            style={{ backgroundColor: formData.hasCustomCommission ? "#00C6A2" : "var(--border)" }}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                formData.hasCustomCommission ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {formData.hasCustomCommission && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border bg-[var(--background-subtle)] border-dashed animate-in fade-in slide-in-from-top-2 duration-300" style={{ borderColor: 'var(--border-subtle)' }}>
            <Dropdown
              label="Komisyon Tipi"
              value={formData.feeType}
              onChange={(val) => setFormData((prev) => ({ ...prev, feeType: val as FEE_TYPE }))}
              options={[
                { label: "Yüzdelik (%)", value: FEE_TYPE.PERCENTAGE },
                { label: "Sabit (₺)", value: FEE_TYPE.FIXED },
              ]}
            />
            <Input
              label="Komisyon Değeri"
              type="number"
              step="0.01"
              value={formData.feeValue.toString()}
              onChange={(e) => setFormData((prev) => ({ ...prev, feeValue: e.target.value }))}
              placeholder="0.00"
              required={formData.hasCustomCommission}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl border bg-[var(--background-subtle)]" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="space-y-0.5">
            <Label className="text-sm font-bold">İlişki Durumu</Label>
            <p className="text-xs text-muted-foreground">Bu eşleşmenin sistem genelindeki aktiflik durumu.</p>
          </div>
          <div className="flex bg-[var(--background-card)] p-1 rounded-lg border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: true }))}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
                formData.isActive
                  ? "bg-[rgba(0,198,162,0.15)] text-[#00C6A2] ring-1 ring-[#00C6A2]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isActive: false }))}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all",
                !formData.isActive
                  ? "bg-[rgba(255,80,80,0.15)] text-[#FF5050] ring-1 ring-[#FF5050]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              Pasif
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading || dataLoading}>
            İptal
          </Button>
        )}
        <Button
          type="submit"
          className="text-white min-w-32"
          disabled={loading || dataLoading || !isFormValid}
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEdit ? "Güncelleniyor..." : "Oluşturuluyor..."}
            </span>
          ) : (
            isEdit ? "Değişiklikleri Kaydet" : "İlişkiyi Kaydet"
          )}
        </Button>
      </div>
    </form>
  );
}
