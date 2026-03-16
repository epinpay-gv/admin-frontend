"use client";

import { MEMBER_TYPE } from "@/features/orders/types";
import { Crown, User, UserCheck } from "lucide-react";

const MEMBER_CONFIG: Record<MEMBER_TYPE, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  [MEMBER_TYPE.GUEST]: {
    label: "Misafir",
    bg: "rgba(150,150,150,0.15)",
    color: "#999",
    icon: <User size={10} />,
  },
  [MEMBER_TYPE.NORMAL]: {
    label: "Normal Üye",
    bg: "rgba(0,133,255,0.15)",
    color: "#0085FF",
    icon: <UserCheck size={10} />,
  },
  [MEMBER_TYPE.PREMIUM]: {
    label: "Premium",
    bg: "rgba(255,180,0,0.15)",
    color: "#FFB400",
    icon: <Crown size={10} />,
  },
};

interface OrderMemberTypeBadgeProps {
  memberType: MEMBER_TYPE;
}

export default function OrderMemberTypeBadge({ memberType }: OrderMemberTypeBadgeProps) {
  const config = MEMBER_CONFIG[memberType];
  return (
    <span
      className="flex w-fit items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono"
      style={{ background: config.bg, color: config.color }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}