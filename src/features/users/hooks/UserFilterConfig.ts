import { FilterField } from "@/components/common/filter-panel/types";
import { USER_STATUS } from "../types";
import { USER_STATUS_LABELS } from "../components/UserTableConfig";

export const USER_FILTERS: FilterField[] = [
  { key: "search", label: "Kullanıcı Ara", type: "text", placeholder: "Kullanıcı adı veya email..." },
  { key: "country", label: "Ülke", type: "text", placeholder: "Örn: TR" },
  { 
    key: "status", 
    label: "Durum", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(USER_STATUS_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
  {
    key: "isPremium",
    label: "Üyelik Tipi",
    type: "select",
    options: [
      { label: "Tümü", value: "all" },
      { label: "Premium", value: "true" },
      { label: "Ücretsiz", value: "false" }
    ]
  }
];