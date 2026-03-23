// src/features/streamers/types/index.ts

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum TEMPLATE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum VARIANT_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum PACKAGE_REQUEST_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum PACKAGE_REQUEST_TYPE {
  RENEWAL = "renewal",
  UPGRADE = "upgrade",
}

export enum PACKAGE_LEVEL {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
}

export enum CONTENT_FIELD_TYPE {
  BOOLEAN = "boolean",
  NUMERIC = "numeric",
  TEXT = "text",
  CURRENCY = "currency",
}

export enum STREAMER_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum PACKAGE_STATUS {
  ACTIVE = "active",
  EXPIRED = "expired",
  NONE = "none",
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const TEMPLATE_STATUS_LABELS: Record<TEMPLATE_STATUS, string> = {
  [TEMPLATE_STATUS.ACTIVE]: "Aktif",
  [TEMPLATE_STATUS.INACTIVE]: "Pasif",
};

export const VARIANT_STATUS_LABELS: Record<VARIANT_STATUS, string> = {
  [VARIANT_STATUS.ACTIVE]: "Aktif",
  [VARIANT_STATUS.INACTIVE]: "Pasif",
};

export const PACKAGE_REQUEST_STATUS_LABELS: Record<PACKAGE_REQUEST_STATUS, string> = {
  [PACKAGE_REQUEST_STATUS.PENDING]: "Beklemede",
  [PACKAGE_REQUEST_STATUS.APPROVED]: "Onaylandı",
  [PACKAGE_REQUEST_STATUS.REJECTED]: "Reddedildi",
};

export const PACKAGE_REQUEST_TYPE_LABELS: Record<PACKAGE_REQUEST_TYPE, string> = {
  [PACKAGE_REQUEST_TYPE.RENEWAL]: "Yenileme",
  [PACKAGE_REQUEST_TYPE.UPGRADE]: "Yükseltme",
};

export const PACKAGE_LEVEL_LABELS: Record<PACKAGE_LEVEL, string> = {
  [PACKAGE_LEVEL.BRONZE]: "Bronz",
  [PACKAGE_LEVEL.SILVER]: "Gümüş",
  [PACKAGE_LEVEL.GOLD]: "Altın",
};

export const CONTENT_FIELD_TYPE_LABELS: Record<CONTENT_FIELD_TYPE, string> = {
  [CONTENT_FIELD_TYPE.BOOLEAN]: "Evet/Hayır",
  [CONTENT_FIELD_TYPE.NUMERIC]: "Sayısal",
  [CONTENT_FIELD_TYPE.TEXT]: "Metin",
  [CONTENT_FIELD_TYPE.CURRENCY]: "Para Birimi",
};

export const STREAMER_STATUS_LABELS: Record<STREAMER_STATUS, string> = {
  [STREAMER_STATUS.PENDING]: "Beklemede",
  [STREAMER_STATUS.APPROVED]: "Onaylı",
  [STREAMER_STATUS.REJECTED]: "Reddedildi",
};

export const PACKAGE_STATUS_LABELS: Record<PACKAGE_STATUS, string> = {
  [PACKAGE_STATUS.ACTIVE]: "Aktif",
  [PACKAGE_STATUS.EXPIRED]: "Süresi Doldu",
  [PACKAGE_STATUS.NONE]: "Paketsiz",
};

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Country {
  code: string;
  name: string;
  currency: string;
}

// ─── Streamer ─────────────────────────────────────────────────────────────────

export interface Streamer {
  id: number;
  userId: number;
  name: string;
  email: string;
  countryCode: string;
  countryName: string;
  streamerStatus: STREAMER_STATUS;
  packageStatus: PACKAGE_STATUS;
  currentVariantId?: number;
  currentPackageName?: string;
  packageStartDate?: string;
  packageEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Template Content ─────────────────────────────────────────────────────────

export interface TemplateContent {
  id: number;
  templateId: number;
  key: string;
  label: string;
  fieldType: CONTENT_FIELD_TYPE;
  defaultValue: string | number | boolean | null;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Package Template ─────────────────────────────────────────────────────────

export interface PackageTemplate {
  id: number;
  name: string;
  level: PACKAGE_LEVEL;
  description?: string;
  status: TEMPLATE_STATUS;
  contents: TemplateContent[];
  createdAt: string;
  updatedAt: string;
}

// ─── Variant Content ──────────────────────────────────────────────────────────

export interface VariantContent {
  id: number;
  variantId: number;
  templateContentId: number;
  key: string;
  overrideValue: string | number | boolean | null;
  updatedAt: string;
}

// ─── Country Package Variant ──────────────────────────────────────────────────

export interface CountryPackageVariant {
  id: number;
  templateId: number;
  templateName: string;
  templateLevel: PACKAGE_LEVEL;
  countryCode: string;
  countryName: string;
  currency: string;
  durationDays: number;
  status: VARIANT_STATUS;
  contents: VariantContent[];
  createdAt: string;
  updatedAt: string;
}

// ─── Package Request ──────────────────────────────────────────────────────────

export interface PackageRequest {
  id: number;
  publisherId: number;
  publisherName: string;
  publisherEmail: string;
  countryCode: string;
  countryName: string;
  requestType: PACKAGE_REQUEST_TYPE;
  currentVariantId: number;
  currentPackageName: string;
  requestedVariantId: number;
  requestedPackageName: string;
  status: PACKAGE_REQUEST_STATUS;
  adminId?: number;
  adminNote?: string;
  processedAt?: string;
  publisherNote?: string;
  createdAt: string;
  updatedAt: string;
}