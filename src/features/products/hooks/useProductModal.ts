"use client";

import { useState } from "react";
import { Product } from "@/features/products/types";

export function useProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const open = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  return { isOpen, selectedProduct, open, close };
}