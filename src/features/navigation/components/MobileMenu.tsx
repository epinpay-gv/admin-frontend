"use client";

import { motion, AnimatePresence } from "framer-motion";
import NavGroup from "./NavGroup";
import SidebarLogo from "./SidebarLogo";
import { useNavigation } from "@/features/navigation/hooks/useNavigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { navGroups, activeHref, navigate } = useNavigation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 h-full z-50 w-72 flex flex-col lg:hidden border-r"
            style={{
              background: "linear-gradient(180deg, #13151E 0%, #0F1117 100%)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <SidebarLogo collapsed={false} />

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
              {navGroups.map((group, index) => (
                <NavGroup
                  key={group.title}
                  group={group}
                  index={index}
                  activeHref={activeHref}
                  collapsed={false}
                  onNavClick={(href) => {
                    navigate(href);
                    onClose();
                  }}
                />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}