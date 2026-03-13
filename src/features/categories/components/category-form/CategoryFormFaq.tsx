"use client";

import { useState } from "react";
import { CategoryFaq } from "@/features/categories/types";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, Check, X } from "lucide-react";

interface CategoryFormFaqProps {
  faqs: CategoryFaq[];
  onChange: (faqs: CategoryFaq[]) => void;
}

function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export default function CategoryFormFaq({
  faqs,
  onChange,
}: CategoryFormFaqProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const addFaq = () => {
    const newFaq: CategoryFaq = {
      id: generateId(),
      name: "",
      description: "",
      order: faqs.length + 1,
      isActive: true,
    };
    const updated = [...faqs, newFaq];
    onChange(updated);
    setEditingId(newFaq.id);
  };

  const updateFaq = (id: number, field: keyof CategoryFaq, value: string | boolean) => {
    onChange(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const removeFaq = (id: number) => {
    onChange(faqs.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveFaq = (id: number, direction: "up" | "down") => {
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) return;
    const next = [...faqs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    onChange(next.map((f, i) => ({ ...f, order: i + 1 })));
  };

  return (
    <div className="space-y-3">
      {faqs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="text-sm font-mono mb-3">Henüz soru eklenmedi</p>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border transition-all"
            style={{
              background: "rgba(0,198,162,0.1)",
              borderColor: "rgba(0,198,162,0.2)",
              color: "#00C6A2",
            }}
          >
            <Plus size={13} />
            İlk soruyu ekle
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isEditing = editingId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border overflow-hidden transition-all"
                style={{
                  background: isEditing
                    ? "var(--background-secondary)"
                    : "var(--background-card)",
                  borderColor: isEditing
                    ? "rgba(0,198,162,0.2)"
                    : "var(--border)",
                  opacity: faq.isActive ? 1 : 0.5,
                }}
              >
                {isEditing ? (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-bold font-mono px-2 py-0.5 rounded"
                        style={{
                          background: "var(--background-card)",
                          color: "var(--text-muted)",
                        }}
                      >
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveFaq(faq.id, "up")}
                          disabled={index === 0}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30"
                          style={{
                            background: "var(--background-card)",
                            borderColor: "var(--border)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFaq(faq.id, "down")}
                          disabled={index === faqs.length - 1}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all disabled:opacity-30"
                          style={{
                            background: "var(--background-card)",
                            borderColor: "var(--border)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFaq(faq.id, "isActive", !faq.isActive)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all text-xs font-mono"
                          style={{
                            background: faq.isActive
                              ? "rgba(0,198,162,0.1)"
                              : "rgba(255,80,80,0.1)",
                            borderColor: faq.isActive
                              ? "rgba(0,198,162,0.2)"
                              : "rgba(255,80,80,0.2)",
                            color: faq.isActive ? "#00C6A2" : "#FF5050",
                          }}
                        >
                          {faq.isActive ? "A" : "P"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                          style={{
                            background: "rgba(255,80,80,0.1)",
                            borderColor: "rgba(255,80,80,0.2)",
                            color: "#FF5050",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                          style={{
                            background: "rgba(0,198,162,0.1)",
                            borderColor: "rgba(0,198,162,0.2)",
                            color: "#00C6A2",
                          }}
                        >
                          <Check size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Soru
                      </label>
                      <input
                        type="text"
                        value={faq.name}
                        onChange={(e) => updateFaq(faq.id, "name", e.target.value)}
                        placeholder="Sık sorulan soru..."
                        autoFocus
                        className="w-full h-10 rounded-lg border px-3 text-sm outline-none transition-all"
                        style={{
                          background: "var(--background-card)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-[11px] font-semibold uppercase tracking-widest font-mono"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Cevap
                      </label>
                      <textarea
                        value={faq.description}
                        onChange={(e) => updateFaq(faq.id, "description", e.target.value)}
                        placeholder="Cevap..."
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all resize-none"
                        style={{
                          background: "var(--background-card)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: "var(--background-secondary)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {faq.name || (
                            <span style={{ color: "var(--text-muted)" }}>
                              Soru girilmedi
                            </span>
                          )}
                        </p>
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {faq.description || "Cevap girilmedi"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(faq.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                        style={{
                          background: "var(--background-secondary)",
                          borderColor: "var(--border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(faq.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                        style={{
                          background: "rgba(255,80,80,0.1)",
                          borderColor: "rgba(255,80,80,0.2)",
                          color: "#FF5050",
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {faqs.length > 0 && (
        <button
          type="button"
          onClick={addFaq}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed text-sm transition-all"
          style={{
            borderColor: "rgba(0,198,162,0.3)",
            color: "#00C6A2",
          }}
        >
          <Plus size={14} />
          Soru Ekle
        </button>
      )}
    </div>
  );
}