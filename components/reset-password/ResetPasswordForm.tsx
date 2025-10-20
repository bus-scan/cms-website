"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { z } from "zod";
import TextInput from "@/components/common/input/TextInput";
import { SolidButton, LinkButton } from "@/components/common/button";
import SuccessModal from "../common/modal/SuccessModal";
import ErrorAlert from "../common/alert/ErrorAlert";
import { passwordSchema, getPasswordRequirements } from "@/lib/validations/password";

// JWT validation utility
interface JWTPayload {
  sub: string;
  email: string;
  type: string;
  iat: number;
  exp: number;
  iss: string;
  version: number;
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

function validateJWT(token: string): { isValid: boolean; error?: string; payload?: JWTPayload } {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return { isValid: false, error: "Token ไม่ถูกต้อง" };
  }
  
  // Check if token type is "password_reset"
  if (payload.type !== "password_reset") {
    return { isValid: false, error: "Token ไม่ถูกต้องสำหรับการตั้งรหัสผ่านใหม่" };
  }
  
  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp <= currentTime) {
    return { isValid: false, error: "Token หมดอายุแล้ว กรุณาขอ Link ตั้งรหัสผ่านใหม่" };
  }
  
  // Check if email exists
  if (!payload.email || typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return { isValid: false, error: "Token ไม่มีข้อมูลอีเมลที่ถูกต้อง" };
  }
  
  return { isValid: true, payload };
}

// Zod validation schema
const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน! กรุณากรอกรหัสผ่านใหม่อีกครั้ง",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hideForm, setHideForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword", "");

  // Check if token exists and is valid
  useEffect(() => {
    if (!token) {
      setErrorMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาขอ Link ตั้งรหัสผ่านใหม่");
      setShowError(true);
      setHideForm(true);
      return;
    }

    // Validate JWT token
    const validation = validateJWT(token);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Token ไม่ถูกต้องหรือหมดอายุ กรุณาขอ Link ตั้งรหัสผ่านใหม่");
      setShowError(true);
      setHideForm(true);
    }
  }, [token]);

  // Password requirements validation
  const passwordRequirements = getPasswordRequirements(newPassword);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage("Token ไม่ถูกต้องหรือหมดอายุ");
      setShowError(true);
      return;
    }

    // Clear previous errors
    setShowError(false);
    setErrorMessage("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = "";

        switch (response.status) {
          case 400:
            if (responseData.error === "Invalid or expired token") {
              errorMsg = "Token ไม่ถูกต้องหรือหมดอายุ กรุณาขอ Link ตั้งรหัสผ่านใหม่";
              setHideForm(true);
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
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Reset password error:", error);

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
    router.push("/login");
  };

  return (
    <>
      {hideForm ? (
        <div className="space-y-6">
          {/* Error Alert */}
          <ErrorAlert message={errorMessage} />
          
          {/* Link to Forgot Password */}
          <div className="text-center">
            <LinkButton
              href="/forgot-password"
              variant="primary"
              size="md"
              fullWidth
            >
              ขอ Link ตั้งรหัสผ่านใหม่
            </LinkButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Error Alert */}
          {showError && <ErrorAlert message={errorMessage} />}

          {/* New Password Field */}
          <div className="mb-4">
            <TextInput
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              label="รหัสผ่าน"
              {...register("newPassword")}
              placeholder="รหัสผ่าน"
              error={errors.newPassword?.message}
              icon={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showNewPassword ? (
                    <HiEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              }
              iconPosition="right"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <TextInput
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              label="ยืนยันรหัสผ่าน"
              {...register("confirmPassword")}
              placeholder="ยืนยันรหัสผ่าน"
              error={errors.confirmPassword?.message}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <HiEyeSlash className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              }
              iconPosition="right"
            />
          </div>

          {/* Password Requirements */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              ข้อกำหนดรหัสผ่าน
            </h3>
            <div className="space-y-2">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      requirement.isValid
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {requirement.isValid && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      requirement.isValid ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <SolidButton
            type="submit"
            variant="dark"
            size="md"
            fullWidth
            isLoading={isLoading}
            loadingText="กำลังตั้งรหัสผ่าน..."
            disabled={!isValid || !token}
          >
            ยืนยัน
          </SolidButton>
        </form>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message={
          <p>
            ตั้งค่ารหัสผ่านใหม่เสร็จสิ้น
          </p>
        }
        buttonText="ตกลง"
      />
    </>
  );
}
