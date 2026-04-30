export enum STREAMER_STATUS {
  ACTIVE       = "active",
  UNDER_REVIEW = "under_review",
  SUSPENDED    = "suspended",
  BANNED       = "banned",
}

export enum CONTRACT_STATUS {
  PENDING_UPLOAD = "pending_upload",
  UNDER_REVIEW   = "under_review",
  APPROVED       = "approved",
  REJECTED       = "rejected",
  EXPIRED        = "expired",
}

export enum EVALUATION_STATUS {
  PENDING  = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  APPLIED  = "applied",
}

export enum EVALUATION_DECISION {
  UPGRADE   = "upgrade",
  KEEP      = "keep",
  DOWNGRADE = "downgrade",
}

export enum PLATFORM {
  TWITCH  = "TWITCH",
  KICK    = "KICK",
  YOUTUBE = "YOUTUBE",
}

export const STREAMER_STATUS_LABELS: Record<STREAMER_STATUS, string> = {
  [STREAMER_STATUS.ACTIVE]:       "Aktif",
  [STREAMER_STATUS.UNDER_REVIEW]: "İncelemede",
  [STREAMER_STATUS.SUSPENDED]:    "Askıya Alındı",
  [STREAMER_STATUS.BANNED]:       "Yasaklandı",
};

export const CONTRACT_STATUS_LABELS: Record<CONTRACT_STATUS, string> = {
  [CONTRACT_STATUS.PENDING_UPLOAD]: "Yükleme Bekleniyor",
  [CONTRACT_STATUS.UNDER_REVIEW]:   "İncelemede",
  [CONTRACT_STATUS.APPROVED]:       "Onaylandı",
  [CONTRACT_STATUS.REJECTED]:       "Reddedildi",
  [CONTRACT_STATUS.EXPIRED]:        "Süresi Doldu",
};


export const EVALUATION_STATUS_LABELS: Record<EVALUATION_STATUS, string> = {
  [EVALUATION_STATUS.PENDING]:  "Beklemede",
  [EVALUATION_STATUS.APPROVED]: "Onaylandı",
  [EVALUATION_STATUS.REJECTED]: "Reddedildi",
  [EVALUATION_STATUS.APPLIED]:  "Uygulandı",
};


export const EVALUATION_DECISION_LABELS: Record<EVALUATION_DECISION, string> = {
  [EVALUATION_DECISION.UPGRADE]:   "Yükseltme",
  [EVALUATION_DECISION.KEEP]:      "Koru",
  [EVALUATION_DECISION.DOWNGRADE]: "Düşürme",
};


export const PLATFORM_LABELS: Record<PLATFORM, string> = {
  [PLATFORM.TWITCH]:  "Twitch",
  [PLATFORM.KICK]:    "Kick",
  [PLATFORM.YOUTUBE]: "YouTube",
};
export interface Streamer {
  package_assignments: any;
  id: string;                    
  userId?: string;                  
  fullName: string;                
  nickName?: string;              
  email?: string;
  phone?: string;
  avatarUrl?: string;              
  geoCountry: string[];            
  streamUrls: string[];          
  socialLinks?: Record<string, string>;
  streamerStatus: STREAMER_STATUS;  
  canReceiveDonation: boolean;      
  createdAt: string;
  updatedAt: string;
}
export interface StreamerListItem {
  id: string;
  userId?: string;
  fullName: string;
  nickName?: string;
  email?: string;
  geoCountry: string[];
  streamerStatus: STREAMER_STATUS;
  createdAt: string;
}
export interface Package {
  id: string;      
  name: string;
  orderRank: number;  
  isActive: boolean;  
  description: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
export interface PackageCriteria {
  id: string;
  name: string;
  unit?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface PackageDetailCriteria {
  id: string;
  detailId: string;    
  criteriaId: string;  
  targetValue?: string;
  isRequired: boolean;
   description?: string; 
  criteria?: PackageCriteria;
}
export interface PackageDetail {
  id: string;                                  
  packageId: string;                              
  version: number;
  isCurrent: boolean;                            
  eligibleCountries: string[] | null;            
  advantages: Record<string, unknown> | null;  
  evaluationPeriodDays: number;                  
  isStarter: boolean;              
  rewardMin?: string;
  rewardMax?: string;
  rewardCurrency: string;               
  criteria: PackageDetailCriteria[];              
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
export interface PackageWithCurrentDetail extends Package {
  details: PackageDetail[];
}
export interface Contract {
  id: string;                        
  streamerId: string;                  
  status: CONTRACT_STATUS;
  templateDocumentUrl?: string;      
  uploadedDocumentUrl?: string;      
  notes?: string;
  startDate?: string;                
  endDate?: string;                  
  reviewedBy?: string;              
  uploadedAt?: string;
  packageId?: string;                
  createdAt: string;
}
export interface ContractWithRelations extends Contract {
  streamer?: StreamerListItem;
  package?: Package;
}
export interface StreamerFilters {
  search?: string;
  status?: STREAMER_STATUS | "all";
  country?: string;
}
export interface PackageFilters {
  search?: string;
  isActive?: boolean | "all";
}
export interface PackageDetailFilters {
  packageId?: string;
  isCurrent?: boolean | "all";
  isStarter?: boolean | "all";
}
export interface ContractFilters {
  search?: string;
  status?: CONTRACT_STATUS | "all";
  packageId?: string;
}

/** @deprecated Package kullan */
export type PackageTemplate = PackageWithCurrentDetail;


/** @deprecated PackageDetail kullan */
export type CountryPackageVariant = PackageDetail;


/** @deprecated Contract kullan */
export type PackageRequest = ContractWithRelations;


/** @deprecated StreamerListItem kullan */
export type AdminStreamer = StreamerListItem;

