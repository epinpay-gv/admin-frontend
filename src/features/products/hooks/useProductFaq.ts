"use client";

import { useState, useCallback } from "react";
import { ProductFaq } from "@/features/products/types";

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export function useProductFaq(initialFaqs: ProductFaq[] = []) {
  const [faqs, setFaqs] = useState<ProductFaq[]>(initialFaqs);

  const addFaq = useCallback(() => {
    setFaqs((prev) => [
      ...prev,
      { id: generateId(), name: "", description: "" },
    ]);
  }, []);

  const updateFaq = useCallback(
    (id: number, field: "name" | "description", value: string) => {
      setFaqs((prev) =>
        prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
      );
    },
    []
  );

  const removeFaq = useCallback((id: number) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  }, []);

  const moveFaq = useCallback((id: number, direction: "up" | "down") => {
    setFaqs((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index === -1) return prev;
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  }, []);

  return { faqs, addFaq, updateFaq, removeFaq, moveFaq };
}