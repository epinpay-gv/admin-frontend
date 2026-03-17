export enum RAFFLE_STATUS {
  DRAFT = "draft",
  ACTIVE = "active",
  FINISHED = "finished",
  CANCELLED = "cancelled",
  INACTIVE = "inactive",
}

export enum RAFFLE_TYPE {
  FREE = "free",
  EP = "ep",
  COUPON = "coupon",
}

export enum RAFFLE_CREATOR_TYPE {
  ADMIN = "admin",
  STORE = "store",
  PUBLISHER = "publisher",
}

export enum PARTICIPATION_RESTRICTION {
  ALL = "all",
  PREMIUM_ONLY = "premium_only",
  REFERRAL_ONLY = "referral_only",
  VERIFIED_ONLY = "verified_only",
}

export enum WINNER_STATUS {
  PENDING = "pending",
  ASSIGNED = "assigned",
  COPIED = "copied",
  REPLACED = "replaced",
}

export enum AUDIT_ACTION {
  CREATED = "created",
  PUBLISHED = "published",
  DEACTIVATED = "deactivated",
  CANCELLED = "cancelled",
  WINNER_SELECTED = "winner_selected",
  CODE_DELIVERED = "code_delivered",
  BACKUP_PROMOTED = "backup_promoted",
}

export const RAFFLE_STATUS_LABELS: Record<RAFFLE_STATUS, string> = {
  [RAFFLE_STATUS.DRAFT]: "Taslak",
  [RAFFLE_STATUS.ACTIVE]: "Yayında",
  [RAFFLE_STATUS.FINISHED]: "Bitti",
  [RAFFLE_STATUS.CANCELLED]: "İptal",
  [RAFFLE_STATUS.INACTIVE]: "Pasif",
};

export const RAFFLE_TYPE_LABELS: Record<RAFFLE_TYPE, string> = {
  [RAFFLE_TYPE.FREE]: "Bedelsiz",
  [RAFFLE_TYPE.EP]: "EP'li",
  [RAFFLE_TYPE.COUPON]: "Kuponlu",
};

export const RAFFLE_CREATOR_TYPE_LABELS: Record<RAFFLE_CREATOR_TYPE, string> = {
  [RAFFLE_CREATOR_TYPE.ADMIN]: "Admin",
  [RAFFLE_CREATOR_TYPE.STORE]: "Mağaza",
  [RAFFLE_CREATOR_TYPE.PUBLISHER]: "Yayıncı",
};

export const PARTICIPATION_RESTRICTION_LABELS: Record<PARTICIPATION_RESTRICTION, string> = {
  [PARTICIPATION_RESTRICTION.ALL]: "Herkes",
  [PARTICIPATION_RESTRICTION.PREMIUM_ONLY]: "Sadece Premium",
  [PARTICIPATION_RESTRICTION.REFERRAL_ONLY]: "Sadece Referanslar",
  [PARTICIPATION_RESTRICTION.VERIFIED_ONLY]: "Sadece Kimlik Doğrulayanlar",
};

export const WINNER_STATUS_LABELS: Record<WINNER_STATUS, string> = {
  [WINNER_STATUS.PENDING]: "Bekliyor",
  [WINNER_STATUS.ASSIGNED]: "Atandı",
  [WINNER_STATUS.COPIED]: "Kopyalandı",
  [WINNER_STATUS.REPLACED]: "Yedekle Değiştirildi",
};

export const AUDIT_ACTION_LABELS: Record<AUDIT_ACTION, string> = {
  [AUDIT_ACTION.CREATED]: "Oluşturuldu",
  [AUDIT_ACTION.PUBLISHED]: "Yayınlandı",
  [AUDIT_ACTION.DEACTIVATED]: "Pasife Alındı",
  [AUDIT_ACTION.CANCELLED]: "İptal Edildi",
  [AUDIT_ACTION.WINNER_SELECTED]: "Kazanan Belirlendi",
  [AUDIT_ACTION.CODE_DELIVERED]: "Kod Teslim Edildi",
  [AUDIT_ACTION.BACKUP_PROMOTED]: "Yedek Devreye Girdi",
};

export interface RaffleReward {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  assignedCount: number;
}

export interface RaffleParticipant {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: string;
  isWinner: boolean;
  isBackup: boolean;
}

export interface RaffleWinner {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rewardId: number;
  rewardName: string;
  status: WINNER_STATUS;
  isBackup: boolean;
  assignedAt: string;
  copiedAt?: string;
}

export interface RaffleAuditLog {
  id: string;
  action: AUDIT_ACTION;
  adminId: string;
  adminName: string;
  description?: string;
  createdAt: string;
}

export interface Raffle {
  id: string;
  name: string;
  description: string;
  type: RAFFLE_TYPE;
  status: RAFFLE_STATUS;
  creatorType: RAFFLE_CREATOR_TYPE;
  creatorId: string;
  creatorName: string;
  participationRestriction: PARTICIPATION_RESTRICTION;
  rewards: RaffleReward[];
  winnerCount: number;
  backupCount: number;
  participantCount: number;
  participants: RaffleParticipant[];
  winners: RaffleWinner[];
  auditLogs: RaffleAuditLog[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
}

export interface RaffleFilters {
  search?: string;
  creatorType?: RAFFLE_CREATOR_TYPE | "all";
  type?: RAFFLE_TYPE | "all";
  status?: RAFFLE_STATUS | "all";
  startDate?: string;
  endDate?: string;
}

export interface RaffleFormData {
  name: string;
  description: string;
  type: RAFFLE_TYPE;
  participationRestriction: PARTICIPATION_RESTRICTION;
  winnerCount: number;
  backupCount: number;
  startDate: string;
  endDate: string;
  rewards: RaffleReward[];
}