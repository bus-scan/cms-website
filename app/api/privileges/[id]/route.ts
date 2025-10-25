import { NextRequest } from "next/server";
import { callExternalApi, createApiResponse, parseRequestBody } from "@/lib/utils/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/privileges/[id] - Get privilege by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { id } = await params;

    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return createApiResponse({
        success: false,
        error: "Authentication required",
        statusCode: 401,
      });
    }

    const result = await callExternalApi(`${baseUrl}/v1/privileges/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in privilege GET route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// PUT /api/privileges/[id] - Update privilege (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { id } = await params;
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

    const result = await callExternalApi(`${baseUrl}/v1/privileges/${id}`, {
      method: "PUT",
      body: parseResult.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in privilege PUT route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// PATCH /api/privileges/[id] - Partial update privilege
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { id } = await params;
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

    const result = await callExternalApi(`${baseUrl}/v1/privileges/${id}`, {
      method: "PATCH",
      body: parseResult.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in privilege PATCH route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// DELETE /api/privileges/[id] - Delete privilege
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!baseUrl) {
      return createApiResponse({
        success: false,
        error: "Server configuration error - API base URL not configured",
        statusCode: 500,
      });
    }

    const { id } = await params;

    // Get access token from cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return createApiResponse({
        success: false,
        error: "Authentication required",
        statusCode: 401,
      });
    }

    const result = await callExternalApi(`${baseUrl}/v1/privileges/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in privilege DELETE route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

