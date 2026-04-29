import { buildEntityBadges } from "@/lib/utils";
import { StatusBadges } from "../badges/StatusBadges";
import { BackButton } from "../buttons/BackButton";
import { PageActions } from "../buttons/PageActions";
import { Category, CATEGORY_STATUS } from "@/features/categories";
import { Product, PRODUCT_STATUS } from "@/features/products";
import { PageMode } from "@/types/common.types";
import { PALETTE } from "@/lib/status-color";

const P_STATUS_COLORS = {
  [PRODUCT_STATUS.ACTIVE]: PALETTE.green,
  [PRODUCT_STATUS.INACTIVE]: PALETTE.red,
};

const P_STATUS_LABELS: Record<PRODUCT_STATUS, string> = {
  [PRODUCT_STATUS.ACTIVE]: "Aktif",
  [PRODUCT_STATUS.INACTIVE]: "Pasif",
};

const C_STATUS_COLORS = {
  [CATEGORY_STATUS.ACTIVE]: PALETTE.green,
  [CATEGORY_STATUS.INACTIVE]: PALETTE.red,
};

const C_STATUS_LABELS: Record<CATEGORY_STATUS, string> = {
  [CATEGORY_STATUS.ACTIVE]: "Aktif",
  [CATEGORY_STATUS.INACTIVE]: "Pasif",
};

interface FormPageHeaderProps {
  title: string;
  isDirty: boolean;
  data: Category | Product | null;
  type: "category" | "product";
  mode: PageMode;
  saving: boolean;
  handleSave: () => Promise<void>;
}

export function FormPageHeader({
  title,
  isDirty,
  data,
  type,
  mode,
  saving,
  handleSave,
}: FormPageHeaderProps) {
  let badges = [];
  if (type === "product") {
    const product = data as Product | null;

    badges = buildEntityBadges({
      status: product?.status,
      mode,
      isDirty,
      config: {
        colors: P_STATUS_COLORS,
        labels: P_STATUS_LABELS,
      },
    });
  } else {
    const category = data as Category | null;

    badges = buildEntityBadges({
      status: category?.status,
      mode,
      isDirty,
      config: {
        colors: C_STATUS_COLORS,
        labels: C_STATUS_LABELS,
      },
    });
  }

  return (
    <div
      className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 mb-4 rounded-xl border gap-4"
      style={{
        background: "var(--background-card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <BackButton isDirty={isDirty} />

        <h1
          className="text-xl font-semibold tracking-tight truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <StatusBadges badges={badges} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PageActions
          mode={mode}
          saving={saving}
          onSave={handleSave}
          duplicateHref={
            data ? `/epinpay/categories/copy-${data.id}` : undefined
          }
        />
      </div>
    </div>
  );
}
