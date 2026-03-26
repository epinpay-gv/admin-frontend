import { User } from "@/features/users/types";
import { Section } from "@/features/users/components/Section";

const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleString("tr-TR") : "—";

export function ProfilTab({ user }: { user: User }) {
  const fields = [
    { label: "Kullanıcı Adı", value: user.username },
    { label: "E-posta", value: user.email },
    { label: "Ülke", value: user.country },
    { label: "Referans Sayısı", value: String(user.referralCount) },
    { label: "Referans Kazancı", value: `₺ ${user.referralEarnings.toFixed(2)}` },
    { label: "Kayıt Tarihi", value: formatDate(user.createdAt) },
  ];

  const activityFields = [
    { label: "Son Giriş", value: formatDate(user.activity.lastLoginAt) },
    { label: "Son Sipariş", value: formatDate(user.activity.lastOrderAt) },
    { label: "Son Ödeme Denemesi", value: formatDate(user.activity.lastPaymentAttemptAt) },
    { label: "Son EP İşlemi", value: formatDate(user.activity.lastEPActionAt) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Section title="Kimlik Bilgileri" fields={fields} />
      <Section title="Son Aktivite" fields={activityFields} />
    </div>
  );
}