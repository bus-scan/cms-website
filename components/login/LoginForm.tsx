"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { z } from "zod";
import ErrorAlert from "./ErrorAlert";
import TextInput from "@/components/common/input/TextInput";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
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

      router.push("/dashboard");
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
        <a href="#" className="text-gray-600 text-sm hover:text-gray-800">
          ลืมรหัสผ่าน?
        </a>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
