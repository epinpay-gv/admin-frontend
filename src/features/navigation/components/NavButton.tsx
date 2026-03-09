"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/features/navigation/types";
import NavAccordion from "./NavAccordion";

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  open: boolean;
  onClick: () => void;
  onChildClick: (href: string) => void;
}

export default function NavButton({
  item,
  isActive,
  collapsed,
  open,
  onClick,
  onChildClick,
}: NavButtonProps) {
  const Icon = item.icon;
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href));

  return (
    <div>
      <motion.button
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        whileHover={{ x: collapsed ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 relative
          ${collapsed ? "justify-center" : "justify-start"}
        `}
        style={{
          background:
            isActive || isChildActive
              ? "linear-gradient(90deg, rgba(0,198,162,0.15) 0%, rgba(0,133,255,0.08) 100%)"
              : "transparent",
          color: isActive || isChildActive ? "#00C6A2" : "var(--text-secondary)",
        }}
      >
        {(isActive || isChildActive) && (
          <motion.span
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#00C6A2]"
          />
        )}

        <Icon size={18} className="shrink-0" />

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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00C6A2]/20 text-[#00C6A2] font-mono">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                </motion.span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {hasChildren && !collapsed && (
        <NavAccordion
          item={item}
          open={open}
          onChildClick={onChildClick}
        />
      )}
    </div>
  );
}