"use client";

import { useState } from "react";
import { ShieldOff, Globe, ChevronsUpDown, X, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CategoryCountry } from "@/features/categories/types";
import { useCountries } from "@/features/products/hooks/useCountries";
import { cn } from "@/lib/utils";

interface CategoryFormCountriesProps {
  forbidden: CategoryCountry[];
  onChange: (countries: CategoryCountry[]) => void;
}

export default function CategoryFormCountries({
  forbidden,
  onChange,
}: CategoryFormCountriesProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { countries, loading } = useCountries();

  const isForbidden = (code: string) => forbidden.some((f) => f.code === code);

  const toggle = (country: { code: string; code3: string; name: string; region: string }) => {
    if (isForbidden(country.code)) {
      onChange(forbidden.filter((f) => f.code !== country.code));
    } else {
      onChange([...forbidden, country]);
    }
  };

  const setAll = () => onChange([]);
  const setNone = () =>
    onChange(
      countries.map((c) => ({
        code: c.code,
        code3: c.code3,
        name: c.name,
        region: c.region,
      }))
    );

  return (
    <div className="space-y-4">
      {/* Özet */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono"
          style={{
            background: forbidden.length > 0
              ? "rgba(255,80,80,0.1)"
              : "rgba(0,198,162,0.1)",
            color: forbidden.length > 0 ? "#FF5050" : "#00C6A2",
            border: `1px solid ${forbidden.length > 0 ? "rgba(255,80,80,0.2)" : "rgba(0,198,162,0.2)"}`,
          }}
        >
          {forbidden.length > 0 ? (
            <>
              <ShieldOff size={14} />
              {forbidden.length} ülke kısıtlı
            </>
          ) : (
            <>
              <Globe size={14} />
              Tüm ülkeler aktif
            </>
          )}
        </div>
        <button
          type="button"
          onClick={setAll}
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
          onClick={setNone}
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
                ? `${forbidden.length} ülke yasaklandı`
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
                        onSelect={() => toggle(country)}
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

      {/* Yasaklı etiketler */}
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
                  type="button"
                  onClick={() => toggle(c)}
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
  );
}