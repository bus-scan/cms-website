import { z } from "zod";

// Shared password validation schema
export const passwordSchema = z
  .string()
  .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
  .regex(/[a-z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว")
  .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว")
  .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
  .refine((val) => !/[^a-zA-Z0-9]/.test(val), "รหัสผ่านห้ามมีอัขระพิเศษ");

// Interface for password requirements
export interface PasswordRequirement {
  text: string;
  isValid: boolean;
}

// Function to check password requirements
export const getPasswordRequirements = (password: string): PasswordRequirement[] => [
  {
    text: "มีความยาว 8 ตัวอักษรขึ้นไป",
    isValid: password.length >= 8,
  },
  {
    text: "มีตัวอักษรพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว",
    isValid: /[a-z]/.test(password),
  },
  {
    text: "มีตัวอักษรพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว",
    isValid: /[A-Z]/.test(password),
  },
  {
    text: "มีตัวเลข (0-9) อย่างน้อย 1 ตัว",
    isValid: /[0-9]/.test(password),
  },
  {
    text: "ห้ามมีอัขระพิเศษ",
    isValid: password === "" || !/[^a-zA-Z0-9]/.test(password),
  },
];
