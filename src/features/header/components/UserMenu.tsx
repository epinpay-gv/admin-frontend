"use client";

import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/layout";
import { useLogout } from "@/features/auth";

interface UserMenuProps {
  user: User;
}

const ROLE_LABELS: Record<User["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
};

export default function UserMenu({ user }: UserMenuProps) {
  const { logout, loading } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors outline-none">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 font-mono"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {user.avatarInitials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-white/85 leading-tight">
              {user.displayName}
            </p>
            <p className="text-[11px] text-white/35 leading-tight font-mono">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <ChevronDown size={14} className="text-white/30" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-white/10 bg-[#1A1D27] text-white/80"
      >
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-white/60">{user.displayName}</p>
          <p className="text-[11px] text-white/30 font-mono">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={logout}
          disabled={loading}
          className="gap-2 text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
        >
          <LogOut size={14} />
          {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}