export enum PrivilegeType {
  COUNT = 'COUNT',
  LIMIT = 'LIMIT',
}

export enum PrivilegeStatus {
  ACTIVE = 'ACTIVE',
  CLOSE = 'CLOSE',
}

export interface Privilege {
  id: string;
  bandId: string;
  name: string;
  description: string;
  type: PrivilegeType;
  condition?: string[];
  imageId: string;
  imagePublicUrl?: string;
  status: PrivilegeStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDeleted: boolean;
}

export interface CreatePrivilegeRequest {
  bandId: string;
  name: string;
  description: string;
  type: PrivilegeType;
  condition?: string[];
  imageId: string;
  status: PrivilegeStatus;
}

export interface UpdatePrivilegeRequest {
  bandId: string;
  name: string;
  description: string;
  type: PrivilegeType;
  condition?: string[];
  imageId: string;
  status: PrivilegeStatus;
}

export interface PatchPrivilegeRequest {
  bandId?: string;
  name?: string;
  description?: string;
  type?: PrivilegeType;
  condition?: string[];
  imageId?: string;
  status?: PrivilegeStatus;
}

export interface SearchPrivilegeParams {
  search?: string;
  bandId?: string;
  type?: PrivilegeType;
  status?: PrivilegeStatus;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedPrivilegeResponse {
  data: Privilege[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CheckNameResponse {
  exists: boolean;
}

export interface PrivilegeFormData {
  bandId: string;
  name: string;
  description: string;
  type: PrivilegeType;
  condition?: string[];
  imageId: string;
  imagePublicUrl?: string;
  status: PrivilegeStatus;
}

export interface Band {
  id: string;
  bandName: string;
  imageId: string;
  imagePublicUrl?: string;
  isActive: boolean;
}

