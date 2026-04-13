import { FilterField } from "@/components/common/filter-panel/types";
import { STATUS_LABELS, LANGUAGE_LABELS } from "../components/BlogTableConfig";


export const BLOG_FILTERS: FilterField[] = [
  { key: "search", label: "İçerik Ara", type: "text", placeholder: "Başlık veya slug..." },
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
    key: "sourceLanguage", 
    label: "Kaynak Dil", 
    type: "select", 
    options: [
      { label: "Tümü", value: "all" },
      ...Object.entries(LANGUAGE_LABELS).map(([value, label]) => ({ label, value }))
    ] 
  },
];