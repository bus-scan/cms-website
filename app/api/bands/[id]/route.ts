import { NextRequest, NextResponse } from "next/server";
import { callExternalApi, createApiResponse, parseRequestBody } from "@/lib/utils/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/bands/[id] - Get band by ID
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

    const result = await callExternalApi(`${baseUrl}/v1/bands/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in band GET route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// PUT /api/bands/[id] - Update band (full update)
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

    const result = await callExternalApi(`${baseUrl}/v1/bands/${id}`, {
      method: "PUT",
      body: parseResult.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in band PUT route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// PATCH /api/bands/[id] - Partial update band
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

    const result = await callExternalApi(`${baseUrl}/v1/bands/${id}`, {
      method: "PATCH",
      body: parseResult.data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in band PATCH route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}

// DELETE /api/bands/[id] - Delete band
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

    const result = await callExternalApi(`${baseUrl}/v1/bands/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return createApiResponse(result);
  } catch (error) {
    console.error("Error in band DELETE route:", error);
    return createApiResponse({
      success: false,
      error: "Internal server error",
      statusCode: 500,
    });
  }
}
