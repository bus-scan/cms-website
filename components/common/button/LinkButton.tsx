import React from "react";
import Link from "next/link";

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  external?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  variant = "text",
  size = "md",
  fullWidth = false,
  external = false,
  className = "",
  ...props
}) => {
  const baseClasses = "font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500 rounded-lg",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 rounded-lg",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 rounded-lg",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 rounded-lg",
    ghost: "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500 rounded-lg",
    text: "text-gray-900 hover:text-gray-800 focus:ring-gray-500 underline-offset-4 hover:underline",
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className,
  ].filter(Boolean).join(" ");

  if (external) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={combinedClasses}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
