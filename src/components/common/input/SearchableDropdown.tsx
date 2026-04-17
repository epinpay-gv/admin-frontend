"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SearchableDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function SearchableDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Seçiniz...",
  error,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  
  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-11 flex items-center justify-between rounded-lg border px-3 py-2 text-sm outline-none transition-all",
              error ? "border-red-500/50" : "border-[var(--border)]",
              !value && "text-muted-foreground"
            )}
            style={{
              background: "var(--background-card)",
              color: value ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown size={14} className="opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Ara..." className="h-9" />
            <CommandList className="max-h-64 overflow-y-auto custom-scrollbar">
              <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    {option.label}
                    {value === option.value && <Check size={14} className="opacity-70" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}
