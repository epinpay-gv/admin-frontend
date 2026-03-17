"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

interface SidebarLogoProps {
  collapsed: boolean;
  onToggle: () => void; // onToggle prop'unu ekledik
}

export default function SidebarLogo({ collapsed, onToggle }: SidebarLogoProps) {
  return (
    <div
      className="flex items-center justify-between h-16 px-4 py-8 border-b shrink-0"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Image 
                src="/epinpay-with-text.png" 
                alt="Logo" 
                width={120} 
                height={24} 
                className="object-contain"
              />
            </motion.div>
          ) : (
            <motion.div
              key="small-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10"
            >
              
               <Image 
                src="/epinpay-no-text.png" 
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
        className="flex items-center absolute -right-3.5 justify-center w-7 h-7 rounded-xl border transition-all hover:bg-black/5 active:scale-95"
        style={{ 
          borderColor: "var(--border-subtle)",
          background: "var(--background-secondary)",
          color: "var(--text-muted)" 
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