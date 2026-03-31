import { FilterField } from "@/components/common/filter-panel/types";
import { STREAMER_STATUS_LABELS,
        TEMPLATE_STATUS_LABELS,
        VARIANT_STATUS_LABELS,
        PACKAGE_REQUEST_STATUS_LABELS,
        PACKAGE_REQUEST_TYPE_LABELS } from "../types";

export const STREAMER_FILTERS: FilterField[] = [
  { key: "search", label: "Yayıncı Ara", type: "text", placeholder: "Ad veya Email..." },
  { 
    key: "streamerStatus", 
    label: "Başvuru Durumu", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(STREAMER_STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  }
];

export const TEMPLATE_FILTERS: FilterField[] = [
  { key: "name", label: "Şablon Adı", type: "text" },
  { 
    key: "status", 
    label: "Durum", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(TEMPLATE_STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  }
];

export const VARIANT_FILTERS: FilterField[] = [
  { key: "templateName", label: "Şablon Ara", type: "text" },
  { key: "countryCode", label: "Ülke Kodu", type: "text", placeholder: "TR, US..." },
  { 
    key: "status", 
    label: "Durum", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(VARIANT_STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  }
];

export const REQUEST_FILTERS: FilterField[] = [
  { key: "publisherName", label: "Yayıncı Ara", type: "text" },
  { 
    key: "status", 
    label: "Talep Durumu", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(PACKAGE_REQUEST_STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
  { 
    key: "requestType", 
    label: "İşlem Türü", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(PACKAGE_REQUEST_TYPE_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
  { key: "dateFrom", label: "Başlangıç", type: "date" },
  { key: "dateTo", label: "Bitiş", type: "date" },
];

export const TAB_FILTERS: Record<string, FilterField[]> = {
  streamers: STREAMER_FILTERS,
  templates: TEMPLATE_FILTERS,
  variants: VARIANT_FILTERS,
  requests: REQUEST_FILTERS
};