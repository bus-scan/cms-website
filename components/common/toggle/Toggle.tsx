"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
}: ToggleProps) {
  const sizeClasses = {
    sm: "h-4 w-7",
    md: "h-6 w-11",
    lg: "h-8 w-14",
  };

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  const thumbTranslateClasses = {
    sm: checked ? "translate-x-3" : "translate-x-0.5",
    md: checked ? "translate-x-6" : "translate-x-1",
    lg: checked ? "translate-x-7" : "translate-x-1",
  };

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={`relative inline-flex items-center rounded-full transition-colors cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${sizeClasses[size]} ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${className}`}
      onClick={handleClick}
    >
      <span
        className={`inline-block transform rounded-full bg-white transition-transform ${thumbSizeClasses[size]} ${thumbTranslateClasses[size]}`}
      />
    </div>
  );
}
