import { 
  Band, 
  CreateBandRequest, 
  UpdateBandRequest, 
  PatchBandRequest, 
  SearchBandParams, 
  PaginatedBandResponse, 
  CheckNameResponse 
} from "@/lib/types/band";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class BandService {
  private baseUrl = '/api/bands';

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error('Band service request error:', error);
      return {
        success: false,
        error: 'Network error occurred',
        statusCode: 500,
      };
    }
  }

  // Get all bands with search and pagination
  async getBands(params: SearchBandParams = {}): Promise<ApiResponse<PaginatedBandResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.isDeleted !== undefined) queryParams.append('isDeleted', params.isDeleted.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<PaginatedBandResponse>(url);
  }

  // Get band by ID
  async getBand(id: string): Promise<ApiResponse<Band>> {
    return this.makeRequest<Band>(`${this.baseUrl}/${id}`);
  }

  // Create new band
  async createBand(data: CreateBandRequest): Promise<ApiResponse<Band>> {
    return this.makeRequest<Band>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update band (full update)
  async updateBand(id: string, data: UpdateBandRequest): Promise<ApiResponse<Band>> {
    return this.makeRequest<Band>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Partial update band
  async patchBand(id: string, data: PatchBandRequest): Promise<ApiResponse<Band>> {
    return this.makeRequest<Band>(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete band
  async deleteBand(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if band name exists
  async checkNameExists(name: string): Promise<ApiResponse<CheckNameResponse>> {
    const encodedName = encodeURIComponent(name);
    return this.makeRequest<CheckNameResponse>(`${this.baseUrl}/names/${encodedName}/exists`);
  }
}

export const bandService = new BandService();
