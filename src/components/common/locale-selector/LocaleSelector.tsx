"use client";

import { useState } from "react";
import { useLocales } from "./hooks/useLocale";
import { Locale } from "./locale.service";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
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

interface LocaleSelectorProps {
  activeLocale: string;
  enabledLocales: string[];
  onLocaleChange: (code: string) => void;
  onLocaleAdd: (locale: Locale) => void;
  onLocaleRemove: (code: string) => void;
}

export default function LocaleSelector({
  activeLocale,
  enabledLocales,
  onLocaleChange,
  onLocaleAdd,
  onLocaleRemove,
}: LocaleSelectorProps) {
  const { locales, loading } = useLocales();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const enabledLocaleObjects = locales.filter((l) =>
    enabledLocales.includes(l.code)
  );
  const availableToAdd = locales.filter(
    (l) => !enabledLocales.includes(l.code)
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Aktif dil sekmeleri */}
      {enabledLocaleObjects.map((locale) => (
        <div key={locale.code} className="flex items-center">
          <button
            type="button"
            onClick={() => onLocaleChange(locale.code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg border text-xs font-mono font-semibold transition-all"
            style={{
              background:
                activeLocale === locale.code
                  ? "rgba(0,198,162,0.15)"
                  : "var(--background-card)",
              borderColor:
                activeLocale === locale.code
                  ? "rgba(0,198,162,0.3)"
                  : "var(--border)",
              color:
                activeLocale === locale.code
                  ? "#00C6A2"
                  : "var(--text-secondary)",
              borderRight: "none",
            }}
          >
            <span>{locale.flag}</span>
            <span>{locale.code.toUpperCase()}</span>
            {activeLocale === locale.code && (
              <Check size={11} className="text-[#00C6A2]" />
            )}
          </button>
          {/* Kaldır butonu — varsayılan dil kaldırılamaz */}
          {enabledLocales.length > 1 && (
            <button
              type="button"
              onClick={() => onLocaleRemove(locale.code)}
              className="flex items-center justify-center w-6 h-[30px] rounded-r-lg border border-l-0 transition-all"
              style={{
                background:
                  activeLocale === locale.code
                    ? "rgba(0,198,162,0.1)"
                    : "var(--background-card)",
                borderColor:
                  activeLocale === locale.code
                    ? "rgba(0,198,162,0.3)"
                    : "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <X size={10} />
            </button>
          )}
          {enabledLocales.length === 1 && (
            <div
              className="flex items-center justify-center w-6 h-[30px] rounded-r-lg border border-l-0"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
              }}
            />
          )}
        </div>
      ))}

      {/* Dil ekle */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <Plus size={11} />
            Dil Ekle
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-0 border"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <Command style={{ background: "var(--background-secondary)" }}>
            <CommandInput
              placeholder="Dil ara..."
              style={{ color: "var(--text-primary)" }}
            />
            <CommandList>
              <CommandEmpty
                className="text-sm py-4 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                Dil bulunamadı
              </CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "var(--border)",
                      borderTopColor: "#00C6A2",
                    }}
                  />
                </div>
              ) : (
                <CommandGroup>
                  {availableToAdd.map((locale) => (
                    <CommandItem
                      key={locale.code}
                      value={`${locale.code} ${locale.name}`}
                      onSelect={() => {
                        onLocaleAdd(locale);
                        setPopoverOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span>{locale.flag}</span>
                      <span className="text-sm">{locale.name}</span>
                      <span
                        className="text-[11px] font-mono ml-auto"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {locale.code.toUpperCase()}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}