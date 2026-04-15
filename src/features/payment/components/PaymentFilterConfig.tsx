import { FilterField } from "@/components/common/filter-panel/types";
import { FEE_TYPE } from "../types";

export const PAYMENT_FILTER_CONFIG: FilterField[] = [
  {
    key: "search",
    label: "Ödeme Yöntemi Ara",
    type: "text",
    placeholder: "Yöntem adı veya slug...",
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