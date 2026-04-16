"use client";
import { Plus, Filter, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface BlogHeaderActionProps {
  refresh: () => Promise<void>;
  loading: boolean;
  setShowFilters: (value: SetStateAction<boolean>) => void;
  showFilters: boolean;
  hasActiveFilters: boolean;
}

export default function BlogHeaderAction({
  refresh,
  loading,
  setShowFilters,
  showFilters,
  hasActiveFilters,
}: BlogHeaderActionProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={refresh}
        title="Yenile"
        className="text-(--text-muted)"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="relative px-4"
        style={{
          backgroundColor:
            showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
          color:
            showFilters || hasActiveFilters ? "#00C6A2" : "var(--text-muted)",
          borderColor:
            showFilters || hasActiveFilters ? "rgba(0, 198, 162, 0.1)" : "",
        }}
      >
        <Filter size={14} className="mr-2" /> Filtre
        {hasActiveFilters && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]"
          />
        )}
      </Button>
      <Button
        onClick={() => router.push("/epinpay/categories/new")}
        className="text-white bg-linear-to-r from-[#00C6A2] to-[#0085FF]"
      >
        <Plus size={18} className="mr-1" /> Yeni Ekle
      </Button>
    </div>
  );
}
