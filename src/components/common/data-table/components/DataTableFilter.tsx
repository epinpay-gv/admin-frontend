"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface DataTableFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DataTableFilter({
  value,
  onChange,
  placeholder = "Ara...",
}: DataTableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
        style={{
          background: isOpen ? "rgba(0,198,162,0.15)" : "rgba(255,255,255,0.05)",
          borderColor: isOpen ? "rgba(0,198,162,0.3)" : "rgba(255,255,255,0.1)",
          color: isOpen ? "#00C6A2" : "rgba(255,255,255,0.4)",
        }}
      >
        <SlidersHorizontal size={14} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 240 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden"
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10"
            />
            <Input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="pl-8 pr-8 h-8 bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus-visible:ring-[#00C6A2]/30 focus-visible:border-[#00C6A2]/40 text-sm"
            />
            {value && (
              <button
                onClick={() => onChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}