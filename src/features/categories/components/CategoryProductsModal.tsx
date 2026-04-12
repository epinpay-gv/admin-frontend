"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal/Modal";
import { Category } from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import { Plus, Eye, X, ChevronsUpDown, Check } from "lucide-react";
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
import { categoryService } from "@/features/categories/services/category.service";

// ── Types ────────────────────────────────────────────────────────────────────
// Shape returned by categoryService.getProducts / searchProducts
interface AdminProduct {
  id: number;
  slug: string;
  categoryId: number | null;
  basePrice: number;
  translation: {
    name: string;
    slug: string;
    imgUrl?: string;
    imgAlt?: string;
    description?: string;
  };
}

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

  // ── State ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Search combobox
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdminProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [adding, setAdding] = useState(false);

  // ── Load category products on open ────────────────────────────────────────
  useEffect(() => {
    if (!open || !category) return;
    setProducts([]);
    setSelectedProduct(null);
    setSearchQuery("");
    setSearchResults([]);

    const load = async () => {
      setLoading(true);
      try {
        const res = await categoryService.getProducts(category.id);
        setProducts(res.products as unknown as AdminProduct[]);
      } catch {
        toast.error("Hata", "Ürünler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, category]);

  // ── Product search (debounced) ────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await categoryService.searchProducts(searchQuery);
        // Filter out products already in this category
        const unassigned = (res.products as unknown as AdminProduct[]).filter(
          (p) => p.categoryId !== category?.id,
        );
        setSearchResults(unassigned);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category?.id]);

  // ── Add product ──────────────────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!selectedProduct || !category) return;
    setAdding(true);
    try {
      await categoryService.addProduct(category.id, {
        productId: selectedProduct.id,
      });
      // Optimistically add to list
      setProducts((prev) => [
        ...prev,
        { ...selectedProduct, categoryId: category.id },
      ]);
      setSelectedProduct(null);
      setSearchQuery("");
      setSearchResults([]);
      toast.success(
        "Eklendi",
        `${selectedProduct.translation.name} kategoriye eklendi.`,
      );
    } catch {
      toast.error("Hata", "Ürün kategoriye eklenemedi.");
    } finally {
      setAdding(false);
    }
  };

  // ── Remove product ───────────────────────────────────────────────────────
  const handleRemoveProduct = async (product: AdminProduct) => {
    if (!category) return;
    try {
      await categoryService.removeProduct(category.id, product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(
        "Kaldırıldı",
        `${product.translation.name} kategoriden kaldırıldı.`,
      );
    } catch {
      toast.error("Hata", "Ürün kategoriden kaldırılamadı.");
    }
  };

  // ── Navigate to product detail ───────────────────────────────────────────
  const handleViewProduct = (id: number) => {
    onClose();
    router.push(`/epinpay/products/${id}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kategori Ürünleri"
      description={category?.translation.name}
      size="xl"
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
                router.push(
                  `/epinpay/products/new?category_id=${category?.id}`,
                );
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
        {/* ── Add existing product ── */}
        {/* <div
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
            Kategoriye Ürün Ekle
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
                      : "Ürün adıyla ara..."}
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
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    style={{ color: "var(--text-primary)" }}
                  />
                  <CommandList>
                    {searchLoading ? (
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
                      <>
                        <CommandEmpty
                          className="text-sm py-4 text-center"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {searchQuery.trim()
                            ? "Ürün bulunamadı"
                            : "Aramak için yazmaya başlayın"}
                        </CommandEmpty>
                        <CommandGroup>
                          {searchResults.map((product) => (
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
                                  style={{
                                    background: "var(--background-card)",
                                  }}
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
                                  <p className="text-sm">
                                    {product.translation.name}
                                  </p>
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
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleAddProduct}
              disabled={!selectedProduct || adding}
              className="text-white shrink-0 flex items-center gap-2"
              style={{
                background: selectedProduct
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
        </div> */}

        {/* ── Product list ── */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div
              className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{
                borderColor: "var(--border)",
                borderTopColor: "#00C6A2",
              }}
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
          <div className="space-y-2 max-h-120 overflow-y-auto">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: "var(--background-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div>{index + 1}</div>
                  <div className="min-w-0 max-w-90">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.translation.name}
                    </p>
                    <p
                      className="text-[11px] font-mono truncate mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {product.translation.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="text-sm font-mono mr-2 "
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ₺ {Number(product.basePrice).toLocaleString("tr-TR", {minimumFractionDigits: 2 })}
                  </div>
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
      </div>
    </Modal>
  );
}
