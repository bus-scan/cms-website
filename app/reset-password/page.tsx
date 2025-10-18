"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ResetPasswordForm from "../../components/reset-password/ResetPasswordForm";
import { useAuthStore } from "../../stores/auth-store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/user/dashboard");
    }
  }, [isAuthenticated, router]);

  // Show nothing while checking authentication status
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-100">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("/login_bg.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Reset Password Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="MERZ AESTHETICS"
                width={280}
                height={43}
                className="mx-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              กรุณาตั้งรหัสผ่านใหม่ สำหรับเข้าใช้งานระบบ
            </p>
          </div>

          {/* Reset Password Form */}
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
