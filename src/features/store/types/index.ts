/* ─── BFF Response Envelope ─────────────────────────────────────────────── */

export interface StockOfferApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  filters?: Record<string, unknown>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/* ─── Offer ────────────────────────────────────────────────────────────── */

export enum OFFER_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SOLD_OUT = "SOLD_OUT",
  DELETED = "DELETED",
}

export enum OFFER_TYPE {
  NORMAL = "NORMAL",
  DROPSHIPPING = "DROPSHIPPING",
  TOP_UP = "TOP_UP",
}

export interface Offer {
  id: string;
  product_id: number;
  store_id: string;
  store_name?: string;
  currency_id: number;
  currency_code?: string;
  amount: number;
  usd_amount?: number;
  type: OFFER_TYPE | string;
  status: OFFER_STATUS | string;
  server_id?: string | null;
  min_stock_threshold?: number | null;
  created_at: string;
  updated_at: string;
  // Detail endpoint extras
  stocks?: Stock[];
  _count?: { stocks: number };
}

// Liste görünümü için alias
export type OfferListItem = Offer;

/* ─── Stock ────────────────────────────────────────────────────────────── */

export interface Stock {
  id: number;
  offer_id: string;
  status: string;
  epin_code?: string;
  created_at: string;
}

/* ─── Filtre State ─────────────────────────────────────────────────────── */

export interface OfferFilters {
  page?: number;
  pageSize?: number;
  storeId?: string;
  status?: OFFER_STATUS | "all";
  type?: OFFER_TYPE | "all";
  search?: string;
  productId?: number;
  minAmount?: number;
  maxAmount?: number;
  serverId?: string;
}

/* ─── Hook Return ──────────────────────────────────────────────────────── */

export interface UseOffersReturn {
  offers: OfferListItem[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  refresh: () => void;
}

/* ─── Form Values ──────────────────────────────────────────────────────── */


export interface OfferFormValues {
  store_id: string;
  product_id: number | "";
  currency_id: number | "";
  currency_name?: string;
  amount: number | "";
  type: OFFER_TYPE;
  status: OFFER_STATUS;
  epins: string[];
  server_id?: string;
  min_stock_threshold?: number | "";
  // For UI helpers
  isStocked?: boolean; 
}