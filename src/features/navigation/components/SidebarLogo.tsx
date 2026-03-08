"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SidebarLogoProps {
  collapsed: boolean;
}

export default function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div
      className="flex items-center h-16 px-4 border-b shrink-0"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 font-mono"
          style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
        >
          EP
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-base tracking-tight whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              epinpay
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}