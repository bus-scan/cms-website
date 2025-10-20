import { HiXCircle } from "react-icons/hi2";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-100 border border-red-700 rounded-lg p-4 mb-4 flex items-center">
      <IoMdInformationCircleOutline className="text-red-600 text-2xl" />
      <p className="ml-3 text-red-600 text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <HiXCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
