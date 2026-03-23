"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/common/modal/Modal";
import { Button } from "@/components/ui/button";
import { Country, Product } from "@/features/products/types";
import { useCountries } from "@/features/products/hooks/useCountries";
import { useForbiddenCountries } from "@/features/products/hooks/useForbiddenCountries";
import { ShieldOff, X, ChevronsUpDown, Check, LucideInfo } from "lucide-react";
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

interface ForbiddenCountriesModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate?: (updated: Product) => void;
}

export default function ForbiddenCountriesModal({
  open,
  onClose,
  product,
  onUpdate,
}: ForbiddenCountriesModalProps) {
  const { countries, loading: countriesLoading } = useCountries();
  const { forbidden, isForbidden, toggleCountry, save, saving } =
    useForbiddenCountries(product);
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
      description={product?.translation.name}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
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
                background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
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
        <div className="text-xs p-2 flex items-center gap-2 rounded-lg" 
          style={{
            background: "var(--background-secondary)",
            color: "rgb(0, 133, 255)",
            border: "1px solid rgba(0, 133, 255, 0.2)",
          }}>
            <span><LucideInfo size={24}/></span>
          Yasaklı olmayan tüm ülkeler satışa açıktır. Ülke kısıtlaması eklemek, ürünün o ülkede görünmemesine ve satın alınamamasına neden olur.
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center justify-between h-11 px-3 rounded-lg border text-sm transition-all"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ color: forbidden.length ? "var(--text-primary)" : "var(--text-muted)" }}>
                {forbidden.length > 0
                  ? `${forbidden.length} ülke seçili`
                  : "Yasaklanacak ülke seç..."}
              </span>
              <ChevronsUpDown size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-115.5 p-0 border"
            style={{
              background: "var(--background-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <Command
              style={{ background: "var(--background-secondary)" }}
            >
              <CommandInput
                placeholder="Ülke ara..."
                className="text-sm"
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
                          onSelect={() => toggleCountry(country)}
                          className="flex items-center justify-between cursor-pointer"
                          style={{
                            color: banned ? "#FF5050" : "var(--text-primary)",
                            background: banned ? "rgba(255,80,80,0.05)" : "transparent",
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
                              banned ? "opacity-100 text-red-400" : "opacity-0"
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

        {/* Seçili yasaklı ülkeler */}
        {forbidden.length > 0 && (
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest font-mono mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Yasaklı Ülkeler
            </p>
            <div className="flex flex-wrap gap-2">
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