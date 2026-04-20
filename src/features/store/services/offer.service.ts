import { api } from "@/lib/api/baseFetcher";
import {
  Offer,
  OfferListItem,
  OfferFilters,
  StockOfferApiResponse,
} from "@/features/store/types";

const BFF_BASE = "/api/features/stock-offer";
const API_BASE = "http://localhost:3011";

export const offerService = {
  getAll: (filters?: OfferFilters): Promise<StockOfferApiResponse<OfferListItem[]>> =>
    api.get<StockOfferApiResponse<OfferListItem[]>>(
      `${BFF_BASE}/offers`,
      filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
          )
        : undefined,
      { baseUrl: API_BASE }
    ),

  getById: (id: string): Promise<StockOfferApiResponse<Offer>> =>
    api.get<StockOfferApiResponse<Offer>>(`${BFF_BASE}/offers/${id}`, undefined, { baseUrl: API_BASE }),

  create: (data: any): Promise<StockOfferApiResponse<Offer>> =>
    api.post<StockOfferApiResponse<Offer>, any>(`${BFF_BASE}/offers`, data, { baseUrl: API_BASE }),

  update: (id: string, data: any): Promise<StockOfferApiResponse<Offer>> =>
    api.put<StockOfferApiResponse<Offer>, any>(`${BFF_BASE}/offers/${id}`, data, { baseUrl: API_BASE }),

  addStocks: (offerId: string, epins: string[]): Promise<StockOfferApiResponse<any[]>> =>
    api.post<StockOfferApiResponse<any[]>, { epins: string[] }>(`${BFF_BASE}/offers/${offerId}/stocks`, { epins }, { baseUrl: API_BASE }),

  getStats: (): Promise<StockOfferApiResponse<unknown>> =>
    api.get<StockOfferApiResponse<unknown>>(
      `${BFF_BASE}/offers/stats/overview`,
      undefined,
      { baseUrl: API_BASE }
    ),

  getStocks: (filters?: any): Promise<StockOfferApiResponse<any[]>> =>
    api.get<StockOfferApiResponse<any[]>>(`${BFF_BASE}/stocks`, filters, { baseUrl: API_BASE }),

  deleteStock: (id: number | string): Promise<StockOfferApiResponse<void>> =>
    api.delete<StockOfferApiResponse<void>>(`${BFF_BASE}/stocks/${id}`, { baseUrl: API_BASE }),

  searchProducts: (q: string, typeIds?: number[]): Promise<any> =>
    api.get<any>(
      `/api/features/catalog/products/search`, 
      { q, perPage: 20, ...(typeIds?.length && { typeIds: typeIds.join(',') }) }, 
      { baseUrl: API_BASE }
    ),

  getProductById: (id: number): Promise<any> =>
    api.get<any>(`/api/features/catalog/products/${id}`, undefined, { baseUrl: API_BASE }),

  getProductTypes: (): Promise<any[]> =>
    api.get<any[]>(`/api/features/catalog/specs/types`, undefined, { baseUrl: API_BASE }),

  searchStores: (search: string): Promise<any> =>
    api.get<any>(`/api/features/store`, { search, limit: 20 }, { baseUrl: API_BASE }),

  getCurrencies: (search?: string): Promise<any> => {
    console.log("Calling getCurrencies from service...", { baseUrl: API_BASE, search });
    return api.get<any>(`/api/features/currency`, { 
      limit: 2000, 
      search,
      _t: Date.now() 
    }, { baseUrl: API_BASE });
  },
};