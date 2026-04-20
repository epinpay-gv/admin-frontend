"use client";

import * as React from "react";
import { offerService } from "../services/offer.service";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox";

interface Currency {
  id: string | number;
  currency_name: string;
}

interface CurrencySearchProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  onNameChange?: (name: string) => void;
  error?: string;
}

export function CurrencySearch({ value, onChange, onNameChange, error }: CurrencySearchProps) {
  const [open, setOpen] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    console.log("CurrencySearch mounted, fetching currencies...");
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await offerService.getCurrencies();
        
        // Response'un dizi olup olmadığını kontrol et (BFF bazen doğrudan data döndürebilir)
        const currencyData = response?.data || (Array.isArray(response) ? response : []);
        setCurrencies(currencyData);
      } catch (err) {
        console.error("Failed to fetch currencies in component Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const selectedCurrency = (currencies || []).find((c) => String(c.id) === String(value));

  const filteredCurrencies = (currencies || []).filter((c) =>
    (c.currency_name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Para Birimi
      </label>
      <Combobox
        onOpenChange={setOpen}
        open={open}
        onValueChange={(val) => {
          onChange(val);
          if (onNameChange) {
            const selected = currencies.find(c => String(c.id) === String(val));
            if (selected) onNameChange(selected.currency_name);
          }
          setOpen(false);
        }}
        value={String(value)}
      >
        <ComboboxInput
          placeholder={selectedCurrency ? selectedCurrency.currency_name : "Para Birimi Seç"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={error ? "border-red-500" : ""}
          style={{ borderColor: error ? "#FF5050" : "var(--border)" }}
        />
        <ComboboxContent>
          <ComboboxList>
            {loading ? (
              <div className="p-4 text-center text-xs text-muted-foreground">Yükleniyor...</div>
            ) : filteredCurrencies.length === 0 ? (
              <ComboboxEmpty>Para birimi bulunamadı.</ComboboxEmpty>
            ) : (
              <ComboboxGroup>
                <ComboboxLabel>Para Birimleri</ComboboxLabel>
                {filteredCurrencies.map((currency) => (
                  <ComboboxItem key={String(currency.id)} value={String(currency.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-12">{currency.currency_name}</span>
                      <span className="text-xs text-muted-foreground">Para Birimi</span>
                    </div>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <p className="text-[11px] text-[#FF5050]">{error}</p>}
    </div>
  );
}
