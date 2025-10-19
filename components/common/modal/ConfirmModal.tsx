import React from "react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Modal from "./Modal";
import { SolidButton } from "../button";

// Confirmation modal component for delete actions
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "ยืนยันการลบ",
  message,
  confirmText = "ลบ",
  cancelText = "ยกเลิก",
  confirmVariant = "danger",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <div className="flex items-center justify-center size-8 rounded-full bg-red-100 mr-3">
            <HiOutlineExclamationTriangle className="size-6 text-red-600" />
          </div>
          <span className="text-lg font-bold text-gray-900">{title}</span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <SolidButton
            onClick={onClose}
            variant="secondary"
            size="md"
            disabled={isLoading}
          >
            {cancelText}
          </SolidButton>
          <SolidButton
            onClick={handleConfirm}
            variant={confirmVariant}
            size="md"
            disabled={isLoading}
          >
            {isLoading ? "กำลังลบ..." : confirmText}
          </SolidButton>
        </div>
      }
      showCloseButton={false}
      size="md"
    >
      <div className="mb-6 text-gray-700 leading-relaxed whitespace-pre-line">
        {typeof message === "string" ? <p className="">{message}</p> : message}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
