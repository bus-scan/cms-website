import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import Modal from "./Modal";
import { SolidButton } from "../button";

// Specialized SuccessModal component for forgot password success
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string | React.ReactNode;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "สำเร็จ !",
  message,
  buttonText = "ตกลง",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <div className="flex items-center justify-center size-8 rounded-full bg-green-100 mr-3">
            <HiOutlineCheckCircle className="size-6 text-green-600" />
          </div>
          <span className="text-lg font-bold text-gray-900">{title}</span>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <SolidButton
            onClick={onClose}
            variant="primary"
            size="md"
          >
            {buttonText}
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

export default SuccessModal;
