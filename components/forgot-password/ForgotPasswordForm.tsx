"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiChevronLeft } from "react-icons/hi2";
import { z } from "zod";
import TextInput from "@/components/common/input/TextInput";
import { SolidButton, LinkButton } from "@/components/common/button";
import SuccessModal from "../common/modal/SuccessModal";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.email("รูปแบบอีเมลไม่ถูกต้อง"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface OtpResponse {
  message: string;
  success: boolean;
  referenceCode: string;
  expiresAt: string;
}

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpResponse, setOtpResponse] = useState<OtpResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Clear previous errors
    setShowError(false);
    setErrorMessage("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = "";

        switch (response.status) {
          case 400:
            if (responseData.error === "Email not found") {
              errorMsg = "ไม่พบ E-mail ในระบบ! กรุณากรอก E-mail ใหม่อีกครั้ง";
            } else if (responseData.error === "Account is inactive") {
              errorMsg = "บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ";
            } else {
              errorMsg = responseData.error || "ข้อมูลไม่ถูกต้อง";
            }
            break;
          case 429:
            errorMsg = "มีการพยายามส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่";
            break;
          case 500:
            errorMsg = "เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
            break;
          default:
            errorMsg = responseData.error || "เกิดข้อผิดพลาดในการส่งคำขอ";
        }

        setErrorMessage(errorMsg);
        setShowError(true);
        return;
      }

      // Success - show modal
      setOtpResponse(responseData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Forgot password error:", error);

      // Handle network errors or other unexpected errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setErrorMessage(
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
        );
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการส่งคำขอ");
      }
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setOtpResponse(null);
    router.push("/login");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Error Alert */}
        {showError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="my-8">
          <TextInput
            type="email"
            id="email"
            {...register("email")}
            placeholder="อีเมล"
            error={errors.email?.message}
          />
        </div>

        {/* Confirm Button */}
        <SolidButton
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          loadingText="กำลังส่งคำขอ..."
          disabled={!isValid}
        >
          ยืนยัน
        </SolidButton>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <LinkButton
            href="/login"
            variant="text"
            size="sm"
            className="flex items-center justify-center space-x-1"
          >
            <HiChevronLeft className="h-4 w-4" />
            <span>กลับไปหน้าเข้าสู่ระบบ</span>
          </LinkButton>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={
          <p>
            ส่ง Link ตั้งค่ารหัสผ่านใหม่เรียบร้อย
            <br /> กรุณาตรวจสอบอีเมลของคุณ
          </p>
        }
        buttonText="ตกลง"
      />
    </>
  );
}
