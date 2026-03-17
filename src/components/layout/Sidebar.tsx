"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SidebarLogo, NavGroup, useNavigation } from "@/features/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { navGroups, activeHref, navigate, loading } = useNavigation();
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

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 custom-scrollbar">
        {loading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 rounded-lg animate-pulse"
                style={{ background: "var(--background-card)" }}
              />
            ))}
          </div>
        ) : (
          navGroups.map((group, index) => (
            <NavGroup
              key={group.title}
              group={group}
              index={index}
              activeHref={activeHref}
              collapsed={collapsed}
              openHref={openHref}
              onNavClick={handleNavClick}
            />
          ))
        )}
      </nav>
    </motion.aside>
  );
}