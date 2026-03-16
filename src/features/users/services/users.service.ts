import {
  AdminNote,
  AdminNotePayload,
  EPEntry,
  LedgerFilter,
  SuspendPayload,
  User,
  UserFilters,
  UserListItem,
  WalletEntry,
} from "@/features/users/types";

const BASE_URL = "/api/users";

export const userService = {
  // Kullanıcı listesi + filtreleme 
  getAll: async (filters?: UserFilters): Promise<UserListItem[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const url = params.size > 0 ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kullanıcı listesi yüklenemedi.");
    return res.json();
  },

  // 360 tam profil 
  getById: async (id: number): Promise<User> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Kullanıcı bulunamadı.");
    return res.json();
  },

  // Cüzdan hareketleri 
  getWalletLedger: async (
    userId: number,
    filters?: LedgerFilter
  ): Promise<WalletEntry[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const url = params.size > 0
      ? `${BASE_URL}/${userId}/wallet?${params.toString()}`
      : `${BASE_URL}/${userId}/wallet`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Cüzdan hareketleri yüklenemedi.");
    return res.json();
  },

  // EP hareketleri 
  getEPLedger: async (
    userId: number,
    filters?: LedgerFilter
  ): Promise<EPEntry[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const url = params.size > 0
      ? `${BASE_URL}/${userId}/ep?${params.toString()}`
      : `${BASE_URL}/${userId}/ep`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("EP hareketleri yüklenemedi.");
    return res.json();
  },

  // Admin notları
  getNotes: async (userId: number): Promise<AdminNote[]> => {
    const res = await fetch(`${BASE_URL}/${userId}/notes`);
    if (!res.ok) throw new Error("Admin notları yüklenemedi.");
    return res.json();
  },

  addNote: async (
    userId: number,
    payload: AdminNotePayload
  ): Promise<AdminNote> => {
    const res = await fetch(`${BASE_URL}/${userId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Not kaydedilemedi.");
    return res.json();
  },

  updateNote: async (
    userId: number,
    noteId: number,
    payload: AdminNotePayload
  ): Promise<AdminNote> => {
    const res = await fetch(`${BASE_URL}/${userId}/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Not güncellenemedi.");
    return res.json();
  },

  deleteNote: async (userId: number, noteId: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${userId}/notes/${noteId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Not silinemedi.");
  },

  // Hesap askıya alma / aktifleştirme 
  suspend: async (
    userId: number,
    payload: SuspendPayload
  ): Promise<User> => {
    const res = await fetch(`${BASE_URL}/${userId}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Kullanıcı askıya alınamadı.");
    return res.json();
  },

  activate: async (userId: number, note?: string): Promise<User> => {
    const res = await fetch(`${BASE_URL}/${userId}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) throw new Error("Kullanıcı aktifleştirilemedi.");
    return res.json();
  },
};