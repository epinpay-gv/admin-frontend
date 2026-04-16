"use client";

import { useState } from "react";
import { ShieldOff, Globe, ChevronsUpDown, X, Check, Save } from "lucide-react";
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
import { useCountries } from "@/features/products/hooks/useCountries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProviderCountryRestrictionProps {
  forbidden: string[]; // List of ISO-2 codes
  onChange: (countries: string[]) => void;
  onSave?: (countries: string[]) => Promise<void>;
  loading?: boolean;
}

export default function ProviderCountryRestriction({
  forbidden,
  onChange,
  onSave,
  loading: saving,
}: ProviderCountryRestrictionProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { countries, loading } = useCountries();

  const isForbidden = (code: string) => forbidden.includes(code);

  const toggle = (code: string) => {
    if (isForbidden(code)) {
      onChange(forbidden.filter((f) => f !== code));
    } else {
      onChange([...forbidden, code]);
    }
  };

  const setAll = () => onChange([]);
  const setNone = () => onChange(countries.map((c) => c.code));

  const hasChanges = true; // For now we allow saving anytime, or we could track initial state

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-muted)">
            Ülke Kısıtlamaları Yönetimi
          </h3>
          <p className="text-xs text-muted-foreground">Sağlayıcının kullanılmasını istemediğiniz ülkeleri seçin.</p>
        </div>
        {onSave && (
          <Button
            size="sm"
            onClick={() => onSave(forbidden)}
            disabled={saving}
            className="text-white"
            style={{ background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)" }}
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
            Değişiklikleri Kaydet
          </Button>
        )}
      </div>

      {/* Özet ve Hızlı İşlemler */}
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
          className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg border transition-all hover:bg-[rgba(0,198,162,0.05)]"
          style={{
            borderColor: "rgba(0,198,162,0.2)",
            color: "#00C6A2",
          }}
        >
          Tümünü Aktif Yap
        </button>
        <button
          type="button"
          onClick={setNone}
          className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg border transition-all hover:bg-[rgba(255,80,80,0.05)]"
          style={{
            borderColor: "rgba(255,80,80,0.2)",
            color: "#FF5050",
          }}
        >
          Tümünü Yasakla
        </button>
      </div>

      {/* Seçim Alanı */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-12 px-4 rounded-xl border text-sm transition-all hover:border-(--border-active)"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: forbidden.length ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            <div className="flex items-center gap-2">
               <Globe size={16} className="text-muted-foreground" />
               <span>
                {forbidden.length > 0
                  ? `${forbidden.length} ülke seçildi`
                  : "Yasaklanacak ülkeleri seçin..."}
              </span>
            </div>
            <ChevronsUpDown size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-125 p-0 border shadow-2xl"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <Command style={{ background: "transparent" }}>
            <CommandInput
              placeholder="Ülke adı veya kodu ile ara..."
              className="h-12 border-none focus:ring-0"
              style={{ color: "var(--text-primary)" }}
            />
            <CommandList className="max-h-80 custom-scrollbar">
              <CommandEmpty
                className="text-sm py-8 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                Ülke bulunamadı.
              </CommandEmpty>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div
                    className="w-8 h-8 border-3 rounded-full animate-spin"
                    style={{
                      borderColor: "rgba(0,198,162,0.1)",
                      borderTopColor: "#00C6A2",
                    }}
                  />
                  <p className="text-xs text-muted-foreground animate-pulse">Ülkeler yükleniyor...</p>
                </div>
              ) : (
                <CommandGroup>
                  {countries.map((country) => {
                    const banned = isForbidden(country.code);
                    return (
                      <CommandItem
                        key={country.code}
                        value={`${country.code} ${country.name}`}
                        onSelect={() => toggle(country.code)}
                        className="flex items-center justify-between cursor-pointer p-3 rounded-lg mx-2 my-1"
                        style={{
                          color: banned ? "#FF5050" : "var(--text-primary)",
                          background: banned ? "rgba(255,80,80,0.05)" : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="text-[10px] font-bold font-mono px-2 py-1 rounded-md"
                            style={{
                              background: banned ? "rgba(255,80,80,0.1)" : "var(--background-subtle)",
                              color: banned ? "#FF5050" : "var(--text-muted)",
                            }}
                          >
                            {country.code}
                          </span>
                          <span className="text-sm font-medium">{country.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${banned ? "bg-[#FF5050] border-[#FF5050]" : "border-(--border)"}`}>
                           {banned && <Check size={12} className="text-white" />}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Yasaklı Ülke Etiketleri */}
      {forbidden.length > 0 && (
        <div className="space-y-3 pt-2 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between">
             <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kısıtlanan Ülkeler</p>
             <button onClick={setAll} className="text-[10px] text-red-500 hover:underline">Tümünü Kaldır</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {forbidden.map((code) => {
              const country = countries.find(c => c.code === code);
              return (
                <span
                  key={code}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border"
                  style={{
                    background: "rgba(255,80,80,0.05)",
                    color: "#FF5050",
                    borderColor: "rgba(255,80,80,0.2)",
                  }}
                >
                  <ShieldOff size={12} />
                  <span>{code}</span>
                  {country && <span className="opacity-50">— {country.name}</span>}
                  <button
                    type="button"
                    onClick={() => toggle(code)}
                    className="ml-1 hover:bg-red-500/20 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
