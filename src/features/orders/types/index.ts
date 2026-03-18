export enum ORDER_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export enum MEMBER_TYPE {
  GUEST = "guest",
  NORMAL = "normal",
  PREMIUM = "premium",
}

export enum DELIVERY_TYPE {
  EPIN = "epin",
  TOP_UP = "top_up",
  ID_LOAD = "id_load",
}

export enum PAYMENT_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PAYMENT_METHOD {
  CREDIT_CARD = "credit_card",
  BANK_TRANSFER = "bank_transfer",
  WALLET = "wallet",
  CRYPTO = "crypto",
}

export enum SLA_STATUS {
  OK = "ok",
  AT_RISK = "at_risk",
  BREACHED = "breached",
}

export interface OrderUser {
  id: number;
  email: string;
  fullName: string;
  memberType: MEMBER_TYPE;
}

export interface OrderProduct {
  id: number;
  name: string;
  slug: string;
  deliveryType: DELIVERY_TYPE;
  quantity: number;
  unitPrice: number;
  currency: string;
  imgUrl?: string;
}

export interface OrderDelivery {
  id: number;
  deliveryType: DELIVERY_TYPE;
  status: ORDER_STATUS;
  deliveredAt?: string;
  payload?: string; // epin kodu, top-up referansı vb.
  slaStatus: SLA_STATUS;
  slaDeadline?: string;
}

export interface OrderPayment {
  id: number;
  method: PAYMENT_METHOD;
  status: PAYMENT_STATUS;
  amount: number;
  currency: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface OrderEventLog {
  id: number;
  event: string;
  description: string;
  createdAt: string;
  actor: "system" | "admin" | "user";
}

export interface Order {
  id: number;
  userId: number | null; // null = misafir
  user: OrderUser | null;
  guestEmail?: string;
  memberType: MEMBER_TYPE;
  status: ORDER_STATUS;
  products: OrderProduct[];
  productCount: number;
  delivery: OrderDelivery;
  payment: OrderPayment;
  eventLogs: OrderEventLog[];
  totalAmount: number;
  currency: string;
  slaStatus: SLA_STATUS;
  cancelReason?: string;
  isSlaCancel?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  search?: string;
  userId?: string;
  memberType?: MEMBER_TYPE | "all";
  status?: ORDER_STATUS | "all";
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderExportParams extends OrderFilters {
  sortKey?: string;
  sortDir?: "asc" | "desc";
}