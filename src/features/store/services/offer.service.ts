import {
  Offer,
  OfferListItem,
  OfferFormValues,
  OfferFilters,
  OFFER_STATUS,
} from "@/features/store/types";

const BASE_URL = "/api/store";

export const offerService = {

  getAll: async (filters?: OfferFilters): Promise<OfferListItem[]> => {
    const params = new URLSearchParams(
      Object.entries(filters ?? {})
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)])
    );

    const res = await fetch(params.size ? `${BASE_URL}?${params}` : BASE_URL);
    if (!res.ok) throw new Error("Teklifler yüklenemedi.");
    return res.json();
  },

  getById: async (id: number): Promise<Offer> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Teklif bulunamadı.");
    return res.json();
  },

  create: async (data: OfferFormValues): Promise<Offer> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Teklif oluşturulamadı.");
    return res.json();
  },

  update: async (id: number, data: Partial<OfferFormValues>): Promise<Offer> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Teklif güncellenemedi.");
    return res.json();
  },

  toggleStatus: async (id: number, status: OFFER_STATUS): Promise<Offer> => {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Teklif durumu güncellenemedi.");
    return res.json();
  },
};