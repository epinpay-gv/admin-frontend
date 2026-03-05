"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Ara...",
  className,
  autoFocus,
}: SearchInputProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -mt-1 -translate-y-1/2 text-white/30 z-10"
      />
      <Input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8 h-8 bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus-visible:ring-[#00C6A2]/30 focus-visible:border-[#00C6A2]/40 text-sm"
      />
      <AnimatePresence initial={false}>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 -mt-1 text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={13} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}