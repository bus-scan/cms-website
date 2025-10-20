import { NextRequest, NextResponse } from "next/server";
import { callExternalApi, parseRequestBody } from "@/lib/utils/api-client";

interface ForgotPasswordRequest {
  email: string;
}

interface OtpResponse {
  message: string;
  success: boolean;
  referenceCode: string;
  expiresAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const parseResult = await parseRequestBody(request);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      );
    }

    const { email } = parseResult.data as ForgotPasswordRequest;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Call external API
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const result = await callExternalApi(`${baseUrl}/v1/password/forgot`, {
      method: "POST",
      body: { email },
      timeout: 15000, // 15 seconds timeout for OTP sending
    });

    if (!result.success) {
      // Handle specific error cases
      switch (result.statusCode) {
        case 400:
          // The API returns 200 even when email is not found for security
          // But if we get 400, it might be validation error
          return NextResponse.json(
            { error: result.error || "Invalid request" },
            { status: 400 }
          );
        case 429:
          return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
          );
        case 500:
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        default:
          return NextResponse.json(
            { error: result.error || "Request failed" },
            { status: result.statusCode || 500 }
          );
      }
    }

    // Success response
    const otpResponse = result.data as OtpResponse;
    return NextResponse.json(otpResponse, { status: 200 });

  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
