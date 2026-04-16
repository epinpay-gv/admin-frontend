"use client";

import { useState } from "react";
import { PaymentMethod } from "@/features/payment/types";
import Input from "@/components/common/input/Input";
import { Button } from "@/components/ui/button";

interface MethodEditFormProps {
  initialData: PaymentMethod;
  onSubmit: (data: Partial<PaymentMethod>) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export function MethodEditForm({
  initialData,
  onSubmit,
  loading,
  onCancel,
}: MethodEditFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    slug: initialData.slug,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Yöntem Adı"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Örn: Kredi Kartı"
          required
        />
        <Input
          label="Slug (Tekil Tanımlayıcı)"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="trn-credit-card"
          required
          hint="Sistem genelinde benzersiz bir tanımlayıcı olmalıdır."
        />
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
