"use client";

import SearchInput from "@/components/common/search-input/SearchInput";
import { useSearchStore } from "@/store/useSearchStore";

export default function SearchBar() {
  const { search, setSearch } = useSearchStore();

  return (
    <div className="flex-1 max-w-md">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="İşlem, kullanıcı veya kart ara..."
        className="w-full h-10"
      />
    </div>
  );
}