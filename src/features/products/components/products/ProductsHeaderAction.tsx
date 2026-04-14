"use client";
import { Plus, Filter, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface ProductsHeaderActionProps {
  refresh: () => Promise<void>;
  loading: boolean;
  setShowFilters: (value: SetStateAction<boolean>) => void;
  showFilters: boolean;
  hasActiveFilters: boolean;
}

export default function ProductsHeaderAction({
  refresh,
  loading,
  setShowFilters,
  showFilters,
  hasActiveFilters,
}: ProductsHeaderActionProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={refresh}
        className="text-(--text-muted)"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      </Button>

      <Button
        variant="outline"
        onClick={() => setShowFilters((v) => !v)}
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
        <Filter size={14} className="mr-2" />
        Filtrele
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-[#00C6A2]"
            />
          )}
        </AnimatePresence>
      </Button>

      <Button
        onClick={() => router.push("/epinpay/products/new")}
        className="text-white"
        style={{
          background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
        }}
      >
        <Plus size={18} className="mr-2" />
        Yeni Ürün Ekle
      </Button>
    </div>
  );
}
