import { api } from "@/lib/api/baseFetcher";
import {
  Offer,
  OfferListItem,
  OfferFormValues,
  OfferFilters,
  OFFER_STATUS,
} from "@/features/store/types";

const BASE_URL = "/api/store";

export const offerService = {
  getAll: (filters?: OfferFilters): Promise<OfferListItem[]> =>
    api.get<OfferListItem[]>(
      BASE_URL,
      filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
          )
        : undefined
    ),

  getById: (id: number): Promise<Offer> =>
    api.get<Offer>(`${BASE_URL}/${id}`),

  create: (data: OfferFormValues): Promise<Offer> =>
    api.post<Offer, OfferFormValues>(BASE_URL, data),

  update: (id: number, data: Partial<OfferFormValues>): Promise<Offer> =>
    api.put<Offer, Partial<OfferFormValues>>(`${BASE_URL}/${id}`, data),

  toggleStatus: (id: number, status: OFFER_STATUS): Promise<Offer> =>
    api.patch<Offer, { status: OFFER_STATUS }>(`${BASE_URL}/${id}/status`, { status }),
};