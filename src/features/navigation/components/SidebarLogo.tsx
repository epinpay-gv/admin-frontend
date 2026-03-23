"use client";

import { useSyncExternalStore } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarLogoProps {
  collapsed: boolean;
  onToggle: () => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SidebarLogo({ collapsed, onToggle }: SidebarLogoProps) {
  const { theme } = useTheme();
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) {    
    return <div className="h-16 px-4 py-8 border-b border-(--border-subtle) shrink-0" />;
  }

  const isDark = theme === "dark";
  const fullLogo = isDark ? "/epinpay-with-text.png" : "/epinpay-with-text-dark.png";
  const smallLogo = isDark ? "/epinpay-no-text.png" : "/epinpay-no-text-dark.png";

  return (
    <div
      className="flex items-center justify-between h-16 px-4 py-8 border-b shrink-0 relative"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Image 
                src={fullLogo} 
                alt="Logo" 
                width={120} 
                height={24} 
                className="object-contain" 
                priority 
              />
            </motion.div>
          ) : (
            <motion.div
              key="small"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Image 
                src={smallLogo} 
                alt="Logo" 
                width={36} 
                height={24} 
                className="object-contain" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onToggle}
        className="flex items-center absolute -right-3.5 justify-center w-7 h-7 rounded-xl border transition-all hover:bg-black/5 active:scale-95 z-50 shadow-sm"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--background-secondary)",
          color: "var(--text-muted)",
        }}
      >
        <motion.div 
          animate={{ rotate: collapsed ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={16} />
        </motion.div>
      </button>
    </div>
  );
}