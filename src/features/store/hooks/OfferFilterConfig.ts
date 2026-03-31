import { FilterField } from "@/components/common/filter-panel/types";
import { OFFER_STATUS, DELIVERY_TYPE } from "../types";
import { STATUS_LABELS, DELIVERY_LABELS } from "../components/OfferTableConfig";

export const OFFER_FILTERS: FilterField[] = [
  { key: "search", label: "Ürün Ara", type: "text", placeholder: "Ürün adı ile ara..." },
  { 
    key: "status", 
    label: "Durum", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
  { 
    key: "deliveryType", 
    label: "Teslimat Tipi", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(DELIVERY_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
];