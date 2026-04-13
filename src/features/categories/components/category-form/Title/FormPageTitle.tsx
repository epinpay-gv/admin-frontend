"use client";
import { ArrowLeft, Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PALETTE } from "@/lib/status-color";
import { useRouter } from "next/navigation";
import { Category, CATEGORY_STATUS } from "@/features/categories/types";

type PageMode = "create" | "edit" | "duplicate";

const STATUS_COLORS = {
  [CATEGORY_STATUS.ACTIVE]: PALETTE.green,
  [CATEGORY_STATUS.INACTIVE]: PALETTE.red,
};

const STATUS_LABELS: Record<CATEGORY_STATUS, string> = {
  [CATEGORY_STATUS.ACTIVE]: "Aktif",
  [CATEGORY_STATUS.INACTIVE]: "Pasif",
};

interface FormPageTitleProps {
  isDirty: boolean;
  pageTitle: string;
  category: Category | null;
  mode: PageMode;
  saving: boolean;
  handleSave: () => Promise<void>;
}

export default function FormPageTitle({
  isDirty,
  pageTitle,
  category,
  mode,
  saving,
  handleSave
}: FormPageTitleProps) {
  const router = useRouter();

  return (
    <div
      className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => {
            if (isDirty) {
              if (
                confirm(
                  "Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?",
                )
              ) {
                router.back();
              }
            } else {
              router.back();
            }
          }}
          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="text-xl font-semibold tracking-tight truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {pageTitle}
            </h1>
            {category && mode === "edit" && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: STATUS_COLORS[category.status].bg,
                  color: STATUS_COLORS[category.status].color,
                }}
              >
                {STATUS_LABELS[category.status]}
              </span>
            )}
            {mode === "create" && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: PALETTE.yellow.bg,
                  color: PALETTE.yellow.color,
                }}
              >
                Yeni
              </span>
            )}
            {mode === "duplicate" && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: PALETTE.blue.bg,
                  color: PALETTE.blue.color,
                }}
              >
                Kopya
              </span>
            )}
            {isDirty && (
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  background: PALETTE.yellow.bg,
                  color: PALETTE.yellow.color,
                }}
              >
                Kaydedilmemiş değişiklikler
              </span>
            )}
          </div>
          {category && (
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              #{category.id} · {category.translation.slug}
            </p>
          )}
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {mode === "edit" && category && (
            <Button
              variant="ghost"
              onClick={() =>
                router.push(`/epinpay/categories/copy-${category.id}`)
              }
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <Copy size={14} />
              Kopyala
            </Button>
          )}
          <Button
            onClick={handleSave}
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
      </div>
    </div>
  );
}
