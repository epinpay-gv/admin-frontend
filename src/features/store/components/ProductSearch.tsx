"use client";

import * as React from "react";
import { Search } from "lucide-react";
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

interface Product {
  id: number;
  translation: {
    name: string;
  };
}

interface ProductSearchProps {
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  typeIds?: number[];
  categoryId?: number;
}

export function ProductSearch({ value, onChange, error, typeIds, categoryId }: ProductSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if (!debouncedSearch && !open) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await offerService.searchProducts(debouncedSearch, typeIds);
        if (response.products) {
          setProducts(response.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, typeIds, open]);

  // Initial fetch if value exists
  React.useEffect(() => {
    if (value && !selectedProduct) {
      const fetchProduct = async () => {
        try {
          const response = await offerService.getProductById(value);
          if (response) {
            setSelectedProduct(response);
          }
        } catch (err) {
          console.error("Failed to fetch product details:", err);
        }
      };
      fetchProduct();
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Ürün Seçimi
      </label>
      <Combobox
        onOpenChange={setOpen}
        open={open}
        onValueChange={(val) => {
          const id = Number(val);
          onChange(id);
          const prod = products.find((p) => p.id === id);
          if (prod) setSelectedProduct(prod);
          setOpen(false);
        }}
         value={value?.toString() ?? ""} 
      >
        <ComboboxInput
          placeholder={selectedProduct ? selectedProduct.translation.name : "Ürün Ara (İsim veya ID)"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={error ? "border-red-500" : ""}
          style={{ borderColor: error ? "#FF5050" : "var(--border)" }}
        />
        <ComboboxContent>
          <ComboboxList>
            {loading ? (
              <div className="p-4 text-center text-xs text-muted-foreground">Aranıyor...</div>
            ) : products.length === 0 ? (
              <ComboboxEmpty>Ürün bulunamadı.</ComboboxEmpty>
            ) : (
              <ComboboxGroup>
                <ComboboxLabel>Sonuçlar</ComboboxLabel>
                {products.map((product) => (
                  <ComboboxItem key={product.id} value={product.id.toString()}>
                    <div className="flex flex-col">
                      <span>{product.translation.name}</span>
                      <span className="text-[10px] text-muted-foreground">ID: {product.id}</span>
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
