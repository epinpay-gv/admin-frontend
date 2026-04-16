import { api } from "@/lib/api/baseFetcher";
import {
  AdminNote,
  AdminNotePayload,
  EPEntry,
  LedgerFilter,
  PaginatedResponse,
  SuspendPayload,
  User,
  UserFilters,
  UserListItem,
  WalletEntry,
} from "@/features/users/types";

const BASE_URL = "/api/features/users";

const API_BASE = "http://localhost:3011";

function buildLedgerParams(filters?: LedgerFilter): Record<string, string | number | boolean | undefined | null> {
  if (!filters) return {};
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
}

export const userService = {
  getAll: async (filters?: UserFilters): Promise<PaginatedResponse<UserListItem[]>> => {
    const res = await api.get<PaginatedResponse<UserListItem[]>>(
      BASE_URL,
      filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
          )
        : undefined,
      { baseUrl: API_BASE }
    );
    
    // Eğer başarılıysa tüm response'u dön, değilse boş dizi içeren bir yapı dön
    return res || { data: [], pagination: {} };
  },

  getById: (id: number): Promise<User> =>
    api.get<User>(`${BASE_URL}/${id}`, undefined, { baseUrl: API_BASE }),

  getWalletLedger: (userId: number, filters?: LedgerFilter): Promise<WalletEntry[]> =>
    api.get<WalletEntry[]>(`${BASE_URL}/${userId}/wallet`, buildLedgerParams(filters), { baseUrl: API_BASE }),

  getEPLedger: (userId: number, filters?: LedgerFilter): Promise<EPEntry[]> =>
    api.get<EPEntry[]>(`${BASE_URL}/${userId}/ep`, buildLedgerParams(filters), { baseUrl: API_BASE }),

  getNotes: (userId: number): Promise<AdminNote[]> =>
    api.get<AdminNote[]>(`${BASE_URL}/${userId}/notes`, undefined, { baseUrl: API_BASE }),

  addNote: (userId: number, payload: AdminNotePayload): Promise<AdminNote> =>
    api.post<AdminNote, AdminNotePayload>(`${BASE_URL}/${userId}/notes`, payload, { baseUrl: API_BASE }),

  updateNote: (userId: number, noteId: number, payload: AdminNotePayload): Promise<AdminNote> =>
    api.patch<AdminNote, AdminNotePayload>(`${BASE_URL}/${userId}/notes/${noteId}`, payload, { baseUrl: API_BASE }),

  deleteNote: (userId: number, noteId: number): Promise<void> =>
    api.delete<void>(`${BASE_URL}/${userId}/notes/${noteId}`, { baseUrl: API_BASE }),

  suspend: (userId: number, payload: SuspendPayload): Promise<User> =>
    api.post<User, SuspendPayload>(`${BASE_URL}/${userId}/suspend`, payload, { baseUrl: API_BASE }),

  activate: (userId: number, note?: string): Promise<User> =>
    api.post<User, { note?: string }>(`${BASE_URL}/${userId}/activate`, { note }, { baseUrl: API_BASE }),
};