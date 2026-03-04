"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SidebarLogo, NavGroup, useNavigation } from "@/features/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { navGroups, activeHref, setActiveHref } = useNavigation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex flex-col h-full border-r overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #13151E 0%, #0F1117 100%)",
        borderColor: "rgba(255,255,255,0.06)",
        minWidth: collapsed ? 72 : 240,
      }}
    >
      <SidebarLogo collapsed={collapsed} />

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups.map((group, index) => (
          <NavGroup
            key={group.title}
            group={group}
            index={index}
            activeHref={activeHref}
            collapsed={collapsed}
            onNavClick={setActiveHref}
          />
        ))}
      </nav>

      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center z-10 text-white/40 hover:text-white/70 transition-colors"
        style={{ background: "#1A1D27", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size={12} />
        </motion.span>
      </motion.button>
    </motion.aside>
  );
}