"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, Check, X } from "lucide-react";

export interface BaseFaq {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface FaqFormSectionProps<T extends BaseFaq> {
  faqs: T[];
  onChange: (faqs: T[]) => void;
}

export default function FaqFormSection<T extends BaseFaq>({
  faqs,
  onChange,
}: FaqFormSectionProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const addFaq = () => {
    const newFaq = {
      id: Math.floor(Math.random() * 1000000),
      name: "",
      description: "",
      order: faqs.length + 1,
      isActive: true,
    } as T; 
    
    onChange([...faqs, newFaq]);
    setEditingId(newFaq.id);
  };
  const updateFaq = <K extends keyof T>(id: number, field: K, value: T[K]) => {
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
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)]">
          <p className="text-sm font-mono mb-3">Henüz soru eklenmedi</p>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border transition-all bg-[rgba(0,198,162,0.1)] border-[rgba(0,198,162,0.2)] text-[#00C6A2] hover:bg-[rgba(0,198,162,0.15)]"
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
                className="rounded-xl border overflow-hidden transition-all shadow-sm"
                style={{                    
                    background: isEditing 
                    ? "var(--background-secondary)" 
                    : "var(--background-card)",                    
                    borderColor: !isEditing 
                    ? "transparent" 
                    : !faq.isActive 
                        ? "rgba(255,80,80,0.5)" 
                        : "rgba(0,198,162,0.5)",
                    opacity: !isEditing && !faq.isActive ? 0.5 : 1,
                }}
              >
                {isEditing ? (
                  <div className="p-4 space-y-4">                    
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-[var(--background-card)] text-[var(--text-muted)] border border-[var(--border)]">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveFaq(faq.id, "up")} disabled={index === 0} className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center disabled:opacity-20 bg-[var(--background-card)]">
                          <ChevronUp size={13} />
                        </button>
                        <button type="button" onClick={() => moveFaq(faq.id, "down")} disabled={index === faqs.length - 1} className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center disabled:opacity-20 bg-[var(--background-card)]">
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFaq(faq.id, "isActive", !faq.isActive)}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-colors"
                          style={{
                            background: faq.isActive ? "rgba(0,198,162,0.1)" : "rgba(255,80,80,0.1)",
                            borderColor: faq.isActive ? "rgba(0,198,162,0.2)" : "rgba(255,80,80,0.2)",
                            color: faq.isActive ? "#00C6A2" : "#FF5050",
                          }}
                        >
                          {faq.isActive ? "A" : "P"}
                        </button>
                        <button type="button" onClick={() => removeFaq(faq.id)} className="w-7 h-7 rounded-lg border border-[rgba(255,80,80,0.2)] flex items-center justify-center bg-[rgba(255,80,80,0.1)] text-[#FF5050] hover:bg-[rgba(255,80,80,0.15)]">
                          <Trash2 size={13} />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg border border-[rgba(0,198,162,0.2)] flex items-center justify-center bg-[rgba(0,198,162,0.1)] text-[#00C6A2] hover:bg-[rgba(0,198,162,0.15)]">
                          <Check size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Input Alanları */}
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Soru</label>
                        <input
                          type="text"
                          value={faq.name}
                          onChange={(e) => updateFaq(faq.id, "name", e.target.value)}
                          className="w-full h-10 rounded-lg border border-[var(--border)] px-3 text-sm bg-[var(--background-card)] text-[var(--text-primary)] outline-none focus:border-[#00C6A2] transition-colors"
                          placeholder="Sıkça sorulan soru..."
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Cevap</label>
                        <textarea
                          value={faq.description}
                          onChange={(e) => updateFaq(faq.id, "description", e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background-card)] text-[var(--text-primary)] outline-none resize-none focus:border-[#00C6A2] transition-colors"
                          placeholder="Açıklayıcı bir cevap yazın..."
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Liste Modu */
                  <div className="flex items-center justify-between px-4 py-3 gap-3 hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--text-muted)] border border-[var(--border)] shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-[var(--text-primary)]">
                          {faq.name || <span className="text-[var(--text-muted)] italic font-normal">Soru girilmedi</span>}
                        </p>
                        <p className="text-xs truncate text-[var(--text-muted)] mt-0.5">
                          {faq.description || "Cevap henüz eklenmemiş..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => setEditingId(faq.id)} className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center bg-[var(--background-secondary)] text-[var(--text-muted)] hover:text-[#00C6A2] hover:border-[#00C6A2] transition-all">
                        <Pencil size={12} />
                      </button>
                      <button type="button" onClick={() => removeFaq(faq.id)} className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center bg-[var(--background-card)] text-[var(--text-muted)] hover:text-[#FF5050] hover:border-[#FF5050] transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Alt Ekleme Butonu */}
      {faqs.length > 0 && (
        <button
          type="button"
          onClick={addFaq}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-[rgba(0,198,162,0.3)] text-[#00C6A2] text-sm font-semibold transition-all bg-[rgba(0,198,162,0.02)] hover:bg-[rgba(0,198,162,0.06)] hover:border-[rgba(0,198,162,0.5)]"
        >
          <Plus size={16} />
          Yeni Soru Ekle
        </button>
      )}
    </div>
  );
}