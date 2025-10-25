import { 
  Privilege, 
  CreatePrivilegeRequest, 
  UpdatePrivilegeRequest, 
  PatchPrivilegeRequest, 
  SearchPrivilegeParams, 
  PaginatedPrivilegeResponse, 
  CheckNameResponse 
} from "@/lib/types/privilege";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class PrivilegeService {
  private baseUrl = '/api/privileges';

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
      console.error('Privilege service request error:', error);
      return {
        success: false,
        error: 'Network error occurred',
        statusCode: 500,
      };
    }
  }

  // Get all privileges with search and pagination
  async getPrivileges(params: SearchPrivilegeParams = {}): Promise<ApiResponse<PaginatedPrivilegeResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.bandId) queryParams.append('bandId', params.bandId);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    if (params.isDeleted !== undefined) queryParams.append('isDeleted', params.isDeleted.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<PaginatedPrivilegeResponse>(url);
  }

  // Get privilege by ID
  async getPrivilege(id: string): Promise<ApiResponse<Privilege>> {
    return this.makeRequest<Privilege>(`${this.baseUrl}/${id}`);
  }

  // Create new privilege
  async createPrivilege(data: CreatePrivilegeRequest): Promise<ApiResponse<Privilege>> {
    return this.makeRequest<Privilege>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update privilege (full update)
  async updatePrivilege(id: string, data: UpdatePrivilegeRequest): Promise<ApiResponse<Privilege>> {
    return this.makeRequest<Privilege>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Partial update privilege
  async patchPrivilege(id: string, data: PatchPrivilegeRequest): Promise<ApiResponse<Privilege>> {
    return this.makeRequest<Privilege>(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete privilege
  async deletePrivilege(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if privilege name exists
  async checkNameExists(name: string): Promise<ApiResponse<CheckNameResponse>> {
    const encodedName = encodeURIComponent(name);
    return this.makeRequest<CheckNameResponse>(`${this.baseUrl}/names/${encodedName}/exists`);
  }
}

export const privilegeService = new PrivilegeService();

