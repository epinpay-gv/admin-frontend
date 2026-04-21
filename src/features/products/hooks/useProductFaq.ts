"use client";

import { useState, useCallback } from "react";
import { ProductFaq } from "@/features/products/types";
import { CategoryFaq } from "@/features/categories";

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export function useProductFaq(initialFaqs: CategoryFaq[] = []) {
  const [faqs, setFaqs] = useState<CategoryFaq[]>(initialFaqs);

  const addFaq = useCallback(() => {
    setFaqs((prev) => [
      ...prev,
      { id: generateId(), name: "", description: "", order: prev.length + 1, isActive: true },
    ]);
  }, []);

  const updateFaq = useCallback(
    (id: number, field: "name" | "description" | "order" | "isActive", value: string | number | boolean) => {
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

  return { faqs, setFaqs, addFaq, updateFaq, removeFaq, moveFaq };
}