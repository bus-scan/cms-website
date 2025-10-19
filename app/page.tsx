import { redirect } from "next/navigation";
import { checkAuthentication } from "@/lib/utils/auth";

export default async function Home() {
  const isAuthenticated = await checkAuthentication();

  if (!isAuthenticated) {
    redirect("/login");
  } else {
    redirect("/user/dashboard");
  }
}
