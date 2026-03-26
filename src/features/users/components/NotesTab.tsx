"use client";
import { useState } from "react";
import { useAdminNotes } from "@/features/users/hooks/useAdminNotes";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/common/toast/toast";
import { EmptyState } from "@/features/users/components/EmptyState";
import Spinner from "@/components/common/spinner/Spinner";

export function NotesTab({ userId }: { userId: number }) {
  const { notes, loading, saving, error, addNote } = useAdminNotes(userId);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await addNote({ content });
      setContent("");
      toast.success("Başarılı", "Not eklendi.");
    } catch {
      toast.error("Hata", "Not eklenemedi.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-xl border p-4 space-y-3" style={{ background: "var(--background-card)", borderColor: "var(--border)" }}>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="Admin notu ekleyin..."
          className="w-full bg-transparent text-sm outline-none resize-none min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={saving || !content.trim()} size="sm">
            {saving ? "Kaydediliyor..." : "Not Ekle"}
          </Button>
        </div>
      </div>

      {notes.length === 0 ? <EmptyState message="Henüz not yok." /> : notes.map(note => (
        <div key={note.id} className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm">{note.content}</p>
          <p className="text-[10px] mt-2 text-muted-foreground font-mono">{note.createdBy} · {new Date(note.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}