"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchBar() {
  const { search, setSearch, clearSearch } = useSearchStore();

  return (
    <div className="flex-1 max-w-md relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="İşlem, kullanıcı veya kart ara..."
        className="pl-9 pr-12 bg-white/5 border-white/10 text-white/80 placeholder:text-white/30 focus-visible:ring-[#00C6A2]/40 focus-visible:border-[#00C6A2]/40"
      />
      {search ? (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          <X size={14} />
        </button>
      ) : (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      )}
    </div>
  );
}