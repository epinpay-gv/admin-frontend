"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Link2, Building2, CreditCard, ChevronRight, Power, Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { useProviderMethod } from "@/features/payment/hooks/useProviderMethod";
import { useUpdateProviderMethod } from "@/features/payment/hooks/useUpdateProviderMethod";
import { FEE_TYPE, ProviderMethod } from "@/features/payment/types";
import { ProviderMethodEditModal } from "@/features/payment/components/ProviderMethodEditModal";

export default function ProviderMethodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pmId = Number(id);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { providerMethod: pm, loading, error, refresh, setProviderMethod } = useProviderMethod(pmId);
  const { updateProviderMethod, loading: updating } = useUpdateProviderMethod();
  const [toggling, setToggling] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditModalOpen(true);
    }
  }, [searchParams]);

  const handleToggleStatus = async () => {
    if (!pm) return;
    setToggling(true);
    try {
      await updateProviderMethod(pmId, { isActive: !pm.isActive }, (updated: ProviderMethod) => {
        setProviderMethod(updated);
      });
    } finally {
      setToggling(false);
    }
  };

  return (
    <PageState loading={loading} error={error} onRetry={() => router.refresh()}>
      {pm && (
        <div className="space-y-6">
          {/* Header */}
          <div
            className="flex items-center justify-between bg-(--background-card) p-4 rounded-2xl border"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft size={18} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[rgba(168,85,247,0.1)] text-[#A855F7]">
                  <Link2 size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Sağlayıcı - Yöntem İlişkisi</h1>
                  <p className="text-xs text-muted-foreground font-mono">İlişki ID: #{pm.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full border ${
                  pm.isActive
                    ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)]"
                    : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)]"
                }`}
              >
                {pm.isActive ? "AKTİF" : "PASİF"}
              </span>              
              <Button
                className="text-white"
                style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={14} className="mr-2" /> Düzenle
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connection Visualizer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-(--background-card) p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 min-h-60 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--text-muted)_1px,_transparent_1px)] bg-[size:20px_20px]" />
                </div>

                <div 
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-(--background-subtle) hover:border-[#00C6A2] transition-all cursor-pointer z-10 w-full max-w-64"
                  onClick={() => router.push(`/payment/providers/${pm.providerId}`)}
                >
                  <div className="p-4 rounded-full bg-[var(--background-card)] shadow-md">
                    <Building2 size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Sağlayıcı</p>
                    <p className="text-base font-bold">{pm.provider?.name || `#${pm.providerId}`}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#00C6A2] to-[#0085FF] rounded-full hidden md:block" />
                  <div className="p-2 rounded-full border bg-(--background-card) shadow-lg text-[#A855F7]">
                    <ChevronRight size={24} className="rotate-90 md:rotate-0" />
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-[#0085FF] to-[#A855F7] rounded-full hidden md:block" />
                </div>

                <div 
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-(--background-subtle) hover:border-[#0085FF] transition-all cursor-pointer z-10 w-full max-w-64"
                  onClick={() => router.push(`/payment/methods/${pm.methodId}`)}
                >
                  <div className="p-4 rounded-full bg-[var(--background-card)] shadow-md">
                    <CreditCard size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Yöntem</p>
                    <p className="text-base font-bold">{pm.method?.name || `#${pm.methodId}`}</p>
                  </div>
                </div>
              </div>

              {/* Commission Details */}
              <div className="bg-(--background-card) p-6 rounded-2xl border space-y-6">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                   Özel Komisyon Yapılandırması
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl border bg-(--background-subtle) space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground uppercase">Override Durumu</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pm.feeValue != null ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2]" : "bg-(--background-card) text-(--text-muted)"}`}>
                             {pm.feeValue != null ? "ÖZEL TANIMLI" : "MİRAS (VARSAYILAN)"}
                          </span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Uygulanan Komisyon</p>
                          <p className="text-2xl font-mono font-black text-(--text-primary)">
                             {pm.feeValue != null ? (
                                pm.feeType === FEE_TYPE.PERCENTAGE ? `%${pm.feeValue}` : `${pm.feeValue}₺`
                             ) : (
                                <span className="text-lg opacity-40 italic">Global değerler kullanılıyor</span>
                             )}
                          </p>
                       </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-(--background-subtle) space-y-4 opacity-50">
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Global Sağlayıcı Değerleri</p>
                        <div className="flex justify-between items-center">
                           <span className="text-xs">Sağlayıcı Komisyonu</span>
                           <span className="text-xs font-mono">{pm.provider?.feeType === FEE_TYPE.PERCENTAGE ? `%${pm.provider.feeValue}` : `${pm.provider?.feeValue}₺`}</span>
                        </div>
                        <p className="text-[9px] italic leading-tight">Bu değerler, ilişki bazında özel bir komisyon tanımlanmadığında (override) geçerli olur.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Side Info */}
            <div className="space-y-6">
               <div className="bg-(--background-card) p-6 rounded-2xl border space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">İlişki Özeti</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between py-2 border-b">
                        <span className="text-xs">Oluşturulma</span>
                        <span className="text-xs font-mono opacity-60">—</span>
                     </div>
                     <div className="flex justify-between py-2">
                        <span className="text-xs">Son Güncelleme</span>
                        <span className="text-xs font-mono opacity-60">—</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      <ProviderMethodEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        providerMethod={pm}
        onSuccess={(updated: ProviderMethod) => {
          setProviderMethod(updated);
          refresh();
        }}
      />
    </PageState>
  );
}
