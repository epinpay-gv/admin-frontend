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
        <button
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors outline-none"
          style={{ color: "var(--text-primary)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 font-mono"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {user.avatarInitials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
              {user.displayName}
            </p>
            <p className="text-[11px] leading-tight font-mono" style={{ color: "var(--text-muted)" }}>
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        style={{
          background: "var(--background-secondary)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{user.displayName}</p>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{user.email}</p>
        </div>
        <DropdownMenuSeparator style={{ background: "var(--border)" }} />
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