import { NextRequest } from "next/server";
import { createApiResponse } from "@/lib/utils/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/files - Upload file
export async function POST(request: NextRequest) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createApiResponse({
        success: false,
        error: "No file provided",
        statusCode: 400,
      });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return createApiResponse({
        success: false,
        error: "Only image files are allowed",
        statusCode: 400,
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return createApiResponse({
        success: false,
        error: "File size must be less than 5MB",
        statusCode: 400,
      });
    }

    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return createApiResponse({
        success: false,
        error: "Authentication required",
        statusCode: 401,
      });
    }

    // Create FormData for backend API
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Call the backend file upload API
    const response = await fetch(`${baseUrl}/v1/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createApiResponse({
        success: false,
        error: errorData.message || errorData.error || 'File upload failed',
        statusCode: response.status,
      });
    }

    const fileData = await response.json();
    
    return createApiResponse({
      success: true,
      data: fileData,
      statusCode: 201,
    });

  } catch (error) {
    console.error("Error in files POST route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}
