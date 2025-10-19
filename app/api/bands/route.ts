import { NextRequest, NextResponse } from "next/server";
import { callExternalApi, createApiResponse, parseRequestBody } from "@/lib/utils/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/bands - List bands with search and pagination
export async function GET(request: NextRequest) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (searchParams.get('search')) {
      queryParams.append('search', searchParams.get('search')!);
    }
    if (searchParams.get('isActive')) {
      queryParams.append('isActive', searchParams.get('isActive')!);
    }
    if (searchParams.get('isDeleted')) {
      queryParams.append('isDeleted', searchParams.get('isDeleted')!);
    }
    if (searchParams.get('page')) {
      queryParams.append('page', searchParams.get('page')!);
    }
    if (searchParams.get('limit')) {
      queryParams.append('limit', searchParams.get('limit')!);
    }

    const queryString = queryParams.toString();
    const url = `${baseUrl}/v1/bands${queryString ? `?${queryString}` : ''}`;

    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return createApiResponse({
        success: false,
        error: "Authentication required",
        statusCode: 401,
      });
    }

    const result = await callExternalApi(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in bands GET route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// POST /api/bands - Create new band
export async function POST(request: NextRequest) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const parseResult = await parseRequestBody(request);
    if (!parseResult.success) {
      return createApiResponse({
        success: false,
        error: parseResult.error,
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

    const result = await callExternalApi(`${baseUrl}/v1/bands`, {
      method: "POST",
      body: parseResult.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in bands POST route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}
