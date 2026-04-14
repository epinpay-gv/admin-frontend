"use client";
import { Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageActionsProps {
  mode: "create" | "edit" | "duplicate";
  saving?: boolean;
  onSave: () => void;
  duplicateHref?: string;
}

export function PageActions({
  mode,
  saving,
  onSave,
  duplicateHref,
}: PageActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {mode === "edit" && duplicateHref && (
        <Button
          variant="ghost"
          onClick={() => router.push(duplicateHref)}
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <Copy size={14} />
          Kopyala
        </Button>
      )}

      <Button
        onClick={onSave}
        disabled={saving}
        className="text-white flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
        }}
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Kaydediliyor...
          </span>
        ) : (
          <>
            <Save size={14} />
            {mode === "create"
              ? "Oluştur"
              : mode === "duplicate"
              ? "Kopyayı Kaydet"
              : "Kaydet"}
          </>
        )}
      </Button>
    </div>
  );
}