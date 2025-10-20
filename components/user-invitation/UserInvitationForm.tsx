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

// Zod validation schema
const setupPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน! กรุณากรอกรหัสผ่านใหม่อีกครั้ง",
  path: ["confirmPassword"],
});

type SetupPasswordFormData = z.infer<typeof setupPasswordSchema>;

export default function UserInvitationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hideForm, setHideForm] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setErrorMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาติดต่อผู้ดูแลระบบ");
        setShowError(true);
        setHideForm(true);
        setIsVerifyingToken(false);
        return;
      }

      try {
        const response = await fetch(`/api/invitations/verify/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          let errorMsg = "";
          switch (response.status) {
            case 400:
              errorMsg = "Token ไม่ถูกต้องหรือหมดอายุ กรุณาติดต่อผู้ดูแลระบบ";
              break;
            case 404:
              errorMsg = "ไม่พบข้อมูลการเชิญ กรุณาติดต่อผู้ดูแลระบบ";
              break;
            case 500:
              errorMsg = "เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
              break;
            default:
              errorMsg = responseData.error || "เกิดข้อผิดพลาดในการตรวจสอบ Token";
          }
          setErrorMessage(errorMsg);
          setShowError(true);
          setHideForm(true);
        } else {
          // Check if the response indicates a valid token
          if (responseData.valid === true) {
            setTokenValid(true);
          } else {
            setErrorMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาติดต่อผู้ดูแลระบบ");
            setShowError(true);
            setHideForm(true);
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
        setShowError(true);
        setHideForm(true);
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  // Password requirements validation
  const passwordRequirements = getPasswordRequirements(password);

  const onSubmit = async (data: SetupPasswordFormData) => {
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
      const response = await fetch("/api/password/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = "";

        switch (response.status) {
          case 400:
            if (responseData.error === "Invalid or expired invitation token") {
              errorMsg = "Token ไม่ถูกต้องหรือหมดอายุ กรุณาติดต่อผู้ดูแลระบบ";
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
      console.error("Setup password error:", error);

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

  // Show loading state while verifying token
  if (isVerifyingToken) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">กำลังตรวจสอบข้อมูล...</span>
      </div>
    );
  }

  return (
    <>
      {hideForm ? (
        <div className="space-y-6">
          {/* Error Alert */}
          <ErrorAlert message={errorMessage} />
          
          {/* Contact Admin Message */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              หากคุณมีปัญหาในการเข้าถึง กรุณาติดต่อผู้ดูแลระบบ
            </p>
            <LinkButton
              href="/login"
              variant="primary"
              size="md"
              fullWidth
            >
              กลับไปหน้าเข้าสู่ระบบ
            </LinkButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Error Alert */}
          {showError && <ErrorAlert message={errorMessage} />}

          {/* Password Field */}
          <div className="mb-4">
            <TextInput
              type={showPassword ? "text" : "password"}
              id="password"
              label="รหัสผ่าน"
              {...register("password")}
              placeholder="รหัสผ่าน"
              error={errors.password?.message}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
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
            disabled={!isValid || !tokenValid}
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
            ตั้งค่ารหัสผ่านเสร็จสิ้น<br />
            คุณสามารถเข้าสู่ระบบได้แล้ว
          </p>
        }
        buttonText="เข้าสู่ระบบ"
      />
    </>
  );
}
