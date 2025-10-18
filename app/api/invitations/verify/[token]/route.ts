import { NextRequest, NextResponse } from "next/server";
import { callExternalApi, createApiResponse } from "@/lib/utils/api-client";

// Types for the API response
interface VerifyInvitationResponseDto {
  valid: boolean;
  invitation?: {
    id: string;
    email: string;
    role: string;
    invitedAt: string;
    expiresAt: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const result = await callExternalApi(
      `${baseUrl}/v1/invitations/verify/${token}`,
      {
        method: "GET",
        timeout: 10000,
      }
    );

    // Handle the specific response format for invitation verification
    if (result.success && result.data) {
      const responseData = result.data as VerifyInvitationResponseDto;
      
      // If the token is invalid, return 400 status
      if (!responseData.valid) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        );
      }
      
      // If valid, return the invitation details
      return NextResponse.json(responseData, { status: 200 });
    }

    return createApiResponse(result);
  } catch (error) {
    console.error("Error verifying invitation token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
