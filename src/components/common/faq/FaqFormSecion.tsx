"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { CategoryFaq } from "@/features/categories";

interface FaqFormSectionProps {
  faqs: CategoryFaq[];
  onChange: (faqs: CategoryFaq[]) => void;
}

export default function FaqFormSection({
  faqs,
  onChange,
}: FaqFormSectionProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const addFaq = () => {
    const newFaq: CategoryFaq = {
      id: Date.now(),
      name: "",
      description: "",
    };

    onChange([...faqs, newFaq]);
    setEditingId(newFaq.id);
  };

  const updateFaq = <K extends keyof CategoryFaq>(
    id: number,
    field: K,
    value: CategoryFaq[K],
  ) => {
    onChange(
      faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
  };

  const removeFaq = (id: number) => {
    onChange(faqs.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
    if (openId === id) setOpenId(null);
  };

  const moveFaq = (id: number, direction: "up" | "down") => {
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) return;

    const next = [...faqs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= next.length) return;

    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    onChange(next);
  };

  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-border text-(--text-muted)">
          <p className="text-sm font-mono mb-3">Henüz soru eklenmedi</p>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border bg-[rgba(0,198,162,0.1)] border-[rgba(0,198,162,0.2)] text-[#00C6A2]"
          >
            <Plus size={13} />
            İlk soruyu ekle
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isEditing = editingId === faq.id;
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-xl border overflow-hidden shadow-sm"
                style={{
                  background: isEditing
                    ? "var(--background-secondary)"
                    : "var(--background-card)",
                  borderColor: isEditing
                    ? "rgba(0,198,162,0.5)"
                    : "transparent",
                }}
              >
                {isEditing ? (
                  // ✏️ EDIT MODE
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono">
                        #{index + 1}
                      </span>

                      <div className="flex gap-1">
                        <button onClick={() => moveFaq(faq.id, "up")}>
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveFaq(faq.id, "down")}>
                          <ChevronDown size={14} />
                        </button>
                        <button onClick={() => removeFaq(faq.id)}>
                          <Trash2 size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)}>
                          <Check size={14} />
                        </button>
                      </div>
                    </div>

                    <input
                      value={faq.name}
                      onChange={(e) =>
                        updateFaq(faq.id, "name", e.target.value)
                      }
                      placeholder="Soru..."
                      className="w-full border px-2 py-1"
                    />

                    <textarea
                      value={faq.description}
                      onChange={(e) =>
                        updateFaq(faq.id, "description", e.target.value)
                      }
                      placeholder="Cevap..."
                      className="w-full border px-2 py-1"
                    />
                  </div>
                ) : (
                  // 👁️ VIEW MODE (ACCORDION)
                  <div className="p-3">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOpen(faq.id)}
                    >
                      <p className="font-semibold">
                        {faq.name || "Soru yok"}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(faq.id);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFaq(faq.id);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* 👇 EXPANDABLE DESCRIPTION */}
                    {isOpen && (
                      <p className="mt-2 text-sm text-(--text-muted)">
                        {faq.description || "Cevap yok"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {faqs.length > 0 && (
        <button
          onClick={addFaq}
          className="flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Yeni Soru
        </button>
      )}
    </div>
  );
}