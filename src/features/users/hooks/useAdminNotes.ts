// Admin notları görüntüleme + ekleme

"use client";

import { useEffect, useState } from "react";
import { AdminNote, AdminNotePayload } from "@/features/users/types";
import { userService } from "../services/users.service";


export function useAdminNotes(userId: number) {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    userService
      .getNotes(userId)
      .then(setNotes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const addNote = async (payload: AdminNotePayload) => {
    setSaving(true);
    setError(null);

    try {
      const newNote = await userService.addNote(userId, payload);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Not kaydedilemedi.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { notes, loading, saving, error, addNote };
}