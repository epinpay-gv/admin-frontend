import { api } from "@/lib/api/baseFetcher";
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

function buildLedgerParams(filters?: LedgerFilter): Record<string, string | number | boolean | undefined | null> {
  if (!filters) return {};
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
}

export const userService = {
  getAll: (filters?: UserFilters): Promise<UserListItem[]> =>
    api.get<UserListItem[]>(
      BASE_URL,
      filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
          )
        : undefined
    ),

  getById: (id: number): Promise<User> =>
    api.get<User>(`${BASE_URL}/${id}`),

  getWalletLedger: (userId: number, filters?: LedgerFilter): Promise<WalletEntry[]> =>
    api.get<WalletEntry[]>(`${BASE_URL}/${userId}/wallet`, buildLedgerParams(filters)),

  getEPLedger: (userId: number, filters?: LedgerFilter): Promise<EPEntry[]> =>
    api.get<EPEntry[]>(`${BASE_URL}/${userId}/ep`, buildLedgerParams(filters)),

  getNotes: (userId: number): Promise<AdminNote[]> =>
    api.get<AdminNote[]>(`${BASE_URL}/${userId}/notes`),

  addNote: (userId: number, payload: AdminNotePayload): Promise<AdminNote> =>
    api.post<AdminNote, AdminNotePayload>(`${BASE_URL}/${userId}/notes`, payload),

  updateNote: (userId: number, noteId: number, payload: AdminNotePayload): Promise<AdminNote> =>
    api.patch<AdminNote, AdminNotePayload>(`${BASE_URL}/${userId}/notes/${noteId}`, payload),

  deleteNote: (userId: number, noteId: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${userId}/notes/${noteId}`),

  suspend: (userId: number, payload: SuspendPayload): Promise<User> =>
    api.post<User, SuspendPayload>(`${BASE_URL}/${userId}/suspend`, payload),

  activate: (userId: number, note?: string): Promise<User> =>
    api.post<User, { note?: string }>(`${BASE_URL}/${userId}/activate`, { note }),
};