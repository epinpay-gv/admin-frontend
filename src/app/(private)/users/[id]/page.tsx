"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import {PageState} from "@/components/common/page-state/PageState";
import { useUser } from "@/features/users/hooks/useUser";
import { useSuspend } from "@/features/users/hooks/useSuspend";
import { USER_STATUS, SuspendPayload, SUSPENSION_REASON } from "@/features/users/types";

// Alt Bileşenleri Import Et
import { ProfilTab } from "@/features/users/components/ProfilTab";
import { VerifyTab } from "@/features/users/components/VerifyTab";
import { PremiumTab } from "@/features/users/components/PremiumTab";
import { WalletTab } from "@/features/users/components//WalletTab";
import { EPTab } from "@/features/users/components/EPTab";
import { NotesTab } from "@/features/users/components/NotesTab";

type Tab = "profil" | "dogrulama" | "premium" | "cuzdan" | "ep" | "notlar";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = Number(id);
  const router = useRouter();
  
  const { user, loading, error, setUser } = useUser(userId);
  const { suspend, activate, loading: actionLoading } = useSuspend();
  const [activeTab, setActiveTab] = useState<Tab>("profil");

  const handleStatusChange = async () => {
    if (!user) return;
    try {
      if (user.status === USER_STATUS.SUSPENDED) {
        await activate(userId, undefined, (updated) => setUser(updated));
        toast.success("Aktif Edildi", "Kullanıcı durumu güncellendi.");
      } else {
        const payload: SuspendPayload = { reason: SUSPENSION_REASON.MANUAL_REVIEW, note: "Manuel işlem." };
        await suspend(userId, payload, (updated) => setUser(updated));
        toast.warning("Askıya Alındı", "Kullanıcı hesabı donduruldu.");
      }
    } catch {
      toast.error("Hata", "İşlem başarısız.");
    }
  };

  return (
    <PageState loading={loading} error={error} onRetry={() => router.refresh()}>
      {user && (
        <div className=" mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-(--background-card) p-4 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft size={18} /></Button>
              <div>
                <h1 className="text-lg font-bold">{user.username}</h1>
                <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
              </div>
            </div>
            <Button 
              variant={user.status === USER_STATUS.SUSPENDED ? "default" : "destructive"}
              onClick={handleStatusChange}
              disabled={actionLoading}
            >
              {user.status === USER_STATUS.SUSPENDED ? <ShieldCheck className="mr-2" size={16}/> : <ShieldOff className="mr-2" size={16}/>}
              {user.status === USER_STATUS.SUSPENDED ? "Aktifleştir" : "Askıya Al"}
            </Button>
          </div>
          <div className="flex gap-2 p-1 bg-[var(--background-subtle)] rounded-xl w-fit border" style={{ borderColor: "var(--border)" }}>
            {["profil", "dogrulama", "premium", "cuzdan", "ep", "notlar"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as Tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === t ? "bg-[var(--background-card)] shadow-sm" : "opacity-50"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-100">
            {activeTab === "profil" && <ProfilTab user={user} />}
            {activeTab === "dogrulama" && <VerifyTab user={user} />}
            {activeTab === "premium" && <PremiumTab user={user} />}
            {activeTab === "cuzdan" && <WalletTab userId={userId} />}
            {activeTab === "ep" && <EPTab userId={userId} />}
            {activeTab === "notlar" && <NotesTab userId={userId} />}
          </div>
        </div>
      )}
    </PageState>
  );
}