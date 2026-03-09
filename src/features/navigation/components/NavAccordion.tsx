"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "@/features/navigation/types";

interface NavAccordionProps {
  item: NavItem;
  open: boolean;
  onChildClick: (href: string) => void;
}

export default function NavAccordion({ item, open, onChildClick }: NavAccordionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden ml-3 pl-3 border-l mt-0.5 mb-1"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {item.children!.map((child) => {
            const ChildIcon = child.icon;
            const isChildCurrentlyActive = pathname.startsWith(child.href);
            return (
              <button
                key={child.href}
                onClick={() => onChildClick(child.href)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                style={{
                  color: isChildCurrentlyActive ? "#00C6A2" : "var(--text-secondary)",
                  background: isChildCurrentlyActive
                    ? "rgba(0,198,162,0.08)"
                    : "transparent",
                }}
              >
                <ChildIcon size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap font-[450]">{child.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}