import { api } from "@/lib/api/baseFetcher";
import { FetcherConfig } from "@/lib/api/types";
import {
  Streamer,
  PackageTemplate,
  CountryPackageVariant,
  PackageRequest,
  STREAMER_STATUS,
  PACKAGE_STATUS,
  TEMPLATE_STATUS,
  VARIANT_STATUS,
  PACKAGE_REQUEST_STATUS,
  PACKAGE_REQUEST_TYPE,
} from "@/features/streamers/types";


const STREAMERS_URL = "/features/streamers";
const TEMPLATES_URL = "/features/streamers/package-templates";
const VARIANTS_URL = "/features/streamers/country-variants";
const REQUESTS_URL = "/features/streamers/package-requests";

const API_BASE = "http://localhost:3011/api";

type StreamerListParams = {
  search?: string;
  countryCode?: string;
  streamerStatus?: STREAMER_STATUS;
  packageStatus?: PACKAGE_STATUS;
  sortKey?: string;
  sortDir?: string;
};

type PackageTemplateListParams = {
  search?: string;
  status?: TEMPLATE_STATUS;
};

type CountryPackageVariantListParams = {
  search?: string;
  countryCode?: string;
  templateId?: number;
  status?: VARIANT_STATUS;
};

type PackageRequestListParams = {
  search?: string;
  countryCode?: string;
  requestType?: PACKAGE_REQUEST_TYPE;
  status?: PACKAGE_REQUEST_STATUS;
  packageId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortKey?: string;
  sortDir?: string;
};


function buildStreamerParams(
  filters: StreamerListParams
): FetcherConfig["params"] {
  return {
    search: filters.search,
    countryCode: filters.countryCode,
    streamerStatus: filters.streamerStatus,
    packageStatus: filters.packageStatus,
    sortKey: filters.sortKey,
    sortDir: filters.sortDir,
  };
}

function buildTemplateParams(
  filters: PackageTemplateListParams
): FetcherConfig["params"] {
  return {
    search: filters.search,
    status: filters.status,
  };
}

function buildVariantParams(
  filters: CountryPackageVariantListParams
): FetcherConfig["params"] {
  return {
    search: filters.search,
    countryCode: filters.countryCode,
    templateId: filters.templateId,
    status: filters.status,
  };
}

function buildRequestParams(
  filters: PackageRequestListParams
): FetcherConfig["params"] {
  return {
    search: filters.search,
    countryCode: filters.countryCode,
    requestType: filters.requestType,
    status: filters.status,
    packageId: filters.packageId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sortKey: filters.sortKey,
    sortDir: filters.sortDir,
  };
}

export const streamerService = {
  getAll: (filters: StreamerListParams = {}): Promise<Streamer[]> =>
    api.get<Streamer[]>(STREAMERS_URL, buildStreamerParams(filters)),

  getById: (id: number): Promise<Streamer> =>
    api.get<Streamer>(`${STREAMERS_URL}/${id}`),

  update: (id: number, data: Partial<Streamer>): Promise<Streamer> =>
    api.put<Streamer, Partial<Streamer>>(`${STREAMERS_URL}/${id}`, data),
};


export const packageTemplateService = {
  getAll: (filters: PackageTemplateListParams = {}): Promise<PackageTemplate[]> =>
    api.get<PackageTemplate[]>(TEMPLATES_URL, buildTemplateParams(filters)),

  getById: (id: number): Promise<PackageTemplate> =>
    api.get<PackageTemplate>(`${TEMPLATES_URL}/${id}`),

  create: (data: Partial<PackageTemplate>): Promise<PackageTemplate> =>
    api.post<PackageTemplate, Partial<PackageTemplate>>(TEMPLATES_URL, data),

  update: (id: number, data: Partial<PackageTemplate>): Promise<PackageTemplate> =>
    api.put<PackageTemplate, Partial<PackageTemplate>>(
      `${TEMPLATES_URL}/${id}`,
      data
    ),
};


export const countryPackageVariantService = {
  getAll: (filters: CountryPackageVariantListParams = {}): Promise<CountryPackageVariant[]> =>
    api.get<CountryPackageVariant[]>(VARIANTS_URL, buildVariantParams(filters)),

  getById: (id: number): Promise<CountryPackageVariant> =>
    api.get<CountryPackageVariant>(`${VARIANTS_URL}/${id}`),

  create: (data: Partial<CountryPackageVariant>): Promise<CountryPackageVariant> =>
    api.post<CountryPackageVariant, Partial<CountryPackageVariant>>(
      VARIANTS_URL,
      data
    ),

  update: (id: number, data: Partial<CountryPackageVariant>): Promise<CountryPackageVariant> =>
    api.put<CountryPackageVariant, Partial<CountryPackageVariant>>(
      `${VARIANTS_URL}/${id}`,
      data
    ),
};

export const packageRequestService = {
  getAll: (filters: PackageRequestListParams = {}): Promise<PackageRequest[]> =>
    api.get<PackageRequest[]>(REQUESTS_URL, buildRequestParams(filters), { baseUrl: API_BASE }),

  getById: (id: number): Promise<PackageRequest> =>
    api.get<PackageRequest>(`${REQUESTS_URL}/${id}`, undefined, { baseUrl: API_BASE }),

  approve: (id: number, adminNote?: string): Promise<PackageRequest> =>
    api.patch<PackageRequest, { action: "approve"; adminNote?: string }>(
      `${REQUESTS_URL}/${id}/status`,
      { action: "approve", adminNote }, { baseUrl: API_BASE }
    ),

  reject: (id: number, adminNote: string): Promise<PackageRequest> =>
    api.patch<PackageRequest, { action: "reject"; adminNote: string }>(
      `${REQUESTS_URL}/${id}/status`,
      { action: "reject", adminNote }, { baseUrl: API_BASE }
    ),
};