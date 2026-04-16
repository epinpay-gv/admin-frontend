"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Building2, Link2, Edit3, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/page-state/PageState";
import { usePaymentMethod } from "@/features/payment/hooks/usePaymentMethod";
import { useUpdateMethod } from "@/features/payment/hooks/useUpdateMethod";
import { FEE_TYPE } from "@/features/payment/types";
import { MethodEditForm } from "@/features/payment/components/MethodEditForm";

export default function MethodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const methodId = Number(id);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { method, loading, error, refresh, setMethod } = usePaymentMethod(methodId);
  const { updateMethod, loading: updating } = useUpdateMethod();
  
  const [activeTab, setActiveTab] = useState<"genel" | "saglayicilar">("genel");
  const [isEditing, setIsEditing] = useState(false);

  // URL'den edit=true gelirse direkt düzenleme modunu aç
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  return (
    <PageState loading={loading} error={error} onRetry={() => refresh()}>
      {method && (
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
                <div className="p-2 rounded-xl bg-[rgba(0,133,255,0.1)] text-[#0085FF]">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{method.name}</h1>
                  <p className="text-xs text-muted-foreground font-mono">{method.slug}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-[#0085FF] text-[#0085FF] hover:bg-[rgba(0,133,255,0.05)]"
                >
                  <Edit3 size={16} className="mr-2" /> Düzenle
                </Button>
              )}
            </div>
          </div>

          {!isEditing && (
            <div
              className="flex gap-2 p-1 bg-[var(--background-subtle)] rounded-xl w-fit border"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                { key: "genel", label: "Genel Bilgiler", icon: CreditCard },
                { key: "saglayicilar", label: "Aktif Sağlayıcılar", icon: Building2 },
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
                      <h2 className="text-base font-bold">Yöntem Bilgilerini Güncelle</h2>
                      <p className="text-xs text-muted-foreground">ID ve ilişkiler hariç tüm alanları düzenleyebilirsiniz.</p>
                    </div>
                  </div>
                  <MethodEditForm
                    initialData={method}
                    loading={updating}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={async (data) => {
                      await updateMethod(methodId, data, (updated) => {
                        setMethod(updated);
                        setIsEditing(false);
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  {activeTab === "genel" && (
                    <div className="bg-(--background-card) p-6 rounded-2xl border space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                        Metot Detayları
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Yöntem Adı</p>
                          <p className="text-sm font-medium">{method.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Slug</p>
                          <p className="text-sm font-mono">{method.slug}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Sistem ID</p>
                          <p className="text-sm font-mono">#{method.id}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "saglayicilar" && (
                    <div className="bg-(--background-card) p-6 rounded-2xl border space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
                        Bu Yöntemi Sunan Sağlayıcılar
                      </h3>
                      {method.providers && method.providers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {method.providers.map((pm) => (
                            <div
                              key={pm.id}
                              className="flex items-center justify-between p-4 rounded-xl border bg-(--background-subtle) hover:border-[#00C6A2] transition-colors cursor-pointer"
                              onClick={() => router.push(`/payment/providers/${pm.providerId}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-[var(--background-card)]">
                                  <Building2 size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{pm.provider?.name || `Sağlayıcı #${pm.providerId}`}</p>
                                  <p className="text-[10px] text-muted-foreground font-mono">İlişki ID: {pm.id}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-mono font-bold">
                                  {pm.feeValue != null ? (
                                    pm.feeType === FEE_TYPE.PERCENTAGE ? `%${pm.feeValue}` : `${pm.feeValue}₺`
                                  ) : (
                                    <span className="text-muted-foreground font-normal italic text-[10px]">Miras Alınan</span>
                                  )}
                                </p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Komisyon</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic text-center py-8">
                          Bu yöntem şu an hiçbir sağlayıcıya atanmamış.
                        </p>
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
                  Bağlantı Özeti
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(0,133,255,0.05)] text-[#0085FF]">
                  <Link2 size={18} />
                  <div>
                    <p className="text-lg font-bold">{method.providers?.length || 0}</p>
                    <p className="text-[10px] uppercase font-semibold">Aktif Sağlayıcı</p>
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
