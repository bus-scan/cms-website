import { NextRequest, NextResponse } from "next/server";
import { callApiWithRefreshAndResponse } from "@/lib/utils/api-client";

// Types
interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  // Get tokens from HTTP-only cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  // Get the base URL for this API
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await callApiWithRefreshAndResponse(
    `${baseUrl}/v1/users/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    },
    refreshToken
  );
}
