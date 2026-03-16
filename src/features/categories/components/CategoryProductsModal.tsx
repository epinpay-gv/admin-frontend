"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal/Modal";
import { Category } from "@/features/categories/types";
import { Product } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { Plus, Eye, ExternalLink, ChevronsUpDown, Check, X } from "lucide-react";
import Image from "next/image";
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
import { cn } from "@/lib/utils";
import { toast } from "@/components/common/toast/toast";

interface CategoryProductsModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function CategoryProductsModal({
  open,
  onClose,
  category,
}: CategoryProductsModalProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!open || !category) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data: Product[] = await res.json();
        setAllProducts(data);
        setProducts(data.filter((p) => p.category_id === category.id));
      } catch {
        setProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setSelectedProduct(null);
  }, [open, category]);

  // Kategoriye atanmamış ürünler
  const unassignedProducts = allProducts.filter(
    (p) => p.category_id !== category?.id
  );

  const handleAddProduct = async () => {
    if (!selectedProduct || !category) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: category.id }),
      });
      if (!res.ok) throw new Error();
      const updated: Product = await res.json();
      setProducts((prev) => [...prev, updated]);
      setAllProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setSelectedProduct(null);
      toast.success("Eklendi", `${updated.translation.name} kategoriye eklendi.`);
    } catch {
      toast.error("Hata", "Ürün kategoriye eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveProduct = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: null }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setAllProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, category_id: null as unknown as number } : p
        )
      );
      toast.success("Kaldırıldı", `${product.translation.name} kategoriden kaldırıldı.`);
    } catch {
      toast.error("Hata", "Ürün kategoriden kaldırılamadı.");
    }
  };

  const handleViewProduct = (id: number) => {
    onClose();
    router.push(`/epinpay/products/${id}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kategori Ürünleri"
      description={category?.translation.name}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {products.length} ürün listeleniyor
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              style={{ color: "var(--text-muted)" }}
            >
              Kapat
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.push(`/epinpay/products/new?category_id=${category?.id}`);
              }}
              className="text-white flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)",
              }}
            >
              <Plus size={14} />
              Yeni Ürün Oluştur
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Mevcut ürün ekle */}
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{
            background: "var(--background-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            Mevcut Ürün Ekle
          </p>
          <div className="flex items-center gap-2">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex-1 flex items-center justify-between h-10 px-3 rounded-lg border text-sm transition-all"
                  style={{
                    background: "var(--background-card)",
                    borderColor: "var(--border)",
                    color: selectedProduct
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  <span className="truncate">
                    {selectedProduct
                      ? selectedProduct.translation.name
                      : "Kategoriye eklenecek ürünü seç..."}
                  </span>
                  <ChevronsUpDown
                    size={14}
                    style={{ color: "var(--text-muted)", flex: 0 }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 border"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <Command style={{ background: "var(--background-secondary)" }}>
                  <CommandInput
                    placeholder="Ürün ara..."
                    style={{ color: "var(--text-primary)" }}
                  />
                  <CommandList>
                    <CommandEmpty
                      className="text-sm py-4 text-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {unassignedProducts.length === 0
                        ? "Eklenecek ürün kalmadı"
                        : "Ürün bulunamadı"}
                    </CommandEmpty>
                    <CommandGroup>
                      {unassignedProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={`${product.id} ${product.translation.name}`}
                          onSelect={() => {
                            setSelectedProduct(product);
                            setPopoverOpen(false);
                          }}
                          className="flex items-center justify-between cursor-pointer"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded overflow-hidden shrink-0"
                              style={{ background: "var(--background-card)" }}
                            >
                              {product.translation.imgUrl && (
                                <Image
                                  src={product.translation.imgUrl}
                                  alt={product.translation.name}
                                  width={28}
                                  height={28}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm">{product.translation.name}</p>
                              <p
                                className="text-[10px] font-mono"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {product.translation.slug}
                              </p>
                            </div>
                          </div>
                          <Check
                            size={13}
                            className={cn(
                              "transition-opacity",
                              selectedProduct?.id === product.id
                                ? "opacity-100 text-teal-400"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleAddProduct}
              disabled={!selectedProduct || adding}
              className="text-white shrink-0 flex items-center gap-2"
              style={{
                background:
                  selectedProduct
                    ? "linear-gradient(135deg, #00C6A2 0%, #0085FF 100%)"
                    : "var(--background-card)",
                color: selectedProduct ? "white" : "var(--text-muted)",
              }}
            >
              {adding ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Ekle
            </Button>
          </div>
        </div>

        {/* Ürün listesi */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div
              className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "#00C6A2" }}
            />
          </div>
        ) : products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-sm font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Bu kategoriye ait ürün bulunamadı.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border"
                    style={{
                      background: "var(--background-card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {product.translation.imgUrl && (
                      <Image
                        src={product.translation.imgUrl}
                        alt={product.translation.imgAlt ?? ""}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.translation.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p
                        className="text-[11px] font-mono truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {product.translation.slug}
                      </p>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono shrink-0"
                        style={{
                          background:
                            product.status === "active"
                              ? "rgba(0,198,162,0.15)"
                              : product.status === "inactive"
                              ? "rgba(255,80,80,0.15)"
                              : "rgba(255,180,0,0.15)",
                          color:
                            product.status === "active"
                              ? "#00C6A2"
                              : product.status === "inactive"
                              ? "#FF5050"
                              : "#FFB400",
                        }}
                      >
                        {product.status === "active"
                          ? "Aktif"
                          : product.status === "inactive"
                          ? "Pasif"
                          : "Taslak"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-sm font-mono font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ₺{Number(product.basePrice).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <button
                    onClick={() => handleViewProduct(product.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                    title="Ürünü Görüntüle"
                    style={{
                      background: "var(--background-card)",
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => handleRemoveProduct(product)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                    title="Kategoriden Kaldır"
                    style={{
                      background: "rgba(255,80,80,0.1)",
                      borderColor: "rgba(255,80,80,0.2)",
                      color: "#FF5050",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <button
            onClick={() => {
              onClose();
              router.push(`/epinpay/products?category=${category?.id}`);
            }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed text-xs font-mono transition-all"
            style={{
              borderColor: "rgba(0,133,255,0.3)",
              color: "#0085FF",
            }}
          >
            <ExternalLink size={12} />
            Tüm ürünleri listele
          </button>
        )}
      </div>
    </Modal>
  );
}