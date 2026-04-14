"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  isDirty?: boolean;
  confirmMessage?: string;
}

export function BackButton({
  isDirty,
  confirmMessage = "Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (isDirty && !confirm(confirmMessage)) return;
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--border)",
        color: "var(--text-muted)",
      }}
    >
      <ArrowLeft size={16} />
    </button>
  );
}