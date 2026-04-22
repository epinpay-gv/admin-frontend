import { FilterField } from "@/components/common/filter-panel/types";
import {
  STREAMER_STATUS_LABELS,
  CONTRACT_STATUS_LABELS,
} from "../types";

export const STREAMER_FILTERS: FilterField[] = [
  {
    key:         "search",
    label:       "Yayıncı Ara",
    type:        "text",
    placeholder: "Ad veya Email...",
  },
  {
    key:   "status",
    label: "Durum",
    type:  "select",
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(STREAMER_STATUS_LABELS).map(([value, label]) => ({ label, value })),
    ],
  },
  {
    key:         "country",
    label:       "Ülke",
    type:        "text",
    placeholder: "TR, US...",
  },
];

export const PACKAGE_FILTERS: FilterField[] = [
  {
    key:         "search",
    label:       "Paket Ara",
    type:        "text",
    placeholder: "Paket adı...",
  },
  {
    key:   "isActive",
    label: "Durum",
    type:  "select",
    options: [
      { label: "Tümü",  value: "all"   },
      { label: "Aktif", value: "true"  },
      { label: "Pasif", value: "false" },
    ],
  },
];


export const PACKAGE_DETAIL_FILTERS: FilterField[] = [
  {
    key:         "packageId",
    label:       "Paket ID",
    type:        "text",
    placeholder: "UUID...",
  },
  {
    key:   "isCurrent",
    label: "Versiyon",
    type:  "select",
    options: [
      { label: "Tümü",           value: "all"   },
      { label: "Güncel Versiyon", value: "true"  },
      { label: "Eski Versiyon",   value: "false" },
    ],
  },
  {
    key:   "isStarter",
    label: "Başlangıç Paketi",
    type:  "select",
    options: [
      { label: "Tümü", value: "all"   },
      { label: "Evet", value: "true"  },
      { label: "Hayır", value: "false" },
    ],
  },
];


export const CONTRACT_FILTERS: FilterField[] = [
  {
    key:         "search",
    label:       "Yayıncı Ara",
    type:        "text",
    placeholder: "Ad veya Email...",
  },
  {
    key:   "status",
    label: "Sözleşme Durumu",
    type:  "select",
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => ({ label, value })),
    ],
  },
];


export const TAB_FILTERS: Record<string, FilterField[]> = {
  streamers: STREAMER_FILTERS,
  packages:  PACKAGE_FILTERS,
  details:   PACKAGE_DETAIL_FILTERS,
  contracts: CONTRACT_FILTERS,
};