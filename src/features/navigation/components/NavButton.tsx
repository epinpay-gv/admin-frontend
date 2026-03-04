"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "@/features/navigation/types";

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export default function NavButton({ item, isActive, collapsed, onClick }: NavButtonProps) {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      whileHover={{ x: collapsed ? 0 : 2 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 relative
        ${isActive ? "text-[#00C6A2]" : "text-white/50 hover:text-white/80 hover:bg-white/5"}
        ${collapsed ? "justify-center" : "justify-start"}
      `}
      style={{
        background: isActive
          ? "linear-gradient(90deg, rgba(0,198,162,0.15) 0%, rgba(0,133,255,0.08) 100%)"
          : undefined,
      }}
    >
      {isActive && (
        <motion.span
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#00C6A2]"
        />
      )}
      <Icon size={18} className="flex-shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 items-center gap-2 overflow-hidden"
          >
            <span className="text-sm text-left whitespace-nowrap font-[450] flex-1">
              {item.label}
            </span>
            {item.badge !== undefined && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00C6A2]/20 text-[#00C6A2] font-mono"
              >
                {item.badge}
              </motion.span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}