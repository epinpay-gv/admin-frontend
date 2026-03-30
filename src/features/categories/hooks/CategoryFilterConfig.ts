import { FilterField } from "@/components/common/filter-panel/types";
import { CATEGORY_STATUS } from "../types";

export const CATEGORY_FILTER_CONFIG: FilterField[] = [
  {
    key: "name",
    label: "Kategori Ara",
    type: "text",
    placeholder: "Kategori adı veya slug...",
  },
  {
    key: "status",
    label: "Durum",
    type: "select",
    options: [
      { label: "Tümü", value: "" },
      { label: "Aktif", value: CATEGORY_STATUS.ACTIVE },
      { label: "Pasif", value: CATEGORY_STATUS.INACTIVE },
    ],
  },
];