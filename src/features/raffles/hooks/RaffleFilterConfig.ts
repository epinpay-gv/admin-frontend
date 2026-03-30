import { FilterField } from "@/components/common/filter-panel/types";
import { 
  RAFFLE_STATUS_LABELS, 
  RAFFLE_TYPE_LABELS, 
  RAFFLE_CREATOR_TYPE_LABELS 
} from "@/features/raffles/types";

export const RAFFLE_FILTER_CONFIG: FilterField[] = [
  { key: "search", label: "Arama", type: "text", placeholder: "Çekiliş adı, oluşturan..." },
  { 
    key: "creatorType", 
    label: "Oluşturan Türü", 
    type: "select", 
    options: Object.entries(RAFFLE_CREATOR_TYPE_LABELS).map(([v, l]) => ({ label: l, value: v })) 
  },
  { 
    key: "type", 
    label: "Çekiliş Türü", 
    type: "select", 
    options: Object.entries(RAFFLE_TYPE_LABELS).map(([v, l]) => ({ label: l, value: v })) 
  },
  { 
    key: "status", 
    label: "Durum", 
    type: "select", 
    options: Object.entries(RAFFLE_STATUS_LABELS).map(([v, l]) => ({ label: l, value: v })) 
  },
  { key: "startDate", label: "Başlangıç Tarihi", type: "date" },
  { key: "endDate", label: "Bitiş Tarihi", type: "date" },
];