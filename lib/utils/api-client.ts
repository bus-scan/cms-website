import { NextRequest, NextResponse } from "next/server";

// Types for API responses
interface ApiError {
  error?: string;
  message?: string;
  statusCode?: number;
}

// Removed unused interface

/**
 * Utility function to call external APIs with proper error handling and timeout
 */
export async function callExternalApi(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    timeout?: number;
  } = {}
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
}> {
  const { method = "GET", body, headers = {}, timeout = 10000 } = options;

  try {
    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: "include", // Include cookies in all requests
      });

      clearTimeout(timeoutId);

      // Parse response
      let data: unknown;
      try {
        data = await response.json();
      } catch (_parseError) {
        console.error("Failed to parse API response:", _parseError);
        return {
          success: false,
          error: "Invalid response from external service",
          statusCode: 502,
        };
      }

      if (!response.ok) {
        const errorData = data as ApiError;
        return {
          success: false,
          error: errorData.message || errorData.error || "Request failed",
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - please try again",
          statusCode: 408,
        };
      }

      console.error("Network error calling external API:", fetchError);
      return {
        success: false,
        error: "Unable to connect to external service",
        statusCode: 503,
      };
    }
  } catch (error) {
    console.error("Unexpected error in API call:", error);

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "Invalid request format",
        statusCode: 400,
      };
    }

    if (error instanceof TypeError) {
      return {
        success: false,
        error: "Network error occurred",
        statusCode: 503,
      };
    }

    return {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    };
  }
}

/**
 * Helper function to create NextResponse from API client result
 */
export function createApiResponse(result: {
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
}): NextResponse {
  if (result.success) {
    return NextResponse.json(result.data, { status: result.statusCode || 200 });
  } else {
    return NextResponse.json(
      {
        error: result.error,
        statusCode: result.statusCode,
      },
      { status: result.statusCode || 500 }
    );
  }
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody(request: NextRequest): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const body = await request.json();
    return { success: true, data: body };
  } catch {
    return {
      success: false,
      error: "Invalid JSON in request body",
    };
  }
}

/**
 * Refresh token utility function
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
}> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await callExternalApi(`${baseUrl}/v1/auth/refresh`, {
    method: "POST",
    body: { refreshToken },
    timeout: 10000,
  });
}

/**
 * Set authentication cookies in response
 */
export function setAuthCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
): void {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: tokens.expiresIn,
  });

  response.cookies.set("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
  });
}

/**
 * Handle API call with automatic token refresh
 */
export async function callApiWithRefresh(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    timeout?: number;
  } = {},
  refreshToken?: string
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
  newTokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}> {
  // Make the initial API call
  const result = await callExternalApi(url, options);

  // If access token is expired and we have a refresh token, try to refresh
  if (!result.success && result.statusCode === 401 && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);

    if (refreshResult.success && refreshResult.data) {
      // Retry the original request with the new access token
      const retryResult = await callExternalApi(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${(refreshResult.data as { accessToken: string }).accessToken}`,
        },
      });

      return {
        ...retryResult,
        newTokens: refreshResult.data as { accessToken: string; refreshToken: string; expiresIn: number },
      };
    }
  }

  return result;
}

/**
 * Handle API call with automatic token refresh and response creation
 * This is the most convenient version for typical route handlers
 */
export async function callApiWithRefreshAndResponse(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    timeout?: number;
  } = {},
  refreshToken?: string
): Promise<NextResponse> {
  const result = await callApiWithRefresh(url, options, refreshToken);
  
  const response = createApiResponse(result);
  
  // Automatically set cookies if new tokens were generated
  if (result.newTokens) {
    setAuthCookies(response, result.newTokens);
  }
  
  return response;
}