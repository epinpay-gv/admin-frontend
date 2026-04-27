import { api } from "@/lib/api/baseFetcher";
import type { FetcherConfig } from "@/lib/api/types";
import type {
  Streamer,
  StreamerListItem,
  Package,
  PackageWithCurrentDetail,
  PackageDetail,
  PackageCriteria,
  Contract,
  ContractWithRelations,
  StreamerFilters,
  PackageFilters,
  ContractFilters,
  STREAMER_STATUS,
  CONTRACT_STATUS,
} from "@/features/streamers/types";

const API_BASE       = "http://localhost:3011/api";
const STREAMERS_URL  = "/features/streamers";
const PACKAGES_URL   = "/features/streamers/packages";
const CRITERIA_URL   = "/features/streamers/criteria";
const CONTRACTS_URL  = "/features/streamers/contracts";

function buildStreamerParams(filters: StreamerFilters): FetcherConfig["params"] {
  return {
    ...(filters.search   && { search:  filters.search }),
    ...(filters.country  && { country: filters.country }),
    ...(filters.status && filters.status !== "all" && { status: filters.status }),
  };
}

function buildPackageParams(filters: PackageFilters): FetcherConfig["params"] {
  return {
    ...(filters.search && { search: filters.search }),
    ...(filters.isActive !== undefined && filters.isActive !== "all" && {
      is_active: String(filters.isActive),
    }),
  };
}

function buildContractParams(filters: ContractFilters): FetcherConfig["params"] {
  return {
    ...(filters.search    && { search:     filters.search }),
    ...(filters.packageId && { package_id: filters.packageId }),
    ...(filters.status && filters.status !== "all" && { status: filters.status }),
  };
}

export const streamerService = {
  getAll: (filters: StreamerFilters = {}): Promise<StreamerListItem[]> =>
    api.get<StreamerListItem[]>(
      STREAMERS_URL,
      buildStreamerParams(filters),
      { baseUrl: API_BASE }
    ),

  getById: (id: string): Promise<Streamer> =>
    api.get<Streamer>(
      `${STREAMERS_URL}/${id}`,
      undefined,
      { baseUrl: API_BASE }
    ),

  updateStatus: (
    id: string,
    status: STREAMER_STATUS,
    reason?: string
  ): Promise<Streamer> =>
    api.patch<Streamer, { status: STREAMER_STATUS; reason?: string }>(
      `${STREAMERS_URL}/${id}/status`,
      { status, reason },
      { baseUrl: API_BASE }
    ),
};

export type CreatePackageBody = {
  name: string;
  order_rank: number;
};

export type UpdatePackageBody = {
  name?: string;
  order_rank?: number;
  is_active?: boolean;
};

export const packageService = {
  getAll: (filters: PackageFilters = {}): Promise<PackageWithCurrentDetail[]> =>
    api.get<PackageWithCurrentDetail[]>(
      PACKAGES_URL,
      buildPackageParams(filters),
      { baseUrl: API_BASE }
    ),

  getById: (id: string): Promise<PackageWithCurrentDetail> =>
    api.get<PackageWithCurrentDetail>(
      `${PACKAGES_URL}/${id}`,
      undefined,
      { baseUrl: API_BASE }
    ),

  create: (data: CreatePackageBody): Promise<Package> =>
    api.post<Package, CreatePackageBody>(
      PACKAGES_URL,
      data,
      { baseUrl: API_BASE }
    ),

  update: (id: string, data: UpdatePackageBody): Promise<Package> =>
    api.patch<Package, UpdatePackageBody>(
      `${PACKAGES_URL}/${id}`,
      data,
      { baseUrl: API_BASE }
    ),

  remove: (id: string): Promise<{ message: string }> =>
    api.delete<{ message: string }>(
      `${PACKAGES_URL}/${id}`,
      { baseUrl: API_BASE }
    ),
};

export type CreatePackageDetailBody = {
  eligible_countries?: string[];
  advantages?: Record<string, unknown>;
  evaluation_period_days: number;
  is_starter?: boolean;
  criteria: {
    criteria_id: string;
    target_value?: string;
    is_required?: boolean;
  }[];
};

export const packageDetailService = {
  getByPackageId: (packageId: string): Promise<PackageDetail[]> =>
    api.get<PackageDetail[]>(
      `${PACKAGES_URL}/${packageId}/details`,
      undefined,
      { baseUrl: API_BASE }
    ),

  addVersion: (packageId: string, data: CreatePackageDetailBody): Promise<PackageDetail> =>
    api.post<PackageDetail, CreatePackageDetailBody>(
      `${PACKAGES_URL}/${packageId}/details`,
      data,
      { baseUrl: API_BASE }
    ),


  updateCurrent: (packageId: string, data: CreatePackageDetailBody): Promise<PackageDetail> =>
    api.put<PackageDetail, CreatePackageDetailBody>(
      `${PACKAGES_URL}/${packageId}/details/current`,
      data,
      { baseUrl: API_BASE }
    ),
};

export type CreateCriteriaBody = {
  name: string;
  unit?: string;
};

export type UpdateCriteriaBody = {
  name?: string;
  unit?: string;
  is_active?: boolean;
};

export const criteriaService = {
  getAll: (params?: { search?: string; is_active?: boolean }): Promise<PackageCriteria[]> =>
    api.get<PackageCriteria[]>(
      CRITERIA_URL,
      {
        ...(params?.search     && { search:    params.search }),
        ...(params?.is_active !== undefined && { is_active: String(params.is_active) }),
      },
      { baseUrl: API_BASE }
    ),

  create: (data: CreateCriteriaBody): Promise<PackageCriteria> =>
    api.post<PackageCriteria, CreateCriteriaBody>(
      CRITERIA_URL,
      data,
      { baseUrl: API_BASE }
    ),

  update: (id: string, data: UpdateCriteriaBody): Promise<PackageCriteria> =>
    api.patch<PackageCriteria, UpdateCriteriaBody>(
      `${CRITERIA_URL}/${id}`,
      data,
      { baseUrl: API_BASE }
    ),
};


export type UpdateContractStatusBody = {
  status: CONTRACT_STATUS;
  notes?: string;
};

export type ApproveContractBody = {
  notes?: string;
  start_date: string;
  end_date: string;
};

export type RejectContractBody = {
  notes: string;
};

export const contractService = {
  getAll: (filters: ContractFilters = {}): Promise<ContractWithRelations[]> =>
    api.get<ContractWithRelations[]>(
      CONTRACTS_URL,
      buildContractParams(filters),
      { baseUrl: API_BASE }
    ),

  getById: (id: string): Promise<ContractWithRelations> =>
    api.get<ContractWithRelations>(
      `${CONTRACTS_URL}/${id}`,
      undefined,
      { baseUrl: API_BASE }
    ),

  updateStatus: (id: string, data: UpdateContractStatusBody): Promise<Contract> =>
    api.patch<Contract, UpdateContractStatusBody>(
      `${CONTRACTS_URL}/${id}`,
      data,
      { baseUrl: API_BASE }
    ),

  approve: (id: string, data: ApproveContractBody): Promise<Contract> =>
    api.patch<Contract, ApproveContractBody>(
      `${CONTRACTS_URL}/${id}/approve`,
      data,
      { baseUrl: API_BASE }
    ),

  reject: (id: string, data: RejectContractBody): Promise<Contract> =>
    api.patch<Contract, RejectContractBody>(
      `${CONTRACTS_URL}/${id}/reject`,
      data,
      { baseUrl: API_BASE }
    ),
};