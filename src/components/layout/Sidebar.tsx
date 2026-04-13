"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SidebarLogo, NavGroup, useNavigation } from "@/features/navigation";
import { useLogout } from "@/features/auth";
import { LogOut } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { navGroups, activeHref, navigate } = useNavigation();
  const { logout, loading } = useLogout();
  const pathname = usePathname();

  const findOpenHref = () =>
    navGroups
      .flatMap((g) => g.items)
      .find((item) => item.children?.some((c) => pathname.startsWith(c.href)))
      ?.href ?? null;

  const [openHref, setOpenHref] = useState<string | null>(findOpenHref);

  const handleNavClick = (href: string) => {
    const allItems = navGroups.flatMap((g) => g.items);
    const item = allItems.find((i) => i.href === href);

    if (item?.children?.length) {
      setOpenHref((prev) => (prev === href ? null : href));
      navigate(href);
    } else {
      navigate(href);
    }
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative hidden lg:flex flex-col h-full border-r "
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <SidebarLogo collapsed={collapsed} onToggle={onToggle} />

      <nav className="flex flex-col h-full py-4 px-2">
        {/* TOP: Navigation */}
        <div className="flex flex-col space-y-5 custom-scrollbar overflow-y-auto overflow-x-hidden">
          {navGroups.map((group, index) => (
            <NavGroup
              key={group.title}
              group={group}
              index={index}
              activeHref={activeHref}
              collapsed={collapsed}
              openHref={openHref}
              onNavClick={handleNavClick}
            />
          ))}
        </div>

        {/* BOTTOM: Logout */}
        <div className="mt-auto">
          <button
            onClick={logout}
            disabled={loading}
            className="cursor-pointer flex items-center justify-center border-t py-4 gap-2 text-red-400 hover:bg-red-400/10 hover:rounded-lg w-full"
          >
            <LogOut size={14} />
            {!collapsed && (loading ? "Çıkış yapılıyor..." : "Çıkış Yap")}
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}
