"use client";

import { useState, useCallback } from "react";
import { IdUploadField } from "@/features/store/types";

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export function useOfferIdFields(initial: IdUploadField[] = []) {
  const [fields, setFields] = useState<IdUploadField[]>(initial);

  const addField = useCallback(() => {
    setFields((prev) => [
      ...prev,
      { key: String(generateId()), label: "", isRequired: true, isEditable: true },
    ]);
  }, []);

  const updateField = useCallback(
    (key: string, patch: Partial<IdUploadField>) => {
      setFields((prev) =>
        prev.map((f) => (f.key === key ? { ...f, ...patch } : f))
      );
    },
    []
  );

  const removeField = useCallback((key: string) => {
    setFields((prev) => prev.filter((f) => f.key !== key));
  }, []);

  return { fields, addField, updateField, removeField };
}