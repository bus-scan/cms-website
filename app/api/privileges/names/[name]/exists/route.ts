import { NextRequest } from "next/server";
import { callExternalApi, createApiResponse } from "@/lib/utils/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/privileges/names/[name]/exists - Check if privilege name exists
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { name } = params;
    const decodedName = decodeURIComponent(name);

    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return createApiResponse({
        success: false,
        error: "Authentication required",
        statusCode: 401,
      });
    }

    const result = await callExternalApi(`${baseUrl}/v1/privileges/names/${encodeURIComponent(decodedName)}/exists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in privilege name exists GET route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

