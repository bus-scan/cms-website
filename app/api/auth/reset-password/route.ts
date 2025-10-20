import { NextRequest, NextResponse } from "next/server";
import {
  callExternalApi,
  createApiResponse,
  parseRequestBody,
} from "@/lib/utils/api-client";

// Types for the request and response
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Removed unused interface

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const parseResult = await parseRequestBody(request);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const { token, newPassword } = parseResult.data as ResetPasswordRequest;

    // Call the external API
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const result = await callExternalApi(`${baseUrl}/v1/password/reset`, {
      method: "POST",
      body: {
        token,
        newPassword,
      },
      timeout: 10000,
    });

    // Create response based on the result
    const response = createApiResponse(result);

    // If successful, return the success message
    if (result.success) {
      return NextResponse.json(
        {
          message: "Password reset successfully",
          success: true,
        },
        { status: 200 }
      );
    }

    // Handle specific error cases
    if (result.statusCode === 400) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (result.statusCode === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Return the error response
    return response;
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
