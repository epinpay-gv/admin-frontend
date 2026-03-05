"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 h-9 w-64 bg-white/5 border-white/10 text-white/80 placeholder:text-white/25 focus-visible:ring-[#00C6A2]/30 focus-visible:border-[#00C6A2]/40 text-sm"
      />
    </div>
  );
}