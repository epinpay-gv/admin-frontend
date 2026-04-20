import { FilterField } from "@/components/common/filter-panel/types";
import { OFFER_STATUS, OFFER_TYPE } from "../types";
import { STATUS_LABELS, TYPE_LABELS } from "../components/OfferTableConfig";

export const OFFER_FILTERS: FilterField[] = [
  {
    key: "search",
    label: "Ara",
    type: "text",
    placeholder: "Teklif veya mağaza ID ile ara...",
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
  {
    key: "type",
    label: "Tip",
    type: "select",
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ label, value })),
    ],
  },
];