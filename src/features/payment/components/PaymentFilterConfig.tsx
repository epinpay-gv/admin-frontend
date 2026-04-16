import { FilterField } from "@/components/common/filter-panel/types";
import { FEE_TYPE } from "../types";

/* ─── Ödeme Sağlayıcıları Filtreleri ─── */
export const PROVIDER_FILTER_CONFIG: FilterField[] = [
  {
    key: "search",
    label: "Sağlayıcı Ara",
    type: "text",
    placeholder: "Sağlayıcı adı...",
  },
  {
    key: "feeType",
    label: "Komisyon Tipi",
    type: "select",
    options: [
      { label: "Tümü", value: "" },
      { label: "Yüzdelik (%)", value: FEE_TYPE.PERCENTAGE },
      { label: "Sabit (₺)", value: FEE_TYPE.FIXED },
    ],
  },
  {
    key: "isActive",
    label: "Durum",
    type: "select",
    options: [
      { label: "Tümü", value: "" },
      { label: "Aktif", value: "true" },
      { label: "Pasif", value: "false" },
    ],
  },
];

/* ─── Ödeme Yöntemleri Filtreleri ─── */
export const METHOD_FILTER_CONFIG: FilterField[] = [
  {
    key: "search",
    label: "Yöntem Ara",
    type: "text",
    placeholder: "Yöntem adı veya slug...",
  },
];

/* ─── Sağlayıcı-Yöntem İlişkileri Filtreleri ─── */
export const PROVIDER_METHOD_FILTER_CONFIG: FilterField[] = [
  {
    key: "search",
    label: "Ara",
    type: "text",
    placeholder: "Sağlayıcı veya yöntem...",
  },
  {
    key: "feeType",
    label: "Komisyon Tipi",
    type: "select",
    options: [
      { label: "Tümü", value: "" },
      { label: "Yüzdelik (%)", value: FEE_TYPE.PERCENTAGE },
      { label: "Sabit (₺)", value: FEE_TYPE.FIXED },
    ],
  },
];

// Backward compatibility (eski ismiyle de export ediyoruz)
export const PAYMENT_FILTER_CONFIG = METHOD_FILTER_CONFIG;