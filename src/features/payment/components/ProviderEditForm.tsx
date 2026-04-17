"use client";

import { useState } from "react";
import { PaymentProvider, FEE_TYPE } from "@/features/payment/types";
import Input from "@/components/common/input/Input";
import Dropdown from "@/components/common/input/Dropdown";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProviderEditFormProps {
  initialData: PaymentProvider;
  onSubmit: (data: Partial<PaymentProvider>) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export function ProviderEditForm({
  initialData,
  onSubmit,
  loading,
  onCancel,
}: ProviderEditFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    feeType: initialData.feeType,
    feeValue: Number(initialData.feeValue),
    isActive: initialData.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      feeValue: Number(formData.feeValue)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Sağlayıcı Adı"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Örn: PayTR"
          required
        />

        <div className="grid grid-cols-2 gap-4">
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
            value={formData.feeValue}
            onChange={(e) => setFormData((prev) => ({ ...prev, feeValue: Number(e.target.value) }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border bg-[var(--background-subtle)]" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="space-y-0.5">
            <Label className="text-sm font-bold">Aktiflik Durumu</Label>
            <p className="text-xs text-muted-foreground">Sağlayıcının sistem genelindeki durumunu belirleyin.</p>
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
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            İptal
          </Button>
        )}
        <Button
          type="submit"
          className="text-white min-w-32"
          disabled={loading}
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </span>
          ) : (
            "Değişiklikleri Kaydet"
          )}
        </Button>
      </div>
    </form>
  );
}
