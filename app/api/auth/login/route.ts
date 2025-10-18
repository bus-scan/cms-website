import { NextRequest, NextResponse } from "next/server";
import {
  callExternalApi,
  createApiResponse,
  parseRequestBody,
  setAuthCookies,
} from "@/lib/utils/api-client";

// Types based on API specification
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function POST(request: NextRequest) {
  // Parse request body
  const parseResult = await parseRequestBody(request);
  if (!parseResult.success) {
    return createApiResponse({
      success: false,
      error: parseResult.error,
      statusCode: 400,
    });
  }

  const { email, password } = parseResult.data as LoginRequest;

  // Get the base URL for this API
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return createApiResponse({
      success: false,
      error: "Server configuration error - API base URL not configured",
      statusCode: 500,
    });
  }

  // Call the external API using the utility function
  const result = await callExternalApi(`${baseUrl}/v1/auth/login`, {
    method: "POST",
    body: { email, password },
    timeout: 10000,
  });

  // If successful, validate response structure and set cookies
  if (result.success && result.data) {
    const authData = result.data as AuthResponse;
    if (
      !authData.accessToken ||
      !authData.refreshToken ||
      !authData.expiresIn
    ) {
      console.error("Invalid response structure from API:", authData);
      return createApiResponse({
        success: false,
        error: "Invalid response from authentication service",
        statusCode: 502,
      });
    }

    // Check if user has admin role - only admin users can access CMS
    // Note: This assumes the API returns user data with role information
    // You may need to make an additional API call to get user profile/role
    // For now, we'll allow login but you should implement role checking
    // based on your API's user data structure
    
    // TODO: Implement proper role checking
    // Example: if (userRole !== 'admin') {
    //   return createApiResponse({
    //     success: false,
    //     error: "Access denied. Admin role required.",
    //     statusCode: 403,
    //   });
    // }

    // Create response with user data (without tokens)
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // Set authentication cookies using utility function
    setAuthCookies(response, authData);

    return response;
  }

  // Return the error response
  return createApiResponse(result);
}
