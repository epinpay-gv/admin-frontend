import { FilterField } from "@/components/common/filter-panel/types";
import { PRODUCT_STATUS } from "@/features/products/types";

export const PRODUCT_FILTER_CONFIG: FilterField[] = [
  {
    key: "name",
    label: "Ürün Adı",
    type: "text",
    placeholder: "Ürün adı veya slug...",
  },
  {
    key: "category_id",
    label: "Kategori",
    type: "select",
    options: [
      { label: "Oyunlar", value: "1" },
      { label: "Hediye Kartları", value: "2" },
      { label: "Yazılım", value: "3" },
    ],
  },
  {
    key: "status",
    label: "Durum",
    type: "select",
    options: [
      { label: "Aktif", value: PRODUCT_STATUS.ACTIVE },
      { label: "Pasif", value: PRODUCT_STATUS.INACTIVE },
      { label: "Taslak", value: PRODUCT_STATUS.DRAFT },
    ],
  },
  {
    key: "min_price",
    label: "Min Fiyat",
    type: "number",
    placeholder: "0.00",
  },
  {
    key: "max_price",
    label: "Max Fiyat",
    type: "number",
    placeholder: "0.00",
  },
];