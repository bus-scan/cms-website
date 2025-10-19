export interface FileResponse {
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class FileService {
  private baseUrl = "/api/files";

  // Upload a file
  async uploadFile(file: File): Promise<ApiResponse<FileResponse>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "File upload failed",
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: "Network error occurred",
        statusCode: 500,
      };
    }
  }
}

export const fileService = new FileService();
