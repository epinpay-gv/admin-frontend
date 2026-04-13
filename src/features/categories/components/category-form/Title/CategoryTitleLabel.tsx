import { PALETTE } from "@/lib/status-color";
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

interface CategoryTitleLabelProps {
  isDirty: boolean;
  category: Category | null;
  mode: PageMode;
}

export default function CategoryTitleLabel({
  isDirty,
  category,
  mode,
}: CategoryTitleLabelProps) {
  return (
    <div className="flex items-center gap-2">
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
  );
}
