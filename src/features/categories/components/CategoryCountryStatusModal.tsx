"use client";

import { useState } from "react";
import Modal from "@/components/common/modal/Modal";
import { Button } from "@/components/ui/button";
import { Category, CategoryCountry } from "@/features/categories/types";
import { useCategoryCountryStatus } from "@/features/categories/hooks/useCategoryCountryStatus";
import { ShieldOff, X, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CategoryCountryStatusModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onUpdate?: (updated: Category) => void;
}

export default function CategoryCountryStatusModal({
  open,
  onClose,
  category,
  onUpdate,
}: CategoryCountryStatusModalProps) {
  const {
    forbidden,
    isForbidden,
    toggleCountry,
    setAllActive,
    setAllInactive,
    save,
    saving,
    countries,
    countriesLoading,
  } = useCategoryCountryStatus(category);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSave = async () => {
    await save((updated) => {
      onUpdate?.(updated);
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ülke Kısıtlamaları"
      description={category?.translation.name}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {forbidden.length} ülke yasaklı
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              style={{ color: "var(--text-muted)" }}
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-white"
              style={{
                background:
                  "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
              }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                "Kaydet"
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Toplu aksiyonlar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={setAllActive}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              background: "rgba(0,198,162,0.1)",
              borderColor: "rgba(0,198,162,0.2)",
              color: "#00C6A2",
            }}
          >
            Tümünü Aktif Yap
          </button>
          <button
            type="button"
            onClick={setAllInactive}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              background: "rgba(255,80,80,0.1)",
              borderColor: "rgba(255,80,80,0.2)",
              color: "#FF5050",
            }}
          >
            Tümünü Pasif Yap
          </button>
        </div>

        {/* Combobox */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center justify-between h-11 px-3 rounded-lg border text-sm transition-all"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: forbidden.length
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
              }}
            >
              <span>
                {forbidden.length > 0
                  ? `${forbidden.length} ülke seçili`
                  : "Yasaklanacak ülke seç..."}
              </span>
              <ChevronsUpDown
                size={14}
                style={{ color: "var(--text-muted)" }}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[462px] p-0 border"
            style={{
              background: "var(--background-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <Command style={{ background: "var(--background-secondary)" }}>
              <CommandInput
                placeholder="Ülke ara..."
                style={{ color: "var(--text-primary)" }}
              />
              <CommandList>
                <CommandEmpty
                  className="text-sm py-4 text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ülke bulunamadı
                </CommandEmpty>
                {countriesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div
                      className="w-5 h-5 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "var(--border)",
                        borderTopColor: "#00C6A2",
                      }}
                    />
                  </div>
                ) : (
                  <CommandGroup>
                    {countries.map((country) => {
                      const banned = isForbidden(country.code);
                      return (
                        <CommandItem
                          key={country.code}
                          value={`${country.code} ${country.name}`}
                          onSelect={() =>
                            toggleCountry({
                              code: country.code,
                              code3: country.code3,
                              name: country.name,
                              region: country.region,
                            })
                          }
                          className="flex items-center justify-between cursor-pointer"
                          style={{
                            color: banned ? "#FF5050" : "var(--text-primary)",
                            background: banned
                              ? "rgba(255,80,80,0.05)"
                              : "transparent",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                              style={{
                                background: "var(--background-card)",
                                color: "var(--text-muted)",
                              }}
                            >
                              {country.code}
                            </span>
                            <span className="text-sm">{country.name}</span>
                          </div>
                          <Check
                            size={13}
                            className={cn(
                              "transition-opacity",
                              banned
                                ? "opacity-100 text-red-400"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Yasaklı ülke etiketleri */}
        {forbidden.length > 0 && (
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Yasaklı Ülkeler
            </p>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {forbidden.map((c) => (
                <span
                  key={c.code}
                  className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg font-mono"
                  style={{
                    background: "rgba(255,80,80,0.1)",
                    color: "#FF5050",
                    border: "1px solid rgba(255,80,80,0.2)",
                  }}
                >
                  <ShieldOff size={11} />
                  {c.code} — {c.name}
                  <button
                    onClick={() => toggleCountry(c)}
                    className="hover:opacity-70 transition-opacity ml-1"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}