import React from "react";

interface SolidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const SolidButton: React.FC<SolidButtonProps> = ({
  children,
  variant = "dark",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "cursor-pointer font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-sky-950 text-white hover:bg-sky-800 focus:ring-gray-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    dark: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText || "กำลังโหลด..." : children}
    </button>
  );
};

export default SolidButton;
