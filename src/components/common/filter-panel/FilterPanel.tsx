"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Search, ChevronDown, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterField, FilterValue } from "./types";

interface FilterPanelProps {
  configs: FilterField[];
  initialFilters: Record<string, FilterValue>;
  onApply: (filters: Record<string, FilterValue>) => void;
  onReset: () => void;
}

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -15,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
  },
};

export function FilterPanel({
  configs,
  initialFilters,
  onApply,
  onReset,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] =
    useState<Record<string, FilterValue>>(initialFilters);

  // Aktif filtreleri hesapla (Badge'ler için)
  const activeFilters = useMemo(() => {
    return configs
      .map((config) => {
        const value = localFilters[config.key];
        if (!value || value === "all" || value === "") return null;

        let displayValue = value;
        if (config.type === "select") {
          displayValue =
            config.options?.find((o) => o.value === value)?.label || value;
        }
        return { key: config.key, label: config.label, value: displayValue };
      })
      .filter(
        (f): f is { key: string; label: string; value: string | number } =>
          f !== null,
      );
  }, [localFilters, configs]);

  // Münferit filtre silme
  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onApply(newFilters); // Silme anında tabloyu güncelle
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={panelVariants}
      className="overflow-hidden border border-border bg-(--background-card) rounded-xl mb-6 shadow-sm"
    >
      <div className="p-5 space-y-5">
        {/* Filtre Form Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {configs.map((config) => (
            <div key={config.key} className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-(--text-muted) ml-1">
                {config.label}
              </label>
              {config.type === "select" ? (
                <div className="relative">
                  <select
                    value={String(localFilters[config.key] || "all")}
                    onChange={(e) =>
                      setLocalFilters((p) => ({
                        ...p,
                        [config.key]: e.target.value,
                      }))
                    }
                    className="cursor-pointer w-full h-10 pl-3 pr-10 bg-(--background-secondary) border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00C6A2]/20 transition-all"
                  >
                    <option value="all">Tümü</option>
                    {config.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} | {opt.status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-3 text-(--text-muted) pointer-events-none"
                  />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={config.type}
                    placeholder={config.placeholder}
                    value={String(localFilters[config.key] || "")}
                    onChange={(e) =>
                      setLocalFilters((p) => ({
                        ...p,
                        [config.key]: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 bg-(--background-secondary) border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2]/20 transition-all"
                  />
                  {config.type === "text" && (
                    <Search
                      size={14}
                      className="absolute right-3 top-3 text-(--text-muted)"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer: Aktif Badge'ler ve Aksiyonlar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-(--text-muted) font-medium mr-1">
              Uygulanan:
            </span>
            <AnimatePresence>
              {activeFilters.length > 0 ? (
                activeFilters.map((f) => (
                  <motion.div
                    key={f.key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-[#00C6A2]/10 border border-[#00C6A2]/20 rounded-md group"
                  >
                    <span className="text-[10px] font-bold text-[#00C6A2]">
                      {f.label}:
                    </span>
                    <span className="text-[10px] font-medium text-(--text-primary)">
                      {f.value}
                    </span>
                    <button
                      onClick={() => removeFilter(f.key)}
                      className="p-0.5 hover:bg-[#00C6A2]/20 rounded-full text-[#00C6A2] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <span className="text-[11px] text-(--text-muted) italic">
                  Filtre yok
                </span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setLocalFilters({});
                onReset();
              }}
              className="h-9 text-xs font-semibold text-(--text-muted) hover:bg-red-50 hover:text-red-500"
            >
              <RotateCcw size={14} className="mr-2" /> Sıfırla
            </Button>
            <Button
              onClick={() => onApply(localFilters)}
              className="h-9 px-6 text-xs font-bold bg-[#00C6A2] hover:bg-[#00b090] text-white rounded-lg shadow-sm transition-transform active:scale-95"
            >
              Filtreleri Uygula
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
