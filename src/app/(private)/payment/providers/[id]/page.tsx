"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, Globe, CreditCard, ShieldOff, Edit3, X, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { usePaymentProvider } from "@/features/payment/hooks/usePaymentProvider";
import { useUpdateProvider } from "@/features/payment/hooks/useUpdateProvider";
import { useProviderForbiddenCountries } from "@/features/payment/hooks/useProviderForbiddenCountries";
import { FEE_TYPE } from "@/features/payment/types";
import { ProviderEditForm } from "@/features/payment/components/ProviderEditForm";
import ProviderCountryRestriction from "@/features/payment/components/ProviderCountryRestriction";

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const providerId = Number(id);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { provider, loading, error, refresh, setProvider } = usePaymentProvider(providerId);
  const { updateProvider, loading: updating } = useUpdateProvider();
  const { updateForbiddenCountries, loading: updatingCountries } = useProviderForbiddenCountries();

  const [activeTab, setActiveTab] = useState<"genel" | "ulkeler" | "yontemler">("genel");
  const [isEditing, setIsEditing] = useState(false);
  const [tempForbidden, setTempForbidden] = useState<string[]>([]);

  // Sync forbidden countries state when provider data loads
  useEffect(() => {
    if (provider) {
      setTempForbidden(provider.forbiddenCountries || []);
    }
  }, [provider]);

  // URL'den edit=true gelirse direkt düzenleme modunu aç
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleCountrySave = async (countries: string[]) => {
    await updateForbiddenCountries(providerId, countries, (updated) => {
      setProvider(updated);
    });
  };

  return (
    <PageState loading={loading} error={error} onRetry={() => refresh()}>
      {provider && (
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
                <div className="p-2 rounded-xl bg-[rgba(0,198,162,0.1)] text-[#00C6A2]">
                  <Building2 size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{provider.name}</h1>
                  <p className="text-xs text-muted-foreground font-mono">ID: {provider.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full border ${
                  provider.isActive
                    ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)]"
                    : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)]"
                }`}
              >
                {provider.isActive ? "SİSTEMDE AKTİF" : "SİSTEMDE PASİF"}
              </span>
              
              {isEditing ? (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                  className="text-muted-foreground"
                >
                  <X size={16} className="mr-2" /> Vazgeç
                </Button>
              ) : (
                <Button
                  className="text-white"
                  style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} className="mr-2" /> Düzenle
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          {!isEditing && (
            <div
              className="flex gap-2 p-1 bg-[var(--background-subtle)] rounded-xl w-fit border"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                { key: "genel", label: "Genel Bilgiler", icon: Building2 },
                { key: "ulkeler", label: "Ülke Kısıtlamaları", icon: Globe },
                { key: "yontemler", label: "Bağlı Yöntemler", icon: CreditCard },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    activeTab === t.key
                      ? "bg-[var(--background-card)] shadow-sm text-(--text-primary)"
                      : "opacity-50 text-(--text-muted)"
                  }`}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {isEditing ? (
                <div className="bg-(--background-card) p-8 rounded-2xl border space-y-6">
                  <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: 'var(--border-subtle)' }}>
                     <div className="p-2 rounded-lg bg-[rgba(0,198,162,0.1)] text-[#00C6A2]">
                        <Edit3 size={18} />
                     </div>
                     <div>
                        <h2 className="text-base font-bold">Sağlayıcı Bilgilerini Güncelle</h2>
                        <p className="text-xs text-muted-foreground">ID ve ülke kısıtlamaları hariç temel alanları düzenleyebilirsiniz.</p>
                     </div>
                  </div>
                  <ProviderEditForm
                    initialData={provider}
                    loading={updating}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={async (data) => {
                      await updateProvider(providerId, data, (updated) => {
                        setProvider(updated);
                        setIsEditing(false);
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  {activeTab === "genel" && (
                    <div className="bg-(--background-card) p-6 rounded-2xl border space-y-6 scale-in-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                        Sistem Bilgileri
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Sağlayıcı Adı</p>
                          <p className="text-sm font-medium">{provider.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Komisyon Tipi</p>
                          <p className="text-sm font-medium">
                            {provider.feeType === FEE_TYPE.PERCENTAGE ? "Yüzdelik (%)" : "Sabit (₺)"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Komisyon Değeri</p>
                          <p className="text-sm font-mono font-bold">
                            {provider.feeType === FEE_TYPE.PERCENTAGE
                              ? `%${provider.feeValue}`
                              : `${provider.feeValue}₺`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "ulkeler" && (
                    <div className="bg-(--background-card) p-6 rounded-2xl border space-y-4 scale-in-center">
                      <ProviderCountryRestriction
                        forbidden={tempForbidden}
                        onChange={setTempForbidden}
                        onSave={handleCountrySave}
                        loading={updatingCountries}
                      />
                    </div>
                  )}

                  {activeTab === "yontemler" && (
                    <div className="bg-(--background-card) p-6 rounded-2xl border space-y-4 scale-in-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                        Aktif İlişkili Yöntemler
                      </h3>
                      {provider.methods && provider.methods.length > 0 ? (
                        <div className="space-y-2">
                          {provider.methods.map((pm) => (
                            <div
                              key={pm.id}
                              className="group flex items-center justify-between p-4 rounded-xl border bg-(--background-subtle) hover:border-[#0085FF] transition-all cursor-pointer"
                              onClick={() => router.push(`/payment/methods/${pm.methodId}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[var(--background-card)] group-hover:text-[#0085FF] transition-colors">
                                  <CreditCard size={18} />
                                </div>
                                <div>
                                   <span className="text-sm font-bold">{pm.method?.name || `Yöntem #${pm.methodId}`}</span>
                                   <p className="text-[10px] text-muted-foreground font-mono">İlişki ID: #{pm.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                                    pm.isActive
                                      ? "bg-[rgba(0,198,162,0.1)] text-[#00C6A2] border-[rgba(0,198,162,0.2)]"
                                      : "bg-[rgba(255,80,80,0.1)] text-[#FF5050] border-[rgba(255,80,80,0.2)]"
                                  }`}
                                >
                                  {pm.isActive ? "AKTİF" : "PASİF"}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-[#0085FF]">Detayı Gör</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
                           <CreditCard size={48} className="text-muted-foreground" />
                           <p className="text-sm italic">Henüz herhangi bir ödeme yöntemi ile ilişkilendirilmemiş.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-(--background-card) p-6 rounded-2xl border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                  İstatistikler
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-(--background-subtle)">
                    <span className="text-xs text-muted-foreground">Bağlı Yöntem</span>
                    <span className="text-sm font-black">{provider.methods?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-(--background-subtle)">
                    <span className="text-xs text-muted-foreground">Kısıtlı Ülke</span>
                    <span className={`text-sm font-black ${provider.forbiddenCountries?.length > 0 ? "text-red-500" : ""}`}>
                      {provider.forbiddenCountries?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageState>
  );
}
