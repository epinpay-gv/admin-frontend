import { User, PREMIUM_STATUS } from "@/features/users/types";
import { Section } from "@/features/users/components/Section";
import { EmptyState } from "@/features/users/components/EmptyState";

const formatDate = (iso: string | null) => 
  iso ? new Date(iso).toLocaleString("tr-TR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : "—";

export function PremiumTab({ user }: { user: User }) {
  // Kullanıcının premium verisi yoksa veya durumu boşsa
  if (!user.premium) {
    return <EmptyState message="Bu kullanıcının aktif bir premium aboneliği bulunmuyor." />;
  }

  const { premium } = user;
  const isActive = premium.status === PREMIUM_STATUS.ACTIVE;

  const fields = [
    { 
      label: "Paket Adı", 
      value: premium.planName ?? "Standart Paket" 
    },
    { 
      label: "Abonelik Durumu", 
      value: isActive ? "✅ Aktif" : "❌ Pasif / Süresi Dolmuş" 
    },
    { 
      label: "Bölge / Ülke", 
      value: premium.country ?? "Belirtilmemiş" 
    },
    { 
      label: "Kaynak Sipariş", 
      value: premium.sourceOrderId ? `#${premium.sourceOrderId}` : "Manuel Tanımlama" 
    },
    { 
      label: "Başlangıç Tarihi", 
      value: formatDate(premium.startedAt) 
    },
    { 
      label: "Bitiş Tarihi", 
      value: formatDate(premium.expiresAt) 
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Section title="Premium Abonelik Detayları" fields={fields} />
      
      {/* Opsiyonel: Eğer süresi dolmak üzereyse bir uyarı notu eklenebilir */}
      {!isActive && (
        <div className="mt-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-xs text-yellow-500 font-medium">
            Not: Kullanıcının premium süresi dolduğu için özellikleri kısıtlanmıştır.
          </p>
        </div>
      )}
    </div>
  );
}