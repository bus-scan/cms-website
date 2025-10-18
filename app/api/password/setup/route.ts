import { NextRequest, NextResponse } from "next/server";
import { callExternalApi, createApiResponse, parseRequestBody } from "@/lib/utils/api-client";

export async function POST(request: NextRequest) {
  // Parse request body
  const bodyResult = await parseRequestBody(request);
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: bodyResult.error },
      { status: 400 }
    );
  }

  const { token, password } = bodyResult.data;

  // Validate required fields
  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and password are required" },
      { status: 400 }
    );
  }

  // Validate password length (minimum 6 characters as per API spec)
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
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
      `${baseUrl}/v1/password/setup`,
      {
        method: "POST",
        body: {
          token,
          password,
        },
        timeout: 10000,
      }
    );

    return createApiResponse(result);
  } catch (error) {
    console.error("Error setting up password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
