import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: "Logout successful",
  });

  // Get all cookies from the request
  const cookies = request.cookies.getAll();

  // Clear all cookies by setting them to expire immediately
  cookies.forEach((cookie) => {
    response.cookies.set(cookie.name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });
  });

  return response;
}
