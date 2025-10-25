import Image from "next/image";
import ForgotPasswordForm from "../../components/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
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

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="MERZ AESTHETICS"
                width={280}
                height={43}
                className="mx-auto"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ลืมรหัสผ่าน ?
            </h1>
            <p className="text-gray-600 text-sm">
              ระบบจะส่ง Link ตั้งค่ารหัสผ่านใหม่ไปที่อีเมลของคุณ
            </p>
          </div>

          {/* Forgot Password Form */}
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
