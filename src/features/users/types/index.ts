// Hesap durum 
export enum USER_STATUS {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  LIMITED = "limited",
}

// Doğrulama tip ve durum  
export enum VERIFICATION_TYPE {
  EMAIL = "email",
  PHONE = "phone",
  KYC = "kyc",
}

export enum VERIFICATION_STATUS {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  CANCELLED = "cancelled",
  NOT_REQUIRED = "not_required",
}

// Premium durum  
export enum PREMIUM_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Askıya alma neden  
export enum SUSPENSION_REASON {
  FRAUD = "fraud",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  LEGAL_REQUEST = "legal_request",
  SUPPORT_REQUEST = "support_request",
  MANUAL_REVIEW = "manual_review",
  OTHER = "other",
}

// Cüzdan hareket   
export enum WALLET_ENTRY_TYPE {
  DEPOSIT = "deposit",
  SPEND = "spend",
  REFUND = "refund",
  BLOCK = "block",
  WITHDRAWAL = "withdrawal",
}

// EP hareket   
export enum EP_ENTRY_TYPE {
  EARN = "earn",
  SPEND = "spend",
  REFUND = "refund",
  MANUAL = "manual",
}
export interface UserListItem {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  country: string;
  status: USER_STATUS;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKycVerified: boolean;
  isPremium: boolean;
  referralCount: number; // Yeni eklenen alan
  referrals: ReferralDetail[]; // Yeni eklenen detaylı liste
  lastLoginAt: string | null;
  lastActionAt: string | null;
  createdAt: string;
}

export interface ReferralDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Doğrulama kaydı
export interface Verification {
  id: number;
  type: VERIFICATION_TYPE;
  status: VERIFICATION_STATUS;
  verifiedAt: string | null;
  provider: string | null;
}

// Premium bilgisi 
export interface Premium {
  status: PREMIUM_STATUS;
  planName: string | null;
  country: string | null;
  startedAt: string | null;
  expiresAt: string | null;
  sourceOrderId: number | null;
}

// Son aktivite özeti 
export interface ActivitySummary {
  lastLoginAt: string | null;
  lastOrderAt: string | null;
  lastPaymentAttemptAt: string | null;
  lastEPActionAt: string | null;
}

// Aktif askıya alma kaydı 
export interface Suspension {
  id: number;
  reason: SUSPENSION_REASON;
  note: string | null;
  suspendedAt: string;
  expiresAt: string | null;
  suspendedBy: string;
}

//  tam profil 
export interface User {
  id: number;
  username: string;
  email: string;
  country: string;
  status: USER_STATUS;
  verifications: Verification[];
  premium: Premium | null;
  referralCount: number;
  referralEarnings: number;
  activity: ActivitySummary;
  suspension: Suspension | null;
  createdAt: string;
}

// Cüzdan ledger kaydı 
export interface WalletEntry {
  id: number;
  type: WALLET_ENTRY_TYPE;
  amount: number;
  currency: string;
  sourceType: string;
  sourceId: number | null;
  note: string | null;
  createdAt: string;
}

// EP ledger kaydı 
export interface EPEntry {
  id: number;
  type: EP_ENTRY_TYPE;
  amount: number;
  balanceAfter: number;
  sourceType: string;
  sourceId: number | null;
  note: string | null;
  createdBy: string | null;
  isFlagged: boolean;
  createdAt: string;
}

export interface LedgerFilter {
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  sourceType?: string;
}

export interface AdminNote {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminNotePayload {
  content: string;
}

export interface SuspendPayload {
  reason: SUSPENSION_REASON;
  note?: string;
  expiresAt?: string;
}

export interface UserFilters {
  search?: string;
  status?: USER_STATUS;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isKycVerified?: boolean;
  isPremium?: boolean;
  country?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationInfo;
}