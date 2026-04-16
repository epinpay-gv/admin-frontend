import { ORDER_STATUS, MEMBER_TYPE } from "../types";
import { FilterField } from "@/components/common/filter-panel/types";

export const ORDER_FILTER_CONFIG: FilterField[] = [
  {
    key: "id",
    label: "Sipariş No",
    type: "text",
    placeholder: "Örn: 10542",
  },
  {
    key: "userEmail",
    label: "E-posta / Kullanıcı Adı",
    type: "text",
    placeholder: "Müşteri ara...",
  },
  {
    key: "status",
    label: "Sipariş Durumu",
    type: "select",
    options: [
      { label: "Hepsi", value: "" },
      { label: "Bekliyor", value: ORDER_STATUS.PENDING },
      { label: "İşleniyor", value: ORDER_STATUS.PROCESSING },
      { label: "Tamamlandı", value: ORDER_STATUS.COMPLETED },
      { label: "İptal Edildi", value: ORDER_STATUS.CANCELLED },
    ],
  },
  {
    key: "memberType",
    label: "Üye Tipi",
    type: "select",
    options: [
      { label: "Misafir", value: MEMBER_TYPE.GUEST },
      { label: "Kullanıcı", value: MEMBER_TYPE.NORMAL },
    ],
  },
  {
    key: "startDate",
    label: "Başlangıç Tarihi",
    type: "date",
  },
  {
    key: "endDate",
    label: "Bitiş Tarihi",
    type: "date",
  },
];