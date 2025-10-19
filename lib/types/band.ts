export interface Band {
  id: string;
  bandName: string;
  imageId: string;
  imagePublicUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateBandRequest {
  bandName: string;
  imageId: string;
  isActive: boolean;
}

export interface UpdateBandRequest {
  bandName: string;
  imageId: string;
  isActive: boolean;
}

export interface PatchBandRequest {
  bandName?: string;
  imageId?: string;
  isActive?: boolean;
}

export interface SearchBandParams {
  search?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedBandResponse {
  data: Band[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CheckNameResponse {
  exists: boolean;
}

export interface BandFormData {
  bandName: string;
  imageId: string;
  imagePublicUrl?: string;
  isActive: boolean;
}

export interface FileUploadResponse {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}