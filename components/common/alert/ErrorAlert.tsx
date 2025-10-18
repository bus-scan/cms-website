import { HiExclamationTriangle } from "react-icons/hi2";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-red-100 border border-red-700 rounded-lg p-4 mb-4 flex items-center">
      <IoMdInformationCircleOutline className="text-red-600 text-2xl" />
      <p className="ml-3 text-red-600 text-sm">{message}</p>
    </div>
  );
}
