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
import { useDebounce } from "@/hooks/use-debounce";

interface Store {
  id: string;
  store_name: string;
}

interface StoreSearchProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function StoreSearch({ value, onChange, error }: StoreSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedStore, setSelectedStore] = React.useState<Store | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await offerService.searchStores(debouncedSearch);
        if (response.success && response.data) {
          setStores(response.data);
          
          // Eğer dışarıdan bir value (id) gelmişse ve henüz seçili mağaza set edilmemişse, listeden bul ve set et
          if (value && !selectedStore) {
            const found = response.data.find((s: Store) => s.id === value);
            if (found) setSelectedStore(found);
          }
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [debouncedSearch, value]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Mağaza Seçimi
      </label>
      <Combobox
        onOpenChange={setOpen}
        open={open}
        onValueChange={(val) => {
          // onChange(val);
          const store = stores.find((s) => s.id === val);
          if (store) setSelectedStore(store);
          setOpen(false);
        }}
        value={value}
      >
        <ComboboxInput
          placeholder={selectedStore ? selectedStore.store_name : "Mağaza Ara"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={error ? "border-red-500" : ""}
          style={{ borderColor: error ? "#FF5050" : "var(--border)" }}
        />
        <ComboboxContent>
          <ComboboxList>
            {loading ? (
              <div className="p-4 text-center text-xs text-muted-foreground">Aranıyor...</div>
            ) : stores.length === 0 ? (
              <ComboboxEmpty>Mağaza bulunamadı.</ComboboxEmpty>
            ) : (
              <ComboboxGroup>
                <ComboboxLabel>Sonuçlar</ComboboxLabel>
                {stores.map((store) => (
                  <ComboboxItem key={store.id} value={store.id}>
                    <div className="flex flex-col">
                      <span>{store.store_name}</span>
                      <span className="text-[10px] text-muted-foreground">ID: {store.id.slice(0, 12)}…</span>
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
