import { AUDIT_ACTION } from "@/features/raffles/types";
import { Plus, Check, Ban, X, Crown, Package, RefreshCw } from "lucide-react";

export const AUDIT_ACTION_ICONS: Record<AUDIT_ACTION, React.ReactNode> = {
  [AUDIT_ACTION.CREATED]: <Plus size={12} color="#0085FF" />,
  [AUDIT_ACTION.PUBLISHED]: <Check size={12} color="#00C6A2" />,
  [AUDIT_ACTION.DEACTIVATED]: <Ban size={12} color="#FFB400" />,
  [AUDIT_ACTION.CANCELLED]: <X size={12} color="#FF5050" />,
  [AUDIT_ACTION.WINNER_SELECTED]: <Crown size={12} color="#A050FF" />,
  [AUDIT_ACTION.CODE_DELIVERED]: <Package size={12} color="#00C6A2" />,
  [AUDIT_ACTION.BACKUP_PROMOTED]: <RefreshCw size={12} color="#FFB400" />,
};