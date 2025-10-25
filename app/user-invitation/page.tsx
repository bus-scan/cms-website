import { Suspense } from "react";
import Image from "next/image";
import UserInvitationForm from "../../components/user-invitation/UserInvitationForm";

export default function UserInvitationPage() {
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

      {/* User Invitation Card */}
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
              ยินดีต้อนรับ! กรุณาตั้งรหัสผ่านสำหรับบัญชีของคุณ
            </p>
          </div>

          {/* User Invitation Form */}
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <UserInvitationForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
