"use client";

import Modal from "@/components/common/modal/Modal";
import { PaymentMethod } from "@/features/payment/types";
import { Building2 } from "lucide-react";

interface MethodProvidersModalProps {
  open: boolean;
  onClose: () => void;
  method: PaymentMethod | null;
}

export function MethodProvidersModal({ open, onClose, method }: MethodProvidersModalProps) {
  if (!method) return null;

  const providers = method.providers || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bağlı Sağlayıcılar"
      description={`${method.name} yöntemini destekleyen sistemdeki tüm sağlayıcılar.`}
      size="md"
    >
      <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {providers.length > 0 ? (
          providers.map((pm) => (
            <div
              key={pm.id}
              className="flex justify-between items-center p-3 rounded-lg border bg-[var(--background-subtle)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(0,198,162,0.1)] text-[#00C6A2]">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold">{pm.provider?.name || `Sağlayıcı #${pm.providerId}`}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {pm.provider?.feeType === "PERCENTAGE" 
                      ? `%${pm.provider.feeValue} Komisyon` 
                      : `${pm.provider?.feeValue || 0}₺ Sabit`}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                  pm.isActive 
                    ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[#00C6A2]/20" 
                    : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[#FF5050]/20"
                }`}>
                  {pm.isActive ? "İLİŞKİ AKTİF" : "İLİŞKİ PASİF"}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">ID: {pm.providerId}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <Building2 size={32} className="mb-2 text-muted-foreground" />
            <p className="text-sm">Bu yöntemi kullanan bir sağlayıcı bulunamadı.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
