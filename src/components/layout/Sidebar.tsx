"use client";

import { motion } from "framer-motion";
import { SidebarLogo, NavGroup, useNavigation } from "@/features/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { navGroups, activeHref, navigate } = useNavigation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative hidden lg:flex flex-col h-full border-r overflow-hidden"
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--border-subtle)",
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
            onNavClick={navigate}
          />
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-4 border-t transition-colors"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono"
          >
            Daralt
          </motion.span>
        )}
      </button>
    </motion.aside>
  );
}