"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import NavButton from "./NavButton";
import { NavGroup as NavGroupType } from "@/features/navigation/types";

interface NavGroupProps {
  group: NavGroupType;
  index: number;
  activeHref: string;
  collapsed: boolean;
  onNavClick: (href: string) => void;
}

export default function NavGroup({
  group,
  index,
  activeHref,
  collapsed,
  onNavClick,
}: NavGroupProps) {
  const pathname = usePathname();
  const [openHref, setOpenHref] = useState<string | null>(
    () => group.items.find((item) => item.children?.some((c) => pathname.startsWith(c.href)))?.href ?? null
  );

  const handleNavClick = (href: string) => {
    const item = group.items.find((i) => i.href === href);
    if (item?.children?.length) {
      setOpenHref((prev) => (prev === href ? null : href));
    }
    onNavClick(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest font-mono overflow-hidden"
            style={{ color: "var(--text-muted)" }}
          >
            {group.title}
          </motion.p>
        )}
      </AnimatePresence>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.href}>
            <NavButton
              item={item}
              isActive={activeHref === item.href}
              collapsed={collapsed}
              open={openHref === item.href}
              onClick={() => handleNavClick(item.href)}
              onChildClick={onNavClick}
            />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}