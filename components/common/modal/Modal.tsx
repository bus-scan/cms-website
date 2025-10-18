import React from "react";
import { HiXMark } from "react-icons/hi2";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = "md",
  className = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          {typeof title === "string" ? (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          ) : (
            title
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
