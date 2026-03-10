"use client";

import { useState } from "react";
import { useForbiddenCountries } from "@/features/products/hooks/useForbiddenCountries";
import { useCountries } from "@/features/products/hooks/useCountries";
import { Product } from "@/features/products/types";
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

interface ProductFormCountriesProps {
  product: Product | null;
}

export default function ProductFormCountries({
  product,
}: ProductFormCountriesProps) {
  const { countries, loading } = useCountries();
  const { forbidden, isForbidden, toggleCountry } = useForbiddenCountries(product);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[11px] font-semibold uppercase tracking-widest font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          Yasaklı Ülkeler
        </label>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between h-11 px-3 rounded-lg border text-sm transition-all"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: forbidden.length ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              <span>
                {forbidden.length > 0
                  ? `${forbidden.length} ülke yasaklı`
                  : "Yasaklanacak ülke seç..."}
              </span>
              <ChevronsUpDown size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[500px] p-0 border"
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
                {loading ? (
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
      </div>

      {forbidden.length > 0 && (
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
                type="button"
                onClick={() => toggleCountry(c)}
                className="hover:opacity-70 transition-opacity ml-1"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}