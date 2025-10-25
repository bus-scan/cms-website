"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { z } from "zod";
import ErrorAlert from "../common/alert/ErrorAlert";
import TextInput from "@/components/common/input/TextInput";
import { SolidButton, LinkButton } from "@/components/common/button";
import { passwordSchema } from "@/lib/validations/password";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน").and(passwordSchema),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    // Clear previous errors
    setShowError(false);
    setErrorMessage("");

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = "";

        switch (response.status) {
          case 401:
            if (responseData.error === "Email or password is invalid") {
              errorMsg = "E-mail หรือ รหัสผ่าน ไม่ถูกต้อง!";
            } else if (responseData.error === "User is inactive") {
              errorMsg = "ไม่สามารถเข้าใช้งานได้ กรุณาติดต่อผู้ดูแลระบบ";
            } else {
              errorMsg = responseData.error;
            }
            break;
          case 429:
            errorMsg =
              "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่";
            break;
          case 400:
            errorMsg = responseData.error || "ข้อมูลไม่ถูกต้อง";
            break;
          case 500:
            errorMsg = "เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
            break;
          default:
            errorMsg = responseData.error;
        }

        setErrorMessage(errorMsg);
        setShowError(true);
        return;
      }

      router.push("/user/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      // Handle network errors or other unexpected errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setErrorMessage(
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
        );
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error Alert */}
      {showError && <ErrorAlert message={errorMessage} />}

      {/* Email Field */}
      <TextInput
        type="email"
        id="email"
        {...register("email")}
        placeholder="อีเมล"
        error={errors.email?.message}
      />

      {/* Password Field */}
      <TextInput
        type={showPassword ? "text" : "password"}
        id="password"
        {...register("password")}
        placeholder="รหัสผ่าน"
        error={errors.password?.message}
        icon={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="hover:text-gray-600"
          >
            {showPassword ? (
              <HiEyeSlash className="h-5 w-5 text-gray-400 cursor-pointer" />
            ) : (
              <HiEye className="h-5 w-5 text-gray-400 cursor-pointer" />
            )}
          </button>
        }
      />

      {/* Forgot Password Link */}
      <div className="text-right mb-6">
        <LinkButton href="/forgot-password" variant="text" size="sm">
          ลืมรหัสผ่าน?
        </LinkButton>
      </div>

      {/* Login Button */}
      <SolidButton
        type="submit"
        variant="dark"
        size="md"
        fullWidth
        isLoading={isLoading}
        loadingText="กำลังเข้าสู่ระบบ..."
        disabled={!isValid}
      >
        เข้าสู่ระบบ
      </SolidButton>
    </form>
  );
}
