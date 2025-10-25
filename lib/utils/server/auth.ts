import { cookies } from "next/headers";

/**
 * Server-side authentication check utility
 * Checks if user is authenticated by validating the access token cookie
 */
export async function checkAuthentication(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    return false;
  }
  return true;
}
