import { FilterField } from "@/components/common/filter-panel/types";
import { STATUS_LABELS } from "../components/BlogTableConfig";

export const BLOG_FILTERS: FilterField[] = [
  {
    key: "search",
    label: "Slug Ara",
    type: "text",
    placeholder: "Slug ile ara...",
  },
  {
    key: "status",
    label: "Durum",
    type: "select",
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value })),
    ],
  },
];